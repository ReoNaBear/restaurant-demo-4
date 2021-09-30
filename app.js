const express = require('express')
const port = 3000
const exphbs = require('express-handlebars')
const app = express()
const restaurant = require('./models/restaurant')



const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

// template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// static files
app.use(express.static('public'))

// 設定首頁路由
app.get('/', (req, res) => {
  restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

//詳細資料
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})


//搜尋 這邊參考了同學的寫法
app.get('/search', (req, res) => {
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

//刪除資料
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//編輯資料
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  console.log("a")
  const id = req.params.id
  const data = req.body

  restaurant.findByIdAndUpdate(id, data)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//新增餐廳


//資料庫連線設定
require('./config/mongoose')


app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})