const MongoClient = require('mongodb').MongoClient;
const faker = require("faker");

let quantityOrder = () => {
    return faker.random.number({
        'min': 1,
        'max': 5
    });
}

MongoClient.connect(
    "mongodb://localhost:27017",
    { useUnifiedTopology: true , poolSize: 20},
    async function (err, client)
    {
        console.time();
        console.log("SEED STARTED AT: ", new Date())

        const databaseNumber    = 5;
        const ingredientNumber  = 1000;
        const addOnNumber       = 200;
        const recipeNumber      = 200;
        const menuItemNumber    = 100;
        const orderNumber       = 100000;
        const userNumber        = 100000;
        const tableNumber       = 20;


        for (let i = 0; i < databaseNumber; i++) {
            console.log("database: ", `Fabizi_${i+1}`);
            let db = client.db(`Fabizi_${i+1}`);

            const ingredientCollection  = db.collection('ingredient');
            const addOnCollection       = db.collection('addOn');
            const recipeCollection      = db.collection('recipe');
            const menuItemCollection    = db.collection('menuItem');
            const orderCollection       = db.collection('order');
            const userCollection        = db.collection('user');
            const tableCollection       = db.collection('table')

            // ---------------------> table <----------------------------
            const tableItem = [];
            for (let j = 0; j < tableNumber; j++) {
                console.log("Table Insert: ", j);
                const table = await tableCollection.insertOne({
                    name: faker.name.findName(),
                    status: "FREE"
                })
                tableItem.push(table.insertedId)
            }

            // ---------------------> user <----------------------------
            const userItem = [];
            for (let j = 0; j < userNumber; j++) {
                console.log("User Insert: ", j);
                const user = await userCollection.insertOne({
                    name: faker.name.findName(),
                    phone: faker.phone.phoneNumber(),
                })
                userItem.push(user.insertedId)
            }

            // ---------------------> ingredient <----------------------------
            const ingredientItem = [];
            for (let j = 0; j < ingredientNumber; j++) {
                console.log("Ingredient Insert: ", j);
                const ingredient = await ingredientCollection.insertOne({
                    name: faker.name.findName()
                })
                ingredientItem.push(ingredient.insertedId)
            }

            // ---------------------> addOn <----------------------------------
            const addOnItem = [];
            for (let j = 0; j < addOnNumber ; j++) {
                console.log("addOn Insert: ", j);
                const addOn = await addOnCollection.insertOne({
                    name: faker.name.findName(),
                    ingredientItem: ingredientItem
                })
                ingredientItem.push(addOn.insertedId)
            }

            // ---------------------> addOn <----------------------------------
            const recipeItem = [];
            for (let j = 0; j < recipeNumber ; j++) {
                console.log("recipe Insert: ", j);
                const recipe = await recipeCollection.insertOne({
                    name: faker.name.findName(),
                    ingredientItem: ingredientItem,
                    addOnItem: addOnItem
                })
                recipeItem.push(recipe.insertedId)
            }

            // ---------------------> menuItem <----------------------------------
            const menuItemArray = [];
            for (let j = 0; j < menuItemNumber ; j++) {
                console.log("menuItem: ", j);

                const menuItem = await menuItemCollection.insertOne({
                    name: faker.name.findName(),
                    quantity: faker.random.number(),
                    price: faker.random.number(),
                    recipe: recipeItem[Math.floor(Math.random() * recipeItem.length)],
                })

                menuItemArray.push(menuItem.insertedId);
            }

            // ---------------------> Order <----------------------------------
            for (let j = 0; j < orderNumber ; j++) {
                console.log("order: ", j);

                let tableId = tableItem[Math.floor(Math.random() * tableItem.length)]

                await orderCollection.insertOne({
                    orderId: faker.random.number({
                        'min': 10000,
                        'max': 40000
                    }),
                    table: {
                        _id: tableId,
                        checkInDateTime: faker.time.recent(),
                    },
                    totalPrice: faker.random.number(),

                    participant: [
                        {
                            userId: userItem[Math.floor(Math.random() * userItem.length)],
                            subOrderId: 1,
                            preparation_time: faker.random.number(),
                            checkOutDateTime: new Date(),
                            totalPrice: faker.random.number(),
                            menuItem: [
                                {
                                    _id: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder()
                                },
                                {
                                    _id: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder()
                                },
                                {
                                    _id: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder()
                                }
                            ]
                        },
                        {
                            userId: userItem[Math.floor(Math.random() * userItem.length)],
                            subOrderId: 1,
                            preparation_time: faker.random.number(),
                            checkOutDateTime: new Date(),
                            totalPrice: faker.random.number(),
                            menuItem: [
                                {
                                    _id: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder()
                                },
                                {
                                    _id: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder()
                                },
                                {
                                    _id: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder()
                                }
                            ]
                        },
                        {
                            userId: userItem[Math.floor(Math.random() * userItem.length)],
                            subOrderId: 1,
                            preparation_time: faker.random.number(),
                            checkOutDateTime: new Date(),
                            totalPrice: faker.random.number(),
                            menuItem: [
                                {
                                    _id: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder()
                                },
                                {
                                    _id: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder()
                                },
                                {
                                    _id: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder()
                                }
                            ]
                        }
                    ]

                })
            }


            console.log("SEED ENDED AT: ", new Date())

            // ---------------------------> index <--------------------------------------
            console.log("INDEXING STARTED AT: ", new Date())
            await addOnCollection.createIndex({
                'ingredientItem': 1
            })

            await recipeCollection.createIndex({
                'ingredientItem': 1
            })
            await recipeCollection.createIndex({
                'addOnItem': 1
            })

            await menuItemCollection.createIndex({
                'recipe': 1
            })
            await menuItemCollection.createIndex({
                'price': 1
            })

            await tableCollection.createIndex({
                'status': 1
            })

            await userCollection.createIndex({
                'phone': 1
            })

            await orderCollection.createIndex({
                'orderId': 1
            })

            await orderCollection.createIndex({
                'table._id': 1
            })

            await orderCollection.createIndex({
                'total_price': 1
            })

            await orderCollection.createIndex({
                'participant.userId': 1
            })

            await orderCollection.createIndex({
                'participant.menuItem._id': 1
            })

            console.log("INDEXING ENDED AT: ", new Date())
        }


        console.timeEnd();
    })