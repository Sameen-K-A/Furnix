const OTPgenerator = function () {
    let otp = '';
    for (let i = 0; i < 4; i++) {
        otp += Math.floor(Math.random() * 10).toString()
    }
    return otp;
}

module.exports = OTPgenerator;