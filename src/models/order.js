const MongoDb = require("mongodb");
const faker = require("faker");
const fs = require('fs')


let quantityOrder = () => {
    return faker.random.number({
        'min': 1,
        'max': 5
    });
}

const recipeItem = () => {
    let arr = []
    for (let i = 0; i < 2; i++) {
        arr.push({
            _id: new MongoDb.ObjectId(),
            name: faker.name.findName(),
            addOn: addOnItem(),
        })
    }
    return arr
}


const orderItem = () => {
    let arr = []
    for (let i = 0; i < 5; i++) {
        arr.push({
            menuItem: {
                _id: new MongoDb.ObjectId(),
                name: faker.name.findName(),
                quantity: quantityOrder(),
                price: faker.random.number(),
                recipe: recipeItem(),
            },
            quantity: quantityOrder()
        })
    }
    return arr
}

const participantItem = () => {
    let arr = []
    for (let i = 0; i < 10; i++) {
        arr.push({
            userId: new MongoDb.ObjectId(),
            subOrderId: 1,
            preparation_time: faker.random.number(),
            checkOutDateTime: faker.time.recent(),
            totalPrice: faker.random.number(),
            orderItem: orderItem(),
        })
    }
    return arr
}


const orderObject = () => {
    return {
        orderSequence: "BeveragesFirst", // BeveragesFirst, Concurrent, PreparationTimeFirst,

        orderId: faker.random.number({
            'min': 10000,
            'max': 40000
        }),

        table: {
            _id: new MongoDb.ObjectId(),
            checkInDateTime: faker.time.recent(),
        },

        participant: participantItem()
    }
}

module.exports = {
    orderObject
}