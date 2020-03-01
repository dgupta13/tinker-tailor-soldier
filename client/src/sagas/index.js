import { all } from "redux-saga/effects";
import { getCustomerDataWatcherSaga } from "../components/CustomerData/modules/customerDataSaga";

export default function* rootSaga() {
  yield all([getCustomerDataWatcherSaga()]);
}
