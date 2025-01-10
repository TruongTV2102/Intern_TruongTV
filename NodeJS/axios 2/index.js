const axios = require('axios');
const app = axios();
const port = 3000;

// Tạo một request để truy xuất người dùng ứng với ID cho sẵn:
axios.get('/user?ID=12345')
  .then(function (response) {
    // xử trí khi thành công
    console.log(response);
  })
  .catch(function (error) {
    // xử trí khi bị lỗi
    console.log(error);
  })
  .finally(function () {
    // luôn luôn được thực thi
  });


app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});