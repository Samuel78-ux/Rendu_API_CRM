import { ForbiddenError } from "../errors.js"

const checkPermission = (permission, resource) => {
  return (req, res, next) => {
    const rolePermissions = req.session.role.permissions[resource]

    if (!rolePermissions[permission]) {
      throw new ForbiddenError()
    }

    next()
  }
}
export default checkPermission
