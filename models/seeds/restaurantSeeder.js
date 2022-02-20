const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant') // restaurantSchema
const User = require('../user')
const restaurantList = require('../../restaurant.json').results
const db = require('../../config/mongoose')
const SEED_USER = {
  name: 'test',
  email: 'test@gg.com',
  password: '123'
}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      function addUserId () {
        for (const item of restaurantList) {
          item.userId = user.id
        }
      }
      return Promise.all([addUserId(), Restaurant.create(restaurantList)])
    })
    .then(() => {
      console.log('done.')
      process.exit()
    })
})
