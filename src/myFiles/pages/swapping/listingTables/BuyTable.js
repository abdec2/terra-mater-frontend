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
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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

const MySwal = withReactContent(Swal);

const TradeTable = (props) => {
  const { currency, Listings, value } = props;
  console.log(Listings);
  const [currentAcc, setCurrentAcc] = useState("");
  // const web3Store = useSelector((state) => state.web3);
  const web3 = new Web3(process.env.REACT_APP_ALCHEMY_TEST_KEY);
  // ----------------------------- >
  // approving natura for contract |
  // ----------------------------- >
  const handleApproveNatura = async (finalAmount, currentAcc, web3) => {
    console.log("approve");
    const tokenContract = CONFIG.NaturaAddress;
    const tokenContractInstance = new web3.eth.Contract(
      NaturaAbi,
      tokenContract
    );
    const estimateGas = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, finalAmount)
      .estimateGas({ from: currentAcc });

    const approve = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, finalAmount)
      .send({ from: currentAcc, gasLimit: estimateGas.toString() });
  };
  // --------------------------- >
  // approving USDT for contract |
  // --------------------------- >
  const handleApproveUSDT = async (AMOUNT, currentAcc, web3) => {
    console.log("approve");
    const tokenContract = CONFIG.USDTAddress;
    const tokenContractInstance = new web3.eth.Contract(USDTAbi, tokenContract);
    const estimateGas = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, AMOUNT)
      .estimateGas({ from: currentAcc });
    const approve = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, AMOUNT)
      .send({ from: currentAcc, gasLimit: estimateGas.toString() });
  };
  // ----------------------------- >
  // Swapping with the  contract   |
  // ----------------------------- >
  const handleSwap = async (
    tokenAddress,
    tokenAbi,
    item,
    currency,
    value,
    index,
    currentAcc,
    web3
  ) => {
    try {
      const contract = new web3.eth.Contract(
        SwapAbi,
        CONFIG.SwapContractAddress
      );
      const estimateGas = await contract.methods
        .swap(index)
        .estimateGas({ from: currentAcc });
      const swap = await contract.methods
        .swap(index)
        .send({ from: currentAcc, gasLimit: estimateGas.toString() });
      console.log(swap);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Transaction Successfull",
        timer: 2000,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        timer: 2000,
      });
    }
  };

  // ----------------------------- >
  // Calling the main function    |
  // ----------------------------- >
  const handleTransaction = async (item, currency, value, index) => {
    const web3Modal = new Web3Modal({
      providerOptions, // required
    });
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const currentAcc = accounts[0];
    setCurrentAcc(currentAcc);
    console.log(currentAcc);
    try {
      if (value === "buy") {
        if (currency === "Natura") {
          const Amount = item.amountA * item.price;
          const AMOUNT = web3.utils.toWei(JSON.stringify(Amount), "lovelace");
          // console.log("AMOUNT", AMOUNT);
          // const finalAmount = web3.utils.toWei(AMOUNT, "lovelace");
          console.log("AMOUNT", AMOUNT);
          await handleApproveUSDT(AMOUNT, currentAcc, web3);
          const tokenAddress = CONFIG.USDTAddress;
          const tokenAbi = USDTAbi;
          await handleSwap(
            tokenAddress,
            tokenAbi,
            item,
            currency,
            value,
            index,
            currentAcc,
            web3
          );
        } else if (currency === "USDT") {
          const Amount = item.amountA * item.price;
          const AMOUNT = web3.utils.fromWei(JSON.stringify(Amount), "lovelace");
          console.log(AMOUNT);
          const finalAmount = web3.utils.toWei(AMOUNT, "ether");
          handleApproveNatura(finalAmount, currentAcc, web3);
        }
      } else if (value === "sell") {
        if (currency === "Natura") {
          const Amount = item.amountA * item.price;
          const AMOUNT = web3.utils.fromWei(JSON.stringify(Amount), "ether");
          console.log(AMOUNT);
          const finalAmount = web3.utils.toWei(AMOUNT, "ether");
          handleApproveNatura(finalAmount, currentAcc, web3);
        } else if (currency === "USDT") {
          const Amount = item.amountA * item.price;
          const AMOUNT = web3.utils.fromWei(JSON.stringify(Amount), "lovelace");
          console.log(AMOUNT);
          const finalAmount = web3.utils.toWei(AMOUNT, "lovelace");
          handleApproveUSDT(finalAmount, currentAcc, web3);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

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
                {Listings.map((item, index) =>
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
                        <td>{item.amountA}</td>
                        <td>Selling</td>
                        <td>
                          <Button
                            onClick={() =>
                              handleTransaction(item, currency, value, index)
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
                {Listings.map((item, index) =>
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

                        <td>{item.amountA}</td>

                        <td>Selling</td>
                        <td>
                          <Button
                            onClick={() =>
                              handleTransaction(item, currency, value, index)
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
                {Listings.map((item, index) =>
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

                        <td>{item.amountA}</td>

                        <td>Buying</td>
                        <td>
                          <Button
                            onClick={() =>
                              handleTransaction(item, currency, value, index)
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
                {Listings.map((item, index) =>
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

                        <td>{item.amountA}</td>

                        <td>Buying</td>
                        <td>
                          <Button
                            onClick={() =>
                              handleTransaction(item, currency, value, index)
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
