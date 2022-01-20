const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes')

// 設定 mongoose
mongoose.connect('mongodb://localhost/restaurant_list')

// 設定 handlebars engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 調用靜態檔案位置
app.use(express.static('public'))
// 調用 bodyParser 以解析 body 資料
app.use(bodyParser.urlencoded({ extended: true }))
// 調用 methodOverride 設定路由
app.use(methodOverride('_method'))
// 調用 routes
app.use(routes)

// mongoose 連線
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})