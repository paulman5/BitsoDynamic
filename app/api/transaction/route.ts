import fs from "fs"
import path from "path"

const filePath = "@/components/tmp.txt" // Adjust the path if needed for your OS

function checkForTransactionFile() {
  // Check if the transaction file exists
  if (fs.existsSync(filePath)) {
    // Read the JSON file
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading transaction file:", err)
        return
      }

      try {
        // Parse the JSON data
        const transaction = JSON.parse(data)
        console.log("Transaction data:", transaction)

        // Process the transaction (you can add your custom logic here)
        processTransaction(transaction)

        // Delete the file after processing to avoid reprocessing
        fs.unlinkSync(filePath)
      } catch (jsonErr) {
        console.error("Error parsing JSON data:", jsonErr)
      }
    })
  } else {
    console.log("No transaction file found.")
  }
}

function processTransaction(transaction) {
  // Example transaction processing logic
  console.log(
    `Processing transaction: ${transaction.transaction_type} ${transaction.amount} to ${transaction.address_to}`
  )
}

// Periodically check for the transaction file every 5 seconds
setInterval(checkForTransactionFile, 5000)
