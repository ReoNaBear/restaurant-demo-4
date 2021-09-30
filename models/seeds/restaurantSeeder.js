const Restaurant = require('../restaurantSchema')
const db = require('../../config/mongoose')
const restaurantSeed = require('../../restaurant.json').results

db.once('open', () => {
  for (let i = 0; i < restaurantSeed.length; i++) {
    let { name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description } = restaurantSeed[i]

    Restaurant.create({
      name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description
    })
  }

  console.log('Created seed data')
})