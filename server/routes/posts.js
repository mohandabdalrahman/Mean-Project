const express = require('express')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const Post = require('../Database/schemas/post')

const router = express.Router()

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = new Error('Invalid mime type')
    if (isValid) {
      error = null
    }
    cb(error, 'server/images')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype]
    cb(null, `${name}-${Date.now()}.${ext}`)
  }
})

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
//INFO: single: find image in image property in req body
router.post('', checkAuth, multer({ storage }).single('image'), async (req, res) => {
  const URL = `${req.protocol}://${req.get('host')}`
  try {
    const post = await Post.create({ ...req.body, imagePath: `${URL}/images/${req.file.filename}`, creator: req.userData.userId }) // it will be converted to Object Id by mongoose
    res.status(201).json({
      message: 'success added',
      post
    })
  } catch (error) {
    console.log('error', error)
  }
})

// INFO: FETCH ALL POSTS
router.get('', async (req, res) => {
  try {
    let posts;
    const { pageSize, currentPage } = req.query
    const postQuery = Post.find();
    let count;
    // handle pagination
    if (+pageSize && +currentPage) {
      posts = await postQuery.skip(+pageSize * (+currentPage - 1)).limit(+pageSize)
      count = await Post.count()
    }
    posts = await postQuery
    count = await Post.count()
    res.status(200).json({
      message: 'success fetched',
      posts,
      count
    })
  } catch (error) {
    console.log('error', error)
  }
})

//INFO: DELETE POST BY ID
router.delete('/:id', checkAuth, async (req, res) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    if (result.n > 0) {
      res.status(204).json({
        message: 'post deleted'
      })
    } else {
      res.status(401).json({
        message: 'not authorizied'
      })
    }
  } catch (error) {
    console.log('error', error)
  }
})

// INFO: UPDATE POST BY ID
router.put('/:id', checkAuth, async (req, res) => {
  try {
    const { title, content, imagePath } = req.body
    const post = { title, content, imagePath, creator: req.userData.userId }
    const result = await Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    if (result.nModified > 0) {
      res.status(204).json({
        message: 'post updated'
      })
    } else {
      res.status(401).json({
        message: 'not authorizied'
      })
    }

  } catch (error) {
    console.log('error', error)
  }
})

module.exports = router