import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import { dataOne } from "./listingData";
import styled from "styled-components";
import { CONFIG } from "../abi/Config";
import { useSelector } from "react-redux";
import Web3 from "web3";
import NaturaAbi from "../abi/NaturaAbi.json";
import USDTAbi from "../abi/USDTAbi.json";
import SwapAbi from "../abi/SwapAbi.json";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
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
const providerOptions = {
  /* See Provider Options Section */
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
        80001: process.env.REACT_APP_ALCHEMY_TEST_KEY,
      },
    },
  },
};

const TradeTable = (props) => {
  const { currency, Listings, value } = props;
  const [account, setAccount] = useState("");
  // const web3Store = useSelector((state) => state.web3);
  const web3 = new Web3(process.env.REACT_APP_ALCHEMY_TEST_KEY);
  // ----------------------------- >
  // approving natura for contract |
  // ----------------------------- >
  const handleApproveNatura = async (item, currentAcc) => {
    console.log("approve");
    const tokenContract = CONFIG.NaturaAddress;
    const tokenContractInstance = new web3.eth.Contract(
      NaturaAbi,
      tokenContract
    );
    const AMOUNT = web3.utils.toWei(item.amountA, "ether");
    const estimateGas = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, AMOUNT)
      .estimateGas({ from: currentAcc });
    const approve = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, AMOUNT)
      .send({ from: currentAcc, gasLimit: estimateGas.toString() });
  };
  // --------------------------- >
  // approving USDT for contract |
  // --------------------------- >
  // const handleApproveUSDT = async () => {
  //   console.log("approve");
  //   const tokenContract = CONFIG.USDTAddress;
  //   const tokenContractInstance = new web3.eth.Contract(USDTAbi, tokenContract);
  //   const AMOUNT = web3.utils.toWei(amount, "lovelace");
  //   const estimateGas = await tokenContractInstance.methods
  //     .approve(CONFIG.SwapContractAddress, AMOUNT)
  //     .estimateGas({ from: web3Store.account });
  //   const approve = await tokenContractInstance.methods
  //     .approve(CONFIG.SwapContractAddress, AMOUNT)
  //     .send({ from: web3Store.account, gasLimit: estimateGas.toString() });
  // };

  const handleTransaction = async (item, currency, value) => {
    if (account === "" || account === null) {
      const web3Modal = new Web3Modal({
        providerOptions, // required
      });
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      const currentAcc = accounts[0];
      setAccount(currentAcc);
      console.log(account);
      try {
        if (value === "buy") {
          if (currency === "Natura") {
            console.log("buy");
            handleApproveNatura(item, currentAcc);
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        console.log(account);
        if (value === "buy") {
          if (currency === "Natura") {
            console.log("buy");
            handleApproveNatura(item, account);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    console.log("account", account);
  }, [account]);
  return (
    <>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Price</th>
            <th>Token</th>
            <th>Amount</th>
            <th>Listing Type</th>
            <th>Trade</th>
          </tr>
        </thead>
        {value === "buy" ? (
          currency === "Natura" ? (
            <>
              <tbody>
                {Listings.map((item) =>
                  item.orderType === "buy" ? (
                    item.tokenA === CONFIG.NaturaAddress ? (
                      <tr key={item.id}>
                        <td>{item.owner}</td>
                        <td>{item.price}</td>
                        {item.tokenA === CONFIG.NaturaAddress ? (
                          <td>Natura</td>
                        ) : (
                          <td>USDT</td>
                        )}
                        {item.tokenA === CONFIG.NaturaAddress ? (
                          <td>{web3.utils.fromWei(item.amountA, "ether")}</td>
                        ) : (
                          <td>
                            {web3.utils.fromWei(item.amountA, "lovelace")}
                          </td>
                        )}
                        <td>{item.orderType}</td>
                        <td>
                          <Button
                            onClick={() =>
                              handleTransaction(item, currency, value)
                            }
                          >
                            Buy
                          </Button>
                        </td>
                      </tr>
                    ) : null
                  ) : null
                )}
              </tbody>
            </>
          ) : currency === "USDT" ? (
            <>
              <tbody>
                {Listings.map((item) =>
                  item.orderType === "buy" ? (
                    item.tokenA === CONFIG.USDTAddress ? (
                      <tr key={item.id}>
                        <td>{item.owner}</td>
                        <td>{item.price}</td>
                        {item.tokenA === CONFIG.NaturaAddress ? (
                          <td>Natura</td>
                        ) : (
                          <td>USDT</td>
                        )}
                        {item.tokenA === CONFIG.NaturaAddress ? (
                          <td>{web3.utils.fromWei(item.amountA, "ether")}</td>
                        ) : (
                          <td>
                            {web3.utils.fromWei(item.amountA, "lovelace")}
                          </td>
                        )}
                        <td>{item.orderType}</td>
                        <td>
                          <Button
                            onClick={() =>
                              handleTransaction(item, currency, value)
                            }
                          >
                            Buy
                          </Button>
                        </td>
                      </tr>
                    ) : null
                  ) : null
                )}
              </tbody>
            </>
          ) : null
        ) : value === "sell" ? (
          currency === "Natura" ? (
            <>
              <tbody>
                {Listings.map((item) =>
                  item.orderType === "sell" ? (
                    item.tokenA === CONFIG.NaturaAddress ? (
                      <tr key={item.id}>
                        <td>{item.owner}</td>
                        <td>{item.price}</td>
                        {item.tokenA === CONFIG.NaturaAddress ? (
                          <td>Natura</td>
                        ) : (
                          <td>USDT</td>
                        )}
                        {item.tokenA === CONFIG.NaturaAddress ? (
                          <td>{web3.utils.fromWei(item.amountA, "ether")}</td>
                        ) : (
                          <td>
                            {web3.utils.fromWei(item.amountA, "lovelace")}
                          </td>
                        )}
                        <td>{item.orderType}</td>
                        <td>
                          <Button
                            onClick={() =>
                              handleTransaction(item, currency, value)
                            }
                          >
                            Sell
                          </Button>
                        </td>
                      </tr>
                    ) : null
                  ) : null
                )}
              </tbody>
            </>
          ) : currency === "USDT" ? (
            <>
              <tbody>
                {Listings.map((item) =>
                  item.orderType === "sell" ? (
                    item.tokenA === CONFIG.USDTAddress ? (
                      <tr key={item.id}>
                        <td>{item.owner}</td>
                        <td>{item.price}</td>
                        {item.tokenA === CONFIG.NaturaAddress ? (
                          <td>Natura</td>
                        ) : (
                          <td>USDT</td>
                        )}
                        {item.tokenA === CONFIG.NaturaAddress ? (
                          <td>{web3.utils.fromWei(item.amountA, "ether")}</td>
                        ) : (
                          <td>
                            {web3.utils.fromWei(item.amountA, "lovelace")}
                          </td>
                        )}
                        <td>{item.orderType}</td>
                        <td>
                          <Button
                            onClick={() =>
                              handleTransaction(item, currency, value)
                            }
                          >
                            Sell
                          </Button>
                        </td>
                      </tr>
                    ) : null
                  ) : null
                )}
              </tbody>
            </>
          ) : null
        ) : null}
      </Table>
    </>
  );
};

export default TradeTable;
