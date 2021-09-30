const restaurant = require('../restaurant')
const db = require('../../config/mongoose')
const restaurantData = require('./restaurantData').results

db.once('open', () => {
  for (let i = 0; i < restaurantData.length; i++) {
    let { name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description } = restaurantData[i]

    restaurant.create({
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