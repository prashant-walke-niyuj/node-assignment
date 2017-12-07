//Database configuration
var knex = require('knex')({
    client: 'pg',
    connection: {
        user: 'niyuj',
        database: 'node',
        port: 5432,
        host: 'localhost',
        password: 'niyuj'
    }
});
module.exports = knex;