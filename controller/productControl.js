const Category = require("../model/categorySchema")


exports.getCategories = async (req, res) => {
    const categories = await Category.find()
    const categoryData = categories.map((category) => {
        return {name: category.name, productCount: category.productCount }
    })
    res.json(categoryData)
}