const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');

const ConceptoSchema = new Schema({
  cuenta: {
    type: mongoose.Schema.ObjectId,
    ref: 'Cuenta',
    required: true,
  },

  servicio: {
    type: String,
  },
  montoSocios: {
    type: Number,
    default: 0
  },
  montoNoSocios: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Socios', 'No Socios'],
    default: 'Socios',
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
ConceptoSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Concepto', ConceptoSchema);
