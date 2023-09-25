const qrcode = require('qrcode');
const fs = require('fs');

const qrCode = async (options) => {
  let opts = {
    errorCorrectionLevel: 'H',
    type: 'svg',
    color: {
      dark: '', // dots
      light: '#00000000', // Transparent background
    },
  };

  let str = `${options.name.trim()}`;

  opts.color.dark = options.color;

  console.log(str, '\n', opts);
  const qrCode = qrcode.toString(str, opts, (err, string) => {
    if (err) throw err;
    console.log(string);

    // let n = string.indexOf('>')
    // let strFinal = string.substring(n + 1, string.length)
    // console.log(strFinal )
    // fs.writeFile(`./${options.name}.svg`,string, (err, string) => {
    //     console.log('Done')
    // })
  });
  return qrCode;
};

module.exports = qrCode;
