const model = require('../../model');

let user = model.User;

module.exports = {
    getUsers: () => {
        user.findAll().then(function(users){
            console.log(users);
        });
    }
}