const {Client} = require("@googlemaps/google-maps-services-js")


exports.geoCode = async (options) => {

const args = {
    params: {
      key: process.env.GEOCODER_API_KEY,
      address: options.address,
    }
  };

const client = new Client({})

        const location = await client.geocode(args, (err, str) => { 
            if (err) throw err;
             const string = JSON.stringify(res.data.results[0]);
//             setTimeout(() => { console.log(`First result is: ${str}`)}, 1000)
//             return res.data.results[0];
            console.log(string);


        })
            return location

//    await client.geocode(args)
//     .then(res => {
//             const str = JSON.stringify(res.data.results[0]);
//             setTimeout(() => { console.log(`First result is: ${str}`)}, 1000)
//             return res.data.results[0];
//         })
//     .catch(e => {
//         console.log(e.response.data.error_message)
//     })

}


 
