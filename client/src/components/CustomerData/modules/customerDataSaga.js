import { takeEvery, call, put } from "redux-saga/effects";
import { getCustomerDataApi } from "./customerDataApi";

const EXISTING_CUSTOMER = "E";
const STAFF = "S";
const NEW_CUSTOMER = "N";
const EXISTING_CUSTOMER_LIMIT = 2000;
const EXISTING_CUSTOMER_DISCOUNT = 1;
const STAFF_CUSTOMER_DISCOUNT = 2;
const NEW_CUSTOMER_DISCOUNT = 2000;
const CARD_IR = {
  tinker: 10,
  tailor: 12,
  soldier: 14
};
const CARD_ANNUAL_FEE = {
  tinker: 300,
  tailor: 200,
  soldier: 150
};

/**
 * Function to calculate monthly discounts
 * @param totalSpentAmount
 * @param purchaseValue
 * @param savings
 * @param month
 * @param discountEligible
 * @returns {number}
 */
export const monthlyPurchaseDiscount = (
  totalSpentAmount,
  purchaseValue,
  savings,
  month,
  discountEligible
) => {
  if (month === "05" || month === "06") {
    return {
      spending:
        totalSpentAmount > 0
          ? totalSpentAmount - purchaseValue * 0.01
          : purchaseValue * 0.01,
      savings: savings + purchaseValue * 0.01,
      discount:
        discountEligible && discountEligible !== "monthly discount"
          ? discountEligible + " , monthly discount"
          : "monthly discount"
    };
  } else if (month === "07" || month === "08") {
    return {
      spending:
        totalSpentAmount > 0
          ? totalSpentAmount - purchaseValue * 0.15
          : purchaseValue * 0.15,
      savings: savings + purchaseValue * 0.15,
      discount:
        discountEligible && discountEligible !== "monthly discount"
          ? discountEligible + " , monthly discount"
          : "monthly discount"
    };
  }
  return {
    spending:
      totalSpentAmount > 0
        ? totalSpentAmount
        : totalSpentAmount + purchaseValue,
    savings: savings,
    discount: discountEligible
  };
};

/**
 * Function to calculate annual discount based on customer type
 * @param customerType
 * @param cardType
 * @param totalAmount
 * @param savings
 * @param discountEligible
 * @returns {number}
 */
export const annualDiscount = (
  customerType,
  cardType,
  totalAmount,
  savings,
  discountEligible
) => {
  if (
    customerType === EXISTING_CUSTOMER &&
    totalAmount > EXISTING_CUSTOMER_LIMIT
  ) {
    return {
      spending: totalAmount - totalAmount * (EXISTING_CUSTOMER_DISCOUNT / 100),
      savings: savings + totalAmount * (EXISTING_CUSTOMER_DISCOUNT / 100),
      discount:
        discountEligible && discountEligible !== "annual discount"
          ? discountEligible + " , annual discount"
          : "annual discount"
    };
  } else if (customerType === NEW_CUSTOMER) {
    return {
      spending: totalAmount - NEW_CUSTOMER_DISCOUNT,
      savings: savings + NEW_CUSTOMER_DISCOUNT,
      discount:
        discountEligible && discountEligible !== "annual discount"
          ? discountEligible + " , annual discount"
          : "annual discount"
    };
  }
  return {
    spending: totalAmount,
    savings: savings,
    discount: discountEligible
  };
};

/**
 * Function to calculate annual fee based on card type and customer type
 * @param totalAmount
 * @param customerType
 * @param cardType
 * @returns {number}
 */
export const applyAnnualFee = (totalAmount, customerType, cardType) => {
  if (customerType !== STAFF) {
    return {
      spending: totalAmount + CARD_ANNUAL_FEE[cardType.toLowerCase()]
    };
  }
  return {
    spending: totalAmount
  };
};

/**
 * Function to calculate interest rate on each card type
 * @param totalAmount
 * @param customerType
 * @param cardType
 * @returns {number}
 */
export const applyAnnualInterestRate = (
  totalAmount,
  customerType,
  cardType
) => {
  if (customerType === STAFF) {
    return {
      spending:
        totalAmount +
        (STAFF_CUSTOMER_DISCOUNT / 100) *
          (totalAmount * (CARD_IR[cardType.toLowerCase()] / 100))
    };
  }
  return {
    spending:
      totalAmount + totalAmount * (CARD_IR[cardType.toLowerCase()] / 100)
  };
};

/**
 * Reformat the response to customer specific object
 * @param customerData
 * @returns {Array}
 */
export const constructCustomerSpecificObject = customerData => {
  let customerDataArray = [];
  customerData.forEach(item => {
    let month = item.DateOfPurchase.split("/");
    if (
      Object.keys(Object.assign({}, ...customerDataArray)).indexOf(
        item.customerID
      ) < 0
    ) {
      let monthlyDiscount = monthlyPurchaseDiscount(
        0,
        item.purchaseValue,
        0,
        month[1],
        ""
      );
      customerDataArray.push({
        [item.customerID]: { ...monthlyDiscount, cardType: item.cardName }
      });
    } else {
      let existingCustomerDetails = customerDataArray.find(
        index => Object.keys(index)[0] === item.customerID
      );
      let updatedValues = monthlyPurchaseDiscount(
        existingCustomerDetails[item.customerID].spending,
        item.purchaseValue,
        existingCustomerDetails[item.customerID].savings,
        month[1],
        existingCustomerDetails[item.customerID].discount
      );
      existingCustomerDetails[item.customerID].spending =
        updatedValues.spending;
      existingCustomerDetails[item.customerID].savings = updatedValues.savings;
      existingCustomerDetails[item.customerID].discount =
        updatedValues.discount;
    }
  });
  return customerDataArray;
};

function* getCustomerDataSaga(action) {
  try {
    const result = yield call(getCustomerDataApi);
    let customerDataArray = constructCustomerSpecificObject(result);

    //Applying annual discounts
    customerDataArray.forEach(item => {
      let objectValues = Object.values(item);
      let updatedValues = annualDiscount(
        Object.keys(item)[0].charAt(0),
        objectValues[0].cardType,
        objectValues[0].spending,
        objectValues[0].savings,
        objectValues[0].discount
      );
      item[Object.keys(item)[0]].spending = updatedValues.spending;
      item[Object.keys(item)[0]].savings = updatedValues.savings;

      //Applying annual fee
      let annualFeeValues = applyAnnualFee(
        item[Object.keys(item)[0]].spending,
        Object.keys(item)[0].charAt(0),
        item[Object.keys(item)[0]].cardType
      );
      item[Object.keys(item)[0]].spending = annualFeeValues.spending;

      //Applying Interest rate
      let valuesAfterIntRate = applyAnnualInterestRate(
        item[Object.keys(item)[0]].spending,
        Object.keys(item)[0].charAt(0),
        item[Object.keys(item)[0]].cardType
      );
      item[Object.keys(item)[0]].spending = valuesAfterIntRate.spending;
    });

    yield put({
      type: "GET_CUSTOMER_DATA_SUCCESS",
      payload: customerDataArray,
      searchParam: action.searchParam
    });
  } catch (error) {
    yield put({
      type: "GET_CUSTOMER_DATA_FAIL",
      searchParam: action.searchParam
    });
  }
}

export function* getCustomerDataWatcherSaga() {
  yield takeEvery("GET_CUSTOMER_DATA", getCustomerDataSaga);
}
