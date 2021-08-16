const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    rol: {
        type: String,
        require: [true, 'El rol esobligatorio']
    }
});


module.exports = model('Role', RoleSchema);