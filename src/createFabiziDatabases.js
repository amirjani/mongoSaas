const MongoClient = require('mongodb').MongoClient;
const faker = require("faker");

const ingredientObject = () => {
    return {
        name: faker.name.findName()
    }
}

MongoClient.connect(
    "mongodb://localhost:27017",
    { useUnifiedTopology: true , poolSize: 20},
    async function (err, client)
    {
        console.time();

        const rand = Math.random()

        const databaseNumber    = 5;
        const ingredientNumber  = 10;
        const orderNumber       = 2;

        for (let i = 0; i < databaseNumber; i++) {
            console.log("database: ", `Fabizi_${i+1}`)
            let db = client.db(`Fabizi_${i+1}`);

            // ---------------------> ingredient <----------------------------
            // for (let j = 0; j < ingredientNumber; j++) {
            //     let collection = db.collection(`ingredient`)
            //     await collection.insertOne(ingredientObject())
            // }

            // ---------------------> addOn <----------------------------------
            for (let j = 0; j < orderNumber ; j++) {
                db.collection('ingredient').aggregate(
                    [
                        { "$unwind": "$questionLibrary.questions" },
                        { "$sample": { "size": 1 } }
                    ]
                )
                console.log(result)
            }

            // ---------------------------> index <--------------------------------------
            // await db.collection('ingredient').createIndex({
            //     '_id': 1
            // })

        }

        console.timeEnd();
    })