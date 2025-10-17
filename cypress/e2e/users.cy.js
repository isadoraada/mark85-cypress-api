describe('POST /users', () => {

  beforeEach(function() {
    cy.fixture('users').then(function(users) {
      this.users = users
    })
  })

  it('Register a new user', function() {

    const user = this.users.create

    cy.task('deleteUser', user.email)
    
    cy.postUser(user)
    .then(response => {
      expect(response.status).to.eq(200)
    })
  })

  it('Duplicate email', function() {
    
    const user = this.users.duplicated

    cy.task('deleteUser', user.email)
    
    cy.postUser(user)

    cy.postUser(user)
    .then(response => {
      const { message } = response.body

      expect(response.status).to.eq(409)
      expect(message).to.eq('Duplicated email!')
    })
  })

  context('Required fields', function() {
    let user;

    beforeEach(function() {
      user = this.users.required
    }) 

    it('Name is required', function() {

      delete user.name
      
      cy.postUser(user)
        .then(response => {
          const { message } = response.body

          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"name\" is required')
      })
    })

    it('Email is required', function() {

      delete user.email
      
      cy.postUser(user)
        .then(response => {
          const { message } = response.body

          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"email\" is required')
      })
    })

    it('Password is required', function() {

      delete user.password
      
      cy.postUser(user)
        .then(response => {
          const { message } = response.body

          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"password\" is required')
      })
    })
  })
})