const mongoose = require('mongoose');
const Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');


const StatusSchema = new Schema({


    oldNumber: {
        type: String
    },
    desc: {
        type: String
    }

});

StatusSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Status', StatusSchema);
