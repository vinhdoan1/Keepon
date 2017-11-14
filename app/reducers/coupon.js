var stateStart = {
  couponID: "",
}

const user = (state = stateStart, action) => {
  switch (action.type) {
    case 'EDITCOUPON': {
      return {
          userID: action.coupon,
        }
    }
    default:
    {
      return state
    }
  }
}

export default user
