const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')
module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      (req, email, password, done) => {
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              req.flash('warning_msg', 'That email is not registered')
              return done(null, false, {
                message: 'That email is not registered',
              })
            }
            return bcrypt.compare(password, user.password).then((isMatched) => {
              if (!isMatched) {
                return done(
                  null,
                  false,
                  req.flash('warning_msg', 'Email or password incorrect')
                )
              }
              return done(null, user)
            })
          })
          .catch((err) => done(err, false))
      }
    )
  )
  passport.use(
    new FacebookStrategy(
      {
        clientID: '1218623331948825',
        clientSecret: 'cfccbe25f9b6832ff02a2fae95a3c675',
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName'],
      },
      (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        User.findOne({ email }).then((user) => {
          if (user) return done(null, user)
          const randomPassword = Math.random().toString(36).slice(-8)
          bcrypt
            .genSalt(10)
            .then((salt) => bcrypt.hash(randomPassword, salt))
            .then((hash) => User.create({ name, email, password: hash }))
            .then((user) => done(null, user))
            .catch((err) => done(err, false))
        })
      }
    )
  )
  passport.serializeUser((user, done) => {
    done(null, user)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null))
  })
}