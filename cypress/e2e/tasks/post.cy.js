describe('POST /tasks', () => {
    beforeEach(function () {
        cy.fixture('tasks/post').then(function (task) {
            this.task = task
        })
    })

    it('Register a new task', function () {
        const { user, task } = this.task.create

        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(userResp => {
                cy.task('removeTask', task.name, user.email)

                cy.postTask(task, userResp.body.token)
                    .then(response => {
                        expect(response.status).to.equal(201)
                        expect(response.body.name).to.eq(task.name)
                        expect(response.body.tags).to.eql(task.tags)
                        expect(response.body.is_done).to.be.false
                        expect(response.body.user).to.eq(userResp.body.user._id)
                        expect(response.body._id.length).to.eq(24)
                    })
            })
    })

    it('Duplicate task', function () {
        const { user, task } = this.task.dup

        cy.task('removeTask', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(userResp => {
                cy.task('removeTask', task.name, user.email)

                cy.postTask(task, userResp.body.token)

                cy.postTask(task, userResp.body.token)
                    .then(response => {
                        expect(response.status).to.equal(409)
                        expect(response.body.message).to.eq('Duplicated task!')
                    })
            })
    })
})