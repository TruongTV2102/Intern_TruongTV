const path = require('path')
const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars').engine
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))  //khi gặp những file tĩnh thì nó sẽ đi vào file public này

// HTTP logger
app.use(morgan('combined'))

// Template engine
app.engine('.hbs', exphbs({
  extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources/views'))


app.get('/', (req, res) => {
  res.render('home')
})

app.get('/news', (req, res) => {
  res.render('news')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})