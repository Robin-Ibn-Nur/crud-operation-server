// how to import so many files from a folder
// const { loveAdd, loveSubstract } = require("./utils")


// console.log(loveAdd(5, 10), loveSubstract(50, 10));



// we can write a file by the following code
const fs = require("fs")
const txt = "I Love you Urmi"
fs.writeFileSync("./loveMessage", txt)





// IIFE
// Immediately Invoked Function Expression

// ((node) => {
//     console.log(`I will level up my skills in ${node}`);
// })("level 2")



// If I want to use import instant of require than I have to rename the file extension .mjs instant of .js than I will use import & export instant of module.exports & require
