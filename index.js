const express = require('express')
const cors = require('cors');
const dotevn = require('dotenv').config()
const path = require('path')
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDb = require('./config/db')
const userRouter = require('./routes/userRoutes');
const parkRouter = require('./routes/parkRoutes');

connectDb()

const app = express()
const Port = 5000

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors({origin:['http://localhost:3000', 'https://ars-mart.onrender.com']}));

//All route 
app.use('/api/users', userRouter)
app.use('/api/parks', parkRouter)

app.use(errorHandler)

app.listen(Port, () => {
  console.log(`Example app listening on Port ${Port}`)
})