const { defineConfig } = require("cypress");

const { connect } = require('./cypress/support/mongo')

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // implement node event listeners here
      let db = await connect()

      on('task', {
        async removeUser(email) {
          try {
            // Reconectar se necessário
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
    },
    baseUrl: 'http://localhost:3333'
  },
});
