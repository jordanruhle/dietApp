const jwt = require("jsonwebtoken");
 
module.exports.authenticate =async (req, res, next) => {
  const userToken = req.cookies.userToken;
  console.log("user token: " + userToken)
  try {
    const decoded = jwt.verify(userToken, process.env.USER_LOGIN_REG_SECRET_KEY)
    const userId = decoded.id
    console.log("user id: " + userId)
    res.json({verified: true})
  } catch (err) {
    res.json('401 You are unauthorized!')
  }
}