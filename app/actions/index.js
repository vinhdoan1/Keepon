export const login = (user) => ({
  type: 'LOGIN',
  userID: user.id,
})

export const logout = () => ({
  type: 'LOGOUT',
})

export const editcoupon = (coupon) => ({
  type: 'EDITCOUPON',
  couponID: coupon.id,
})

export const editcoupondone = () => ({
  type: 'EDITCOUPONDONE',
})
