const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');

const FertilidadSchema = new Schema({
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
  registros : [{
    regNum: {
      //Horse registration number
      type: String,
      required: true,
    },
    Servicios: {
      inactivoSexual: {type: Boolean, default: false},
      activoSexual: {type: Boolean, default: false},
      colecciones: {type: Number, default: 0},
      yeguasAsignadas: {type: Number, default: 0},
      servicios: {type: Number, default: 0},
      IA: {type: Number, default: 0},
    },
    genitales: {
      derecho: {
        testiculos: {type: Number, default: 0},
        presentes:{type: Boolean, default: false},
        palpacion:{type: Boolean, default: false},
        medidas:{
          largo:{type: Number},
          ancho:{type: Number},
          alto:{type: Number}
        },
        consistencia:{type: String}

      },
      izquierdo: {
        testiculos: {type: Number, default: 0},
        presentes:{type: Boolean, default: false},
        palpacion:{type: Boolean, default: false},
        medidas:{
          largo:{type: Number, default: 0},
          ancho:{type: Number, default: 0},
          alto:{type: Number, default: 0}
        },
        consistencia:{ type: String }
      }
    },
    anomalidades:{
      pene:{type: String},
      epididimo:{type: String},
      cordonEspermatico:{type: String},
      escroto:{type: String},
      anilloInguinal:{type: String},
      vesiculaSeminal:{type: String},
      ampula:{type: String},
      prostata:{type: String}
    },
    comportamiento:{
      interesHembra:{type: Boolean, default: false},
      inspeccionVulvar:{type: Boolean, default: false},
      signoDeFlameen:{type: Boolean, default: false},
      erecciónPene:{type: Boolean, default: false},
      monta:{type: Boolean, default: false},
      tiempoMonta:{type: Number, default: 0},
      eyaculacion:{type: Boolean, default: false},
    },
    veterinario:{
      nombre:{type: String},
      cedula:{type: String},
      tel1:{type: String},
      tel2:{type: String},
      dirección:{type: String},
      email: {
        type: String,
        // required: [true, 'Por favor, agregar email'],
        //unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email',
        ],
      },
    },
    cedula:{type: String},
    
    deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    deletedDate: {
      type: Date,
    },
}],
  deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  deletedDate: {
    type: Date,
  },
});
FertilidadSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Fertilidad', FertilidadSchema);
