const Users = require("../models/User.model")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


// Read All
module.exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await Users.find()
    res.json({users: allUsers})
  } catch (error) {
    error => res.json({msg: 'Something went wrong', error: error})
  }
}

// Find One
module.exports.findoneSingleUser = async (req, res) => {
  try {
    const oneUser = await Users.findOne({ _id: req.params.id });
    res.json({ user: oneUser });
  } catch (error) {
    res.json({msg: 'Something went wrong', error: error})
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
    const userToken = jwt.sign(payload, process.env.USER_LOGIN_REG_SECRET_KEY)
    console.log(userToken);
    res
    res
    .cookie('userToken', userToken, { httpOnly: true })
    .status(200)
    .json({ msg: 'success!', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
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
  } catch (error) {
    console.log(error);
    // send error and error message
    res.json(error)
  }
}

module.exports.userLogout = async (req, res) => {
  try {
    res.cookie('userToken', '', { expires: new Date(0), httpOnly: true, sameSite: 'strict', secure: true })
    console.log("userToken cleared");
    res
      .json({ msg: 'logout successful' })
      .sendStatus(200);
  } catch (error) {
    console.log(error);
  }
}

module.exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await Users.deleteOne({ _id: req.params.id });
    if (deletedUser.deletedCount > 0) {
      res.json({ msg: 'User deleted successfully', result: deletedUser });
    } else {
      res.status(404).json({ msg: 'User not found', result: deletedUser });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Something went wrong', error: error });
  }
}

