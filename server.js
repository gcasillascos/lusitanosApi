const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

//Load env vars
dotenv.config({ path: './config/config.env' });

// Connect DB
connectDB();



//Routes files
const auth = require('./routes/auth');
const users = require('./routes/users');
const utils = require('./routes/utils');
const owners = require('./routes/owners');
const horses = require('./routes/horses');
const cuentas = require('./routes/cuentas');
const conceptos = require('./routes/conceptos');
const edoCtas = require('./routes/edoCtas');
const cuerpos = require('./routes/cuerpoEdoCtas');
const pedigrees = require('./routes/pedigrees');
const cuerpoCubs = require('./routes/cuerpoCubricion');
const cubriciones = require('./routes/cubriciones');
const cuerpoBajas = require('./routes/cuerpoBajas');
const bajas = require('./routes/bajas');
const premios = require('./routes/premios');
const sanitario = require('./routes/sanitarios');
const nutricional = require('./routes/nutricionales');
const preRegistros = require('./routes/preRegistros');
const valoraciones = require('./routes/valoraciones');
const fertilidades = require('./routes/fertilidades');
const nacimientos = require('./routes/nacimientos');
const userPagos = require('./routes/userPagos');

const app = express();

app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set static folder
app.use(express.static(path.join(__dirname, '/public')));
console.log(path.join(__dirname, '/public'));

//File Upload
app.use(fileupload());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Ratelimiting
const limiter = rateLimit({
  windowMS: 10 * 60 * 1000, //10 mins
  max: 100,
});

app.use(limiter);

// Prevent HTTP param polution
app.use(hpp());

// Prevent CORS
app.use(cors());

//Mount routers

app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/utils', utils);
app.use('/api/v1/owners', owners);
app.use('/api/v1/horses', horses);
app.use('/api/v1/cuentas', cuentas);
app.use('/api/v1/conceptos', conceptos);
app.use('/api/v1/edoctas', edoCtas);
app.use('/api/v1/cuerpo', cuerpos);
app.use('/api/v1/pedigrees', pedigrees);
app.use('/api/v1/cubriciones', cubriciones);
app.use('/api/v1/cuerpocubs', cuerpoCubs);
app.use('/api/v1/bajas', bajas);
app.use('/api/v1/cuerpobajas', cuerpoBajas);
app.use('/api/v1/premios', premios);
app.use('/api/v1/sanitario', sanitario);
app.use('/api/v1/nutricional', nutricional);
app.use('/api/v1/preregistros', preRegistros);
app.use('/api/v1/valoraciones', valoraciones);
app.use('/api/v1/fertilidades', fertilidades);
app.use('/api/v1/nacimientos', nacimientos);
app.use('/api/v1/userpagos', userPagos);

app.use(errorHandler);
const PORT = process.env.PORT || 4500;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold
  )
);

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server & exit process
  server.close(() => process.exit(1));
});
