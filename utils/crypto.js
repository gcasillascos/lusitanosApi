const crypto = require("crypto")

const algorithm = "aes-256-cbc"
//Generate 16 bytes random data
const iv = crypto.randomBytes(16)
//Generate securitykey
const securityKey = crypto.randomBytes(32)

exports.encrypt = async (options) => {

// Cipher function
    const cipher = crypto.createCipheriv(algorithm, securityKey, iv)

//encrypt message
    let encrypt = cipher.update(options.message, "utf-8", "hex")

    encrypt += cipher.final("hex")
    console.log("Encrypted message: " + encrypt);
    return encrypt.toString()
}


exports.decrypt = async (options) => {
// the decipher function
    const decipher = crypto.createDecipheriv(algorithm, securityKey, iv)

    let decrypt = decipher.update(options.message, "hex", "utf-8")

    decrypt += decipher.final("utf8")

    console.log("Decrypted message: " + decrypt)

    return decrypt.toString()
}