const { MongoClient } = require('mongodb')

require('dotenv').config()

const mongoUri = process.env.MONGO_URI

let client = null

async function connect() {
    try {
        if (!client) {
            client = new MongoClient(mongoUri, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            })
        }
        
        await client.connect()
        console.log('Conectado ao MongoDB')
        return client.db('markdb')
    } catch (error) {
        console.log('Erro ao conectar MongoDB:', error.message)
        throw error
    }
}

async function disconnect() {
    if (client) {
        await client.close()
        client = null
    }
}

module.exports = { connect, disconnect }