describe('GET /tasks', () => {
    beforeEach(function () {
        cy.fixture('tasks/get').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it('Get my tasks', function () {
        const { user, tasks } = this.tasks.list

        cy.task('removeTasksLike', 'Estud4r')

        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(respUser => {

                tasks.forEach(function (t) {
                    cy.postTask(t, respUser.body.token)
                })

                cy.wait(1000)
                
                cy.getTasks(respUser.body.token)
                    .then(response => {
                        expect(response.status).to.eq(200)
                        return response
                    }).its('body')
                    .should('be.an', 'array')
                    .and('have.length', tasks.length)
            })
    })
})

describe('GET /tasks/:id', () => {
    beforeEach(function () {
        cy.fixture('tasks/get').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it('Get unique task', function () {
        const { user, task } = this.tasks.unique

        cy.task('removeTask', task.name, user.email)
        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(respUser => {
                cy.postTask(task, respUser.body.token)
                    .then(taskResp => {
                        cy.getUniqueTask(taskResp.body._id, respUser.body.token).then((response) => {
                            expect(response.status).to.eq(200)
                            expect(response.body._id).to.eq(taskResp.body._id)
                            expect(response.body.name).to.eq(task.name)
                            expect(response.body.tags).to.eql(task.tags)
                            expect(response.body.user).to.eq(respUser.body.user._id)
                        })
                    })
            })
    })

    it('Task not found', function () {
        const { user, task } = this.tasks.not_found

        cy.task('removeTask', task.name, user.email)
        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(respUser => {

                cy.postTask(task, respUser.body.token)
                    .then(taskResp => {
                        const taskId = taskResp.body._id
                        cy.deleteTask(taskId, respUser.body.token)
                            .then((deleteResponse) => {
                                expect(deleteResponse.status).to.eq(204)
                            })
                        cy.getUniqueTask(taskId, respUser.body.token)
                            .then((getResponse) => {
                                expect(getResponse.status).to.eq(404)
                            })
                    })
            })
    })
})