var connectionString = 'postgres://localhost:5432/postgres';
var Promise = require('bluebird');
var bodyParser = require('body-parser')
var express = require('express');
var app = express();

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


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Header
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,token");
    next();
});

//Add User
app.post('/users', function (req, res) {
    //Start Validation
    if (req.body.first_name.length <= 0) {
        res.status(200)
            .json({
                status: 'fail',
                message: 'Please enter first name'
            });

    } else if (req.body.last_name.length <= 0) {
        res.status(200)
            .json({
                status: 'fail',
                message: 'Please enter last name'
            });

    } else {
        knex('users').where({
            first_name: req.body.first_name,
            last_name: req.body.last_name
        }).select('id').then(function (projectNames) {
            if (projectNames.length >= 1) {
                res.status(200)
                    .json({
                        status: 'fail',
                        message: 'User already exist'
                    });
            } else {
                knex.insert({first_name: req.body.first_name, last_name: req.body.last_name, info: req.body.info})
                    .returning('id')
                    .into('users')
                    .then(function (id) {
                        res.status(200)
                            .json({
                                status: 'success',
                                data: id,
                                message: 'User Inserted'
                            });
                    });
            }
        });
    }

});

//Get all user list
app.get('/users', function (req, res) {
    knex('users').select('*').then(function (projectNames) {
        res.status(200)
            .json({
                status: 'success',
                data: projectNames,
                message: 'Retrieved all users data'
            });
    });
});

//Get single user data
app.get('/users/:id', function (req, res) {
    knex('users').where({
        id: req.params.id
    }).select('*').then(function (projectNames) {
        if (projectNames.length >= 1) {
            res.status(200)
                .json({
                    status: 'success',
                    data: projectNames,
                    message: 'Retrieved data for user id ' + req.params.id
                });
        } else {
            res.status(200)
                .json({
                    status: 'fail',
                    data: null,
                    message: 'Invalid user id ' + req.params.id
                });
        }

    });
});

//Update single user data
app.put('/users/:id', function (req, res) {
    knex('users').where({
        id: req.params.id
    }).select('*').then(function (projectNames) {
        if (projectNames.length >= 1) {
            if (req.body.first_name.length <= 0) {
                res.status(200)
                    .json({
                        status: 'fail',
                        message: 'Please enter first name'
                    });

            } else if (req.body.last_name.length <= 0) {
                res.status(200)
                    .json({
                        status: 'fail',
                        message: 'Please enter last name'
                    });

            } else {
                knex('users').where({
                    id: req.params.id
                }).update(
                    {first_name: req.body.first_name}
                );
                res.status(200)
                    .json({
                        status: 'success',
                        message: 'Updated data for user id ' + req.params.id
                    });
            }


        } else {
            res.status(200)
                .json({
                    status: 'fail',
                    data: null,
                    message: 'Invalid user id ' + req.params.id
                });
        }

    });
});

//Delete user data by id
app.delete('/users/:id', function (req, res) {
    knex('users').where({
        id: req.params.id
    }).select('*').then(function (projectNames) {
        if (projectNames.length >= 1) {
            knex('users').where({
                id: req.params.id
            }).del().then(function () {
                res.status(200)
                    .json({
                        status: 'success',
                        message: 'Deleted data for user id ' + req.params.id
                    });
            });
        } else {
            res.status(200)
                .json({
                    status: 'fail',
                    message: 'Invalid user id ' + req.params.id
                });
        }
    });
});

// server listner
var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port
    console.log("server Started ");
    console.log("host " + host);
    console.log("port " + port);

})