const jwt = require('jsonwebtoken');
const config = require('config');


const authMiddleware = (req, res, next) => {
    if (req.method === 'OPTIONS'){
        next();
    }
    try {
        const authorization = req.headers.authorization;
        let token;
        if (authorization){
            token = authorization.split(' ')[1];
        }
        if (!token){
            res.status(401).json({msg: "User is not logged in"})
        }

        const payload = jwt.verify(token,config.get('jwtSecretKey'));

        req.user = payload;
        next();
    } catch (e) {
        return res.status(500).json(e.message)
    }
}

module.exports = authMiddleware;
