const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');

const EdoCtaSchema = new Schema({
  cuenta: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Cuenta',
  },
  fechaEmision: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: String,
    required: true,
    ref: 'Owner',
  },
  impuesto: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fechaFin: {
    type: Date,
  },
  pago: {
    pagado: { type: Boolean },
    fechaPago: { type: Date },
    referencia: { type: String },
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

EdoCtaSchema.plugin(uniqueValidator);

module.exports = mongoose.model('EdoCta', EdoCtaSchema);
