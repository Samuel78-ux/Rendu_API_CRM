import { InvalidCredentials } from "../errors.js"
import hashPassword from "../hashPassword.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import { sanitizeUser } from "../sanitizers.js"
import {
  emailValidator,
  firstNameValidator,
  lastNameValidator,
  passwordValidator,
} from "../validators.js"

const makeRoutesSign = ({ app, db }) => {
  app.post(
    "/sign-up",
    validate({
      body: {
        firstName: firstNameValidator.required(),
        lastName: lastNameValidator.required(),
        email: emailValidator.required(),
        password: passwordValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { firstName, lastName, email, password } = req.data.body
      const [passwordHash, passwordSalt] = hashPassword(password)
      const [user] = await db("users")
        .insert({
          firstName,
          lastName,
          email,
          passwordHash,
          passwordSalt,
        })
        .returning("*")

      res.send({ result: sanitizeUser(user) })
    })
  )
  app.post(
    "/sign-in",
    validate({
      body: {
        email: emailValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { email, password } = req.data.body
      const [user] = await db("users").where({ email })

      if (!user) {
        throw new InvalidCredentials()
      }

      const [passwordHash] = hashPassword(password, user.passwordSalt)

      if (user.passwordHash !== passwordHash) {
        throw new InvalidCredentials()
      }

      res.send({ result: "OK" })
    })
  )
}

export default makeRoutesSign
