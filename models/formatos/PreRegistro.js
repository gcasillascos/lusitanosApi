const mongoose = require('mongoose')
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId
let uniqueValidator = require('mongoose-unique-validator')

const PreRegistroSchema = new Schema({
  horseName: {
    //Horse's Registered Name
    type: String,
    required: true,
  },

  foalingDate: {
    //Date on which the horse was born
    type: Date,
    default: Date.now,
  },
  sex: {
    //Horse's sex
    type: String,
    // required: true,
    enum: [null, 'Macho', 'Hembra'],
  },
  tipoCubricion: {
    type: String,
    enum: [null, 'Monta Natural', 'Inseminación', 'Transf. Embrionaria'],
  },
  breederId: {
    //Owner Id
    type: String,
    ref: 'Owner',
  },
  sireRegNum: {
    type: String,
    ref: 'Horse',
  },
  damRegNum: {
    type: String,
    ref: 'Horse',
  },
  tipoRegistro: {
    type: String,
    enum: ['PSL', 'SOLO MEXICO', 'CRUZADO'],
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  deletedDate: {
    type: Date,
  },
})

PreRegistroSchema.plugin(uniqueValidator)

module.exports = mongoose.model('PreRegistro', PreRegistroSchema)
