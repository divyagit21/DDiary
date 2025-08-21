const jwt = require('jsonwebtoken');
const User = require('./models/user')
const verifyToken = async (req, res, next) => {
    try {
        const authtoken = req.cookies.token;

        if (!authtoken) {
            return res.status(401).json({ message: "User not authorized: No token provided" });
        }
        const verify = jwt.verify(authtoken, process.env.SECRET_KEY);
        const user = await User.findOne({ email: verify.email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "User not authorized: Invalid token" });
    }
}

module.exports = verifyToken;