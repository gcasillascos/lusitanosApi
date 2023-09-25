const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Horses = require('../models/Horse.js')
let uniqueValidator = require('mongoose-unique-validator')

const HorseSchema = new Schema(
  {
    _id: {
      //Horse registration number
      type: String,
      required: true,
    },
    estatus: {
      //Status of Horse Registry
      type: String,
      enum: ['INSCRITO', 'PENDIENTES'],
    },
    tomo: {
      // Book
      type: String,
    },
    recNum: {
      //
      type: Number,
      required: true,
    },
    tipoReg: {
      type: String,
      enum: ['PSL', 'SOLO MEXICO', 'CRUZADO'],
    },
    pslNum: {
      type: String,
    },
    pslSN: {
      type: String,
    },
    horseName: {
      //Horse's Registered Name
      type: String,
      required: true,
    },
    imported: {
      //Country of Birth
      type: String,
    },
    area: {
      //City/State/Province of Birth
      type: String,
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
    color: {
      //Color of horse's hair coat
      type: String,
    },
    markings: {
      //Markings on face, legs and body
      type: String,
    },
    markingImg: {
      //Code Marking Pix
      type: String,
    },
    tipoCubricion: {
      type: String,
      enum: [null, 'Monta Natural', 'Inseminación', 'Transf. Embrionaria'],
    },
    pv: {
      //Parentage Verified
      type: String,
    },
    otherId: {
      //Tatoo or branded Number
      type: String,
    },
    brandCode: {
      //Brand or Horse if any
      type: String,
      ref: 'Owner',
    },
    breederId: {
      //ID of the Dam's Horse
      type: String,
      ref: 'Owner',
    },
    ownerId: {
      //Owner Id
      type: String,
      ref: 'Owner',
    },
    issueDate: {
      //Date that the Horse's original certificate was issue
      type: Date,
    },
    castrated: {
      //Date that the horse was castrated
      type: Date,
    },
    deceased: {
      //Date that the horse died
      type: Date,
    },
    deceasedDesc: {
      //Comentarios sobre el desceso
      type: String,
    },   
    reIssued: {
      //Date that the Certificate was issued
      type: Date,
    },
    notes: {
      type: String,
    },
    premios: {
      type: String,
      ref: 'Premio',
    },
    alert: {
      // Registry Alert
      type: String,
    },
    lastUpdate: {
      type: Date,
      default: Date.now,
    },
    studBookPar1: {
      type: String,
    },
    studBookPar2: {
      type: String,
    },
    done: {
      type: String,
    },
    val1: {
      type: String,
    },
    val2: {
      type: String,
    },
    val3: {
      type: String,
    },
    val4: {
      type: String,
    },
    val5: {
      type: String,
    },
    val6: {
      type: String,
    },
    val7: {
      type: String,
    },
    val8: {
      type: String,
    },
    noCriador: {
      type: String,
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
  }
)

HorseSchema.plugin(uniqueValidator)

HorseSchema.virtual('pedigree', {
  ref: 'Pedigree',
  localField: '_id',
  foreignField: 'regRef',
  justOne: false,
})

HorseSchema.virtual('cubricion', {
  ref: 'Cubricion',
  localField: '_id',
  foreignField: 'damRegNum',
  justOne: false,
})

HorseSchema.virtual('nutricion', {
  ref: 'Nutricional',
  localField: '_id',
  foreignField: '_id',
  justOne: false,
})

HorseSchema.virtual('sanitario', {
  ref: 'Sanitario',
  localField: '_id',
  foreignField: '_id',
  justOne: false,
})

// HorseSchema.virtual('bajas', {
//   ref: 'Baja',
//   localField: '_id',
//   foreignField: 'ownerId',
//   justOne: false,
// })

// HorseSchema.virtual('preRegistro', {
//   ref: 'PreRegistro',
//   localField: '_id',
//   foreignField: 'ownerId',
//   justOne: false,
// })

HorseSchema.virtual('valoracion', {
  ref: 'Valoracion',
  localField: '_id',
  foreignField: '_id',
  justOne: false,
})



HorseSchema.virtual('owner', {
  ref: 'Owner',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: false,
})

HorseSchema.virtual('breeder', {
  ref: 'Owner',
  localField: 'breederId',
  foreignField: '_id',
  justOne: false,
})

HorseSchema.virtual('brand', {
  ref: 'Owner',
  localField: 'brandCode',
  foreignField: '_id',
  justOne: false,
})

HorseSchema.virtual('prem', {
  ref: 'Premio',
  localField: '_id',
  foreignField: '_id',
  justOne: false,
})

HorseSchema.virtual('nacimiento', {
  ref: 'Nacimiento',
  localField: '_id',
  foreignField: 'damRegNum',
  justOne: false,
})

module.exports = mongoose.model('Horse', HorseSchema)
