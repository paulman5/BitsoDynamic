// app/api/transaction/route.js

import fs from "fs"
import msgpack from "msgpack5"

const filePath = "/tmp/transaction_data.msgpack" // Adjust for your OS if needed

export async function GET() {
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({ message: "Transaction file not found." }),
        { status: 404 }
      )
    }

    // Read the file
    const data = fs.readFileSync(filePath)
    const transaction = msgpack().decode(data)

    // Return the transaction data as JSON
    return new Response(JSON.stringify(transaction), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (err) {
    console.error("Error reading transaction file:", err)
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
    })
  }
}
