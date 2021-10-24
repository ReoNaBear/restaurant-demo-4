const express = require('express')
const router = express.Router()
// 引用 restaurant model
const restaurant = require('../../models/restaurant')

//詳細資料
router.get('/:id/detail', (req, res) => {
  const id = req.params.id
  const userId = req.user._id
  return restaurant.findById(id, userId)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})


//刪除資料
router.delete('/:id', (req, res) => {
  const id = req.params.id
  const userId = req.user._id
  return restaurant.findById(id, userId)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//編輯資料
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const userId = req.user._id
  restaurant.findById(id, userId)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return restaurant.findOne({ _id, userId })
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})
router.post('/new', (req, res) => {
  const userId = req.user._id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


module.exports = router