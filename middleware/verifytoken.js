
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')    
dotenv.config();

const verifyTokenMiddleware = (req, res, next) => { 
    const { token } = req.body; 
    if (!token) return res.status(403).json({  
        msg: "No token present" 
    }); 
    try { 
        const decoded = jwt.verify(token,  
            process.env.JWT_SECRET_KEY); 
        req.user = decoded; 
    } catch (err) { 
        return res.status(401).json({  
            msg: "Invalid Token" 
        }); 
    } 
    next(); 
}; 

module.exports = {verifyTokenMiddleware}