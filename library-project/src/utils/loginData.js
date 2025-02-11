const STORAGE_KEY = 'loginList'
const USER_KEY = 'user'

// Khởi tạo danh sách tài khoản mặc định nếu chưa có
export function initLoginList() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const defaultUsers = [
      {
        email: 'admin@gmail.com',
        password: 'admin123',
        name: 'Admin',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'admin',
      },
      {
        email: 'truongtv@gmail.com',
        password: '1234567',
        name: 'Trương TV',
        avatar:
          'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg',
        role: 'admin',
      },
      {
        email: 'example1@gmail.com',
        password: 'password1',
        name: 'Nguyễn Văn A',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'user',
      },
      {
        email: 'example2@gmail.com',
        password: 'password2',
        name: 'Trần Thị B',
        avatar: 'https://i.pravatar.cc/150?img=3',
        role: 'user',
      },
      {
        email: 'example3@gmail.com',
        password: 'password3',
        name: 'Lê Văn C',
        avatar: 'https://i.pravatar.cc/150?img=4',
        role: 'user',
      },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
  }
}

// Lấy danh sách tài khoản từ localStorage
export function getLoginList() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}

// Lấy thông tin người dùng hiện tại
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(USER_KEY))
}

// Đăng nhập và lưu thông tin người dùng vào localStorage
export function loginUser(email, password) {
  const users = getLoginList()
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    // Đảm bảo lưu toàn bộ thông tin user (không chỉ email & password)
    const userData = {
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    }
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    return userData // Trả về đầy đủ thông tin
  }
  return null
}

// Lưu trạng thái đăng nhập của người dùng
export function setCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Xóa thông tin đăng nhập khi logout
export function logoutUser() {
  localStorage.removeItem('user')
}
