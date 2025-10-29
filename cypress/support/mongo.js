const { MongoClient } = require('mongodb')

const mongoUri = 'mongodb+srv://qax:xperience@cluster0.x84s5kx.mongodb.net/markdb?retryWrites=true&w=majority&appName=Cluster0'

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