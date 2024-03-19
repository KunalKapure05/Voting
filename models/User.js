const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },

    age:{
        type:String,
        required:true
    },

    aadharCardNumber: {
        type: Number,
        required: true,
        unqiue: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
})  


userSchema.pre('save',async function(req,res){
    const user = this;

    if(!user.isModified('password')) return next();

    try {

        const salt = bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword;
        next();

        
    } catch (error) {
        return next(err);
        
    }


})

userSchema.methods.comparePassword = async function(candidatePassword){
    try {
        
        const isMatch = await bcrypt.compare(candidatePassword,this.password);
        return isMatch;

    } catch (error) {
        throw err;
    }
}


const User = mongoose.model('User', userSchema);
module.exports = User;