import React, {useEffect} from 'react';
import {StyledTable, StyledHeader, StyledRow} from './CustomerData.style';

const CustomerData = () => {
    useEffect(() => {

      }, []);
    return (<StyledTable>
    <StyledHeader>Customer Name</StyledHeader>
    <StyledHeader>Total spending</StyledHeader>
    <StyledHeader>Total annual savings</StyledHeader>
    <StyledHeader>Eligible discounts</StyledHeader></StyledTable>);
};

export default CustomerData;