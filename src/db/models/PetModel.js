import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"

class PetModel extends BaseModel {
  static tableName = "pets"

  static get modifiers() {
    return {
      sanitize(builder) {
        builder.select("name", "weight")
      },
      fatestFirst(builder) {
        builder.orderBy("weight", "desc")
      },
    }
  }

  static get relationMappings() {
    return {
      owner: {
        modelClass: UserModel,
        relation: BaseModel.BelongsToOneRelation,
      },
    }
  }
}

export default PetModel
