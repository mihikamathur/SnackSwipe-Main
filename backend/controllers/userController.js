import userModel from "../modals/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import validator from 'validator'


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        
        const user = await userModel.findOne({ email });
        if (!user) {
                return res.status(404).json({ success: false, message: "User doesn't exist" })
        }

        
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Invalid credentials" })
            }

        
        const token = createToken(user._id);
        res.json({ success: true, token })
    }
    catch (error) {
        console.error('login error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' })
    }
}

const createToken = (id) => {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    return jwt.sign({ id }, secret, { expiresIn: '7d' });
}


const registerUser = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" })
        }

        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" })
        }

       
        if (!password || password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a password of at least 8 characters" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const newUser = new userModel({
            username: username,
            email: email,
            password: hashedPassword
        })
        
        const user = await newUser.save()

       
        const token = createToken(user._id)
        res.json({ success: true, token })

    }

    catch (error) {
        console.error('register error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' })
    }
}

export { loginUser, registerUser }