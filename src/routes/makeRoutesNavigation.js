// import NavigationModel from "../db/models/NavigationModel.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import { NotFoundError } from "../errors.js"
import { sanitizeNavigation, sanitizeMenu } from "../sanitizers.js"
import auth from "../middlewares/auth.js"
import {
  nameValidator,
  queryLimitValidator,
  queryOffsetValidator,
  idValidator,
} from "../validators.js"
import checkPermission from "../middlewares/perms.js"
import MenuModel from "../db/models/MenuModel.js"

const makeRoutesNavigation = ({ app, db }) => {
  const checkIfMenuExists = async (menuId) => {
    const menu = await MenuModel.query().findById(menuId)

    if (menu) {
      return menu
    }

    throw new NotFoundError()
  }
  app.post(
    "/add-menu",
    auth,
    checkPermission("create", "menu"),
    validate({
      body: {
        name: nameValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { name } = req.data.body

      const [navigation] = await db("menu")
        .insert({
          name,
        })
        .returning("*")

      res.send({ result: sanitizeNavigation(navigation) })
    })
  )

  app.get("/menu/:menuName", async (req, res) => {
    const { menuName } = req.params

    const pages = await db
      .select("title")
      .from("pages")
      .innerJoin("menu", "posts.menu", "menu.id")
      .where("menu.name", menuName)

    res.send({ menuName, pages })
  })

  app.get("/menu-pages", async (req, res) => {
    const menu = await db
      .select("menu.id", "menu.name", "pages.title")
      .from("menu")
      .leftJoin("pages", "menu.id", "pages.menu")
      .groupBy("menu.id", "menu.name", "pages.title")

    const result = []
    menu.forEach((menu) => {
      let currentMenu = result.find((c) => c.id === menu.id)

      if (!currentMenu) {
        currentMenu = {
          id: menu.id,
          name: menu.name,
          pages: [],
        }
        result.push(currentMenu)
      }

      currentMenu.pages.push(menu.title)
    })

    res.send({ result })
  })

  app.get(
    "/menu",
    validate({
      query: {
        limit: queryLimitValidator,
        offset: queryOffsetValidator,
      },
    }),
    mw(async (req, res) => {
      const { limit, offset } = req.data.query
      const posts = await MenuModel.query().limit(limit).offset(offset)

      res.send({ result: sanitizeMenu(posts) })
    })
  )

  app.delete(
    "/menu/:menuId",
    auth,
    checkPermission("delete", "menu"),
    validate({
      params: { menuId: idValidator.required() },
    }),
    mw(async (req, res) => {
      const { menuId } = req.data.params
      const menu = await checkIfMenuExists(menuId, res)

      if (!menu) {
        return
      }

      await MenuModel.query().deleteById(menuId)

      res.send({ result: sanitizeMenu(menu) })
    })
  )

  app.patch(
    "/menu/:menuId",
    auth,
    checkPermission("update", "menu"),
    validate({
      params: { menuId: idValidator.required() },
      body: {
        name: nameValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        data: {
          body: { name },
          params: { menuId },
        },
      } = req

      const updatedMenu = await MenuModel.query().updateAndFetchById(menuId, {
        ...(name ? { name } : {}),
      })

      res.send({ result: sanitizeMenu(updatedMenu) })
    })
  )
}

export default makeRoutesNavigation
