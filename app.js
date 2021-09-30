const express = require('express')
const port = 3000
const exphbs = require('express-handlebars')
const app = express()
const restaurantList = require('./restaurant.json')

// template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// static files
app.use(express.static('public'))

// router 首頁
app.get('/', (req, res) => {
  res.render('index', { restaurantList: restaurantList.results })
})

// router 詳細資料
app.get('/restaurants/:restaurant_id', (req, res) => {

  let index = req.params.restaurant_id - 1
  res.render('show', { restaurant: restaurantList.results[index] })
})

// router 搜尋
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const storeSearched = restaurantList.results.filter((store) => {
    return store.name.toLowerCase().includes(keyword.toLowerCase())
  })
  console.log(storeSearched)
  if (storeSearched.length === 0) {
    res.render('index_noResult')
  } else {
    res.render('index', { restaurantList: storeSearched, keyword: keyword })
  }
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})