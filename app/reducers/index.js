import { combineReducers } from 'redux'
import user from './user'
import coupon from './coupon'

const dataCheck = combineReducers({
  user,
  coupon,
})

export default dataCheck
