const initialState = {
  customerData: [],
  loading: false,
  hasError: false
};

export const customerDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CUSTOMER_DATA":
      return {
        ...state,
        loading: true
      };
    case "GET_CUSTOMER_DATA_SUCCESS":
      return {
        ...state,
        customerData: action.payload,
        loading: false
      };
    case "GET_CUSTOMER_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        hasError: true
      };
    default:
      return {
        ...state
      };
  }
};
