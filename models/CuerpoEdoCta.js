const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');

const cuerpoSchema = new Schema({
  edocta: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'EdoCta',
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
  },
  servicio: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Concepto',
  },
  detalles: {
    type: String,
    enum: ['Servicio', 'Cuota'],
    required: true,
  },
  monto: {
    type: Number,
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
cuerpoSchema.plugin(uniqueValidator);

module.exports = mongoose.model('cuerpo', cuerpoSchema);
