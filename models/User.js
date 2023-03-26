const { ObjectId } = require('mongodb');
const { default: mongoose } = require('mongoose');

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      require: [true, 'first name is required!'],
      trim: true,
      text: true,
    },
    last_name: {
      type: String,
      require: [true, 'last name is required!'],
      trim: true,
      text: true,
    },
    username: {
      type: String,
      require: [true, 'username is required!'],
      trim: true,
      text: true,
      unique: true,
    },
    email: {
      type: String,
      require: [true, 'email is required!'],
      trim: true,
    },
    password: {
      type: String,
      require: [true, 'password is required!'],
    },
    picture: {
      type: String,
      default:
        'https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg',
    },
    cover: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      required: [true, 'gender is required'],
      trim: true,
    },
    bYear: {
      type: Number,
      required: true,
    },
    bMonth: {
      type: Number,
      required: true,
    },
    bDay: {
      type: Number,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    friends: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    requests: {
      type: Array,
      default: [],
    },
    search: [
      {
        user: {
          type: ObjectId,
          ref: 'User',
        },
      },
    ],
    details: {
      bio: {
        type: String,
      },
      otherName: {
        type: String,
      },
      job: {
        type: String,
      },
      workplace: {
        type: String,
      },
      highSchool: {
        type: String,
      },
      college: {
        type: String,
      },
      currentCity: {
        type: String,
      },
      hometown: {
        type: String,
      },
      relationship: {
        type: String,
        enum: ['Single', 'In a relationship', 'Married', 'Divorced'],
      },
      instagram: {
        type: String,
      },
    },
    savedPost: [
      {
        post: {
          type: ObjectId,
          ref: 'Post',
        },
        saveAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('User', userSchema);
