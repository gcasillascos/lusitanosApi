const AWS = require('aws-sdk');

exports.uploadData = async (options) => {
  //Convierte de ArrayBuffer a Buffer
  const buff = toBuffer(options.file.data);

  let params = {
    Bucket: process.env.AWS_BUCKET_NAME, // pass your bucket name
    Key: `${options.ruta}/${options.fileName}`,
    Body: buff,
  };

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  s3.upload(params, function (err, data) {
    if (err) throw err;
    console.log(`File uploaded successfully at ${data.Location}`);
  });
};

function toBuffer(ab) {
  var buf = Buffer.alloc(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}

exports.downloadData = async (options) => {
  //Convierte de ArrayBuffer a Buffer
  // const buff = toBuffer(options.file.data);

  let params = {
    Bucket: process.env.AWS_BUCKET_NAME, // pass your bucket name
    Key: `${options.ruta}/${options.fileName}`,
  };

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  const data = await s3.getObject(params).promise();
  return data.Body;
};

exports.listData = async (options) => {
  //Convierte de ArrayBuffer a Buffer
  //const buff = toBuffer(options.file.data);
  let path = null
 if (options.ruta === 'horses') {
  path = `${options.id}/${options.ruta}/${options.horseId}/${options.tipo}/`
 } else {
  path = `${options.id}/${options.ruta}/${options.tipo}/`
 }
 


  let params = {
    Bucket: process.env.AWS_BUCKET_NAME, // pass your bucket name
    Prefix: path,
  };

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  const data = await s3.listObjects(params).promise();
  return data;
};
