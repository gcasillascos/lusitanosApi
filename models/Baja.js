const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');

const BajaSchema = new Schema({
  fechaEmision: {
    type: Date,
    default: Date.now,
  },
  ownerId: {
    type: String,
    required: true,
    ref: 'Owner',
  },
  desc: {
    type: String,
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

BajaSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Baja', BajaSchema);
