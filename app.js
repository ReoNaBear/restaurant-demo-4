const express = require('express')
const port = 3000
const exphbs = require('express-handlebars')
const app = express()
const restaurant = require('./models/restaurant')

const bodyParser = require('body-parser')

// 載入 method-override
const methodOverride = require('method-override')
// 設定每一筆請求都會透過 methodOverride 進行前置處理

app.use(methodOverride('_method'))
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
app.delete('/restaurants/:id', (req, res) => {
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

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const data = req.body

  restaurant.findByIdAndUpdate(id, data)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// 新增資料
app.get('/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants/new', (req, res) => {
  return restaurant.create({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})



//資料庫連線設定
require('./config/mongoose')


app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})