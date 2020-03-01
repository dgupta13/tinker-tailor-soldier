import React from "react";
import { cleanup } from "@testing-library/react";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {
  annualDiscount,
  applyAnnualFee,
  applyAnnualInterestRate,
  constructCustomerSpecificObject,
  monthlyPurchaseDiscount
} from "./customerDataSaga";

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe("test custom functions", () => {
  it("testing monthlyPurchaseDiscount", () => {
    const monthlyDiscount = monthlyPurchaseDiscount(100, 100, 20, "07");

    expect(monthlyDiscount).toEqual({
      spending: 85,
      savings: 35,
      discount: "monthly discount"
    });
  });

  it("testing annualDiscount", () => {
    const annualDiscountAmount = annualDiscount("E", "tinker", 100, 30, "");

    expect(annualDiscountAmount).toEqual({
      spending: 100,
      savings: 30,
      discount: ""
    });
  });

  it("testing applyAnnualInterestRate", () => {
    const annualIR = applyAnnualInterestRate(100, "E", "tinker");

    expect(annualIR).toEqual({
      spending: 110
    });
  });

  it("testing constructCustomerSpecificObject", () => {
    const response = constructCustomerSpecificObject([
      {
        purchaseID: 1,
        customerID: "E1",
        DateOfPurchase: "05/07/2019",
        purchaseValue: 100,
        cardName: "Tinker"
      }
    ]);

    expect(response).toEqual([
      {
        E1: {
          cardType: "Tinker",
          discount: "monthly discount",
          savings: 15,
          spending: 15
        }
      }
    ]);
  });
});
