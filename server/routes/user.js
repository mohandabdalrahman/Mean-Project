const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../Database/schemas/user')

const router = express.Router()


//INFO: signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body
    const hashPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ email, password: hashPassword })
    res.status(201).json({
      message: 'user created',
      user
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
})

//INFO:LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'auth failed' })
    const isEqualPassword = await bcrypt.compare(password, user.password)
    if (!isEqualPassword) return res.status(401).json({ message: 'auth failed' })
    // Create token
    const token = jwt.sign({ email, userId: user._id }, 'MOHAND_SECRET', {
      expiresIn: "1h"
    })
    res.status(200).json({
      token,
      expiresIn: 3600
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
})


module.exports = router