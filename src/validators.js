import * as yup from "yup"

export const nameValidator = yup
  .string()
  .matches(/^[\p{L} -]+$/u, "Name is invalid")
  .label("Name")

export const emailValidator = yup.string().email().label("E-mail")

export const birthDateValidator = yup
  .date()
  .max(new Date(), "Birth date must be a past date")
  .label("Birth Date")

export const idValdiator = yup
  .number()
  .integer()
  .min(1)
  .label("ID")
  .typeError("Invalid ID")
