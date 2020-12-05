const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(
    "mongodb://localhost:27017",
    { useUnifiedTopology: true , poolSize: 20},
    async function (err, client)
    {
        console.time();
        const databaseNumber                    = 10;
        const collectionInEachDatabaseNumber    = 50;

        for (let i = 0; i < databaseNumber; i++) {
            console.log("database: ", `fabizi_tenant_${i+1}`)
            let db = client.db(`fabizi_tenant_${i+1}`);
            for (let j = 0; j < collectionInEachDatabaseNumber; j++) {
                console.log('collection: ', `tenant_collection_${j+1}`)
                let collection = db.collection(`tenant_collection_${j+1}`)
                await collection.insertOne({
                    "test": true
                })
            }
        }
        console.timeEnd();
    })