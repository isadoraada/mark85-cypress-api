describe('DELETE /tasks/:id', () => {
    beforeEach(function () {
        cy.fixture('tasks/delete').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it('Remove a task', function () {
        const { user, task } = this.tasks.remove

        cy.task('removeTask', task.name, user.email)
        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(respUser => {
                cy.postTask(task, respUser.body.token)
                    .then(taskResp => {
                        cy.deleteTask(taskResp.body._id, respUser.body.token)
                            .then((response) => {
                                expect(response.status).to.eq(204)
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
                        cy.deleteTask(taskId, respUser.body.token)
                            .then((getResponse) => {
                                expect(getResponse.status).to.eq(404)
                            })
                    })
            })
    })
})