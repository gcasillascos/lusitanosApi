const mongoose = require('mongoose')
const slugify = require('slugify')
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId
let uniqueValidator = require('mongoose-unique-validator')

const geocoder = require('../utils/geocoder')

const geoCode = require('../utils/gcpGeoCode')

const OwnerSchema = new Schema(
  {
    _id: {
      //Owner Registry
      type: String,
      required: true,
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
    memberDate: {
      type: Date,
      default: Date.now,
    },
    rfc: {
      type: String,
      match: [
        /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/,
        'Please use a valid RFC',
      ],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    email: {
      type: String,
      // required: [true, 'Por favor, agregar email'],
      //unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    deletedDate: {
      type: Date,
    },
    socio:{
      type: Boolean,
      default: false,
      requiered: true,
    },
    noCriador: {
      type: String,
    },

    location: {
      // GeoJSON Point
      type: {
          type: String,
          enum: ['Point']
      },
      coordinates: {
          type: [Number],
          index: '2dsphere'
      },
      place_id: String,
      formattedAddress: String,
  },
    titular: [
      {
        chk:{
          type: Boolean,
          default:true
        },
        street: {
          type: String,
          default: null,
        },
        city: {
          type: String, 
          default: null,
        },
        state: {
          type: String,
          default: null,
        },
        country: {
          type: String,
          default: null,
        },
        postalCode: {
          type: String,
          default: null,
        },
        phone: {
          type: String,
          default: null,
        },
        email: {
          type: String, 
          // required: [true, 'Por favor, agregar email'],
          //unique: true,
          match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
          ],default: null,
        },
      },
    ],
    contacto: [
      {
        chk:{
          type: Boolean,
          default:true
        },
        lastName: {
          type: String,
          default: null,
        },
        firstName: {
          type: String,
          default: null,
        },
        salutation: {
          type: String,
          default: null,
        },
        street: {
          type: String,default: null,
        },
        city: {
          type: String,default: null,
        },
        state: {
          type: String,default: null,
        },
        country: {
          type: String,default: null,
        },
        postalCode: {
          type: String,default: null,
        },
        phone: {
          type: String,default: null,
        },
        email: {
          type: String, 
          // required: [true, 'Por favor, agregar email'],
          //unique: true,
          match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
          ], default: null,
        },
      },
    ],
    representante: [
      {        
        chk:{
        type: Boolean,
        default:true
      },
        lastName: {
          type: String, 
          default: null,
        },
        firstName: {
          type: String,
          default: null,
        },
        salutation: {
          type: String,
          default: null,
        },
        street: {
          type: String,
          default: null,
        },
        city: {
          type: String,
          default: null,
        },
        state: {
          type: String,
          default: null,
        },
        country: {
          type: String,
          default: null,
        },
        postalCode: {
          type: String,
          default: null,
        },
        phone: {
          type: String,
          default: null,
        },
        email: {
          type: String,
          // required: [true, 'Por favor, agregar email'],
          //unique: true,
          match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
          ],default: null,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

OwnerSchema.plugin(uniqueValidator)

// // Create bootcamp slug from the name
// OwnerSchema.pre('save', function (next) {
//     this._id = slugify(this._id, {lower: false, replacement: '_'});
//     next();
// });

// Reverse populate with virtuals

OwnerSchema.virtual('horses', {
  ref: 'Horse',
  localField: '_id',
  foreignField: 'ownerId',
  justOne: false,
})



// GeoCoder
OwnerSchema.pre('save', async function (next) {

  const local = await geoCode.geoCode({address: `${(this.street === null) ? '': this.street} ${(this.city=== null) ? '':this.city} ${(this.state=== null) ? '':this.state} ${(this.country=== null) ? '':this.country} ${(this.postalCode=== null) ? '':this.postalCode}`.trim()})

  const addr = local.data.results[0]

        console.log(local.data.results[0])

   this.location = {
      type: 'Point',
      coordinates: [addr.geometry.location.lng, addr.geometry.location.lat],
      place_id: addr.place_id,
      formattedAddress: addr.formatted_address,

  }

  next();
});

module.exports = mongoose.model('Owner', OwnerSchema)
