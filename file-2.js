const { love, robin, urmi } = require("./file-1.js")

// name alies (when the same name will declare in two files)
const { love: love3, robin: robin3, urmi: urmi3 } = require("./file-3.js");




console.log(love3(10, 20), robin3, urmi3);