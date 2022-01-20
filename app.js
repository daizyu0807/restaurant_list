const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/Restaurant')
const methodOverride = require('method-override')

// 設定 mongoose
mongoose.connect('mongodb://localhost/restaurant_list')

// 設定 handlebars engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 調用靜態檔案位置
app.use(express.static('public'))
// 調用 bodyParser 以解析 body 資料
app.use(bodyParser.urlencoded({ extended: true }))
// 調用 middleware methodOverride
app.use(methodOverride('_method'))

// mongoose 連線
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

// 餐廳首頁
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurantList => res.render('index', { restaurants: restaurantList }))
})

// 搜尋餐廳
app.get('/search', (req, res) => {
  // 搜尋欄位空值
  if (!req.query.keyword) {
    res.redirect('/')
  }

  const keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .then(restaurantList => {
      const restaurantFilter = restaurantList.filter(
        item =>
          item.name.toLowerCase().includes(keyword.toLowerCase()) || // 比對餐廳名稱或類型
          item.category.toLowerCase().includes(keyword.toLowerCase())
      )
      res.render('index', { restaurants: restaurantFilter, keyword: keyword })
    })
    .catch(err => console.log(err))
})

// 查看指定餐廳
app.get('/restaurants/:restaurant_id', (req, res) => {
  Restaurant.findById(req.params.restaurant_id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => console.log(err))
})

// 新增頁面
app.get('/new', (req, res) => {
  res.render('new')
})

// 新增餐廳
app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 編輯頁面
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  Restaurant.findById(req.params.restaurant_id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(err => console.log(err))
})

// 編輯餐廳
app.post('/restaurants/:restaurant_id', (req, res) => {
  Restaurant.findByIdAndUpdate(req.params.restaurant_id, req.body)
    .lean()
    .then(() => res.redirect(`/restaurants/${req.params.restaurant_id}`))
    .catch(err => console.log(err))
})

// 刪除餐廳
app.delete('/restaurants/:restaurant_id', (req, res) => {
  Restaurant.findByIdAndDelete(req.params.restaurant_id)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})