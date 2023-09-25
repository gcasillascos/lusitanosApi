const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
 const Owner = require('./models/Owner');
//const Horse = require('./models/Horse');
// const Pedigree = require('./models/Pedigree');
 //const Concepto = require('./models/Concepto');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Read JSON files

const owners = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/owner.json`, 'utf-8')
);

// const horses = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/horses2.json`, 'utf-8')
// );

// const pedigrees = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/pedigree.json`, 'utf-8')
// );

// const conceptos = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/conceptosPesos.json`, 'utf-8')
// );

// const conceptos2 = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/conceptosEuros.json`, 'utf-8')
// );

// Import into DB
const importData = async () => {
  try {
     await Owner.create(owners);
    // await Horse.create(horses);
    // await Pedigree.create(pedigrees);
    //  await Concepto.create(conceptos);
    // await Concepto.create(conceptos2);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    /*     await Owner.deleteMany();*/
    await Horse.deleteMany(); 
    // await Pedigree.deleteMany();
    // await Review.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
