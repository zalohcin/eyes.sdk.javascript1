'use strict'
const {BlobServiceClient} = require('@azure/storage-blob')

async function uploadToStorage({sdkName, sdkVersion, isSandbox, payload}) {
  const folderName = `${sdkName}/${isSandbox ? 'sandbox' : 'prod'}`
  const blobName = `${formatDate(new Date())}-${isSandbox ? 'sandbox' : sdkVersion}.json`
  const blobPath = `${folderName}/${blobName}`
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
  const containerClient = blobServiceClient.getContainerClient('coverage-test-results')
  const blockBlobClient = containerClient.getBlockBlobClient(blobPath)
  return await blockBlobClient.upload(payload, payload.length)
}

function formatDate(d) {
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const date = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  const millis = String(d.getMilliseconds()).padStart(3, '0')
  return `${d.getFullYear()}-${month}-${date}-${hours}-${minutes}-${seconds}-${millis}`
}

module.exports = uploadToStorage
