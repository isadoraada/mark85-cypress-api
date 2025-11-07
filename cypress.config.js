const { defineConfig } = require("cypress");
const { connect } = require('./cypress/support/mongo')

const allureWriter = require('@shelex/cypress-allure-plugin/writer');

require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      allureWriter(on, config);

      let db = await connect()

      on('task', {
        async removeUser(email) {
          try {
            if (!db) {
              db = await connect()
            }
            const users = db.collection('users')
            await users.deleteMany({
              email: email
            })
            return null
          } catch (error) {
            console.log(`Erro ao deletar usuário ${email}:`, error.message)
            // Tentar reconectar
            db = await connect()
            const users = db.collection('users')
            await users.deleteMany({
              email: email
            })
            return null
          }
        },
        async removeTask(taskName, emailUser) {
          try {
            // Reconectar se necessário
            if (!db) {
              db = await connect()
            }
            const users = db.collection('users')
            const user = await users.findOne({ email: emailUser })

            if (!user) {
              console.log(`Usuário não encontrado: ${emailUser}`)
              return null
            }

            const tasks = db.collection('tasks')
            await tasks.deleteMany({
              name: taskName,
              user: user._id
            })
            return null
          } catch (error) {
            console.log(`Erro ao deletar task ${taskName}:`, error.message)
            // Tentar reconectar
            db = await connect()
            return null
          }
        },
        async removeTasksLike(key) {
          const tasks = db.collection('tasks')

          await tasks.deleteMany({
            name: { $regex: key }
          })

          return null
        }
      })

      return config
    },
    baseUrl: process.env.BASE_URL,
    video: false,
    screenshotOnRunFailure: false,
    env: {
      amqpHost: process.env.AMQP_HOST,
      amqpQueue: process.env.AMQP_QUEUE,
      amqpToken: process.env.AMQP_TOKEN,
      allure: true
    }
  },
});
