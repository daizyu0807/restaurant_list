const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const Restaurant = require('./models/Restaurant')

mongoose.connect('mongodb://localhost/restaurant_list')

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
// app.use(express.urlencoded({ extended: true }))

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

// 所有餐廳
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurantList => res.render('index', { restaurants: restaurantList }))
})

// 搜尋餐點
app.get('/search', (req, res) => {
  if (!req.query.keyword) {
    res.redirect('/')
  }

  const keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .then(restaurantList => {
      const restaurantFilter = restaurantList.filter(
        item =>
          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
          item.category.toLowerCase().includes(keyword.toLowerCase())
      )
      res.render('index', { restaurants: restaurantFilter, keyword: keyword })
    })
    .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

// 查看餐廳
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(item => item.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})