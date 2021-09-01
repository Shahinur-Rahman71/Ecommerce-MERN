const Users = require('../models/userModel');
const Payments = require('../models/paymentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('./sendMail')

const {CLIENT_URL} = process.env;

const userCtrl = {
    register: async (req, res) => {
        try {
            const {name, email, password} = req.body;

            if(!name || !email || !password)
                return res.status(400).json({msg: 'Please fill in all the fields.'});

            if(!validateEmail(email))
                return res.status(400).json({msg: 'Invalid email.'});

            const user = await Users.findOne({email});

            if(user) 
                return res.status(400).json({msg: 'This email already exists.'});

            if(password.length<6) 
                return res.status(400).json({msg: 'Password will be at least 6 characters long.'});

            // Password Encryption
            const passHash = await bcrypt.hash(password, 10);
            const newUser = new Users({
                name, email, password:passHash
            });
            // // Save Mongodb
            // await newUser.save(); 
            
            // create jsonWebToken for Authentication
            const activation_token = createActivationToken(newUser);
            // const accesstoken = createAccessToken({id:newUser._id});
            // const refreshtoken = createRefreshToken({id:newUser._id});

            const url = `${CLIENT_URL}/user/activate/${activation_token}`
            sendMail(email, url, 'Verify your email address')

            // res.cookie('refreshtoken', refreshtoken, {
            //     httpOnly: true,
            //     path: '/user/refresh_token',
            //     maxAge: 7*24*60*60*1000 // 7d
            // })

            res.json({msg: 'Registration done !! Please check your email for activation'});

        } catch(err) {
            return res.status(500).json({msg: err.message});
        }        
    },
    activateEmail: async (req, res) => {
        try {
            const {activation_token} = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const {name, email, password} = user

            const check = await Users.findOne({email})
            if(check) return res.status(400).json({msg:"This email already exists."})

            const newUser = new Users({
                name, email, password
            })

            await newUser.save()

            res.json({msg: "Account has been activated!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const {email,password} = req.body;
            const user = await Users.findOne({email});
           // console.log(user)
            if(!user) return res.status(400).json({msg: 'User does not exists'});

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(400).json({msg: 'Invalid Password. Please try again.'})

            // if user match then create accesstoken and refresh token
            const accesstoken = createAccessToken({id:user._id});
            const refreshtoken = createRefreshToken({id:user._id});

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            })
            res.json({accesstoken});
            //res.json({msg: 'Login done'});

        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'});
            return res.json({msg: "Logged out!!"});
            
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: 'Please login now!!'});

            jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET, (err,user) => {
                if(err) return res.status(400).json({msg: 'Please login now!!'});

                const accesstoken = createAccessToken({id: user.id});
                res.json({accesstoken});
            })
             
            //res.json({rf_token});
        } catch (error) {
            return res.status(500).json({msg: err.message});
        }
        
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password');
            if(!user) return res.status(400).json({msg: "User does not exists."});

            res.json(user);

        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    updateUser: async (req, res) => { // for update user
        try {
            const {images, phone, address} = req.body;
            await Users.findOneAndUpdate({_id: req.params.id},{images, phone, address});

            res.json({msg: 'User updated !!'})

        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg: "User does not exist"});

            await Users.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            });

            return res.json({msg: "Added to cart"})
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    history: async(req, res) => {
        try {
            const history = await Payments.find({user_id: req.user.id})

            res.json(history)
            
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    }
}

const createActivationToken = (user) => {
    return jwt.sign(user.toJSON(), process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'});
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '11m'});
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = userCtrl;