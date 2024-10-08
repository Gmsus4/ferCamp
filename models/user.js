const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    urlPerfil: [
        {
            url: String,
            filename: String
        }     
    ]
});

//Passport-Local Mongoose agregará un nombre de usuario, hash y campo de sal para almacenar el nombre de usuario, la contraseña hash y el valor de sal.
UserSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model('User', UserSchema);