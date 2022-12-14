export class AppError extends Error {
  #errors = null
  #httpCode = null

  constructor(errors = ["Oops. Something went wrong"], httpCode = 500) {
    super(errors.join(" | "))

    this.#errors = errors
    this.#httpCode = httpCode
  }

  get errors() {
    return this.#errors
  }

  get httpCode() {
    return this.#httpCode
  }
}

export class NotFoundError extends AppError {
  constructor(resourceName, id) {
    super([`Not found \`${resourceName}\`${id ? `(id = ${id})` : ""} `], 404)
  }
}

export class InvalidArgumentError extends AppError {
  constructor(errors) {
    super(errors, 422)
  }
}
