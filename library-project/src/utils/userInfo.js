import { getCurrentUser, getLoginList } from './localStorage'

// ✅ Hàm lấy thông tin user từ loginList
export function getUserInfo() {
  const currentUser = getCurrentUser() // Lấy user đang đăng nhập
  if (!currentUser) return null

  const users = getLoginList() // Lấy danh sách tài khoản từ localStorage
  return users.find((u) => u.email === currentUser.email) || null
}
