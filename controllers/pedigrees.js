const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Pedigrees = require('../models/Pedigree');
const Owners = require('../models/Owner');
const { getHorseByName } = require('./horses');

let arbs = {};

// @desc      Get all pedigrees
// @route     GET /api/v1/pedigrees
// @access    Private/Admin
exports.getPedigrees = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get all pedigrees
// @route     GET /api/v1/pedigrees
// @access    Private/Admin
exports.getPedigreesAll = asyncHandler(async (req, res, next) => {
  const horse = await Pedigrees.find().populate('caballoDat');
  
  const mapa = horse.map( element => (
    
    {
         regRef: element.regRef,
           horseName: element.horseName,
           regNum: element.regNum,
          horseName: element.horseName,
          breeder: element.breeder,
          sireRegNum: element.sireRegNum,
          sireRefNum: element.sireRefNum,
          sire: element.sire,
          sireBreeder:element.sireBreeder,
          damRegNum: element.damRegNum,
          damRefNum: element.damRefNum,
          dam: element.dam,
          damBreeder: element.damBreeder,
          sex: element.sex,
          sireBreed: element.sireBreed,
          damBreed: element.damBreed,
          ownerId: element.ownerId,
          color: element.color,
           foalingDate: element.caballoDat[0]?.foalingDate,
         
  }

  ))
  
  
  
  return res.status(200).json({
    success: true,
    count: horse.length,
    data: mapa,
  });
});

// @desc      Get horses by Name
// @route     GET /api/v1/pedigree/name/:name
// @access    Private/Admin, publisher
exports.getPedigreeByName = asyncHandler(async (req, res, next) => {

  const expresion = new RegExp(req.params.name)
  let pedigree = null;
    pedigree = await Pedigrees.find({sex: req.params.sex == 'H' ? 'H':'M', deleted: false, horseName: {$in: [expresion]}});
  
  

   if (!pedigree) {
    return next(
      new ErrorResponse(
        `Horse not found with the name of ${req.params.name}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: pedigree,
  });
});






// @desc      Get lineage
// @route     GET /api/v1/pedigrees/:id
// @access    Private/Admin, publisher
exports.getPedigreeByNum = asyncHandler(async (req, res, next) => {
  const horse =await Pedigrees.find({ regRef: req.params.id });

  if (!horse || horse.length === 0) {
    return next(
      new ErrorResponse(`Pedigree not found with the id of ${req.params.id}`, 404)
    );
  }

  let arbolLimpio = null;

  // caballoObj = horse[0]._doc;
  // caballoObj.id = '1';
  // caballoObj.parentId = '';

  caballoObj = horse[0]?._doc;
  caballoObj.id = '1';
  caballoObj.parentId = '';

  //recursiva de caballos
  // arbs = arbs + JSON.stringify(caballoObj) + ',';

  // caballo, nodo, padre
  
  const caballo = await Pedigrees.find()
 
   const tree = await generaArbol(caballo, horse[0].regRef, 0);
  // //buscar los datos de los padres (objecto, nodo, padre)

  // console.log(arbs);
  const padres = await generaNodo(caballoObj, 2, 1);
  const abuelosPadre = await generaNodo(padres.oCaballoMachoObj, 4, 3);
  const abuelosMadre = await generaNodo(padres.oCaballoHembraObj, 6, 2);
  const bisPadresAbueloPadre = await generaNodo(
    abuelosPadre.oCaballoMachoObj,
    8,
    5
  );

  const bisPadresAbueloMadre = await generaNodo(
    abuelosPadre.oCaballoHembraObj,
    10,
    4
  );
  const bisMadresAbueloPadre = await generaNodo(
    abuelosMadre.oCaballoMachoObj,
    12,
    7
  );
  const bisMadresAbueloMadre = await generaNodo(
    abuelosMadre.oCaballoHembraObj,
    14,
    6
  );
  const taPadrebisPadreAbueloPadre = await generaNodo(
    bisPadresAbueloPadre.oCaballoMachoObj,
    16,
    9
  );

  const taMadrebisPadreAbueloPadre = await generaNodo(
    bisPadresAbueloPadre.oCaballoHembraObj,
    18,
    8
  );
  const taPadresbisPadreAbueloMadre = await generaNodo(
    bisPadresAbueloMadre.oCaballoHembraObj,
    20,
    10
  );
  const taMadresbisMadreAbueloPadre = await generaNodo(
    bisMadresAbueloPadre.oCaballoMachoObj,
    22,
    13
  );
  const taMadrebisMadreAbueloPadre = await generaNodo(
    bisMadresAbueloPadre.oCaballoHembraObj,
    24,
    12
  );
  const taMadresbisMadreAbueloMadre = await generaNodo(
    bisMadresAbueloMadre.oCaballoHembraObj,
    26,
    14
  );
  const taPadrebisMadreAbueloMadre = await generaNodo(
    bisMadresAbueloMadre.oCaballoMachoObj,
    28,
    15
  );

  const chotaPadrebisPadreAbueloPadre = await generaUltimo(
    taPadrebisPadreAbueloPadre,
    30,
    16
  );

  const chotaMadrebisPadreAbueloPadre = await generaUltimo(
    taMadrebisPadreAbueloPadre,
    34,
    18
  );

  const chotaPadresbisPadreAbueloMadre = await generaUltimo(
    taPadresbisPadreAbueloMadre,
    38,
    18
  );

  const chotaPadrebisMadreAbueloMadre = await generaUltimo(
    taPadrebisMadreAbueloMadre,
    44,
    28
  );

  const chotaMadresbisMadreAbueloPadre = await generaUltimo(
    taMadresbisMadreAbueloPadre,
    48,
    22
  );

  const chotaMadresbisMadreAbueloMadre = await generaUltimo(
    taMadresbisMadreAbueloMadre,
    52,
    26
  );

  const chotaMadrebisMadreAbueloPadre = await generaUltimo(
    taMadrebisMadreAbueloPadre,
    55,
    24
  );

  let arbol = `[${JSON.stringify(caballoObj)}, 
    ${JSON.stringify(padres.oCaballoMachoObj)},
    ${JSON.stringify(padres.oCaballoHembraObj)}, 
    ${JSON.stringify(abuelosPadre.oCaballoMachoObj)},
    ${JSON.stringify(abuelosPadre.oCaballoHembraObj)}, 
    ${JSON.stringify(abuelosMadre.oCaballoMachoObj)},
    ${JSON.stringify(abuelosMadre.oCaballoHembraObj)}, 
    ${JSON.stringify(bisPadresAbueloPadre.oCaballoMachoObj)},
    ${JSON.stringify(bisPadresAbueloPadre.oCaballoHembraObj)},
    ${JSON.stringify(bisPadresAbueloMadre.oCaballoMachoObj)},
    ${JSON.stringify(bisPadresAbueloMadre.oCaballoHembraObj)}, 
    ${JSON.stringify(bisMadresAbueloPadre.oCaballoMachoObj)},
    ${JSON.stringify(bisMadresAbueloPadre.oCaballoHembraObj)}, 
    ${JSON.stringify(bisMadresAbueloMadre.oCaballoMachoObj)},
    ${JSON.stringify(bisMadresAbueloMadre.oCaballoHembraObj)},
    ${JSON.stringify(taPadrebisPadreAbueloPadre.oCaballoMachoObj)},
    ${JSON.stringify(taPadrebisPadreAbueloPadre.oCaballoHembraObj)},
    ${JSON.stringify(taMadrebisPadreAbueloPadre.oCaballoMachoObj)},
    ${JSON.stringify(taMadrebisPadreAbueloPadre.oCaballoHembraObj)},
    ${JSON.stringify(taPadresbisPadreAbueloMadre.oCaballoMachoObj)},
    ${JSON.stringify(taPadresbisPadreAbueloMadre.oCaballoHembraObj)},
    ${JSON.stringify(taMadresbisMadreAbueloPadre.oCaballoMachoObj)},
    ${JSON.stringify(taMadresbisMadreAbueloPadre.oCaballoHembraObj)},
    ${JSON.stringify(taMadrebisMadreAbueloPadre.oCaballoMachoObj)},
    ${JSON.stringify(taMadrebisMadreAbueloPadre.oCaballoHembraObj)},
    ${JSON.stringify(taMadresbisMadreAbueloMadre.oCaballoMachoObj)},
    ${JSON.stringify(taMadresbisMadreAbueloMadre.oCaballoHembraObj)},
    ${JSON.stringify(taPadrebisMadreAbueloMadre.oCaballoMachoObj)},
    ${JSON.stringify(taPadrebisMadreAbueloMadre.oCaballoHembraObj)},

    ${JSON.stringify(chotaPadrebisPadreAbueloPadre.oHembraCaballoMachoObj)},
    ${JSON.stringify(chotaPadrebisPadreAbueloPadre.oHembraCaballoHembraObj)},
    ${JSON.stringify(chotaPadrebisPadreAbueloPadre.oMachoCaballoMachoObj)},
    ${JSON.stringify(chotaPadrebisPadreAbueloPadre.oMachoCaballoHembraObj)},

    ${JSON.stringify(chotaMadrebisPadreAbueloPadre.oHembraCaballoMachoObj)},
    ${JSON.stringify(chotaMadrebisPadreAbueloPadre.oHembraCaballoHembraObj)},
    ${JSON.stringify(chotaMadrebisPadreAbueloPadre.oMachoCaballoMachoObj)},
    ${JSON.stringify(chotaMadrebisPadreAbueloPadre.oMachoCaballoHembraObj)},

    ${JSON.stringify(chotaPadrebisMadreAbueloMadre.oHembraCaballoMachoObj)},
    ${JSON.stringify(chotaPadrebisMadreAbueloMadre.oHembraCaballoHembraObj)},
    ${JSON.stringify(chotaPadrebisMadreAbueloMadre.oMachoCaballoMachoObj)},
    ${JSON.stringify(chotaPadrebisMadreAbueloMadre.oMachoCaballoHembraObj)},

    ${JSON.stringify(chotaMadresbisMadreAbueloPadre.oHembraCaballoMachoObj)},
    ${JSON.stringify(chotaMadresbisMadreAbueloPadre.oHembraCaballoHembraObj)},
    ${JSON.stringify(chotaMadresbisMadreAbueloPadre.oMachoCaballoMachoObj)},
    ${JSON.stringify(chotaMadresbisMadreAbueloPadre.oMachoCaballoHembraObj)},

    ${JSON.stringify(chotaMadresbisMadreAbueloMadre.oHembraCaballoMachoObj)},
    ${JSON.stringify(chotaMadresbisMadreAbueloMadre.oHembraCaballoHembraObj)},
    ${JSON.stringify(chotaMadresbisMadreAbueloMadre.oMachoCaballoMachoObj)},
    ${JSON.stringify(chotaMadresbisMadreAbueloMadre.oMachoCaballoHembraObj)},

    ${JSON.stringify(chotaMadrebisMadreAbueloPadre.oHembraCaballoMachoObj)},
    ${JSON.stringify(chotaMadrebisMadreAbueloPadre.oHembraCaballoHembraObj)},
    ${JSON.stringify(chotaMadrebisMadreAbueloPadre.oMachoCaballoMachoObj)},
    ${JSON.stringify(chotaMadrebisMadreAbueloPadre.oMachoCaballoHembraObj)}, 
   ]`;

  let arbol2 = [
    caballoObj,
    padres.oCaballoMachoObj,
    padres.oCaballoHembraObj,
    abuelosPadre.oCaballoMachoObj,
    abuelosPadre.oCaballoHembraObj,
    abuelosMadre.oCaballoMachoObj,
    abuelosMadre.oCaballoHembraObj,
    bisPadresAbueloPadre.oCaballoMachoObj,
    bisPadresAbueloPadre.oCaballoHembraObj,
    bisPadresAbueloMadre.oCaballoMachoObj,
    bisPadresAbueloMadre.oCaballoHembraObj,
    bisMadresAbueloPadre.oCaballoMachoObj,
    bisMadresAbueloPadre.oCaballoHembraObj,
    bisMadresAbueloMadre.oCaballoMachoObj,
    bisMadresAbueloMadre.oCaballoHembraObj,
    taPadrebisPadreAbueloPadre.oCaballoMachoObj,
    taPadrebisPadreAbueloPadre.oCaballoHembraObj,
    taMadrebisPadreAbueloPadre.oCaballoMachoObj,
    taMadrebisPadreAbueloPadre.oCaballoHembraObj,
    taPadresbisPadreAbueloMadre.oCaballoMachoObj,
    taPadresbisPadreAbueloMadre.oCaballoHembraObj,
    taMadresbisMadreAbueloPadre.oCaballoMachoObj,
    taMadresbisMadreAbueloPadre.oCaballoHembraObj,
    taMadrebisMadreAbueloPadre.oCaballoMachoObj,
    taMadrebisMadreAbueloPadre.oCaballoHembraObj,
    taMadresbisMadreAbueloMadre.oCaballoMachoObj,
    taMadresbisMadreAbueloMadre.oCaballoHembraObj,
    taPadrebisMadreAbueloMadre.oCaballoMachoObj,
    taPadrebisMadreAbueloMadre.oCaballoHembraObj,

    chotaPadrebisPadreAbueloPadre.oHembraCaballoMachoObj,
    chotaPadrebisPadreAbueloPadre.oHembraCaballoHembraObj,
    chotaPadrebisPadreAbueloPadre.oMachoCaballoMachoObj,
    chotaPadrebisPadreAbueloPadre.oMachoCaballoHembraObj,

    chotaMadrebisPadreAbueloPadre.oHembraCaballoMachoObj,
    chotaMadrebisPadreAbueloPadre.oHembraCaballoHembraObj,
    chotaMadrebisPadreAbueloPadre.oMachoCaballoMachoObj,
    chotaMadrebisPadreAbueloPadre.oMachoCaballoHembraObj,

    chotaPadrebisMadreAbueloMadre.oHembraCaballoMachoObj,
    chotaPadrebisMadreAbueloMadre.oHembraCaballoHembraObj,
    chotaPadrebisMadreAbueloMadre.oMachoCaballoMachoObj,
    chotaPadrebisMadreAbueloMadre.oMachoCaballoHembraObj,

    chotaMadresbisMadreAbueloPadre.oHembraCaballoMachoObj,
    chotaMadresbisMadreAbueloPadre.oHembraCaballoHembraObj,
    chotaMadresbisMadreAbueloPadre.oMachoCaballoMachoObj,
    chotaMadresbisMadreAbueloPadre.oMachoCaballoHembraObj,

    chotaMadresbisMadreAbueloMadre.oHembraCaballoMachoObj,
    chotaMadresbisMadreAbueloMadre.oHembraCaballoHembraObj,
    chotaMadresbisMadreAbueloMadre.oMachoCaballoMachoObj,
    chotaMadresbisMadreAbueloMadre.oMachoCaballoHembraObj,

    chotaMadrebisMadreAbueloPadre.oHembraCaballoMachoObj,
    chotaMadrebisMadreAbueloPadre.oHembraCaballoHembraObj,
    chotaMadrebisMadreAbueloPadre.oMachoCaballoMachoObj,
    chotaMadrebisMadreAbueloPadre.oMachoCaballoHembraObj,
  ];

  arbolLimpio = clearEmpties(arbol2);
  console.log(arbol, arbol2);

  res.status(200).json({
    success: true,
    data: arbolLimpio,
  });
});

function clearEmpties(obj) {
  let limObj = [];
  for (var k in obj) {
    if (!obj[k] || typeof obj[k] !== 'object') {
      continue; // If null or not an object, skip to the next iteration
    }

    // The property is an object
    if (Object.keys(obj[k]).length === 0) {
      delete obj[k]; // The object had no properties, so delete that property
    } else {
      limObj.push(obj[k]);
    }
  }
  return limObj;
}

async function generaNodo(caballo, nodo, padre) {
  let oCaballoMachoObj = {};
  let oCaballoHembraObj = {};
  console.log(`Caballo: ${caballo.regRef} ${caballo.horseName}, Padre: ${caballo.sireRefNum} ${caballo.sire}, Madre: ${caballo.damRefNum} ${caballo.dam}, breeder: ${caballo.breeder}`);
  const oCaballoMacho = await Pedigrees.find({ regRef: caballo.sireRefNum });
  const oCaballoHembra = await Pedigrees.find({ regRef: caballo.damRefNum });
  
const obreederH = await Owners.find({_id : oCaballoHembra[0]?.breeder});
const obreederM = await Owners.find({_id : oCaballoMacho[0]?.breeder});
  if (oCaballoHembra.length === 0) {
    
    if (!caballo.damRefNum) {
      oCaballoHembraObj = {};
    } else {
      
      oCaballoHembraObj.regRef = caballo.damRefNum;
      oCaballoHembraObj.sex = 'H';
      oCaballoHembraObj.horseName = caballo.dam;
      oCaballoHembraObj.breeder = caballo.damBreeder;
      oCaballoHembraObj.farm = obreederH[0]?.farm
      oCaballoHembraObj.firstName = obreederH[0]?.firstName
      oCaballoHembraObj.lastName = obreederH[0]?.lastName
      oCaballoHembraObj.color = caballo.color;
      oCaballoHembraObj.microchip = caballo.microchip;
      oCaballoHembraObj.id = nodo.toString();
      oCaballoHembraObj.parentId = padre.toString();
    }
  } else {
    oCaballoHembraObj = oCaballoHembra[0]._doc;
    oCaballoHembraObj.farm = obreederH[0]?.farm
    oCaballoHembraObj.firstName = obreederH[0]?.firstName
    oCaballoHembraObj.lastName = obreederH[0]?.lastName
    oCaballoHembraObj.id = nodo.toString();
    oCaballoHembraObj.parentId = padre.toString();
  }

  if (oCaballoMacho.length === 0) {
    if (!caballo.sireRefNum) {
      oCaballoMachoObj = {};
    } else {

      oCaballoMachoObj.regRef = caballo.sireRefNum;
      oCaballoMachoObj.sex = 'M';
      oCaballoMachoObj.horseName = caballo.sire;
      oCaballoMachoObj.breeder = caballo.sireBreeder;
      oCaballoMachoObj.farm = obreederM[0]?.farm
      oCaballoMachoObj.firstName = obreederM[0]?.firstName
      oCaballoMachoObj.lastName = obreederM[0]?.lastName
      oCaballoMachoObj.color = caballo.color;
      oCaballoMachoObj.microchip = caballo.microchip;
      oCaballoMachoObj.id = (nodo + 1).toString();
      oCaballoMachoObj.parentId = padre.toString();
    }
  } else {
    oCaballoMachoObj = oCaballoMacho[0]._doc;
    oCaballoMachoObj.farm = obreederM[0]?.farm
    oCaballoMachoObj.firstName = obreederM[0]?.firstName
    oCaballoMachoObj.lastName = obreederM[0]?.lastName
    oCaballoMachoObj.id = (nodo + 1).toString();
    oCaballoMachoObj.parentId = padre.toString();
  }

  return { oCaballoMachoObj, oCaballoHembraObj };
}

async function generaUltimo(obj, nodo, padre) {
  let oHembraCaballoMachoObj = {};
  let oHembraCaballoHembraObj = {};
  let oMachoCaballoMachoObj = {};
  let oMachoCaballoHembraObj = {};
  
  console.log(obj);
  if (!obj.oCaballoHembraObj.damRefNum) {
    oHembraCaballoHembraObj = {};
  } else {
    const obreeder = await Owners.find({_id : obj.oCaballoHembraObj.damBreeder});
    oHembraCaballoHembraObj.regRef = obj.oCaballoHembraObj.damRefNum;
    oHembraCaballoHembraObj.sex = 'H';
    oHembraCaballoHembraObj.horseName = obj.oCaballoHembraObj.dam;
    oHembraCaballoHembraObj.breeder = obj.oCaballoHembraObj.damBreeder;
    oHembraCaballoHembraObj.farm = obreeder[0]?.farm
    oHembraCaballoHembraObj.firstName = obreeder[0]?.firstName
    oHembraCaballoHembraObj.lastName = obreeder[0]?.lastName
    oHembraCaballoHembraObj.color = obj.oCaballoHembraObj.color;
    oHembraCaballoHembraObj.microchip = obj.oCaballoHembraObj.microchip;
    oHembraCaballoHembraObj.id = nodo.toString();
    oHembraCaballoHembraObj.parentId = padre.toString();
  }

  if (!obj.oCaballoHembraObj.sireRefNum) {
    oHembraCaballoMachoObj = {};
  } else {
    const obreeder = await Owners.find({_id : obj.oCaballoHembraObj.sireBreeder});
    oHembraCaballoMachoObj.regRef = obj.oCaballoHembraObj.sireRefNum;
    oHembraCaballoMachoObj.sex = 'M';
    oHembraCaballoMachoObj.horseName = obj.oCaballoHembraObj.sire;
    oHembraCaballoMachoObj.breeder = obj.oCaballoHembraObj.sireBreeder;
    oHembraCaballoMachoObj.farm = obreeder[0]?.farm
    oHembraCaballoMachoObj.firstName = obreeder[0]?.firstName
    oHembraCaballoMachoObj.lastName = obreeder[0]?.lastName
    oHembraCaballoMachoObj.color = obj.oCaballoHembraObj.color;
    oHembraCaballoMachoObj.microchip = obj.oCaballoHembraObj.microchip;
    oHembraCaballoMachoObj.id = (nodo + 1).toString();
    oHembraCaballoMachoObj.parentId = padre.toString();
  }

  if (!obj.oCaballoMachoObj.damRegNum) {
    oMachoCaballoHembraObj = {};
  } else {
    const obreeder = await Owners.find({_id : obj.oCaballoMachoObj.damBreeder});
    oMachoCaballoHembraObj.regRef = obj.oCaballoMachoObj.damRefNum;
    oMachoCaballoHembraObj.sex = 'H';
    oMachoCaballoHembraObj.horseName = obj.oCaballoMachoObj.dam;
    oMachoCaballoHembraObj.breeder = obj.oCaballoMachoObj.damBreeder;
    oMachoCaballoHembraObj.farm = obreeder[0]?.farm
    oMachoCaballoHembraObj.firstName = obreeder[0]?.firstName
    oMachoCaballoHembraObj.lastName = obreeder[0]?.lastName
    oMachoCaballoHembraObj.color = obj.oCaballoMachoObj.color;
    oMachoCaballoHembraObj.microchip = obj.oCaballoMachoObj.microchip;
    oMachoCaballoHembraObj.id = (nodo + 2).toString();
    oMachoCaballoHembraObj.parentId = (padre + 1).toString();
  }

  if (!obj.oCaballoMachoObj.sireRegNum
    ) {
    oMachoCaballoMachoObj = {};
  } else {
    const obreeder = await Owners.find({_id : obj.oCaballoMachoObj.sireBreeder});
    oMachoCaballoMachoObj.regRef = obj.oCaballoMachoObj.sireRefNum;
    oMachoCaballoMachoObj.sex = 'M';
    oMachoCaballoMachoObj.horseName = obj.oCaballoMachoObj.sire;
    oMachoCaballoMachoObj.breeder = obj.oCaballoMachoObj.sireBreeder;
    oMachoCaballoMachoObj.farm = obreeder[0]?.farm
    oMachoCaballoMachoObj.firstName = obreeder[0]?.firstName
    oMachoCaballoMachoObj.lastName = obreeder[0]?.lastName
    oMachoCaballoMachoObj.color = obj.oCaballoMachoObj.color;
    oMachoCaballoMachoObj.microchip = obj.oCaballoMachoObj.microchip;
    oMachoCaballoMachoObj.id = (nodo + 3).toString();
    oMachoCaballoMachoObj.parentId = (padre + 1).toString();
  }

  return {
    oHembraCaballoMachoObj,
    oHembraCaballoHembraObj,
    oMachoCaballoMachoObj,
    oMachoCaballoHembraObj,
  };
}





let num = 0
let Arbol = []
async function generaArbol(caballos, regRef, padre) {
  let oCaballo = {}

  let caballoObj = caballos.filter((obje) => {
    return obje.regRef === regRef
  })
    oCaballo = armaNodo(caballoObj,  padre)
    Arbol.push(oCaballo)
   
  let oSire = caballos.filter((obje) => {
    return obje.regRef === caballoObj[0].sireRefNum
  })
  let oDam = caballos.filter((obje) => {
    return obje.regRef === caballoObj[0].damRefNum
  })
  if (oSire.length === 0) {
    console.log('Termine')
    padre = oCaballo.id
      const sireTerminal = armaNodoTerminal(caballoObj[0],  padre, 's')
      Arbol.push(sireTerminal)
    
  } else {

      padre = oCaballo.id
    generaArbol(caballos, oSire[0].regRef,  padre)
  }


  if (oDam.length === 0) {
    console.log('Termine')
    padre = oCaballo.id
    const damTerminal = armaNodoTerminal(caballoObj[0],  padre, 'd')
    Arbol.push(damTerminal)

    
  } else {

    padre = oCaballo.id
    generaArbol(caballos, oDam[0].regRef,  padre)
 
}

return Arbol

}

function armaNodoTerminal(caballoObj, padre, sexo){
  let oCaballo = {}
  oCaballo.id = Arbol.length +1
  oCaballo.parentId = padre
  if (sexo === 's') {
    oCaballo.regRef = caballoObj.sireRefNum
    oCaballo.horseName = caballoObj.sire
  } else {
    oCaballo.regRef = caballoObj.damRefNum
    oCaballo.horseName = caballoObj.dam
  }

  
  
  
  console.log(
    `RegRef: ${oCaballo.regRef}, Name: ${oCaballo.horseName},  Padre: ${padre}, Nodo: ${oCaballo.id}`
  )
  return oCaballo
}

function armaNodo(caballoObj,  padre){
  let oCaballo = {}
  oCaballo.regRef = caballoObj[0].regRef
  oCaballo.id = Arbol.length+1
  oCaballo.parentId = padre
  oCaballo.horseName = caballoObj[0].horseName
  oCaballo.sireRefNum = caballoObj[0].sireRefNum
  oCaballo.sire = caballoObj[0].sire
  oCaballo.damRefNum = caballoObj[0].damRefNum
  oCaballo.dam = caballoObj[0].dam
  
  console.log(
    `RegRef: ${oCaballo.regRef}, Name: ${oCaballo.horseName},  Padre: ${padre}, Nodo: ${oCaballo.id} `
  )
  return oCaballo
}
