const mongoose = require('mongoose');
const Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
let uniqueValidator = require('mongoose-unique-validator');


const PremioSchema = new Schema({

    _id: {
        type: String
        //Horse reg Num
    },
    Premios : [{
        competicion: {
            type: String
        },
        fecha: {
            type: Date
        },
        grupo: {
            type: String
        },
        grupoNo: {
            type: Number
        },
        nombreGrupo: {
            type: String
        },
        caballoNo: {
            type: String
        },
        medalla: {
            type: String
        }
    }
        
    ]
    
});

PremioSchema.plugin(uniqueValidator);

// PremioSchema.virtual('premios', {
//     ref: 'Horse',
//     localField: '_id',
//     foreignField: '_id',
//     justOne: false,
//   })

module.exports = mongoose.model('Premio', PremioSchema);
