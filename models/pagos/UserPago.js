const mongoose = require('mongoose')
const slugify = require('slugify')
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId
let uniqueValidator = require('mongoose-unique-validator')

const UserPagoSchema = new Schema(
  {
   ownerId: {
      //Owner Registry
      type: String,
    },
    socio: {
      type: Boolean,
      default: true,
    },
    lastName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    salutation: {
      type: String,
    },
    farm: {
      //Nombre de la Granja o Partner
      type: String,
    },
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    phone: {
      type: String,
    },
    rfc: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/,
        'Please use a valid RFC',
      ],
    },
    email: {
      type: String,
       required: [true, 'Por favor, agregar email'],
      //unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    formasPago: [
      {
        tarjeta: {
          type: String
        },
        nombreTarj: {
          type: String
        },
        vencTarj: {
          type: String
        }
    }
  ],
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

UserPagoSchema.plugin(uniqueValidator)

// UserPagoSchema.virtual('horses', {
//   ref: 'Horse',
//   localField: '_id',
//   foreignField: 'ownerId',
//   justOne: false,
// })

module.exports = mongoose.model('UserPago', UserPagoSchema)
