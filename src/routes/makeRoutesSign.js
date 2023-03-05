import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"
import { InvalidCredentialsError } from "../errors.js"
import hashPassword from "../hashPassword.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import { sanitizeUser } from "../sanitizers.js"
import {
  emailValidator,
  firstNameValidator,
  lastNameValidator,
  passwordValidator,
  roleValidator,
} from "../validators.js"
import auth from "../middlewares/auth.js"
import checkPermissions from "../middlewares/perms.js"

const makeRoutesSign = ({ app, db }) => {
  app.post(
    "/sign-up",
    auth,
    checkPermissions("create", "sign"),
    validate({
      body: {
        firstName: firstNameValidator.required(),
        lastName: lastNameValidator.required(),
        email: emailValidator.required(),
        password: passwordValidator.required(),
        roleId: roleValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { firstName, lastName, email, roleId, password } = req.data.body
      const [passwordHash, passwordSalt] = hashPassword(password)
      const [user] = await db("users")
        .insert({
          firstName,
          lastName,
          email,
          roleId,
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
      const [role] = await db("roles").where({ id: user.roleId })

      if (!user) {
        throw new InvalidCredentialsError()
      }

      const [passwordHash] = hashPassword(password, user.passwordSalt)

      if (user.passwordHash !== passwordHash) {
        throw new InvalidCredentialsError()
      }

      const jwt = jsonwebtoken.sign(
        {
          payload: {
            user: {
              id: user.id,
              roleId: user.roleId,
              fullName: `${user.firstName} ${user.lastName}`,
            },
            role: {
              permissions: role.permissions,
            },
          },
        },
        config.security.session.jwt.secret,
        { expiresIn: config.security.session.jwt.expiresIn }
      )

      res.send({ result: jwt })
    })
  )
}

export default makeRoutesSign
