import BaseModel from "./BaseModel.js"
import PetModel from "./PetModel.js"

class UserModel extends BaseModel {
  static tableName = "users"

  static get relationMappings() {
    return {
      pets: {
        modelClass: PetModel,
        relation: BaseModel.HasManyRelation,
        join: {
          from: "users.id",
          to: "pets.userId",
        },
      },
    }
  }
}

export default UserModel
