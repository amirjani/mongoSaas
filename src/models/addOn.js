

const addOnItem = () => {
    let arr = []
    for (let i = 0; i < 10; i++) {
        arr.push({
            name: faker.name.findName(),
            ingredient: ingredientItem()
        })
    }
    return arr
}