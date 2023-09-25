const mongoose = require('mongoose');
const Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');


const CountrySchema = new Schema({

    _id: {
        type: Number,
        required: true
    },
     pais: {
        type: String
    }

});

CountrySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Country', CountrySchemaSchema);
