import Ajv from 'ajv'
import addErrors from 'ajv-errors'
import addFormats from 'ajv-formats'

export const validateData = (data, schema) => {
  const ajv = new Ajv({
    allErrors: true,
    $data: true,
  })
  addErrors(ajv)
  addFormats(ajv)
  const validate = ajv.compile(schema)
  const isValid = validate(data)
  const errors = {}

  if (!isValid && validate.errors) {
    validate.errors.forEach((error) => {
      const key = error.instancePath.replace('/', '')
      errors[key] = error.message
    })
  }

  return { isValid, errors }
}
