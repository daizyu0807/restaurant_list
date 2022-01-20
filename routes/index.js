const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurants = require('./modules/restaurants')

// 將網址結構符合 / 字串的 request 導向指定模組
router.use('/', home)
router.use('/restaurants', restaurants)

module.exports = router