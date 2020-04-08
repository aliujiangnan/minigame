var CryptoJS = require("aes");
var AesCbc = (function () {
    function AesCbc() {
    }

    var key = CryptoJS.enc.Utf8.parse("ilc2grp9_d3LcMRYJ8BgYsSXuvnQbHbH");
    var iv = CryptoJS.enc.Utf8.parse('0000000000000000');
    
    var options = {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }

    AesCbc.encode = function (src) {
        var encryptedData = CryptoJS.AES.encrypt(src, key, options);
        var encryptedBase64Str = encryptedData.toString();
        return encryptedBase64Str;
    }

    AesCbc.decode = function (src) {
        var decryptedData = CryptoJS.AES.decrypt(src, key, options);
        var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
        return decryptedStr;
    }

    return AesCbc;
}());

module.exports = AesCbc;
