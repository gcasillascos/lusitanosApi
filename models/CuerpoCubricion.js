const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');

const cuerpoCubricionSchema = new Schema({
  damRegNum: {
    type: String,
    ref: 'Horse',
  },
  sireRegNum: {
    type: String,
    ref: 'Horse',
  },
  ultimaMonta: {
    type: Date,
  },
  tipoCubricion: {
    type: String,
    enum: ['Monta Natural', 'Inseminación', 'Transf. Embrionaria'],
  },
  desc: {
    type: String,
  },
  resCubricion: {
    type: String,
    enum: ['Preñado', 'Aborto', 'AAA', 'BBBB'],
  },
  deliveryDate: {
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
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

cuerpoCubricionSchema.plugin(uniqueValidator);

cuerpoCubricionSchema.virtual('horseData', {
  ref: 'Horse',
  localField: 'sireRegNum',
  foreignField: '_id',
  justOne: false,
})

module.exports = mongoose.model('cuerpoCubricion', cuerpoCubricionSchema);
