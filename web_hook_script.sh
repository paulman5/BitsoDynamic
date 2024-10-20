from fastapi import FastAPI, Request
from datetime import datetime

app = FastAPI()

# Webhook endpoint
@app.post("/webhook")
async def webhook(request: Request):
    data = await request.json()  # Get the JSON payload
    with open("app_input.txt", "a") as f:
        f.write(f"{datetime.now()}: {data}\n")  # Append data to file
    return {"message": "Webhook received", "status": "success"}

