const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant') // restaurantSchema
const User = require('../user')
const restaurantList = require('../../restaurant.json').results
const db = require('../../config/mongoose')

const users = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10))
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10))
  }
]

db.once('open', async () => {
  // 創建種子帳號
  await User.create(users)
  await User.find()
    .then(user => {
      // 創建種子帳號餐廳清單
      const user1List = restaurantList.slice(0, 3)
      const user2List = restaurantList.slice(3, 6)
      const userList = user1List.concat(user2List)
      for (const item of user1List) {
        item.userId = user[0].id
      }
      for (const item of user2List) {
        item.userId = user[1].id
      }
      return userList
    })
    // 同步處理
    .then((userList) => {
      Restaurant.create(userList)
    })
})
