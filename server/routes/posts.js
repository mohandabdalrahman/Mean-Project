const express = require('express')
const Post = require('../Database/schemas/post')

const router = express.Router()

//INFO: get post by id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post) {
      res.status(200).json({
        post
      })
    } else {
      res.status(404).json({
        message: 'Post not found'
      })
    }
  } catch (error) {
    console.log('error', error)
  }
})

//INFO: ADD POST
router.post('', async (req, res) => {
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

// INFO: FETCH ALL POSTS
router.get('', async (req, res) => {
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

//INFO: DELETE POST BY ID
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id)
    res.status(204).json({
      message: 'post deleted'
    })
  } catch (error) {
    console.log('error', error)
  }
})

// INFO: UPDATE POST BY ID
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body
    const post = { title, content }
    await Post.findByIdAndUpdate(req.params.id, post)
    res.status(204).json({
      message: 'post updated'
    })
  } catch (error) {
    console.log('error', error)
  }
})

module.exports = router