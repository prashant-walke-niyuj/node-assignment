var prompt = require('prompt');
var connectionString = 'postgres://localhost:5432/postgres';
var Promise = require('bluebird');

var knex = require('./config.js');

// Create table 
var tableCreation = function () {
    return knex.schema.hasTable('users').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('users', function (table) {
                table.increments('id').primary();
                table.string('first_name', 100);
                table.string('last_name', 100);
                table.text('info');
            });
            console.log('Table Created');
        }
    });
}
//
// Start the prompt
//
prompt.start();

var databaseOpration = function () {
    prompt.get([{
        name: 'first_name',
        description: 'First name',
        type: 'string',
        required: true,
        message: 'Please enter First name'
    },
        {
            name: 'last_name',
            description: 'Last Name',
            type: 'string',
            required: true,
            message: 'Please enter Last name'
        },
        {
            name: 'info',
            description: 'Basic Information',
            type: 'string',
            required: false,
        }
    ], function (err, result) {
        //Database Validation
        knex('users').where({
            first_name: result.first_name,
            last_name: result.last_name
        }).select('id').then(function (projectNames) {
            if (projectNames.length >= 1) {
                console.log('User already exist');
                console.log('Please enter valid informaion again');
                databaseOpration();
            } else {
                knex.insert({first_name: result.first_name, last_name: result.last_name, info: result.info})
                    .returning('id')
                    .into('users')
                    .then(function (id) {
                        console.log('Successfully inserted user information. User ID : ' + id);
                        prompt.get([{
                            name: 'input',
                            description: 'Do you want insert one more record? yes/no',
                            type: 'string',
                            required: true
                        }
                        ], function (err, recordResult) {
                            if (recordResult.input == 'yes') {
                                databaseOpration();
                            } else {
                                process.exit(0);
                            }
                        });

                    });
            }
        });


    });
}

databaseOpration();