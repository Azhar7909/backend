const express = require("express");
const router = express.Router();
require('../db/db-conn');
const User = require('../db/models/users-schema');
const bcrypt = require('bcryptjs');
const Athenticate = require("../middlewares/Athenticate");

// user signin
router.post("/signin-user", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Plz fill the fields properly" })
  }
  try {
    const userExist = await User.findOne({ email: email });
    const isPass = await bcrypt.compare(password, userExist.password)
    // console.log("pass",isPass);
    const token = await userExist.generateAuthToken();
    // console.log(token);
    res.cookie("jwToken", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true
    })
    if (userExist && isPass) {
      res.status(200).json({
        messase: "signinin successfully!",
        detail: {
          name: userExist.name,
          email: userExist.email,
          phone: userExist.phone
        }
      })
    } else {
      res.status(400).json({ messase: "Invalid credentials!", detail: err });
    }
  } catch (err) {
    res.status(400).json({ messase: "Invalid credentials!", detail: err });
  }
});


// User register by async await  way
router.post("/register-user", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Plz fill the fields properly" })
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: `${userExist.email} already exist!` });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "passwords are not matching!" });
    }
    const user = new User({ name, email, phone, work, password, cpassword });
    const userRegistered = await user.save();
    if (userRegistered) {
      res.status(201).json({ messase: "user registered successfully!", detail: userRegistered });
    }

  } catch (err) {
    res.status(500).json({ messase: "Failed register!", detail: err });
  }
});

// get users
router.get("/users-list", Athenticate, (req, res) => {

  User.find({}, function (err, users) {
    var userMap = [];

    users.forEach(function (user) {
      userMap.push(user)
    });

    res.send(userMap);
  });
});

// About page
router.get('/about', Athenticate, (req, res) => {
  // console.log("About is working with middleware");
  res.send(req.userExist)
})

// Contact Page
router.get('/contact', Athenticate, (req, res) => {
  // console.log("About is working with middleware");
  res.send(req.userExist)
})

module.exports = router;