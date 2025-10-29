describe('POST /sessions', () => {
    beforeEach(function () {
        cy.fixture('users').then(function(users) {
            this.users = users
        })
    })

    it('User session', function() {
        const userData = this.users.login

        cy.task('removeUser', userData.email)

        cy.postUser(userData)

        cy.postSession(userData)
            .then(response => {
                expect(response.status).to.eq(200)

                const {user, token} = response.body

                expect(user.name).to.eq(userData.name)
                expect(user.email).to.eq(userData.email)
                expect(token).not.to.be.empty
            }) 
    })

    it('Invalid password', function() {
        const user = {
            email: 'isadoraraujo13@gmail.com',
            password: 'senha12345'
        }

        cy.postSession(user)
            .then(response => {
                expect(response.status).to.eq(401)
            })
    })

    it('Invalid email', function() {
        const user = {
            email: '404@gmail.com',
            password: 'senha123'
        }

        cy.postSession(user)
            .then(response => {
                expect(response.status).to.eq(401)
            })
    })
})