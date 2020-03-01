import React from "react";
import { mount } from "enzyme";
import configureStore from "redux-mock-store";
import CustomerData from "./CustomerData";
import { cleanup } from "@testing-library/react";
import { StoreContext } from "redux-react-hook";

const mockStore = configureStore();
let store, element, setUp;
afterEach(cleanup);

describe("renders one component with no row/data", () => {
  const state = {
    customerData: [],
    loading: false,
    hasError: false
  };
  store = mockStore(state);
  setUp = store => {
    return mount(
      <StoreContext.Provider value={store}>
        <CustomerData />
      </StoreContext.Provider>
    );
  };

  it("will render the customer data component to render", () => {
    element = setUp(store);
    expect(element.find(CustomerData).exists()).toEqual(true);
  });

  it("will render the customer data component to render with proper header", () => {
    element = setUp(store);
    expect(element.find(CustomerData).text()).toContain("Customer Name");
    expect(element.find(CustomerData).text()).toContain("Total spending");
  });

  it("will render the customer data component to render with no row", () => {
    element = setUp(store);
    expect(element.find(".E1").length).toEqual(0);
  });
});
