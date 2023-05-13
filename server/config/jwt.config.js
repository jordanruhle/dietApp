const jwt = require("jsonwebtoken");

module.exports.authenticate = async (req, res, next) => {
  const userToken = req.cookies.userToken;
  console.log("user token: " + userToken);

  try {
    const decoded = jwt.verify(userToken, process.env.USER_LOGIN_REG_SECRET_KEY);
    const userId = decoded.id;
    console.log("user id: " + userId);

    // Add the decoded payload to the req object
    req.user = {
      id: userId
    };

    // Call the next middleware function
    next();
  } catch (err) {
    res.status(401).json({ msg: 'You are unauthorized!' });
  }
};
