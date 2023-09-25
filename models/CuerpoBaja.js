const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');

const cuerpoBajaSchema = new Schema({
  baja: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Baja',
  },
  RegNumNac: {
    type: String,
    ref: 'Horse',
  },
  RegNumAdultos: {
    type: String,
    ref: 'Horse',
  },
  causa: {
    type: String,
  },
  fechaDeceso: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  deletedDate: {
    type: Date,
  },
});
cuerpoBajaSchema.plugin(uniqueValidator);

module.exports = mongoose.model('cuerpoBaja', cuerpoBajaSchema);
