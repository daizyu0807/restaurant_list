const mongoose = require('mongoose')
// 設定 mongoose
mongoose.connect('mongodb://localhost/restaurant_list')

// mongoose 連線
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db
