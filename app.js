const express = require('express')
const app = express()
const session = require('express-session')
const usePassport = require('./config/passport') // 載入設定檔，要寫在 express-session 以後
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes')
const flash = require('connect-flash')

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
// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)
app.use(flash()) // 掛載套件
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg') // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg') // 設定 warning_msg 訊息
  next()
})
app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})
// 調用 routes
app.use(routes)

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
