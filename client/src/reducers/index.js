import { combineReducers } from "redux";
import { customerDataReducer } from "../components/CustomerData/modules/customerDataReducer";

const rootReducer = combineReducers({
  customerData: customerDataReducer
});

export default rootReducer;
