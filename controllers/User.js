const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middlewares/jwtAuth');



exports.getAllUsers = async function(req,res){
    try {
        const response = await User.find();
        console.log("List of Users are : ");
        return res.json(response);
    } 
    
    catch (error) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


async function hashingPassword(password){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword;
}

exports.signup = async function(req, res) {
    const data = req.body;
    try {
        const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        if (!/^\d{12}$/.test(data.aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }

        if (data.age < 18) {
            return res.status(404).json({ message: "Less than 18 cannot vote" });
        }

        const hashedPassword = await hashingPassword(data.password)

        data.password = hashedPassword;

        const newUser = new User(data);

        const response = await newUser.save();
        console.log("User Saved in db");

        const payload = {
            id: response.id
        };
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);

        res.status(200).json({response , token: token });

    } catch (error) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.login = async function(req, res) {
    try {
        const { aadharCardNumber, password } = req.body;

        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(404).json({ error: "Wrong Password" });
        }

        const payload = {
            id: user.id
        };

        console.log(JSON.stringify(payload));

        const token = generateToken(payload);
        console.log("User logged In");
        return res.status(200).json({"token":token});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.profile = async function(req,res){
    try {
        const userId  = req.user.id
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"User Not found"});
        }
       
       return res.status(200).json(user)
    } 
    
    
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });   
    }
}


exports.UserPassword= async function(req,res){
    try {
        const userId = req.user.id;

        const {currentPassword,newPassword} = req.body;

        if(!currentPassword || !newPassword){
            return res.status(404).json({error:"Both currentPassword and newPassword are required"})
        }

        const user = await User.findById(userId);
        
        if(!user){
           return res.status(404).json({error:"User not found"});
        }

        const comparePassword = await bcrypt.compare(currentPassword,user.password)
        if(!comparePassword){
            return res.status(404).json({error:"Invalid Current Password"});
        }
        
        const hashedNewPassword = await hashingPassword(newPassword)
        user.password = hashedNewPassword;

        
        await user.save();

        console.log('password updated');
        res.status(200).json({ user,message: 'Password updated' });

         



       



        
    } 
    
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' }); 
    }

}