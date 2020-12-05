const http = require('http');



// function LookupServer() {
// const { LookupQueryJson } = require("./queryFabiziDatabases")
//     const MongoClient = require('mongodb').MongoClient;
//     MongoClient.connect(
//         "mongodb://localhost:27017",
//         { useUnifiedTopology: true, poolSize: 20 },
//         function (err, client) {
//             http.createServer(async function (req, res) {
//                 const data = await LookupQueryJson(client);
//                 res.sendDate = true;
//                 res.write(JSON.stringify(data)) //write a response to the client
//                 res.end(); //end the response
//             }).listen(3000);
//     })
// }
// LookupServer();

async function DeepPopulateServer() {
    const { DeepPopulate } = require("./databaseSchema");
    const mongoose = require("mongoose");
    await mongoose.connect(
        "mongodb://localhost:27017/Fabizi_1",
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 15
        }
    );
    
    // console.log(data);
    http.createServer(async function (req, res) {
        const data = await DeepPopulate();
        res.sendDate = true;
        res.write(JSON.stringify(data)) //write a response to the client
        res.end(); //end the response
    }).listen(3000);
}

DeepPopulateServer()
