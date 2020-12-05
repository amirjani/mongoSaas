const MongoClient = require('mongodb').MongoClient;
const faker = require("faker");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017', {
    poolSize:20, 
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

let quantityOrder = () => {
    return faker.random.number({
        'min': 1,
        'max': 5
    });
}

async function LookupQuery() {
    
    MongoClient.connect(
        "mongodb://localhost:27017",
        { useUnifiedTopology: true, poolSize: 20 },
        async function (err, client) {
            const db = client.db(`Fabizi_${1}`);
            const orderCollection = db.collection('order');

            try {
                await db.dropCollection("order-agg")
            } catch (error) {

            }
            console.time("START_LOOKUP")
            const orders = await orderCollection.aggregate([
                {
                    $match: { orderId: 25455 }
                },
                {
                    $lookup:
                      {
                        from: "table",
                        localField: "table._id",
                        foreignField: "_id",
                        as: "table._id"
                      }
                },
                {
                    $unwind: "$table._id"
                },
                
                {
                    $unwind: "$participant"
                },
                {
                    $lookup:
                      {
                        from: "user",
                        localField: "participant.userId",
                        foreignField: "_id",
                        as: "participant.userId"
                      }
                },
                {
                    $unwind: "$participant.userId"
                },
                {
                    $unwind: "$participant.menuItem"
                },
                {
                    $lookup: {
                        from: "menuItem",
                        let: { 
                            menuItemId: "$participant.menuItem._id",
                            count: "$participant.menuItem.count",
                            price: "$participant.menuItem.price",
                            preprationTime: "$participant.menuItem.preprationTime"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                                { $eq: ["$_id", "$$menuItemId"] },
                                            ]
                                    }
                                },
                            },
                            // lots of recipes
                            {
                                $unwind: "$recipe"
                            },
                            // now each have one recipe
                            {
                                $lookup: {
                                    from: "recipe",
                                    let: { recipeId: "$recipe._id", amount:"$recipe.amount" },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                            { $eq: ["$_id", "$$recipeId"] },
                                                        ]
                                                }
                                            },
                                        },
                                    ],
                                    as:"recipe" 
                                } 
                            },
                            {
                                $group: {
                                    _id: "$$menuItemId",
                                    count: { $first: "$$count" },
                                    price: { $first: "$$price" },
                                    preprationTime: { $first: "$$preprationTime" },
                                    recipe: { $push: { $first: "$recipe"}}
                                }
                            }
                        ],
                        as: "participant.menuItem"
                    }
                },
                {
                    $unwind: "$participant.menuItem"
                },
                {
                    $group: {
                        _id: "$participant.userId",
                        orderObjectId: { $first: "$_id" },
                        orderId: { $first: "$orderId" },
                        orderTable: { $first: "$table" },
                        orderTableObj: { $first: "$tableObj" },
                        orderTotalPrice: { $first: "$totalPrice" },


                        participantUserId: { $first: "$participant.userId" },
                        participantSubOrderId: { $first: "$participant.subOrderId" },
                        participantCheckOutDateTime: { $first: "$participant.checkOutDateTime" },
                        participantTotalPrice: { $first: "$participant.totalPrice" },

                        participantMenuItem: { $push: "$participant.menuItem" }
                    }
                },
                {
                    $group: {
                        _id: "$orderObjectId",
                        orderId: { $first: "$orderId" },
                        orderTable: { $first: "$orderTable" },
                        totalPrice: { $first: "$orderTotalPrice" },    
                        participant:  { 
                            $push: { 
                                userId: "$participantUserId",
                                subOrderId: "$participantSubOrderId",
                                checkOutDateTime: "$participantCheckOutDateTime",
                                totalPrice: "$participantTotalPrice",
                                menuItem: "$participantMenuItem"
                            }
                        }
                    }
                }
            ]).toArray();
            console.timeEnd("START_LOOKUP");
            const coll = await db.createCollection('order-agg')
            await coll.insertMany(orders.map(i => {
                delete i._id
                return i
            }))
            process.exit(0);
        }
    );
};


async function LookupQueryJson (client) {
    const db = client.db(`Fabizi_${1}`);
    const orderCollection = db.collection('order');
    const orders = await orderCollection.aggregate([
        {
            $match: { orderId: 25455 }
        },
        {
            $lookup:
              {
                from: "table",
                localField: "table._id",
                foreignField: "_id",
                as: "table._id"
              }
        },
        {
            $unwind: "$table._id"
        },
        
        {
            $unwind: "$participant"
        },
        {
            $lookup:
              {
                from: "user",
                localField: "participant.userId",
                foreignField: "_id",
                as: "participant.userId"
              }
        },
        {
            $unwind: "$participant.userId"
        },
        {
            $unwind: "$participant.menuItem"
        },
        {
            $lookup: {
                from: "menuItem",
                let: { 
                    menuItemId: "$participant.menuItem._id",
                    count: "$participant.menuItem.count",
                    price: "$participant.menuItem.price",
                    preprationTime: "$participant.menuItem.preprationTime"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                        { $eq: ["$_id", "$$menuItemId"] },
                                    ]
                            }
                        },
                    },
                    // lots of recipes
                    {
                        $unwind: "$recipe"
                    },
                    // now each have one recipe
                    {
                        $lookup: {
                            from: "recipe",
                            let: { recipeId: "$recipe._id", amount:"$recipe.amount" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                    { $eq: ["$_id", "$$recipeId"] },
                                                ]
                                        }
                                    },
                                },
                            ],
                            as:"recipe" 
                        } 
                    },
                    {
                        $group: {
                            _id: "$$menuItemId",
                            count: { $first: "$$count" },
                            price: { $first: "$$price" },
                            preprationTime: { $first: "$$preprationTime" },
                            recipe: { $push: { $first: "$recipe"}}
                        }
                    }
                ],
                as: "participant.menuItem"
            }
        },
        {
            $unwind: "$participant.menuItem"
        },
        {
            $group: {
                _id: "$participant.userId",
                orderObjectId: { $first: "$_id" },
                orderId: { $first: "$orderId" },
                orderTable: { $first: "$table" },
                orderTableObj: { $first: "$tableObj" },
                orderTotalPrice: { $first: "$totalPrice" },


                participantUserId: { $first: "$participant.userId" },
                participantSubOrderId: { $first: "$participant.subOrderId" },
                participantCheckOutDateTime: { $first: "$participant.checkOutDateTime" },
                participantTotalPrice: { $first: "$participant.totalPrice" },

                participantMenuItem: { $push: "$participant.menuItem" }
            }
        },
        {
            $group: {
                _id: "$orderObjectId",
                orderId: { $first: "$orderId" },
                orderTable: { $first: "$orderTable" },
                totalPrice: { $first: "$orderTotalPrice" },    
                participant:  { 
                    $push: { 
                        userId: "$participantUserId",
                        subOrderId: "$participantSubOrderId",
                        checkOutDateTime: "$participantCheckOutDateTime",
                        totalPrice: "$participantTotalPrice",
                        menuItem: "$participantMenuItem"
                    }
                }
            }
        }
    ]).toArray();
    return orders;
}

module.exports = {
    LookupQueryJson
}
async function findQuery() {
   
    try {
         await mongoose.connection.useDb(`Fabizi_${1}`).dropCollection("order-agg")
    } catch (error) {

    }
    let data = [];
    console.time("START_FIND")
    const order = 
        await mongoose.connection
            .useDb(`Fabizi_${1}`)
            .collection("order")
            .findOne({ orderId: 15612 });
    for (let i = 0; i < order.participant.length; i++) {
        const participant = order.participant[i];
        for (let j = 0; j < participant.menuItem.length; j++) {
            const menuItem = participant.menuItem[j];
            const itemId = mongoose.Types.ObjectId(menuItem._id); 
            const item = 
                await mongoose.connection
                    .useDb(`Fabizi_${1}`)
                    .collection("menuItem")
                    .findOne({ _id: itemId });

            const recipeId = mongoose.Types.ObjectId(item.recipe);
            const recipe = 
                await mongoose.connection
                    .useDb(`Fabizi_${1}`)
                    .collection("recipe")
                    .findOne({ _id: recipeId });
            const ingredients = 
                await mongoose.connection
                    .useDb(`Fabizi_${1}`)
                    .collection("ingredient")
                    .find({ _id: { 
                        $in: recipe.ingredientItem.map(ii => mongoose.Types.ObjectId(ii)) 
                    }})
                    .toArray();
            const addOns = 
                await mongoose.connection
                    .useDb(`Fabizi_${1}`)
                    .collection("addOn")
                    .find({ _id: { 
                        $in: recipe.addOnItem.map(ad => mongoose.Types.ObjectId(ad)) 
                    }})
                    .toArray();


            // let addOnIngredientItemIds =  []
            // addOns.map(addOn => addOnIngredientItemIds = addOnIngredientItemIds.concat(addOn.ingredientItem));
            // const addOnIngredientItems = 
            //     await mongoose.connection
            //         .useDb(`Fabizi_${1}`)
            //         .collection("ingredient")
            //         .find({ _id: { 
            //             $in: addOnIngredientItemIds.map(adii => mongoose.Types.ObjectId(adii)) 
            //         }})
            //         .toArray();

            // const allIngredients = addOnIngredientItems.concat(ingredients);
            data.push({
                i, j, count: menuItem.count, addOns , ingredients
            });

        }
    }
    console.timeEnd("START_FIND")
    // console.log(data);
    const coll = 
        await mongoose.connection
                .useDb(`Fabizi_${1}`).createCollection('order-agg')
    await coll.insertOne({data})
    // console.log(order);
}
// findQuery()

async function populateQuery() {
    mongoose.connect('mongodb://localhost:27017', {
        poolSize:20, 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    });
    try {
         await mongoose.connection.useDb(`Fabizi_${1}`).dropCollection("order-agg")
    } catch (error) {

    }
    let data = [];
    console.time("START_FIND");

    console.timeEnd("START_FIND");
    process.exit(0);
}