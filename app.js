const express = require('express')
const app = express()
const session = require('express-session')
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes')

require('./config/mongoose')
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

// 設定 handlebars engine
app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: 'main',
    helpers: ({
      selected: function (option, value) {
        if (option === value) {
          return 'selected'
        } else {
          return ''
        }
      }
    })
  }))
app.set('view engine', 'handlebars')

// 調用靜態檔案位置
app.use(express.static('public'))
// 調用 bodyParser 以解析 body 資料
app.use(bodyParser.urlencoded({ extended: true }))
// 調用 methodOverride 設定路由
app.use(methodOverride('_method'))
// 調用 routes
app.use(routes)

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
