const {Schema,model} = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    cart: {
        type: Array,
        default: []
    },
    images: {
        type: String,
        default: 'https://res.cloudinary.com/dboa1jxnr/image/upload/v1629056366/test/user_xgrgts.svg'
    }   
},{
    timestamps: true
});

module.exports = model('Users', userSchema);