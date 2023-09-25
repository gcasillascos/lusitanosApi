const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');

const PedigreeSchema = new Schema({
  regRef: {
    type: String,
    ref: 'Horse',
  },
  regNum: {
    type: String,
    ref: 'Horse',
  },
  horseName: {
    type: String,
  },
  breeder: {
    type: String,
  },
  sireRegNum: {
    type: String,
    ref: 'Horse',
  },
  sireRefNum: {
    type: String,
    ref: 'Horse',
  },
  sire: {
    type: String,
  },
  sireBreeder: {
    type: String,
  },
  damRegNum: {
    type: String,
    ref: 'Horse',
  },
  damRefNum: {
    type: String,
    ref: 'Horse',
  },
  dam: {
    type: String,
  },
  damBreeder: {
    type: String,
  },
  sex: {
    type: String,
  },
  sireBreed: {
    type: String,
  },
  damBreed: {
    type: String,
  },
  bloodTypeCaseNo: {
    type: String,
  },
  microchip: {
    type: String,
  },
  apslNo: {
    type: String,
  },
  apslSn: {
    type: String,
  },
  otherNo: {
    type: String,
  },
  ownerId: {
    type: String,
  },
  color: {
    type: String,
  },
  studBookPag: {
    type: String,
  },
  Misc: {
    type: String,
  },
  AGA: {
    type: Number,
  },
  DES: {
    type: Number,
  },
  PRI: {
    type: Number,
  },
  HUC: {
    type: Number,
  },
  REG: {
    type: Number,
  },
  MAR: {
    type: Number,
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
});

PedigreeSchema.plugin(uniqueValidator);

PedigreeSchema.virtual('abuelo', {
  ref: 'Pedigree',
  localField: 'sireRegNum',
  foreignField: 'regNum',
  justOne: false,
})

PedigreeSchema.virtual('abuela', {
  ref: 'Pedigree',
  localField: 'damRegNum',
  foreignField: 'regNum',
  justOne: false,
})

PedigreeSchema.virtual('abueloDat', {
  ref: 'Owner',
  localField: 'sireBreeder',
  foreignField: '_id',
  justOne: false,
})

PedigreeSchema.virtual('abuelaDat', {
  ref: 'Owner',
  localField: 'damBreeder',
  foreignField: '_id',
  justOne: false,
})

PedigreeSchema.virtual('caballoDat', {
  ref: 'Horse',
  localField: 'regRef',
  foreignField: '_id',
  justOne: false,
})


module.exports = mongoose.model('Pedigree', PedigreeSchema);
