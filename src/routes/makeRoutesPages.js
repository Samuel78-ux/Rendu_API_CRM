import PageModel from "../db/models/PageModel.js"
import mw from "../middlewares/mw.js"
import { NotFoundError } from "../errors.js"
import validate from "../middlewares/validate.js"
import { sanitizePage } from "../sanitizers.js"
import auth from "../middlewares/auth.js"
import {
  titleValidator,
  contentValidator,
  idCategorieValidator,
  idValidator,
  queryLimitValidator,
  queryOffsetValidator,
} from "../validators.js"
import checkPermission from "../middlewares/perms.js"

const makeRoutesPages = ({ app, db }) => {
  const checkIfUserExists = async (userId) => {
    const page = await PageModel.query().findById(userId)

    if (page) {
      return page
    }

    throw new NotFoundError()
  }

  const generateUrlSlug = (title) => {
    return title.toLowerCase().split(" ").join("-")
  }

  app.post(
    "/add-page",
    auth,
    checkPermission("create", "pages"),
    validate({
      body: {
        title: titleValidator.required(),
        content: contentValidator.required(),
        menu: idCategorieValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { title, content, menu, status } = req.data.body
      const {
        session: {
          user: { id: userId, fullName: creator },
        },
      } = req

      const urlSlug = generateUrlSlug(title)

      const [page] = await db("pages")
        .insert({
          title,
          content,
          urlSlug,
          creator,
          menu,
          status,
          userId,
        })
        .returning("*")

      res.send({ result: sanitizePage(page) })
    })
  )

  app.delete(
    "/pages/:pageId",
    auth,
    checkPermission("delete", "page"),
    validate({
      params: { pageId: idValidator.required() },
    }),
    mw(async (req, res) => {
      const { pageId } = req.data.params
      const page = await checkIfUserExists(pageId, res)

      if (!page) {
        return
      }

      await PageModel.query().deleteById(pageId)

      res.send({ result: sanitizePage(page) })
    })
  )

  app.get(
    "/pages",
    auth,
    validate({
      query: {
        limit: queryLimitValidator,
        offset: queryOffsetValidator,
      },
    }),
    mw(async (req, res) => {
      const { limit, offset } = req.data.query
      const pages = await PageModel.query().limit(limit).offset(offset)

      res.send({ result: sanitizePage(pages) })
    })
  )

  app.get(
    "/pages/:pageId",
    auth,
    validate({
      params: { pageId: idValidator.required() },
    }),
    mw(async (req, res) => {
      const { pageId } = req.data.params
      const pages = await PageModel.query().findById(pageId)

      if (!pages) {
        return
      }

      res.send({ result: sanitizePage(pages) })
    })
  )

  app.patch(
    "/pages/:pageId",
    auth,
    validate({
      params: { pageId: idValidator.required() },
      body: {
        title: titleValidator,
        content: contentValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        data: {
          body: { title, content },
          params: { pageId },
        },
      } = req

      const updatedPage = await PageModel.query().updateAndFetchById(pageId, {
        ...(title ? { title } : {}),
        ...(content ? { content } : {}),
      })

      res.send({ result: sanitizePage(updatedPage) })
    })
  )
}
export default makeRoutesPages
