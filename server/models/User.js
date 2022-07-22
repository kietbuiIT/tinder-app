const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({

    photo: {
        type: String
    },
});

const User = mongoose.model('Image', userSchema);

module.exports = User;