import React from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import { dataTwo } from "./listingData";
import styled from "styled-components";

const Button = styled.button`
  background: #ff343f;
  color: #fff;
  border: none;
  padding: 8px 30px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  :hover {
    box-shadow: 0px 0px 10px #ff343f;
    transition: 0.3s;
  }
`;

const SellTable = (props) => {
  const { currency } = props;
  return (
    <>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Advertiser</th>
            <th>Price</th>
            <th>Limit/Available</th>
            <th>Payment Method</th>
            <th>Trade</th>
          </tr>
        </thead>
        {currency === "USDT" ? (
          <>
            {dataTwo.usdtList.map((data) => (
              <>
                <tbody>
                  <tr>
                    <td>{data.advertisor}</td>
                    <td>{data.price}</td>
                    <td>{data.limit}</td>
                    <td>{data.paymentMethod}</td>
                    <td>
                      <Button>Sell</Button>
                    </td>
                  </tr>
                </tbody>
              </>
            ))}
          </>
        ) : (
          <>
            {dataTwo.naturaList.map((data) => (
              <>
                <tbody>
                  <tr>
                    <td>{data.advertisor}</td>
                    <td>{data.price}</td>
                    <td>{data.limit}</td>
                    <td>{data.paymentMethod}</td>
                    <td>
                      <Button>Sell</Button>
                    </td>
                  </tr>
                </tbody>
              </>
            ))}
          </>
        )}
      </Table>
    </>
  );
};

export default SellTable;
