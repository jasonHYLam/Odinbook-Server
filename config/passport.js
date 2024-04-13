const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

function initializePassport(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          console.log("a");
          return done(null, false, { message: "No user" });
        }

        console.log("password");
        console.log(password);
        console.log("user");
        console.log(user);
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          console.log("b");
          return done(null, false, { message: "Incorrect password" });
        }
        console.log("all good");

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = initializePassport;
