export const login = (user) => ({
  type: 'LOGIN',
  userID: user.id,
})

export const logout = () => ({
  type: 'LOGOUT',
})
