const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const Horses = require('../models/Horse');
let uniqueValidator = require('mongoose-unique-validator');

const NacimientoSchema = new Schema(
  {
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
    regPre: {
      type: Boolean,
      default: false,

    },
    regFinal: {
      type: Boolean,
      default: false,

    },
    tipoRegistro: {
      type: String,
      enum: ['PSL', 'SOLO MEXICO', 'CRUZADO'],
    },
    lastUpdate: {
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

NacimientoSchema.plugin(uniqueValidator);

NacimientoSchema.pre('save', async function (next) {
  const horse = await Horses.find({_id: this.damRegNum})

  if(horse){

    this.breederId = horse[0].ownerId
  }

  next()
})



module.exports = mongoose.model('Nacimiento', NacimientoSchema);
