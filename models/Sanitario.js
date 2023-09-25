const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');

const SanitarioSchema = new Schema(
  {
    _id: {
      type: String,
    },
    Sanit: [
      {
        fecha: {
          type: Date,
          required: true,
        },
        comentario: {
          type: String,
          required: true,
        },
        monto: {
          type: Number,
          default:0,
        },
      },
    ],
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
  }
)

SanitarioSchema.plugin(uniqueValidator);

// SanitarioSchema.virtual('horseData', {
//   ref: 'Horse',
//   localField: 'sireRegNum',
//   foreignField: '_id',
//   justOne: false,
// })

module.exports = mongoose.model('Sanitario', SanitarioSchema);
