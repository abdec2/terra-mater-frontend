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
// import Web3Modal from "web3modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LoadingScreen from "../../stakingNFT/loadingScreen";

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

// const providerOptions = {
//   /* See Provider Options Section */
//   walletconnect: {
//     package: WalletConnectProvider, // required
//     options: {
//       rpc: {
//         137: process.env.REACT_APP_ALCHEMY_KEY,
//       },
//     },
//   },
// };

const MySwal = withReactContent(Swal);

const TradeTable = (props) => {
  const { currency, Listings, value, setRefetch, setIsLoading } = props;
  console.log(Listings);

  const [currentAcc, setCurrentAcc] = useState(null);
  const [provider, setProvider] = useState(null);
  // const web3Store = useSelector((state) => state.web3);
  const web3 = new Web3(process.env.REACT_APP_ALCHEMY_KEY);
  const [BuyNatura, setBuyNatura] = useState([]);
  const [SellNatura, setSellNatura] = useState([]);
  const [BuyUSDT, setBuyUSDT] = useState([]);
  const [SellUSDT, setSellUSDT] = useState([]);

  useEffect(() => {
    function sortUSDTByPriceBuy() {
      let newArray = Listings.map((item, index) => {
        return {
          ...item,
          index: index,
        };
      }).filter(
        (item) =>
          item.orderType === "buy" &&
          item.status !== "0" &&
          item.status !== "2" &&
          item.tokenA === CONFIG.NaturaAddress
      );
      newArray.sort((a, b) => {
        return (
          web3.utils.fromWei(a.price.toString(), "lovelace") -
          web3.utils.fromWei(b.price.toString(), "lovelace")
        );
      });
      console.log("b", newArray);
      setBuyUSDT(newArray);
    }
    function sortNaturaByPriceBuy() {
      let newArray = Listings.map((item, index) => {
        return {
          ...item,
          index: index,
        };
      }).filter(
        (item) =>
          item.orderType === "buy" &&
          item.status !== "0" &&
          item.status !== "2" &&
          item.tokenA === CONFIG.USDTAddress
      );
      newArray.sort((a, b) => {
        return (
          web3.utils.fromWei(a.price.toString(), "ether") -
          web3.utils.fromWei(b.price.toString(), "ether")
        );
      });
      console.log("b", newArray);
      setBuyNatura(newArray);
    }
    function sortNaturaByPriceSell() {
      let newArray = Listings.map((item, index) => {
        return {
          ...item,
          index: index,
        };
      }).filter(
        (item) =>
          item.orderType === "sell" &&
          item.status !== "0" &&
          item.status !== "2" &&
          item.tokenA === CONFIG.NaturaAddress
      );
      newArray.sort((a, b) => {
        return (
          web3.utils.fromWei(a.price.toString(), "lovelace") -
          web3.utils.fromWei(b.price.toString(), "lovelace")
        );
      });
      console.log("b", newArray);
      setSellNatura(newArray);
    }
    function sortUSDTByPriceSell() {
      let newArray = Listings.map((item, index) => {
        return {
          ...item,
          index: index,
        };
      }).filter(
        (item) =>
          item.orderType === "sell" &&
          item.status !== "0" &&
          item.status !== "2" &&
          item.tokenA === CONFIG.USDTAddress
      );
      newArray.sort((a, b) => {
        return (
          web3.utils.fromWei(a.price.toString(), "ether") -
          web3.utils.fromWei(b.price.toString(), "ether")
        );
      });
      console.log("b", newArray);
      setSellUSDT(newArray);
    }

    sortUSDTByPriceBuy();
    sortNaturaByPriceBuy();
    sortNaturaByPriceSell();
    sortUSDTByPriceSell();
  }, [Listings]);
  // ----------------------------- >
  // approving natura for contract |
  // ----------------------------- >
  const handleApproveNatura = async (AMOUNT, currentAcc, web3) => {
    console.log("approve");
    const tokenContract = CONFIG.NaturaAddress;
    const tokenContractInstance = new web3.eth.Contract(
      NaturaAbi,
      tokenContract
    );
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
  const handleSwap = async (reversedIndex, currentAcc, web3) => {
    try {
      console.log(reversedIndex);
      const contract = new web3.eth.Contract(
        SwapAbi,
        CONFIG.SwapContractAddress
      );
      const estimateGas = await contract.methods
        .swap(reversedIndex)
        .estimateGas({ from: currentAcc });
      const swap = await contract.methods
        .swap(reversedIndex)
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
  const handleTransaction = async (item, currency, value, reversedIndex) => {
    // if (currentAcc === null || currentAcc === "") {
    //   const web3Modal = new Web3Modal({
    //     providerOptions, // required
    //   });
    //   const provider = await web3Modal.connect();
    //   const web3 = new Web3(provider);
    //   const accounts = await web3.eth.getAccounts();
    //   console.log(accounts);
    //   const currentAcc = accounts[0];
    //   setCurrentAcc(currentAcc);
    //   setProvider(web3);

    //   return;
    // }
    // console.log(currentAcc);
    // const network = await provider.eth.getChainId();
    // if (network.toString() !== CONFIG.Chain_Id) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Please connect to Polygon mumbai network",
    //     timer: 2000,
    //   });
    //   return;
    // }
    // try {
    //   setIsLoading(true);
    //   if (value === "buy") {
    //     if (currency === "Natura") {
    //       const AMOUNT =
    //         web3.utils.fromWei(item.amountA.toString(), "ether") * item.price;
    //       console.log("AMOUNT", AMOUNT);
    //       // const AMOUNT = web3.utils.toWei(JSON.stringify(Amount), "lovelace");
    //       // console.log("AMOUNT", AMOUNT);
    //       // const finalAmount = web3.utils.toWei(AMOUNT, "lovelace");
    //       // console.log("AMOUNT", AMOUNT);
    //       await handleApproveUSDT(AMOUNT, currentAcc, provider);
    //       await handleSwap(reversedIndex, currentAcc, provider);
    //     } else if (currency === "USDT") {
    //       console.log(item.price);
    //       console.log(item.amountA);
    //       const AMOUNT = JSON.stringify(
    //         web3.utils.fromWei(item.price.toString(), "lovelace") * item.amountA
    //       );
    //       console.log(AMOUNT);
    //       // const finalAmount = web3.utils.toWei(AMOUNT, "ether");
    //       await handleApproveNatura(AMOUNT, currentAcc, provider);
    //       const tokenAddress = CONFIG.NaturaAddress;
    //       const tokenAbi = NaturaAbi;
    //       await handleSwap(reversedIndex, currentAcc, provider);
    //     }
    //   } else if (value === "sell") {
    //     if (currency === "Natura") {
    //       // console.log(item.amountA);
    //       // console.log(item.price);
    //       console.log(item.amountA);
    //       console.log(item.price);
    //       const AMOUNT = JSON.stringify(
    //         web3.utils.fromWei(item.amountA.toString(), "lovelace") * item.price
    //       );

    //       // const finalAmount = web3.utils.toWei(AMOUNT, "ether");
    //       await handleApproveNatura(AMOUNT, currentAcc, provider);
    //       const tokenAddress = CONFIG.NaturaAddress;
    //       const tokenAbi = NaturaAbi;
    //       await handleSwap(reversedIndex, currentAcc, provider);
    //     } else if (currency === "USDT") {
    //       const AMOUNT = JSON.stringify(
    //         web3.utils.fromWei(item.amountA.toString(), "ether") * item.price
    //       );
    //       console.log(AMOUNT);
    //       // const finalAmount = web3.utils.toWei(AMOUNT, "lovelace");
    //       await handleApproveUSDT(AMOUNT, currentAcc, provider);
    //       const tokenAddress = CONFIG.USDTAddress;
    //       const tokenAbi = USDTAbi;
    //       await handleSwap(reversedIndex, currentAcc, provider);
    //     }
    //   }
    //   setRefetch(true);
    //   setIsLoading(false);
    // } catch (error) {
    //   console.log(error);
    //   setIsLoading(false);
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Something went wrong!",
    //     timer: 2000,
    //   });
    // }
  };
  const calculatePrice = (item) => {
    if (value === "buy") {
      if (currency === "Natura") {
        console.log(item.price);
        const AMOUNT = web3.utils.fromWei(item.price, "lovelace");
        console.log(AMOUNT);
        const PRICE = web3.utils.fromWei(item.price, "ether");
        // const plateformFee = AMOUNT * 0.05;
        // const amountToTransfer = AMOUNT - plateformFee;
        // const am = amountToTransfer;
        return AMOUNT;
      } else if (currency === "USDT") {
        const AMOUNT = web3.utils.fromWei(item.amountA, "lovelace");
        const PRICE = web3.utils.fromWei(item.price, "ether");
        // const Burnfee = AMOUNT * 0.04;
        // const amountToTransfer = AMOUNT - Burnfee;
        // const am = amountToTransfer * PRICE;
        return AMOUNT;
      }
    }
  };
  const calculateAmount = (item) => {
    if (value === "buy") {
      if (currency === "Natura") {
        const AMOUNT = web3.utils.fromWei(item.amountA, "ether");
        // const PRICE = web3.utils.fromWei(item.price, "lovelace");
        const Burnfee = AMOUNT * 0.04;
        const amountToTransfer = AMOUNT - Burnfee;
        const am = amountToTransfer;
        return am;
      } else if (currency === "USDT") {
        const AMOUNT = web3.utils.fromWei(item.amountA, "lovelace");
        //const PRICE = web3.utils.fromWei(item.price, "ether");
        const Burnfee = AMOUNT * 0.04;
        const amountToTransfer = AMOUNT - Burnfee;
        const am = amountToTransfer;
        return am;
      }
    }
  };
  const calculateTotal = (item) => {
    if (value === "sell") {
      if (currency === "Natura") {
        const AMOUNT = web3.utils.fromWei(item.amountA, "ether");
        const PRICE = web3.utils.fromWei(item.price, "lovelace");
        const Burnfee = AMOUNT * 0.04;
        const amountToTransfer = AMOUNT - Burnfee;
        const am = amountToTransfer * PRICE;
        return am;
      } else {
        if (currency === "USDT") {
          const AMOUNT = web3.utils.fromWei(item.amountA, "lovelace");
          const PRICE = web3.utils.fromWei(item.price, "ether");
          const PlateformFee = AMOUNT * 0.04;
          const amountToTransfer = AMOUNT - PlateformFee;
          const am = amountToTransfer * PRICE;
          return am;
        }
      }
    } else {
      if (currency === "Natura") {
        const AMOUNT = web3.utils.fromWei(item.amountA, "ether");
        console.log(AMOUNT);
        const PRICE = web3.utils.fromWei(item.price, "lovelace");
        console.log(PRICE);
        const Burnfee = AMOUNT * 0.04;
        console.log(Burnfee);
        const amountToTransfer = AMOUNT - Burnfee;
        console.log(amountToTransfer);
        const am = amountToTransfer * PRICE;
        return am;
      } else {
        if (currency === "USDT") {
          const AMOUNT = web3.utils.fromWei(item.amountA, "lovelace");
          const PRICE = web3.utils.fromWei(item.price, "ether");
          const BurnFee = AMOUNT * 0.04;
          const amountToTransfer = AMOUNT - BurnFee;
          const am = amountToTransfer;
          return am;
        }
      }
    }
  };
  return (
    <>
      <Table responsive className="text-center">
        <thead>
          <tr style={{background: 'black'}}>
            <th className="text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Owner</th>
            <th className="text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Price/Token</th>
            <th className="text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Token</th>
            {value === "buy" ? (
              <th className="text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>On-Sale</th>
            ) : (
              <th className="text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Purchasing</th>
            )}
            {value === "buy" ? (
              <th className="text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Purchasing</th>
            ) : (
              <th className="text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>On-Sale</th>
            )}
            <th className="text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Trade</th>
          </tr>
        </thead>
        {value === "buy" ? (
          currency === "Natura" ? (
            <>
              <tbody>
                {SellNatura?.map((item, index) => {
                  //const reversedIndex = Listings.length - 1 - index;
                  return item.orderType === "sell" ? (
                    item.tokenA.toLowerCase() ===
                      CONFIG.NaturaAddress.toLowerCase() &&
                    parseInt(item.status) !== 0 &&
                    parseInt(item.status) !== 2 ? (
                      <tr key={index} style={{background: 'black'}}>
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>
                          {item.owner.slice(0, 5) +
                            "...." +
                            item.owner.slice(37, 42)}
                        </td>
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>{`${web3.utils.fromWei(
                          item.price,
                          "mwei"
                        )} USDT`}</td>
                        {item.tokenA.toLowerCase() ===
                        CONFIG.NaturaAddress.toLowerCase() ? (
                          <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Natura</td>
                        ) : (
                          <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>USDT</td>
                        )}
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>{`${web3.utils.fromWei(
                          item.amountA,
                          "ether"
                        )} NAT`}</td>
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>{`${
                          parseFloat(web3.utils.fromWei(item.price, "mwei")) *
                          parseFloat(web3.utils.fromWei(item.amountA, "ether"))
                        } USDT`}</td>
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>
                          <Button
                            onClick={() =>
                              handleTransaction(
                                item,
                                currency,
                                value,
                                item.index
                              )
                            }
                          >
                            {currentAcc === "" || currentAcc === null
                              ? "Connect Wallet"
                              : "Trade"}
                          </Button>
                        </td>
                      </tr>
                    ) : null
                  ) : null;
                })}
              </tbody>
            </>
          ) : currency === "USDT" ? (
            <>
              <tbody>
                {SellUSDT?.map((item, index) => {
                  //const reversedIndex = Listings.length - 1 - index;
                  return item.orderType === "sell" ? (
                    item.tokenA.toLowerCase() ===
                      CONFIG.USDTAddress.toLowerCase() &&
                    parseInt(item.status) !== 0 &&
                    parseInt(item.status) !== 2 ? (
                      <tr key={index} style={{background: 'black'}}>
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>
                          {item.owner.slice(0, 5) +
                            "...." +
                            item.owner.slice(37, 42)}
                        </td>
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>{web3.utils.fromWei(item.price, "ether")} NAT</td>
                        {item.tokenA === CONFIG.NaturaAddress ? (
                          <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Natura</td>
                        ) : (
                          <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>USDT</td>
                        )}

                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>{web3.utils.fromWei(item.amountA, "mwei")} USDT</td>

                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>{`${
                          parseFloat(web3.utils.fromWei(item.price, "ether")) *
                          parseFloat(web3.utils.fromWei(item.amountA, "mwei"))
                        } NAT`}</td>
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>
                          <Button
                            onClick={() =>
                              handleTransaction(
                                item,
                                currency,
                                value,
                                item.index
                              )
                            }
                          >
                            {currentAcc === "" || currentAcc === null
                              ? "Connect Wallet"
                              : "Trade"}
                          </Button>
                        </td>
                      </tr>
                    ) : null
                  ) : null;
                })}
              </tbody>
            </>
          ) : null
        ) : value === "sell" ? (
          currency === "USDT" ? (
            <>
              <tbody>
                {BuyUSDT?.map((item, index) => {
                  const reversedIndex = Listings.length - 1 - index;
                  return item.orderType === "buy" ? (
                    item.tokenA.toLowerCase() ===
                      CONFIG.NaturaAddress.toLowerCase() &&
                    parseInt(item.status) !== 0 &&
                    parseInt(item.status) !== 2 ? (
                      <tr key={index} style={{background: 'black'}}>
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>
                          {item.owner.slice(0, 5) +
                            "...." +
                            item.owner.slice(37, 42)}
                        </td>
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>
                          {web3.utils.fromWei(item.price, "lovelace")} USDT
                        </td>
                        {item.tokenA.toLowerCase() ===
                        CONFIG.NaturaAddress.toLowerCase() ? (
                          <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>USDT</td>
                        ) : (
                          <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Natura</td>
                        )}

                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>
                          {parseFloat(web3.utils.fromWei(item.price, "ether")) *
                            parseFloat(
                              web3.utils.fromWei(item.amountA, "mwei")
                            )}{" "}
                          USDT
                        </td>

                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>{web3.utils.fromWei(item.amountA, "ether")} NAT</td>
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>
                          <Button
                            onClick={() =>
                              handleTransaction(
                                item,
                                currency,
                                value,
                                item.index
                              )
                            }
                          >
                            {currentAcc === "" || currentAcc === null
                              ? "Connect Wallet"
                              : "Trade"}
                          </Button>
                        </td>
                      </tr>
                    ) : null
                  ) : null;
                })}
              </tbody>
            </>
          ) : currency === "Natura" ? (
            <>
              <tbody>
                {BuyNatura?.map((item, index) => {
                  //const reversedIndex = Listings.length - 1 - index;
                  return item.orderType === "buy" ? (
                    item.tokenA.toLowerCase() ===
                      CONFIG.USDTAddress.toLowerCase() &&
                    parseInt(item.status) !== 0 &&
                    parseInt(item.status) !== 2 ? (
                      <tr key={index} style={{background: 'black'}}>
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>
                          {item.owner.slice(0, 5) +
                            "...." +
                            item.owner.slice(37, 42)}
                        </td>
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>{web3.utils.fromWei(item.price, "ether")} NAT</td>
                        {item.tokenA.toLowerCase() ===
                        CONFIG.NaturaAddress.toLowerCase() ? (
                          <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>USDT</td>
                        ) : (
                          <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Natura</td>
                        )}

                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>
                          {parseFloat(web3.utils.fromWei(item.price, "ether")) *
                            parseFloat(
                              web3.utils.fromWei(item.amountA, "mwei")
                            )}{" "}
                          NAT
                        </td>
                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>
                          {/* checking if wrong */}
                          {web3.utils.fromWei(item.amountA, "mwei")} {" "}
                          USDT
                        </td>

                        <td style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>
                          <Button
                            onClick={() =>
                              handleTransaction(
                                item,
                                currency,
                                value,
                                item.index
                              )
                            }
                          >
                            {currentAcc === "" || currentAcc === null
                              ? "Connect Wallet"
                              : "Trade"}
                          </Button>
                        </td>
                      </tr>
                    ) : null
                  ) : null;
                })}
              </tbody>
            </>
          ) : null
        ) : null}
      </Table>
    </>
  );
};

export default TradeTable;
