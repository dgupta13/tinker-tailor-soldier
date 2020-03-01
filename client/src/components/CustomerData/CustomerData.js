import React, { useCallback, useEffect } from "react";
import { useDispatch, useMappedState } from "redux-react-hook";
import {
  StyledTable,
  StyledHeader,
  StyledRow,
  StyledTd
} from "./CustomerData.style";

const CustomerData = () => {
  const mapState = useCallback(
    state => ({
      loading: state.customerData.loading,
      customerData: state.customerData.customerData,
      hasError: state.customerData.hasError
    }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const { loading, customerData, hasError } = useMappedState(mapState);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "GET_CUSTOMER_DATA" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    !loading &&
    !hasError && (
      <StyledTable>
        <tbody>
          <StyledRow>
            <StyledHeader>Customer Name</StyledHeader>
            <StyledHeader>Total spending</StyledHeader>
            <StyledHeader>Total annual savings</StyledHeader>
            <StyledHeader>Discount Eligible</StyledHeader>
          </StyledRow>
          {customerData &&
            customerData.length > 0 &&
            customerData.map(item => (
              <StyledRow key={Object.keys(item)[0]}>
                <StyledTd>{Object.keys(item)[0]}</StyledTd>
                <StyledTd>{Object.values(item)[0].spending}</StyledTd>
                <StyledTd>{Object.values(item)[0].savings}</StyledTd>
                <StyledTd>{Object.values(item)[0].discount}</StyledTd>
              </StyledRow>
            ))}
        </tbody>
      </StyledTable>
    )
  );
};

export default CustomerData;
