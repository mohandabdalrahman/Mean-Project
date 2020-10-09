const express = require('express')
const cors = require('cors')
require('./Database/db')
const Post = require('./Database/schemas/post')
const app = express()

// MIDDLEWARES
app.use(cors())
app.use(express.json())

/** ROUTES */
app.post('/api/posts', async (req, res) => {
  try {
    const post = await Post.create(req.body)
    res.status(201).json({
      message: 'success added',
      postId: post._id
    })
  } catch (error) {
    console.log('error', error)
  }
})

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find()
    res.status(200).json({
      message: 'success fetched',
      posts
    })
  } catch (error) {
    console.log('error', error)
  }
})

app.delete('/api/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id)
    res.status(204).json({
      message: 'post deleted'
    })
  } catch (error) {
    console.log('error', error)
  }
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`app listen on port ${PORT}`))
