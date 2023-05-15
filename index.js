const jwt = require("jsonwebtoken")
const axios = require("axios")
// middleware untuk cek permission
const checkPermissions = (permissions, action)=>{
    const check = permissions.includes(action)
    return check
}
  
  // middleware untuk cek permission untuk suatu aksi
const authorization = (action) => {
return (req, res, next) => {
    const token = req.headers.token;
    console.log('token', token)
    const user = jwt.verify(token, req.app.get('secretKey'));
    console.log('user', user)
    if(user == null){
        return res.status(403).json({
            success: false,
            message: 'Access denied. You do not have permission params access token'
        });
    }
    const { permissions } = user;
    console.log('permissions', permissions)
    const isAllowed = checkPermissions(permissions, action);
    console.log(isAllowed)
    if (isAllowed) {
        next();
    } else {
    return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have the necessary permissions to perform this action.'
    });
    }
    
}
}

// middleware untuk memverifikasi access token
const authentication = async(req, res, next, uriAuth) => {
  const token = req.headers.token;
  try {
    const resAuth = await axios.post(uriAuth, {}, {headers:{token}})
    if(resAuth.status == 200){
      next();
    }
    else{
      res.status(resAuth.status).json({ message: resAuth.status.message });
    }
  } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {
  authorization,
  authentication
};