import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"
import MenuModel from "./MenuModel.js"

class PageModel extends BaseModel {
  static tableName = "pages"

  static get relationMappings() {
    return {
      users: {
        modelClass: UserModel,
        relation: BaseModel.HasManyRelation,
        join: {
          from: "users.id",
          to: "pages.userId",
        },
      },
      navigationMenu: {
        modelClass: MenuModel,
        relation: BaseModel.HasOneRelation,
        join: {
          from: "menu.id",
          to: "pages.category",
        },
      },
    }
  }
}

export default PageModel
