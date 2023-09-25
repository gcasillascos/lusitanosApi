const mongoose = require('mongoose')
const Schema = mongoose.Schema
let uniqueValidator = require('mongoose-unique-validator')


const MarkingSchema = new Schema({

    _id: {
        type: String,
        ref: 'Horse'
    },
    markingPic: {  //Status of Horse Registry
        type: String
    }

});

MarkingSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Marking', MarkingSchema);
