import BaseModel from "./BaseModel.js"
import RoleModel from "./RoleModel.js"

class UserModel extends BaseModel {
  static tableName = "users"
  static get relationMappings() {
    return {
      roles: {
        modelClass: RoleModel,
        relation: BaseModel.HasManyRelation,
        join: {
          from: "roles.id",
          to: "users.roleId",
        },
      },
    }
  }
}

export default UserModel
