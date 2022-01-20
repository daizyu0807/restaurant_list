const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')

// 查看指定餐廳
router.get('/:restaurant_id', (req, res) => {
  Restaurant.findById(req.params.restaurant_id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => console.log(err))
})

// 新增餐廳
router.post('/', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 編輯頁面
router.get('/:restaurant_id/edit', (req, res) => {
  Restaurant.findById(req.params.restaurant_id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(err => console.log(err))
})

// 編輯餐廳
router.put('/:restaurant_id', (req, res) => {
  Restaurant.findByIdAndUpdate(req.params.restaurant_id, req.body)
    .lean()
    .then(() => res.redirect(`/restaurants/${req.params.restaurant_id}`))
    .catch(err => console.log(err))
})

// 刪除餐廳
router.delete('/:restaurant_id', (req, res) => {
  Restaurant.findByIdAndDelete(req.params.restaurant_id)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router
