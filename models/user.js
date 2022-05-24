const mongoose = require('mongoose')
 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,

    },
    emailToken:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
})
const User = mongoose.model('User', userSchema)

module.exports = User