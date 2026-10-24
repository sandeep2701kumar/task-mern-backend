const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name']
        },
        email: {
            type: String,
            required: [true, 'please add an email'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'password is required']
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema);