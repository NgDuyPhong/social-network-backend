const User = require('../models/User');

exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

exports.validateLength = (text, min, max) => {
  return !(text.length > max || text.length < min);
};

exports.validateUsername = async (username) => {
  let isValid = false;
  do {
    let check = await User.findOne({ username });
    if (check) {
      // nếu user name đã tồn tại thì tạo 1 username + random 0 -> 999
      username += Math.floor(Math.random() * 1000);
    } else {
      isValid = false;
    }
  } while (isValid);
  return username;
};
