const mongoose = require('mongoose')
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId
let uniqueValidator = require('mongoose-unique-validator')

const ValoracionxSchema = new Schema({
  ownerId: {
    //Owner Id
    type: String,
    ref: 'Owner',
    required: true,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  registros: [
    {
      regNum: {
        //Horse registration number
        type: String,
        required: true,
      },
    },
  ],
  deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  deletedDate: {
    type: Date,
  },
})
ValoracionxSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Valoracionx', ValoracionxSchema)
