describe('POST /users', () => {

  it('Register a new user', () => {

    const user = {
      name: 'Isadora Aureliano',
      email: 'isadoraaureliano@gmail.com',
      password: 'senha123'
    }

    cy.task('deleteUser', user.email)
    
    cy.postUser(user)
    .then(response => {
      expect(response.status).to.eq(200)
    })
  })

  it('Duplicate email', () => {
    
    const user = {
      name: 'James Gunn',
      email: 'james@hotmail.com',
      password: 'senha123'
    }

    cy.task('deleteUser', user.email)
    
    cy.postUser(user)

    cy.postUser(user)
    .then(response => {
      const { message } = response.body

      expect(response.status).to.eq(409)
      expect(message).to.eq('Duplicated email!')
    })
  })

  context('Required fields', () => {
    let user;

    beforeEach(()=> {
      user = {  
        name: 'Margot Robbie',
        email: 'margot@gamil.com',
        password: 'senha123'
      }
    }) 

    it('Name is required', () => {

      delete user.name
      
      cy.postUser(user)
        .then(response => {
          const { message } = response.body

          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"name\" is required')
      })
    })

    it('Email is required', () => {

      delete user.email
      
      cy.postUser(user)
        .then(response => {
          const { message } = response.body

          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"email\" is required')
      })
    })

    it('Password is required', () => {

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