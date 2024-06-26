import { combineReducers } from "redux"
import loginReducer from "./loginReducer.js"

const rootReducer = combineReducers({
	login: loginReducer,
})

export default rootReducer
