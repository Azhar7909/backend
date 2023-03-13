const jwt = require('jsonwebtoken');
const User = require('../db/models/users-schema');

const Athenticate = async (req, res, next) => {
    // console.log("cookie",req);
    try {
        const token = await req.cookies.jwToken;
        console.log(token);
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        if (verifyToken) {
            const userExist = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
            if (!userExist) { throw new Error("User not found!"); }
            console.log("check", token, req.token);
            req.token = token;
            req.userExist = userExist;
            req.userId = userExist._id;

            next()
        }
    } catch (err) {
        res.status(401).json({ messase: "Unauthorized!", detail: err });
        console.log(err);
    }
}

module.exports = Athenticate;