const mongoose = require('mongoose')
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId
let uniqueValidator = require('mongoose-unique-validator')

const ReciboSchema = new Schema(
  {
    userPagoId: {
      //Owner Registry
      type: String,
      requiered: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      requiered: true,
    },
    cuerpoRecibo : [ 
    {
        cantidad: {
            type: Number,
        },
        servicio: {
            type: String,
        },
        precioUnitario: {
            type: Number,
        }
    }],
    transaccion: {
      {
        numero:{
          type: String,
        },
        fechadepago: {
          type: Date,
        },
        monto: {
          type: Number, 
        }
      }
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

ReciboSchema.plugin(uniqueValidator)

ReciboSchema.virtual('recibo', {
  ref: 'UserPago',
  localField: 'userPagoId',
  foreignField: '_Id',
  justOne: false,
})

module.exports = mongoose.model('Recibo', ReciboSchema)
