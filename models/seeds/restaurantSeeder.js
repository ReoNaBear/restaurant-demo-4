const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const restaurantList = require('./restaurantData.json').results
const User = require('../user')
const db = require('../../config/mongoose')

const SEED_USER = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    restaurantIndex: [0, 1, 2],
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    restaurantIndex: [3, 4, 5],
  },
]
db.once('open', () => {
  console.log('mongodb connected!')
  Promise.all(
    Array.from(SEED_USER, (seedUser) => {
      bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(seedUser.password, salt))
        .then((hash) =>
          User.create({
            name: seedUser.name,
            email: seedUser.email,
            password: hash,
          })
        )
        .then((user) => {
          const userId = user._id
          let restaurant = []
          seedUser.restaurantIndex.forEach((index) => {
            restaurantList[index].userId = userId
            restaurant.push(restaurantList[index])
          })
          return Restaurant.create(restaurant)
        })
    })
  )
    .then(() => {
      console.log('done')
    })
    .catch((err) => console.log(err))
})