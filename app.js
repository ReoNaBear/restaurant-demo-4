const express = require('express')
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
// 載入 method-override
const methodOverride = require('method-override')
const routes = require('./routes')
const app = express()


app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))


app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))


require('./config/mongoose')

app.use(routes)

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})