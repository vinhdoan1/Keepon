var stateStart = {
  loggedIn: false,
  userID: "",
}

const user = (state = stateStart, action) => {
  switch (action.type) {
    case 'LOGIN': {
      return {
          loggedIn: true,
          userID: action.userID,
        }
    }
    case 'LOGOUT': {
      return {
          loggedIn: false,
          userID: action.userID,
        }
    }
    default:
    {
      return state
    }
  }
}

export default user
