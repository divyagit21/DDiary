const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const signin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const newpassword = hashpassword;
        const newUser = new User({ name, email, password: newpassword });
        await newUser.save();

        return res.status(201).json({ message: 'User successfully registered' });

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user does not exist" });
        }
        const userPassword = user.password;
        const passwordCompare = await bcrypt.compare(password, userPassword);
        if (!passwordCompare) {
            return res.status(401).json({ message: "user password is wrong" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 60 * 60 * 24 * 1000
        });
        return res.status(200).json({ message: "User successfully logged in" });

    }
    catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const profile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user: { name: req.user.name, email: req.user.email, id: req.user._id } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production'
        });

        return res.status(200).json({ message: "User successfully logged out" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    signin,
    login,
    profile,
    logout
};
