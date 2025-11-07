Cypress.Commands.add('purgeQueueMessages', () => {
    cy.api({
        url: Cypress.env('amqpHost') + '/tasks/contents',
        method: 'DELETE',
        body: {
            vhost: 'rkweappk',
            name: Cypress.env('amqpQueue'),
            mode: 'purge'
        },
        headers: {
            authorization: Cypress.env('amqpToken')
        },
        failOnStatusCode: false
    }).then(response => {
        return response
    })
})

Cypress.Commands.add('getMessagesQueue', () => {
    cy.api({
        url: Cypress.env('amqpHost') + '/tasks/get',
        method: 'POST',
        body: {
            count: 5,
            ackmode: 'ack_requeue_false',
            encoding: 'auto'
        },
        headers: {
            authorization: Cypress.env('amqpToken')
        },
        failOnStatusCode: false
    }).then(response => {
        return response
    })
})