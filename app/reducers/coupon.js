var stateStart = {
  couponID: "",
  editing: false,
}

const coupon = (state = stateStart, action) => {
  switch (action.type) {
    case 'EDITCOUPON': {
      return {
          couponID: action.couponID,
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
