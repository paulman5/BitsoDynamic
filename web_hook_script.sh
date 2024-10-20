#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Add snap bin to PATH for ngrok
export PATH=$PATH:/snap/bin

# Variables
WEBHOOK_DIR=${1:-"$HOME/webhook_project"}
NGROK_TOKEN=${2:-""}
PORT=${3:-8000}

# Function for logging with timestamp
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function for error handling
error_exit() {
    log "ERROR: $1"
    exit 1
}

log "Starting setup..."

# Step 1: Install Python, pip, and ngrok if not installed
log "Checking for required software..."

# Check for Python
if ! command -v python3 &> /dev/null; then
    log "Python3 not found. Installing..."
    sudo apt update && sudo apt install -y python3 || error_exit "Failed to install Python3."
else
    log "Python3 is already installed."
fi

# Check for pip
if ! command -v pip3 &> /dev/null; then
    log "pip3 not found. Installing..."
    sudo apt install -y python3-pip || error_exit "Failed to install pip3."
else
    log "pip3 is already installed."
fi

# Check for ngrok
if ! command -v ngrok &> /dev/null; then
    log "ngrok not found. Installing..."
    sudo snap install ngrok || error_exit "Failed to install ngrok."
else
    log "ngrok is already installed."
fi

# Step 2: Create directory for webhook project
log "Setting up project directory at $WEBHOOK_DIR..."
mkdir -p "$WEBHOOK_DIR" && cd "$WEBHOOK_DIR" || error_exit "Failed to create or navigate to project directory."

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    log "Creating a virtual environment..."
    python3 -m venv venv || error_exit "Failed to create virtual environment."
fi

# Activate the virtual environment
log "Activating the virtual environment..."
source venv/bin/activate || error_exit "Failed to activate virtual environment."

# Step 3: Install FastAPI and Uvicorn in the virtual environment
log "Upgrading pip..."
pip install --upgrade pip || error_exit "Failed to upgrade pip."

log "Installing FastAPI and Uvicorn inside the virtual environment..."
pip install fastapi uvicorn || error_exit "Failed to install FastAPI and Uvicorn."

# Step 4: Create a simple FastAPI webhook app
log "Creating FastAPI webhook app..."

cat <<EOF > webhook.py
from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/webhook")
async def webhook(request: Request):
    data = await request.json()
    print(f"Received Webhook: {data}")
    return {"message": "Webhook received successfully"}
EOF

if [ ! -f "webhook.py" ]; then
    error_exit "Failed to create FastAPI app script."
else
    log "FastAPI app created successfully."
fi

# Step 5: Start FastAPI server in background
log "Starting FastAPI server on port $PORT..."

# Kill any process using the port (optional)
if lsof -i :"$PORT" | grep LISTEN; then
    log "Port $PORT is in use. Attempting to kill the process using it."
    fuser -k "$PORT"/tcp || error_exit "Failed to kill process using port $PORT."
fi

# Start Uvicorn server
nohup uvicorn webhook:app --host 0.0.0.0 --port "$PORT" > uvicorn_output.log 2>&1 &

sleep 3  # Give the server time to start

# Check if FastAPI started
if ! lsof -i :"$PORT" | grep LISTEN > /dev/null; then
    log "Failed to start FastAPI server. See uvicorn_output.log for details."
    cat uvicorn_output.log
    error_exit "FastAPI server did not start."
else
    log "FastAPI server started successfully."
fi

# Step 6: Start ngrok (use auth token if provided)
if [ -n "$NGROK_TOKEN" ]; then
    log "Setting ngrok auth token..."
    ngrok config add-authtoken "$NGROK_TOKEN" || error_exit "Failed to set ngrok auth token."
fi

log "Starting ngrok on port $PORT..."
nohup ngrok http "$PORT" > ngrok_output.log 2>&1 &

sleep 5  # Give ngrok time to initialize

# Check if ngrok started successfully
if ! pgrep ngrok > /dev/null; then
    log "Failed to start ngrok. See ngrok_output.log for details."
    cat ngrok_output.log
    error_exit "ngrok did not start."
else
    log "ngrok started successfully."
fi

log "Fetching ngrok public URL..."

# Retry fetching ngrok public URL up to 5 times
NGROK_URL=""
for i in {1..5}; do
    NGROK_URL=$(curl --silent --max-time 10 http://localhost:4040/api/tunnels | grep -Eo 'https://[0-9a-zA-Z]+\.ngrok\.io' | head -n1)
    if [ -n "$NGROK_URL" ]; then
        break
    else
        log "Attempt $i: Failed to retrieve ngrok public URL. Retrying in 3 seconds..."
        sleep 3
    fi
done

if [ -z "$NGROK_URL" ]; then
    log "Failed to retrieve ngrok public URL after multiple attempts. See ngrok_output.log for details."
    error_exit "Could not fetch ngrok URL."
else
    log "Your webhook is now publicly accessible at: $NGROK_URL/webhook"
fi

log "Setup complete. The FastAPI server and ngrok are running in the background."
log "To stop them, use the following commands:"
log "  pkill -f uvicorn"
log "  pkill ngrok"
