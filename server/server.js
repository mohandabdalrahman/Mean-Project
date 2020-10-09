const express = require('express')
const cors = require('cors')
require('./Database/db')
const postsRoutes = require('./routes/posts')
const app = express()

// MIDDLEWARES
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/posts', postsRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`app listen on port ${PORT}`))
