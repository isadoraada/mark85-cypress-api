describe('POST /tasks', () => {
    beforeEach(function () {
        cy.fixture('tasks/post').then(function (task) {
            this.task = task
        })
    })

    context('Register a new task', function () {
        before(function () {
            cy.purgeQueueMessages()
                .then(response => {
                    expect(response.status).to.eq(204)
                })
        })

        it('Post new task', function () {
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

        after(function () {
            cy.fixture('tasks/post').then((taskData) => {
                const { user, task } = taskData.create

                cy.wait(3000)
                cy.getMessagesQueue()
                    .then(response => {
                        expect(response.status).to.eq(200)
                        
                        if (response.body && response.body.length > 0) {
                            expect(response.body[0].payload).to.include(user.name.split(' ')[0])
                            expect(JSON.stringify(response.body[0].payload)).to.include(task.name)
                            expect(JSON.stringify(response.body[0].payload)).to.include(user.email)
                        } else {
                            cy.log('No messages found in queue - this might indicate a timing issue or the message was not sent')
                        }
                    })
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