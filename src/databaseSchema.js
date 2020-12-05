const mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

// ============================ table schema 
const tableSchema = new mongoose.Schema({
    name: String,
    status: String,
    capacity: Number
}, {
    collection: 'table'
});
const Table = mongoose.model('Table', tableSchema);

// ================================ user Schema 
const userSchema = new mongoose.Schema({
    name: String,
    phone: [
        {
            number: String,
            prefix: String
        }
    ], 
    location: {
        lat: Number,
        long: Number,
        address: String
    },
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['ADMIN', 'SUPER_VISOR'],
        default: 'ADMIN' 
    },
    orders: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Order'
    }
}, {
    collection: 'user'
})
const User = mongoose.model('User', userSchema)

// ================================= ingredient 
const ingredientSchema = new mongoose.Schema({
    itemType: String,
    name: String,
    unit: String,
    size: Number,
    minimumCapacity: Number,
    defaultPrice: Number,
    wasteIn: Number,
    stock: [String]
}, {
    collection: 'ingredient'
})
const Ingredient = mongoose.model('Ingredient', ingredientSchema)

// ================================= addOn 
const addOnSchema = new mongoose.Schema({
    name: String,
    ingredientItem: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Ingredient'
    },
    amount: Number,
    size: Number,
    mainCost: Number,
    wasteCost: Number
}, {
    collection: 'addOn'
});
const AddOn = mongoose.model('AddOn', addOnSchema);

// ================================== recipe 
const recipeSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    unit: String,
    bulk: Boolean,
    mainCost: Number,
    wasteCost: Number,
    ingredients:[
        {
            ingredient: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Ingredient'
            },
            usage: Number,
            waste: Number
        }
    ],
    addOns:[
        {
            addOn: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'AddOn'
            },
            usage: Number,
            waste: Number
        }
    ],
}, {
    collection: 'recipe'
});
const Recipe = mongoose.model('Recipe', recipeSchema);

// ================================ menuItem
const menuItemSchema = new mongoose.Schema({
    image: String,
    name: String,
    englishName: String,
    quantity: Number,
    price: Number,
    recipes:[
        {
            recipe: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Recipe'
            },
            usage: Number,
            waste: Number
        }
    ]
}, {
    collection: 'menuItem'
})
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// ============================== order
const orderSchema = new mongoose.Schema({
    orderId: Number,
    totalPrice: Number,
    sit: {
        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Table' 
        },
        checkInDateTime: {
            type : Date, 
        }
    },
    participant: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            subOrderId: Number,
            checkOutTime: { 
                type : Date, 
                default: Date.now 
            },
            totalPrice: Number,
            menuItems: [
                {
                    menuItem: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'MenuItem'
                    },
                    count: Number,
                    price: Number,
                    preprationTime: Number
                }
            ]
        }
    ]   
}, {
    collection: 'order'
});
const Order = mongoose.model('order', orderSchema);

async function DeepPopulate() {
    orderSchema.plugin(deepPopulate);

    return await Order
        .findOne()
        .lean()
        .deepPopulate([
            'sit.table',
            'participant.user',
            'participant.menuItems.menuItem',
            'participant.menuItems.menuItem.recipes.recipe',
        ]).exec();

}

module.exports = {
    DeepPopulate
}
