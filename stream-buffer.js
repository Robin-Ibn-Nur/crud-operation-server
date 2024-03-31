const fs = require("fs");

// fs.readFile(__dirname + "/loveMessage", "utf-8", (err, data) => {
//     if (err) {
//         throw new Error("Error! Reading File");
//     }
//     fs.writeFile(__dirname + "/loveReply", data, (err) => {
//         if (err) {
//             throw new Error("Error! Write File");
//         }
//     })
// })

// create a readableStrem

const readableStraem = fs.createReadStream(__dirname + "/loveReply", "utf-8")
const writableStream = fs.createWriteStream(__dirname + '/loveMessage');
readableStraem.on("data", (data) => {
    console.log(data);

    // writableStream.write(data, (err) => {
    //     if (err) {
    //         throw new Error("Error! Write File");
    //     }
    // })

    // it's not working {readableStraem.pipe(writeableStream)}
    readableStraem.pipe(writableStream)


})


readableStraem.on("error", (err) => {
    throw new Error(err)
});

writableStream.on("error", (err) => {
    throw new Error(err)
});


writableStream.on("finish", () => {
    console.log("finish writing file!");
});
