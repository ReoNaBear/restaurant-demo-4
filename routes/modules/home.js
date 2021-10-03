// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 model
const restaurant = require('../../models/restaurant')

// 設定首頁路由
router.get('/', (req, res) => {
  restaurant.find()
    .lean()
    .sort({ name: 'asc' })
    .then(restaurants => res.render('index', { restaurants })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

//搜尋 這邊參考了同學的寫法
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  restaurant.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } },
      { location: { $regex: keyword, $options: 'i' } }
    ]
  })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(error => console.log(error))
})

// 新增資料
router.get('/new', (req, res) => {
  res.render('new')
})

module.exports = router