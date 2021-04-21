const Category = require('../models/categoryModel');
const Products = require('../models/productModel')

const categoryCtrl = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find();
            res.json(categories);

        } catch (error) {
            return res.status(500).json({msg: error.message});
        }        
    },
    createCategory: async (req, res) => {
        try {
            // if user role == 1 => admin active
            // category=> only admin can creae, delete and update
            const {name} = req.body;
            const category = await Category.find({name});
            if(!category) return res.status(400).json({msg: "This category have already exists"});

            const newCategory = new Category({name});
            await newCategory.save();
            res.json({msg: "New category created !!"})
            
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    }, 
    deleteCategory: async (req, res) => {
        try {
            const products = await Products.findOne({category: req.params.id})
            if(products) return res.status(400).json({msg: "Please delete this category all products."});

            await Category.findByIdAndDelete(req.params.id);
            res.json({msg: 'category deleted'})
            
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    updateCategory: async (req, res) => {
        try {

            const {name} = req.body;
            await Category.findByIdAndUpdate({_id: req.params.id}, {name});

            res.json({msg: 'category updated'})
            
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    }

}

module.exports = categoryCtrl;