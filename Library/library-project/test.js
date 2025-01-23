// import Ajv from 'ajv'
// const schema = {
//   type: 'object',
//   properties: {
//     name: {
//       type: 'string',
//       maxLength: 3,
//     },
//     age: {
//       type: 'string',
//       maxLength: 3,
//     },
//   },
// }

// const ajv = new Ajv({
//     allErrors: true
// })
// const validate = ajv.compile(schema)
// const error = {};

// const onSubmit = () => {
//   const valid = validate({
//     name: 'asdasdad',
//     age:'2313'
//   })
//   validate.errors.forEach(value=>{
//     error[value.instancePath.replace('/','')] = value.message
//   })
//   console.log(234, error);

// //   const a = {
// //     name: 'eqwe',
// //     age: '3e24243'
// //   }
// }

// onSubmit()

// import Ajv from "ajv";
// import addErrors from "ajv-errors";

// const ajv = new Ajv({ allErrors: true });
// addErrors(ajv); // Kích hoạt plugin ajv-errors

// const schema = {
//   type: "object",
//   properties: {
//     name: { type: "string", minLength: 3 },
//     age: { type: "integer", minimum: 18 }
//   },
//   required: ["name", "age"],
//   errorMessage: {
//     properties: {
//       name: "Tên phải là một chuỗi và có ít nhất 3 ký tự.",
//       age: "Tuổi phải là số nguyên và lớn hơn hoặc bằng 18."
//     },
//     required: {
//       name: "Trường 'name' là bắt buộc.",
//       age: "Trường 'age' là bắt buộc."
//     }
//   }
// };

// const validate = ajv.compile(schema);

// const data = {
//   age: '',
// };

// const valid = validate(data);
// if (!valid) {
//   console.log(validate.errors);
// }

// import Ajv from "ajv";
// import addErrors from "ajv-errors";

// const ajv = new Ajv({ allErrors: true });
// addErrors(ajv); // Kích hoạt plugin ajv-errors

// const schema = {
//   type: "object",
//   properties: {
//     name: {
//       type: "string",
//       errorMessage: "Tên phải là một chuỗi.",
//       minLength: 3
//     },
//     age: {
//       type: "integer",
//       minimum: 18,
//       errorMessage: {
//         type: "Tuổi phải là số nguyên.",
//         minimum: "Tuổi phải lớn hơn hoặc bằng 18."
//       }
//     }
//   },
//   required: ["name", "age"],
//   errorMessage: {
//     required: {
//       name: "Trường 'name' là bắt buộc.",
//       age: "Trường 'age' là bắt buộc."
//     }
//   }
// };

// const validate = ajv.compile(schema);

// const data = {
//   name: 'ab', // Không phải chuỗi
//   age: 15 // Nhỏ hơn 18
// };

// const valid = validate(data);
// if (!valid) {
//   console.log(validate.errors);
// }

// const error = {};

// validate.errors.forEach(value=>{
//       error[value.instancePath.replace('/','')] = value.message
//     })

//     console.log(error);

// import { useQuasar } from 'quasar'

// const $q = useQuasar()

// const showNotification = () => {
//   const a = $q.notify('Message')
//   console.log(a)
// }

// showNotification()

// Import AJV và các module liên quan
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

// Khởi tạo AJV
const ajv = new Ajv({ allErrors: true }) // Bật hiển thị toàn bộ lỗi nếu dữ liệu không hợp lệ
addFormats(ajv) // Thêm hỗ trợ các format (ví dụ: email, URL)

// Danh sách thông tin tài khoản hợp lệ
const loginList = [
  { email: 'truongtv', password: '1234567' },
  { email: 'example1', password: 'password1' },
  { email: 'example2', password: 'password2' },
]

// JSON Schema kiểm tra tính hợp lệ
const schema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
  additionalProperties: false, // Không cho phép các thuộc tính ngoài `email` và `password`
  anyOf: loginList.map((item) => ({
    properties: {
      email: { const: item.email },
      password: { const: item.password },
    },
  })),
}

// Thông tin nhập vào của người dùng
const input = {
  email: 'truongtv',
  password: '12345678',
}

// Kiểm tra dữ liệu nhập vào
const validate = ajv.compile(schema)
const valid = validate(input)

if (valid) {
  console.log('Thông tin hợp lệ!')
} else {
  console.log('Thông tin không hợp lệ!', validate.errors)
}
