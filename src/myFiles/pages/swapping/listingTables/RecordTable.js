import React, { useEffect } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import { dataTwo } from "./listingData";
import styled from "styled-components";
import { CONFIG } from "../abi/Config";
import Web3 from "web3";

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

const RecordTable = (props) => {
  const { currency, Listings, value, setRefetch, setIsLoading, filterType } =
    props;
  const web3 = new Web3(process.env.REACT_APP_ALCHEMY_KEY);
  useEffect(() => {}, [Listings]);
  return (
    <>
      <Table responsive className="text-center">
        <thead>
          <tr>
            <th className="text-center">Owner</th>
            <th className="text-center">Token</th>
            <th className="text-center">Listing Type</th>
            <th className="text-center">Price/Token</th>
            <th className="text-center">Amount</th>
            <th className="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {filterType === "all" ? (
            [...Listings]?.reverse().map((item, index) => {
              return parseInt(item.status) !== 1 ? (
                <tr key={index}>
                  <td>
                    {" "}
                    {item.owner.slice(0, 5) + "...." + item.owner.slice(37, 42)}
                  </td>
                  <td>{item.tokenA === CONFIG.USDTAddress ? "USDT" : "NAT"}</td>
                  <td>{item.orderType === "sell" ? "Selling" : "Buying"}</td>
                  <td>
                    {item.tokenA === CONFIG.USDTAddress &&
                    item.orderType === "sell"
                      ? web3.utils.fromWei(item.price, "ether") + " NAT"
                      : item.tokenA === CONFIG.NaturaAddress &&
                        item.orderType === "sell"
                      ? web3.utils.fromWei(item.price, "lovelace") + " USDT"
                      : item.orderType === "buy" &&
                        item.tokenA === CONFIG.USDTAddress
                      ? web3.utils.fromWei(item.price, "ether") + " NAT"
                      : item.orderType === "buy" &&
                        item.tokenA === CONFIG.NaturaAddress
                      ? web3.utils.fromWei(item.price, "lovelace") + " USDT"
                      : null}
                  </td>
                  <td>
                    {item.tokenA === CONFIG.USDTAddress &&
                    item.orderType === "sell"
                      ? web3.utils.fromWei(item.amountA, "lovelace") + " USDT"
                      : item.tokenA === CONFIG.NaturaAddress &&
                        item.orderType === "sell"
                      ? web3.utils.fromWei(item.amountA, "ether") + " NAT"
                      : item.orderType === "buy" &&
                        item.tokenA === CONFIG.USDTAddress
                      ? web3.utils.fromWei(item.amountA, "lovelace") + " USDT"
                      : item.orderType === "buy" &&
                        item.tokenA === CONFIG.NaturaAddress
                      ? web3.utils.fromWei(item.amountA, "ether") + " NAT"
                      : null}
                  </td>
                  {item.status === "0" ? (
                    <td
                      style={{
                        color: "green",
                      }}
                    >
                      {" "}
                      Successful{" "}
                    </td>
                  ) : item.status === "2" ? (
                    <td
                      style={{
                        color: "red",
                      }}
                    >
                      Cancelled
                    </td>
                  ) : null}
                </tr>
              ) : null;
            })
          ) : filterType === "cancelled" ? (
            [...Listings]?.reverse().map((item, index) => {
              return parseInt(item.status) === 2 ? (
                <>
                  <tr key={index}>
                    <td>
                      {" "}
                      {item.owner.slice(0, 5) +
                        "...." +
                        item.owner.slice(37, 42)}
                    </td>
                    <td>
                      {item.tokenA === CONFIG.USDTAddress ? "USDT" : "NAT"}
                    </td>
                    <td>{item.orderType === "sell" ? "Selling" : "Buying"}</td>
                    <td>
                      {item.tokenA === CONFIG.USDTAddress &&
                      item.orderType === "sell"
                        ? web3.utils.fromWei(item.price, "ether") + " NAT"
                        : item.tokenA === CONFIG.NaturaAddress &&
                          item.orderType === "sell"
                        ? web3.utils.fromWei(item.price, "lovelace") + " USDT"
                        : item.orderType === "buy" &&
                          item.tokenA === CONFIG.USDTAddress
                        ? web3.utils.fromWei(item.price, "ether") + " NAT"
                        : item.orderType === "buy" &&
                          item.tokenA === CONFIG.NaturaAddress
                        ? web3.utils.fromWei(item.price, "lovelace") + " USDT"
                        : null}
                    </td>
                    <td>
                      {item.tokenA === CONFIG.USDTAddress &&
                      item.orderType === "sell"
                        ? web3.utils.fromWei(item.amountA, "lovelace") + " USDT"
                        : item.tokenA === CONFIG.NaturaAddress &&
                          item.orderType === "sell"
                        ? web3.utils.fromWei(item.amountA, "ether") + " NAT"
                        : item.orderType === "buy" &&
                          item.tokenA === CONFIG.USDTAddress
                        ? web3.utils.fromWei(item.amountA, "ether") + " NAT"
                        : item.orderType === "buy" &&
                          item.tokenA === CONFIG.NaturaAddress
                        ? web3.utils.fromWei(item.amountA, "ether") + " USDT"
                        : null}
                    </td>
                    {item.status === "0" ? (
                      <td
                        style={{
                          color: "green",
                        }}
                      >
                        {" "}
                        Successful{" "}
                      </td>
                    ) : item.status === "2" ? (
                      <td
                        style={{
                          color: "red",
                        }}
                      >
                        Cancelled
                      </td>
                    ) : null}
                  </tr>
                </>
              ) : null;
            })
          ) : filterType === "successful" ? (
            <>
              {[...Listings]?.reverse().map((item, index) => {
                return parseInt(item.status) === 0 ? (
                  <>
                    <tr key={index}>
                      <td>
                        {" "}
                        {item.owner.slice(0, 5) +
                          "...." +
                          item.owner.slice(37, 42)}
                      </td>
                      <td>
                        {item.tokenA === CONFIG.USDTAddress ? "USDT" : "NAT"}
                      </td>
                      <td>
                        {item.orderType === "sell" ? "Selling" : "Buying"}
                      </td>
                      <td>
                        {item.tokenA === CONFIG.USDTAddress &&
                        item.orderType === "sell"
                          ? web3.utils.fromWei(item.price, "ether") + " NAT"
                          : item.tokenA === CONFIG.NaturaAddress &&
                            item.orderType === "sell"
                          ? web3.utils.fromWei(item.price, "lovelace") + " USDT"
                          : item.orderType === "buy" &&
                            item.tokenA === CONFIG.USDTAddress
                          ? web3.utils.fromWei(item.price, "ether") + " NAT"
                          : item.orderType === "buy" &&
                            item.tokenA === CONFIG.NaturaAddress
                          ? web3.utils.fromWei(item.price, "lovelace") + " USDT"
                          : null}
                      </td>
                      <td>
                        {item.tokenA === CONFIG.USDTAddress &&
                        item.orderType === "sell"
                          ? web3.utils.fromWei(item.amountA, "lovelace") +
                            " USDT"
                          : item.tokenA === CONFIG.NaturaAddress &&
                            item.orderType === "sell"
                          ? web3.utils.fromWei(item.amountA, "ether") + " NAT"
                          : item.orderType === "buy" &&
                            item.tokenA === CONFIG.USDTAddress
                          ? web3.utils.fromWei(item.amountA, "ether") + " NAT"
                          : item.orderType === "buy" &&
                            item.tokenA === CONFIG.NaturaAddress
                          ? web3.utils.fromWei(item.amountA, "ether") + " USDT"
                          : null}
                      </td>
                      {item.status === "0" ? (
                        <td
                          style={{
                            color: "green",
                          }}
                        >
                          {" "}
                          Successful{" "}
                        </td>
                      ) : item.status === "2" ? (
                        <td
                          style={{
                            color: "red",
                          }}
                        >
                          Cancelled
                        </td>
                      ) : null}
                    </tr>
                  </>
                ) : null;
              })}
            </>
          ) : null}
        </tbody>
      </Table>
    </>
  );
};

export default RecordTable;
