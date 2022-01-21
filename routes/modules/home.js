const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')

// 餐廳首頁
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurantList => res.render('index', { restaurants: restaurantList }))
    .catch(err => console.log(err))
})

// 排序餐廳
router.get('/sorting', (req, res) => {
  const sort = req.query.sort
  let sortValue = {}
  switch (sort) {
    case 'nameAsc': {
      sortValue = { name: 'asc' }
      break
    }
    case 'nameDesc': {
      sortValue = { name: 'desc' }
      break
    }
    case 'CategoryAsc': {
      sortValue = { category: 'asc' }
      break
    }
    case 'locationAsc': {
      sortValue = { location: 'asc' }
      break
    }
    default : {
      sortValue = { name: 'asc' }
      break
    }
  }

  console.log('keyword: ', req.query.keyword)
  Restaurant.find()
    .lean()
    .sort(sortValue)
    .then(restaurantList => {
      res.render('index', { restaurants: restaurantList, sort: sort })
    })
    .catch(err => console.log(err))
})

// 搜尋餐廳
router.get('/search', (req, res) => {
  // 搜尋欄位空值
  if (!req.query.keyword) {
    return res.redirect('/')
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

// 新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})

module.exports = router
