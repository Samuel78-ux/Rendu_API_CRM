const extract = (keys) => {
  const subExtract = (obj) =>
    Array.isArray(obj)
      ? obj.map(subExtract)
      : keys.reduce((sanitized, key) => ({ ...sanitized, [key]: obj[key] }), {})

  return subExtract
}

export const sanitizeUser = extract(["id", "firstName", "lastName", "email"])

export const sanitizePage = extract([
  "id",
  "title",
  "content",
  "menu",
  "createdAt",
  "updatedAt",
])

export const sanitizeNavigation = extract([
  "id",
  "name",
  "createdAt",
  "updatedAt",
])

export const sanitizeMenu = extract(["id", "name"])
