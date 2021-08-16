const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    title: {
        type : String,
        require : true,
        trim: true
    },
    body: {
        type : String,
        require : true
    },
    status: {
        type : String,
        default : 'public',
        enum: ['public' , 'private']
    },
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Data' , DataSchema)