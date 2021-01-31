const express = require('express')
const cors = require('cors')
require('./db/mongoose')

const app = express()
app.use(express.json())

app.use(cors())
 
const userRoutes = require('./routes/users')

const port = process.env.PORT || 5000
app.use(userRoutes)

app.listen(port, () => console.log(`Server started on port ${port}`));
