const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const { authenticator } = require('../middleware/auth') // 掛載 middleware

// 將網址結構符合 / 字串的 request 導向指定模組
router.use('/restaurants', authenticator, restaurants)
router.use('/users', users)
router.use('/', authenticator, home)

module.exports = router
