const mongoose = require('mongoose')
const Schema = mongoose.Schema
let uniqueValidator = require('mongoose-unique-validator')

const valoracionSchema = new Schema({
  _id: {
    //Horse registration number
    type: String,
    required: true,
  },
  cabezaCuello: {
    cabeza: {
      type: Number,
    },
    cuello: {
      type: Number,
    },
    calificacion: {
      type: Number,
    },
  },
  espaldaCruz: {
    type: Number,
  },
  pechoCostado: {
    type: Number,
  },
  dorsoRinon: {
    type: Number,
  },
  grupa: {
    type: Number,
  },
  miembros: {
    anteriores: {
      type: Number,
    },
    posteriores: {
      type: Number,
    },
    calificacion: {
      type: Number,
    },
  },
  andamientos: {
    paso: {
      type: Number,
    },
    trote: {
      type: Number,
    },
    galope: {
      type: Number,
    },
    calificacion: {
      type: Number,
    },
  },
  formas: {
    type: Number,
  },
  alzada: {
    type: Number,
  },
  calificacion: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
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

valoracionSchema.plugin(uniqueValidator)

valoracionSchema.pre('save', async function (next) {
  this.cabezaCuello.calificacion =
    (this.cabezaCuello.cabeza + this.cabezaCuello.cuello) / 2

  this.miembros.calificacion =
    (this.miembros.anteriores + this.miembros.posteriores) / 2

  this.andamientos.calificacion =
    (this.andamientos.paso + this.andamientos.trote + this.andamientos.galope) / 3

  this.calificacion =
    (this.cabezaCuello.calificacion * 1.0) +
    (this.espaldaCruz * 1.0) +
    (this.pechoCostado * 1.0) +
    (this.dorsoRinon * 1.5) +
    (this.grupa * 1.0) +
    (this.miembros.calificacion * 1.5) +
    (this.andamientos.calificacion * 1.5) +
    (this.formas * 1.5)

  next()
})

module.exports = mongoose.model('Valoracion', valoracionSchema)
