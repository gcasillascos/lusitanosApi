const fs = require('fs');
const async = require("async");
const awsS3 = require("./awsS3");


exports.imageList = async (options) => {
    let objImg = [];

    let list = await awsS3.listData({
      ruta: options.ruta,
      tipo: options.tipo,
      id: options.id,
      horseId: options.horseId
      });
    
      // console.log(list.Contents);
      list.Contents.forEach(function (obj, index) {
        if (obj.Size !== 0) {
          console.log(obj.Key);
          objImg.push(obj.Key)
        }
        
      });
      return objImg;
    }
    
    