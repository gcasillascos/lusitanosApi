const AWS = require('aws-sdk');

exports.sendMail = async (options) => {
  // Set the region
  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  // Create sendEmail params
  var params = {
    Destination: {
      ToAddresses: [
        options.emailTo,
        /* more items */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: options.htmlMessage,
        },
        Text: {
          Charset: 'UTF-8',
          Data: options.textMessage,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: options.subject,
      },
    },
    Source: process.env.AWS_FROM_MAIL /* required */,
  };

  // Create a new SES object.
  var ses = new AWS.SES();
  //Try to send the email.
  ses.sendEmail(params, function (err, data) {
    // If something goes wrong, print an error message.
    if (err) {
      console.log(err.message);
    } else {
      console.log('Email sent! Message ID: ', data.MessageId);
    }
  });

  //   // Create the promise and SES service object
  //   var sendPromise = await new AWS.SES().sendEmail(params).promise();

  //   // Handle promise's fulfilled/rejected states
  //   sendPromise
  //     .then(function (data) {
  //       console.log(data.MessageId);
  //     })
  //     .catch(function (err) {
  //       console.error(err, err.stack);
  //     });
};
