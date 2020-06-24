const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");

router.post("/signup", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const pic = req.body.pic;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" });
  } else {
    User.findOne({ email: email })
      .then((response) => {
        if (response) {
          return res
            .status(422)
            .json({ error: "user already exists with tht email" });
        }
        bcrypt.hash(password, 12).then((hashedpassword) => {
          const user = new User({
            name,
            email,
            password: hashedpassword,
            pic,
          });
          user
            .save()
            .then((user) => res.json({ message: "saved successfully" }))
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  }
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "enter email and password" });
  }
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(422).json({ error: "invalid email or password" });
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: user._id }, JWT_SECRET);
          // res.setHeader("Authorization", "Bearer " + token);
          const { _id, name, email, followers, following, pic } = user;
          res.json({
            token: token,
            user: { _id, name, email, followers, following, pic },
          });
          //res.json({ messgae: "signed in success" });
        } else {
          return res.status(422).json({ error: "invalid email or password" });
        }
      })
      .catch((err) => console.log(err));
  });
});
module.exports = router;
