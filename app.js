const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json') // 點擊餐廳、查詢餐廳暫時使用
const Restaurant = require('./models/Restaurant')

mongoose.connect('mongodb://localhost/restaurant_list')

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
// app.use(express.urlencoded({ extended: true }))

const db  = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

// 渲染所有餐廳
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurantList => res.render('index', { restaurants: restaurantList }))
})

// 渲染點擊餐廳
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(item => item.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})

// 渲染查詢餐點
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(item => {
    if (item.name.toLowerCase().includes(keyword.toLowerCase())) {
      return item.name.toLowerCase().includes(keyword.toLowerCase())
    } else {
      return item.category.toLowerCase().includes(keyword.toLowerCase())
    }
    
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
