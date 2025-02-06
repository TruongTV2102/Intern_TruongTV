const STORAGE_KEY = 'loginList'
const USER_KEY = 'user'

// ✅ Khởi tạo danh sách tài khoản mặc định nếu chưa có
export function initLoginList() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const defaultUsers = [
      {
        email: 'truongtv@gmail.com',
        password: '1234567',
        name: 'Trương TV',
        avatar:
          'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg',
      },
      {
        email: 'example1@gmail.com',
        password: 'password1',
        name: 'Nguyễn Văn A',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      {
        email: 'example2@gmail.com',
        password: 'password2',
        name: 'Trần Thị B',
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
      {
        email: 'example3@gmail.com',
        password: 'password3',
        name: 'Lê Văn C',
        avatar: 'https://i.pravatar.cc/150?img=4',
      },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
  }
}

// ✅ Lấy danh sách tài khoản từ localStorage
export function getLoginList() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}

// ✅ Lấy thông tin người dùng hiện tại
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(USER_KEY))
}

// ✅ Đăng nhập và lưu thông tin người dùng vào localStorage
export function loginUser(email, password) {
  const users = getLoginList()
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return user // Trả về thông tin user nếu đăng nhập thành công
  }
  return null // Đăng nhập thất bại
}

// ✅ Lưu trạng thái đăng nhập của người dùng
export function setCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// ✅ Xóa thông tin đăng nhập khi logout
export function logoutUser() {
  localStorage.removeItem(USER_KEY)
}
