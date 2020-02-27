import types from './customerDataActionTypes';

export const getCustomerDataActions = (state, dispatch) => ({
    dispatch({ type: types.GET_CUSTOMER_DATA })
});