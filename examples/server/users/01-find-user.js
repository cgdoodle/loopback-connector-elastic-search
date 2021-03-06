/**
 * To run:
 *   DEBUG=loopback:connector:*,loopback:datasource,boot:test:* slc run
 * or
 *   DEBUG=loopback:connector:*,loopback:datasource,boot:test:* node server/server.js
 */

var _ = require('lodash');
var Promise = require('bluebird');

var path = require('path');
var fileName = path.basename(__filename, '.js'); // gives the filename without the .js extension
var debug = require('debug')('boot:test:'+fileName);

module.exports = function(app) {
    var UserModel = app.models.UserModel;

    var userWithStringId1 = {
        id: '1',
        realm: 'portal',
        username: 'userWithStringId1@shoppinpal.com',
        email: 'userWithStringId1@shoppinpal.com',
        password: 'userWithStringId1'
    };
    var userWithNumericId2 = {
        id: 2,
        realm: 'portal',
        username: 'userWithNumericId2@shoppinpal.com',
        email: 'userWithNumericId2@shoppinpal.com',
        password: 'userWithNumericId2'
    };
    var userWithoutAnyId3 = {
        realm: 'portal',
        username: 'userWithoutAnyId3@shoppinpal.com',
        email: 'userWithoutAnyId3@shoppinpal.com',
        password: 'userWithoutAnyId3'
    };

    var users = [userWithStringId1, userWithNumericId2, userWithoutAnyId3];

    Promise.map(
        users,
        function (user) {
            return UserModel.findAsync({
                where: {username: user.username}
            })
                .then(function (resolvedData) {
                    debug('findAsync', user.username, 'results:', JSON.stringify(resolvedData,null,2));
                    return Promise.resolve();
                },
                function (err) {
                    console.error(err);
                    return Promise.reject();
                });
        },
        {concurrency: 1}
    )
        .then(function () {
            debug('all work for UserModels finished');
        },
        function (err) {
            console.error(err);
        });
};