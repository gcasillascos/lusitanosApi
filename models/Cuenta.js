const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');

const CuentaSchema = new Schema({
  banco: {
    type: String,
  },
  clabe: {
    type: String,
    minlength: 18,
    maxlength: 18,
  },
  moneda: {
    type: String,
    enum: ['Pesos', 'Dolares', 'Euros'],
    default: 'Pesos',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fechaFin: {
    type: Date,
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
CuentaSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Cuenta', CuentaSchema);
