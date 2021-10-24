if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const usePassport = require('./config/passport')
const port = process.env.PORT || 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
// 載入 method-override
const methodOverride = require('method-override')
const routes = require('./routes')
const app = express()

require('./config/mongoose')

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))



usePassport(app)

app.use(flash())
app.use((req, res, next) => {
  console.log(req.user)
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})
app.use(routes)

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})