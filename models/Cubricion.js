const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');

const CubricionSchema = new Schema({
  damRegNum: {
    type: String,
    ref: 'Horse',
  },
  sireRegNum: {
    type: String,
    ref: 'Horse',
  },
  sireName: {
    type: String,
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
    enum: ['Pendiente' , 'Gestante' , 'Vacia' , 'Aborto', 'Reabsorcion', 'Gestación Gemelar'],
  },
  deliveryDate: { //es la fecha en la que se espera que nazca el  animal
    type: Date,
  },
  horseName: {
    type: String,
  },
  sex: {
    //Horse's sex
    type: String,
    // required: true,
    enum: [null, 'Macho', 'Hembra'],
  },
  foalingDate:{
    type: Date,
  },
  tipoRegistro: {
    type: String,
    enum: ['PSL', 'SOLO MEXICO', 'CRUZADO'],
  },
  status: {
    type: Boolean,
    default: false,
    required: true,
  },
  statusDate: {
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

CubricionSchema.plugin(uniqueValidator);

CubricionSchema.virtual('horseData', {
  ref: 'Horse',
  localField: 'sireRegNum',
  foreignField: '_id',
  justOne: false,
})

module.exports = mongoose.model('Cubricion', CubricionSchema);
