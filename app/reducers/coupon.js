var stateStart = {
  couponID: "",
  editing: false,
}

const coupon = (state = stateStart, action) => {
  switch (action.type) {
    case 'EDITCOUPON': {
      return {
          userID: action.coupon,
          editing: true,
        }
    }
    case 'EDITCOUPONDONE': {
      return {
          editing: false,
        }
    }
    default:
    {
      return state
    }
  }
}

export default coupon
