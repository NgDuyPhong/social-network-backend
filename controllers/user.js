const {
  validateEmail,
  validateLength,
  validateUsername,
} = require('../helpers/validation');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateToken } = require('../helpers/token');
const { sendVerificationEmail } = require('../helpers/mailer');

exports.register = async (req, res) => {
  try {
    const {
      fist_name,
      last_name,
      email,
      password,
      username,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email address!',
      });
    }
    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message:
          'This email address already exists, try with a different email address!',
      });
    }

    if (!validateLength(fist_name, 3, 30)) {
      return res.status(400).json({
        message: 'fistname must between 3 and 30 characters!',
      });
    }

    if (!validateLength(last_name, 3, 30)) {
      return res.status(400).json({
        message: 'fistname must between 3 and 30 characters!',
      });
    }

    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: 'password must be atleast 6 characters!',
      });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);

    const tempUserName = fist_name + last_name;
    let newUsername = await validateUsername(tempUserName);

    const user = await new User({
      fist_name,
      last_name,
      email,
      password: cryptedPassword,
      username: newUsername,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();

    const emaiVerificationToken = generateToken(
      { id: user._id.toString() },
      '30m'
    );
    const url = `${process.env.BASE_URL}/activate/${emaiVerificationToken}`;
    sendVerificationEmail(user.email, user.fist_name, url);
    const token = generateToken({ id: user._id.toString() }, '7d');
    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      frist_name: user.fist_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message: 'Register success! Please activate your email to start.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.body;
    console.log(token, 'token');
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);
    if (check.verified) {
      return res
        .status(400)
        .json({ message: 'This email is already activated!' });
    }
    await User.findByIdAndUpdate(user.id, { verified: true });
    return res
      .status(200)
      .json({ message: 'Account has been activated successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'The email address you enterd is not connected to an account.',
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: 'Invalid password. Please try agian.',
      });
    }
    const token = generateToken({ id: user._id.toString() }, '7d');
    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      frist_name: user.fist_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message: 'Login success!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
