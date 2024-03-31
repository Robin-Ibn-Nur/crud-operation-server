const http = require("http");
const fs = require("fs");
const { MongoClient, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

const uri = 'mongodb://0.0.0.0:27017/';
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const postCollection = client.db("post").collection("allPost");

        const server = http.createServer(async (req, res) => {
            console.log(req.url, req.method);

            const parsedURL = new URL(req.url, `http://${req.headers.host}`);
            const pathName = parsedURL.pathname;

            if (pathName === "/home" && req.method === "GET") {
                fs.readFile(__dirname + "/index.html", "utf-8", (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end("Error! Reading File");
                    } else {
                        res.setHeader("Content-type", "text/html");
                        res.statusCode = 200;
                        res.end(data);
                    }
                });
            } else if (pathName === "/post" && req.method === "GET") {
                fs.readFile(__dirname + "/data.json", "utf-8", (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end("Error! Reading File");
                    } else {
                        const query = parsedURL.searchParams;
                        const postID = query.get("id");
                        const expectedPost = JSON.parse(data).find(p => p.id == postID);
                        res.setHeader("Content-type", "application/json");
                        res.statusCode = 200;
                        res.end(JSON.stringify(expectedPost));
                    }
                });

                // post method
            } else if (pathName === "/create-post" && req.method === "POST") {
                let body = "";
                req.on("data", (chunk) => {
                    body += chunk.toString();
                });

                req.on("end", async () => {
                    try {
                        const postData = JSON.parse(body);
                        const result = await postCollection.insertOne(postData);
                        res.setHeader("Content-type", "application/json");
                        res.statusCode = 200;
                        res.end(JSON.stringify({
                            message: "Post created successfully!",
                            data: result.ops[0], // Return the inserted document
                        }));
                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end("Error! Invalid JSON");
                    }
                });

                // updated post
            } else if (pathName.startsWith("/update-post") && req.method === "PATCH") {
                const postID = pathName.split("/")[2];
                let body = "";
                req.on("data", (chunk) => {
                    body += chunk.toString();
                });

                req.on("end", async () => {
                    try {
                        const updatedData = JSON.parse(body);
                        const result = await postCollection.updateOne(
                            { _id: new ObjectId(postID) },
                            { $set: updatedData });
                        res.setHeader("Content-type", "application/json");
                        res.statusCode = 200;
                        res.end(JSON.stringify({
                            message: "Post updated successfully!",
                            data: result.ops[0], // Return the inserted document
                        }));
                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end("Error! Invalid JSON");
                    }
                });
            } else if (pathName.startsWith("/delete-post") && req.method === "DELETE") {
                const postID = pathName.split("/")[2];

                const result = await postCollection.deleteOne(
                    { _id: new ObjectId(postID) },
                );
                res.setHeader("Content-type", "application/json");
                res.statusCode = 200;
                res.end(JSON.stringify({
                    message: "Post deleted successfully!",
                    data: result.ops[0], // Return the inserted document
                }));

            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end("Not Found");
            }
        });

        server.listen(port, () => {
            console.log(`Server is Listening on ${port}`);
        });

    } finally {
        // Close the MongoDB client when done
        // client.close();
    }
}

run().catch(console.error);
