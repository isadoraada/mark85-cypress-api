describe('PUT /tasks/:id/done', () => {
    beforeEach(function () {
        cy.fixture('tasks/put').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it('Update task to done', function () {
        const { user, task } = this.tasks.update

        cy.task('removeTask', task.name, user.email)
        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(respUser => {
                cy.postTask(task, respUser.body.token)
                    .then(taskResp => {
                        cy.putTaskDone(taskResp.body._id, respUser.body.token)
                            .then(response => {
                                expect(response.status).to.eq(204)
                            })

                        cy.getUniqueTask(taskResp.body._id, respUser.body.token)
                            .then((response) => {
                                expect(response.body.is_done).to.be.true
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
                        cy.putTaskDone(taskResp.body._id, respUser.body.token)
                            .then(response => {
                                expect(response.status).to.eq(404)
                            })
                    })
            })
    })
})