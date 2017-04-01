const APIError = require('../../rest').APIError;
const userService = require('../service/user')

module.exports = {
    'GET /api/users': async (ctx, next) => {
        var users = userService.getUsers();
        ctx.rest(users);
    }
};