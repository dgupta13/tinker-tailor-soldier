import React from "react";
import { mount } from "enzyme";
import App from "./App";
import configureStore from "redux-mock-store";
import CustomerData from "./components/CustomerData/CustomerData";
import { StoreContext } from "redux-react-hook";

const mockStore = configureStore();

test("renders one child component", () => {
  const state = {
    customerData: [],
    loading: false,
    hasError: false
  };
  let store = mockStore(state);
  const wrapper = mount(
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  );
  expect(wrapper.find(CustomerData).exists()).toEqual(true);
  expect(wrapper.find(CustomerData)).toHaveLength(1);
});
