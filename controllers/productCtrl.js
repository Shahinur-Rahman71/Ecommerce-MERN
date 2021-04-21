const Product = require('../models/productModel');

// filter, sorting and pagination
class APIfeature {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filtering() {
        const queryObject = {...this.queryString} // queryString = req.query;
        //console.log({before: queryObject}); // before delete page

        const excludedFields = ['page', 'sort', 'limit'];
        excludedFields.forEach(value => delete(queryObject[value]));

        //console.log({after: queryObject}) // after delete page

        let querystr = JSON.stringify(queryObject);
        querystr = querystr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        //console.log({querystr});

        // gte = greater than or equal
        // lte = less than or equal
        // lt = less than
        // gt = greater than
        this.query.find(JSON.parse(querystr));

        return this;
    }

    sorting() {
        if(this.queryString.sort)  {
            const sortby = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortby);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

// get,create,delete and update products
const productCtrl = {
    getProducts: async(req, res) => {
        try {
            //console.log(req.query)
            const features = new APIfeature(Product.find(), req.query).filtering().sorting().paginating();
            const products = await features.query;

            res.json({
                status: 'success',
                result: products.length,
                products: products
            });

        } catch (error) {
           return res.status(500).json({msg: error.message});
        }
    },
    createProduct: async(req, res) => {
        try {
            const {product_id,title,price,description,content,images,category} = req.body;

            if(!images) return res.status(400).json({msg: 'No image uploaded.'});

            const products = await Product.findOne({product_id});
            if(products) return res.status(400).json({msg: 'This images already exists.'});

            const newProducts = new Product({
                product_id, title: title.toLowerCase(), price, description,content,images,category
            });

            await newProducts.save();
            res.json({msg: 'Product Created !!'});
            
        } catch (error) {
           return res.status(500).json({msg: error.message});
        }
    },
    deleteProduct: async(req, res) => {
        try {
            await Product.findByIdAndDelete(req.params.id)
            
            res.json({msg: 'Product deleted.'});
        } catch (error) {
           return res.status(500).json({msg: error.message});
        }
    },
    updateProduct: async(req, res) => {
        try {
            const {title,price,description,content,images,category} = req.body;

            if(!images) return res.status(400).json({msg: 'No image uploaded.'});

            await Product.findOneAndUpdate({_id: req.params.id}, {
                title: title.toLowerCase(), price, description,content,images,category
            });

            res.json({msg: 'Product Updated !!'});
            
        } catch (error) {
           return res.status(500).json({msg: error.message});
        }
    },
}

module.exports = productCtrl;