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
        const tableNumber       = 50;

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
                    status: "FREE",
                    capacity: faker.random.number(),
                })
                tableItem.push(table.insertedId)
            }

            // ---------------------> user <----------------------------
            const userItem = [];
            for (let j = 0; j < userNumber; j++) {
                console.log("User Insert: ", j);
                const user = await userCollection.insertOne({
                    name: faker.name.findName(),
                    phone: [
                        {
                            number: faker.phone.phoneNumber(),
                            prefix: '+98'
                        },
                        {
                            number: faker.phone.phoneNumber(),
                            prefix: '+98'
                        }
                    ],
                    location: {
                        lat: faker.address.latitude(),
                        long: faker.address.longitude(),
                        address: faker.address.streetAddress()
                    },
                    email: faker.internet.email(),
                    password: faker.random.word(),
                    role: [
                        "ADMIN",
                        "SUPER_VISOR"
                    ],
                    orders: []
                })
                userItem.push(user.insertedId)
            }

            // ---------------------> ingredient <----------------------------
            const ingredientItem = [];
            for (let j = 0; j < ingredientNumber; j++) {
                console.log("Ingredient Insert: ", j);
                const ingredient = await ingredientCollection.insertOne({
                    itemType: "VEGETABLES",
                    name: faker.name.findName(),
                    unit: "gr",
                    size: faker.random.number(),
                    minimumCapacity: 2, 
                    defaultPrice: faker.random.number(),
                    wasteIn: faker.random.number(),
                    stock: [
                        "Niavaran"
                    ]
                })
                ingredientItem.push(ingredient.insertedId)
            }

            // ---------------------> addOn <----------------------------------
            const addOnItem = [];
            for (let j = 0; j < addOnNumber ; j++) {
                console.log("addOn Insert: ", j);
                const addOn = await addOnCollection.insertOne({
                    name: faker.name.findName(),
                    ingredientItem: [
                        ingredientItem[Math.floor(Math.random() * ingredientItem.length)],
                        ingredientItem[Math.floor(Math.random() * ingredientItem.length)],
                        ingredientItem[Math.floor(Math.random() * ingredientItem.length)],
                        ingredientItem[Math.floor(Math.random() * ingredientItem.length)],
                        ingredientItem[Math.floor(Math.random() * ingredientItem.length)]
                    ],
                    amount: faker.random.number(),
                    size: faker.random.number(),
                    mainCost: faker.random.number(),
                    wasteCost: faker.random.number()
                })
                addOnItem.push(addOn.insertedId)
            }

            // ---------------------> recipe <----------------------------------
            const recipeItem = [];
            for (let j = 0; j < recipeNumber ; j++) {
                console.log("recipe Insert: ", j);
                const recipe = await recipeCollection.insertOne({
                    name: faker.name.findName(),
                    amount: faker.random.number(),
                    unit: 'gr',
                    bulk: faker.random.boolean(),
                    mainCost: faker.random.number(),
                    wasteCost:  faker.random.number(),
                    ingredients: [
                        {
                            ingredient: ingredientItem[Math.floor(Math.random() * ingredientItem.length)],
                            usage: faker.random.number(),
                            waste: faker.random.number()
                        },
                        {
                            ingredient: ingredientItem[Math.floor(Math.random() * ingredientItem.length)],
                            usage: faker.random.number(),
                            waste: faker.random.number()
                        },
                        {
                            ingredient: ingredientItem[Math.floor(Math.random() * ingredientItem.length)],
                            usage: faker.random.number(),
                            waste: faker.random.number()
                        },
                        {
                            ingredient: ingredientItem[Math.floor(Math.random() * ingredientItem.length)],
                            usage: faker.random.number(),
                            waste: faker.random.number()
                        },
                        
                    ],
                    addOns: [
                        {
                            addOn: addOnItem[Math.floor(Math.random() * addOnItem.length)],
                            usage: faker.random.number(),
                            waste: faker.random.number()
                        },
                        {
                            addOn: addOnItem[Math.floor(Math.random() * addOnItem.length)],
                            usage: faker.random.number(),
                            waste: faker.random.number()
                        },
                        {
                            addOn: addOnItem[Math.floor(Math.random() * addOnItem.length)],
                            usage: faker.random.number(),
                            waste: faker.random.number()
                        },
                    ]
                })
                recipeItem.push(recipe.insertedId)
            }

            // ---------------------> menuItem <----------------------------------
            const menuItemArray = [];
            for (let j = 0; j < menuItemNumber ; j++) {
                console.log("menuItem: ", j);

                const menuItem = await menuItemCollection.insertOne({
                    image: faker.random.words(),
                    name: faker.name.findName(),
                    englishName: faker.random.word(),
                    quantity: faker.random.number(),
                    price: faker.random.number(),
                    recipes: [
                        {
                            recipe: recipeItem[Math.floor(Math.random() * recipeItem.length)],
                            amount: quantityOrder()
                        },
                        {
                            recipe: recipeItem[Math.floor(Math.random() * recipeItem.length)],
                            amount: quantityOrder()
                        },
                        {
                            recipe: recipeItem[Math.floor(Math.random() * recipeItem.length)],
                            amount: quantityOrder()
                        },
                        {
                            recipe: recipeItem[Math.floor(Math.random() * recipeItem.length)],
                            amount: quantityOrder()
                        }
                    ],
                })

                menuItemArray.push(menuItem.insertedId);
            }

            // ---------------------> Order <----------------------------------
            for (let j = 0; j < orderNumber ; j++) {
                console.log("order: ", j);

                let tableId = tableItem[Math.floor(Math.random() * tableItem.length)]

                const order = await orderCollection.insertOne({
                    orderId: j + 1,
                    sit: {
                        table: tableId,
                        checkInDateTime: faker.time.recent(),
                    },
                    totalPrice: faker.random.number(),

                    participant: [
                        {
                            user: userItem[Math.floor(Math.random() * userItem.length)],
                            subOrderId: 1,
                            checkOutDateTime: new Date(),
                            totalPrice: faker.random.number(),
                            menuItems: [
                                {
                                    menuItem: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder(),
                                    price: faker.random.number(),
                                    preprationTime: faker.random.number()
                                },
                                {
                                    menuItem: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder(),
                                    price: faker.random.number(),
                                    preprationTime: faker.random.number()
                                },
                                {
                                    menuItem: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder(),
                                    price: faker.random.number(),
                                    preprationTime: faker.random.number()
                                }
                            ]
                        },
                        {
                            user: userItem[Math.floor(Math.random() * userItem.length)],
                            subOrderId: 2,
                            preparation_time: faker.random.number(),
                            checkOutDateTime: new Date(),
                            totalPrice: faker.random.number(),
                            menuItems: [
                                {
                                    menuItem: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder(),
                                    price: faker.random.number(),
                                    preprationTime: faker.random.number()
                                },
                                {
                                    menuItem: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder(),
                                    price: faker.random.number(),
                                    preprationTime: faker.random.number()
                                },
                                {
                                    menuItem: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder(),
                                    price: faker.random.number(),
                                    preprationTime: faker.random.number()
                                }
                            ]
                        },
                        {
                            user: userItem[Math.floor(Math.random() * userItem.length)],
                            subOrderId: 3,
                            preparation_time: faker.random.number(),
                            checkOutDateTime: new Date(),
                            totalPrice: faker.random.number(),
                            menuItems: [
                                {
                                    menuItem: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder(),
                                    price: faker.random.number(),
                                    preprationTime: faker.random.number()
                                },
                                {
                                    menuItem: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder(),
                                    price: faker.random.number(),
                                    preprationTime: faker.random.number()
                                },
                                {
                                    menuItem: menuItemArray[Math.floor(Math.random() * menuItemArray.length)],
                                    count: quantityOrder(),
                                    price: faker.random.number(),
                                    preprationTime: faker.random.number()
                                }
                            ]
                        }
                    ]

                })
                
                // attach order to user collection 
                order.ops[0].participant.forEach(item => {
                    userCollection.updateOne({
                        "_id": item.user
                    }, {
                        "$push": {
                            orders: order.insertedId    
                        }
                    })
                });
                
            }


            console.log("SEED ENDED AT: ", new Date())

            // ---------------------------> index <--------------------------------------
            console.log("INDEXING STARTED AT: ", new Date())

            await userCollection.createIndex(
                {
                    'orders': 1
                }
            )

            await userCollection.createIndex(
                {
                    'name': 1
                }
            )

            await userCollection.createIndex(
                {
                    'email': 1
                }
            )

            await userCollection.createIndex(
                {
                    'phone.number': 1
                }
            )


            await addOnCollection.createIndex({
                'ingredientItem': 1
            })

            await recipeCollection.createIndex({
                'ingredientItem': 1
            })
            await recipeCollection.createIndex({
                'addOnItem': 1
            })
            await recipeCollection.createIndex({
                'mainCost': 1
            })
            await recipeCollection.createIndex({
                'wasteCost': 1
            })
            await recipeCollection.createIndex({
                'amount': 1
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

            await tableCollection.createIndex({
                'capacity': 1
            })

            await userCollection.createIndex({
                'phone': 1
            })

            await orderCollection.createIndex({
                'orderId': 1
            })

            await orderCollection.createIndex({
                'participant.UserId': 1
            })

            await orderCollection.createIndex({
                'sit.table': 1
            })

            await orderCollection.createIndex({
                'total_price': 1
            })

            await orderCollection.createIndex({
                'participant.menuItems.menuItem': 1
            })

            console.log("INDEXING ENDED AT: ", new Date())
        }


        console.timeEnd();
    })