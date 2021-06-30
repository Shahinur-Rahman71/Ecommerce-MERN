const Payments = require('../models/paymentModel');
const Users = require('../models/userModel');
const Products = require('../models/productModel')


const paymentCtrl = {
    getPayments: async(req, res) => {
        try {
            const payments = await Payments.find()
            res.json(payments)

        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    createPayment: async(req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email')
            if(!user) return res.status(400).json({msg: "User does not exist."})

            const {cart, phone, address} = req.body;
            const {_id, name, email} = user;

            const newPayment = new Payments({
                user_id: _id, name, email, cart, phone, address
            })

            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold)
            })

            await newPayment.save()
            res.json({msg: "Payment Success !!"})
            
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}

const sold = async (id, quantity, oldSold) => {
    await Products.findOneAndUpdate({_id: id}, {
        sold: quantity + oldSold
    })
}

module.exports = paymentCtrl;