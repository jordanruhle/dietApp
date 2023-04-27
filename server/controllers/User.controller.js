const Users = require("../models/User.model")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


// Read All
module.exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await Users.find()
    res.json({users: allUsers})
  } catch (error) {
    error => res.json({message: 'Something went wrong', error: error})
  }
}

// Find One
module.exports.findoneSingleUser = async (req, res) => {
  try {
    const oneUser = await Users.findOne({ _id: req.params.id });
    res.json({ user: oneUser });
  } catch (error) {
    res.json({message: 'Something went wrong', error: error})
  }
}

// Create One
module.exports.createNewUser = async (req, res) => {
  console.log(req.body)
  const newUser = new Users(req.body);
  try {
    await newUser.save()
    console.log(newUser)
    const payload = {
      id: newUser._id
    }
    const userToken = jwt.sign(payload, process.env.ADMIN_LOGIN_REG_SECRET_KEY)
    console.log(userToken);
    res
      .cookie("userToken", userToken, { domain: '.mountainbikes.store', httpOnly: true })
      .json({ msg: "success!", user: user });
  } catch (err) {
    res.json(err)
  }
}

// variable = function for login
module.exports.userLogin = async (req, res) => {
  // takes request = email + password
  const { email, password } = req.body;
  console.log("password: " + password)
  try {
    // checks if email is in the Database
    const user = await Users.findOne({ email: email })

    // if email is not in database send response
    if (!user) {
      res.json('401, Invalid email or password. Please try again.')
    }

    // Check if passwords match
    const matchedPasswords = await bcrypt.compare(password, user.password)
    console.log("passwords match: " + matchedPasswords)

    // checks if password associated with email matches given password
    if (matchedPasswords) {
      // Build Response
      var payload = {
        id: user._id
      }
    } else {
      res.json('401, Invalid email or password. Please try again.')
    }

    // create JWT
    const userToken = jwt.sign(payload, process.env.USER_LOGIN_REG_SECRET_KEY)
    console.log("user token: " + userToken)

    res
      .cookie("userToken", userToken, { httpOnly: true })
      .json({ msg: "login succesful" })
  } catch (err) {
    console.log(err);
    // send err and error message
    res.json(err)
  }
}

module.exports.userLogout = async (req, res) => {
  try {
    res.cookie('userToken', '', { expires: new Date(0), httpOnly: true, sameSite: 'strict', secure: true })
    console.log("userToken cleared");
    res
      .json({ msg: 'logout successful' })
      .sendStatus(200);
  } catch (err) {
    console.log(err);
  }
}

