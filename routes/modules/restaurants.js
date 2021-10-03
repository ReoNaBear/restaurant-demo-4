const express = require('express')
const router = express.Router()
// 引用 restaurant model
const restaurant = require('../../models/restaurant')

//詳細資料
router.get('/:id/detail', (req, res) => {
  const id = req.params.id
  return restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})


//刪除資料
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//編輯資料
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const data = req.body

  return restaurant.findByIdAndUpdate(id, data)
    .then(() => res.redirect(`/restaurants/${id}/detail`))
    .catch(error => console.log(error))
})

router.post('/new', (req, res) => {
  return restaurant.create({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})


module.exports = router