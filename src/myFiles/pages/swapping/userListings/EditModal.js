import React, { useState } from "react";
import styled from "styled-components";
import { RxCross1 } from "react-icons/rx";
import Dropdown from "react-bootstrap/Dropdown";
import { CONFIG } from "../abi/Config";
import SwapAbi from "../abi/SwapAbi.json";
import NaturaAbi from "../abi/NaturaAbi.json";
import USDTAbi from "../abi/USDTAbi.json";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const Modal = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  left: 0;
  right: 0;
  /* margin: 0 auto; */
  top: 0;
  /* bottom: 0; */
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
`;
const Modal_inner = styled.div`
  background-color: black;
  margin: 0 auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid gray;
  width: 45%; /* Could be more or less, depending on screen size */
  border-radius: 10px;
  @media (max-width: 768px) {
    width: 90%;
    background-color: black;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    border-radius: 10px;
  }
`;
const Modal_header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  //   height: 30px;
  border-bottom: 1px solid #878787;
`;
const Heading = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 5px;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
const Modal_body = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  width: 100%;
  .row {
    display: flex;
     .inner_row {
        display: flex;
        flex-direction: column;
        gap: 10px;
    button {
      background: #ff343f;
      border-radius: 5px;
      border: none;
      margin-top: 10px;
      margin-bottom: 10px;
        padding: 10px;
        color: #fff;
        transition: 0.3s;
        :hover { 
            box-shadow: 2px 2px 20px 0px #ff343f;
  transition: 0.3s;
        }
    }
  }
`;
const Modal_form = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 40px;
  input {
    padding: 10px;
    border-radius: 5px;
    border: none;
    background: #1c1c1c;
    color: #fff;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  label {
    font-size: 0.8rem;
    color: #fff;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  button {
    background: #ff343f;
    border-radius: 5px;
    border: none;
    padding: 10px;
    color: #fff;
    margin-top: 10px;
    margin-bottom: 10px;
    transition: 0.3s;
    :hover {
      box-shadow: 2px 2px 20px 0px #ff343f;
      transition: 0.3s;
    }
  }
`;
const MySwal = withReactContent(Swal);
const EditModal = (props) => {
  const {
    setOpenModal,
    updateData,
    provider,
    currentAcc,
    currenctIndex,
    setRefetch,
    setIsLoading,
  } = props;
  const [listingType, setListingType] = useState("");
  const [selectedTokenOne, setSelectedTokenOne] = useState("Select your Token");
  const [selectedTokenTwo, setSelectedTokenTwo] = useState("Select your Token");
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const closeModal = () => {
    setOpenModal(false);
  };
  const ChoseListingType = (props) => {
    setListingType(props);
  };
  const handleTokenSelection = (token) => {
    setSelectedTokenOne(token);
  };
  const handleTokenSelectionTwo = (token) => {
    setSelectedTokenTwo(token);
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="dropdown-toggle"
    >
      {children}
      &#x25bc;
    </a>
  ));
  const handleApproveNatura = async (updatedAMOUNT, currentAcc, provider) => {
    console.log("approve");
    const tokenContract = CONFIG.NaturaAddress;
    const tokenContractInstance = new provider.eth.Contract(
      NaturaAbi,
      tokenContract
    );
    const estimateGas = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, updatedAMOUNT)
      .estimateGas({ from: currentAcc });

    const approve = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, updatedAMOUNT)
      .send({ from: currentAcc, gasLimit: estimateGas.toString() });
  };
  // --------------------------- >
  // approving USDT for contract |
  // --------------------------- >
  const handleApproveUSDT = async (updatedAMOUNT, currentAcc, provider) => {
    console.log("approve");
    const tokenContract = CONFIG.USDTAddress;
    const tokenContractInstance = new provider.eth.Contract(
      USDTAbi,
      tokenContract
    );
    const estimateGas = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, updatedAMOUNT)
      .estimateGas({ from: currentAcc });
    const approve = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, updatedAMOUNT)
      .send({ from: currentAcc, gasLimit: estimateGas.toString() });
  };
  // --------------------------- >
  // order update function       |
  // --------------------------- >
  const UpdateOrder = async (AMOUNT, PRICE) => {
    const contract = new provider.eth.Contract(
      SwapAbi,
      CONFIG.SwapContractAddress
    );
    const estimateGas = await contract.methods
      .updateOrder(currenctIndex, AMOUNT, PRICE)
      .estimateGas({ from: currentAcc });
    const update = await contract.methods
      .updateOrder(currenctIndex, AMOUNT, PRICE)
      .send({ from: currentAcc, gasLimit: estimateGas.toString() });
  };
  // --------------------------- >
  // order update caller function|
  // --------------------------- >
  const edit = async () => {
    console.log("edit");

    if (parseInt(updateData.status) === 1) {
      if (updateData.orderType === "sell") {
        if (updateData.tokenA === CONFIG.NaturaAddress) {
          const AMOUNT =
            amount === 0 || amount === "" || amount === null
              ? updateData.amountA
              : provider.utils.toWei(amount.toString(), "ether");

          const PRICE =
            price === 0 || price === "" || price === null
              ? updateData.price
              : provider.utils.toWei(price.toString(), "lovelace");

          if (parseInt(AMOUNT) > parseInt(updateData.amountA)) {
            try {
              setIsLoading(true);
              setOpenModal(false);
              const updatedamount = AMOUNT - updateData.amountA;
              const updatedAMOUNT = JSON.stringify(updatedamount);
              console.log("updatedAMOUNT", updatedAMOUNT);
              await handleApproveNatura(updatedAMOUNT, currentAcc, provider);
              await UpdateOrder(AMOUNT, PRICE);
              setRefetch(true);
              setIsLoading(false);
              MySwal.fire({
                icon: "success",
                title: "Your order has been updated",
                showConfirmButton: false,
                timer: 1500,
              });
              setAmount(0);
              setPrice(0);
            } catch (error) {
              console.log(error);
              setIsLoading(false);
              MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          } else {
            try {
              setIsLoading(true);
              setOpenModal(false);
              await UpdateOrder(AMOUNT, PRICE);
              setRefetch(true);
              setIsLoading(false);
              MySwal.fire({
                icon: "success",
                title: "Your order has been updated",
                showConfirmButton: false,
                timer: 1500,
              });
              setAmount(0);
              setPrice(0);
            } catch (error) {
              console.log(error);
              setIsLoading(false);
              MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          }
        } else {
          const AMOUNT =
            amount === 0 || amount === "" || amount === null
              ? updateData.amountA
              : provider.utils.toWei(amount.toString(), "lovelace");

          const PRICE =
            price === 0 || price === "" || price === null
              ? updateData.price
              : provider.utils.toWei(price.toString(), "ether");
          if (parseInt(AMOUNT) > parseInt(updateData.amountA)) {
            try {
              setIsLoading(true);
              setOpenModal(false);
              const updatedamount = AMOUNT - updateData.amountA;
              const updatedAMOUNT = JSON.stringify(updatedamount);
              await handleApproveUSDT(updatedAMOUNT, currentAcc, provider);
              await UpdateOrder(AMOUNT, PRICE);
              setRefetch(true);
              setIsLoading(false);
              MySwal.fire({
                icon: "success",
                title: "Your order has been updated",
                showConfirmButton: false,
                timer: 1500,
              });
              setAmount(0);
              setPrice(0);
            } catch (error) {
              console.log(error);
              setIsLoading(false);
              MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          } else {
            try {
              setIsLoading(true);
              setOpenModal(false);
              await UpdateOrder(AMOUNT, PRICE);
              setRefetch(true);
              setIsLoading(false);
              MySwal.fire({
                icon: "success",
                title: "Your order has been updated",
                showConfirmButton: false,
                timer: 1500,
              });
              setAmount(0);
              setPrice(0);
            } catch (error) {
              console.log(error);
              setIsLoading(false);
              MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          }
        }
      } else {
        if (updateData.tokenA === CONFIG.NaturaAddress) {
          const AMOUNT =
            amount === 0 || amount === "" || amount === null
              ? updateData.amountA
              : provider.utils.toWei(amount.toString(), "ether");

          const PRICE =
            price === 0 || price === "" || price === null
              ? updateData.price
              : provider.utils.toWei(price.toString(), "lovelace");

          console.log("here");
          console.log("AMOUNT", AMOUNT);
          console.log("PRICE", PRICE);
          console.log("updateData.amountA", updateData.amountA);
          if (parseInt(AMOUNT) > parseInt(updateData.amountA)) {
            try {
              setIsLoading(true);
              setOpenModal(false);
              const updatedamount =
                parseInt(AMOUNT) - parseInt(updateData.amountA);
              console.log("updatedamount", updatedamount);
              const updatedAMOUNT = JSON.stringify(updatedamount);
              await handleApproveNatura(updatedAMOUNT, currentAcc, provider);
              await UpdateOrder(AMOUNT, PRICE);
              setRefetch(true);
              setIsLoading(false);
              MySwal.fire({
                icon: "success",
                title: "Your order has been updated",
                showConfirmButton: false,
                timer: 1500,
              });
              setAmount(0);
              setPrice(0);
            } catch (error) {
              console.log(error);
              setIsLoading(false);
              MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          } else {
            try {
              console.log("here");
              console.log("AMOUNT", AMOUNT);
              console.log("PRICE", PRICE);
              setIsLoading(true);
              setOpenModal(false);
              await UpdateOrder(AMOUNT, PRICE);
              setRefetch(true);
              setIsLoading(false);
              MySwal.fire({
                icon: "success",
                title: "Your order has been updated",
                showConfirmButton: false,
                timer: 1500,
              });
              setAmount(0);
              setPrice(0);
            } catch (error) {
              console.log(error);
              setIsLoading(false);
              MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          }
        } else {
          const AMOUNT =
            amount === 0 || amount === "" || amount === null
              ? updateData.amountA
              : provider.utils.toWei(amount.toString(), "lovelace");

          const PRICE =
            price === 0 || price === "" || price === null
              ? updateData.price
              : provider.utils.toWei(price.toString(), "ether");
          console.log("here");
          console.log("AMOUNT", typeof AMOUNT);
          console.log("PRICE", typeof PRICE);
          console.log("updateData.amountA", typeof updateData.amountA);
          if (parseInt(AMOUNT) > parseInt(updateData.amountA)) {
            console.log("here in if", AMOUNT > updateData.amountA);

            try {
              setIsLoading(true);
              setOpenModal(false);
              const updatedamount =
                parseInt(AMOUNT) - parseInt(updateData.amountA);
              const updatedAMOUNT = JSON.stringify(updatedamount);
              await handleApproveUSDT(updatedAMOUNT, currentAcc, provider);
              await UpdateOrder(AMOUNT, PRICE);
              setRefetch(true);
              setIsLoading(false);
              MySwal.fire({
                icon: "success",
                title: "Your order has been updated",
                showConfirmButton: false,
                timer: 1500,
              });
              setAmount(0);
              setPrice(0);
            } catch (error) {
              console.log(error);
              setIsLoading(false);
              MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          } else {
            console.log("here in else", AMOUNT < updateData.amountA);
            try {
              console.log("here in other");
              setIsLoading(true);
              setOpenModal(false);
              await UpdateOrder(AMOUNT, PRICE);
              setRefetch(true);
              setIsLoading(false);
              MySwal.fire({
                icon: "success",
                title: "Your order has been updated",
                showConfirmButton: false,
                timer: 1500,
              });
              setAmount(0);
              setPrice(0);
            } catch (error) {
              console.log(error);
              setIsLoading(false);
              MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          }
        }
      }
    }
  };
  return (
    <>
      <Modal>
        <Modal_inner>
          <Modal_header>
            <Heading>Edit Listing</Heading>
            <RxCross1
              size="20px"
              color="white"
              cursor="pointer"
              onClick={closeModal}
            />
          </Modal_header>
          <Modal_body>
            <Modal_form>
              <label>Update price*</label>
              <input
                type="text"
                placeholder={
                  updateData.tokenA === CONFIG.USDTAddress &&
                  updateData.orderType === "sell"
                    ? provider.utils.fromWei(updateData.price, "ether") + " NAT"
                    : updateData.tokenA === CONFIG.NaturaAddress &&
                      updateData.orderType === "sell"
                    ? provider.utils.fromWei(updateData.price, "lovelace") +
                      " USDT"
                    : updateData.orderType === "buy" &&
                      updateData.tokenA === CONFIG.USDTAddress
                    ? provider.utils.fromWei(updateData.price, "ether") + " NAT"
                    : updateData.orderType === "buy" &&
                      updateData.tokenA === CONFIG.NaturaAddress
                    ? provider.utils.fromWei(updateData.price, "lovelace") +
                      " USDT"
                    : null
                }
                onChange={(e) => setPrice(e.target.value)}
              />

              <label>Update quantity*</label>
              <input
                type="text"
                placeholder={
                  updateData.orderType === "sell" &&
                  updateData.tokenA === CONFIG.USDTAddress
                    ? provider.utils.fromWei(updateData.amountA, "lovelace") +
                      " USDT"
                    : updateData.orderType === "sell" &&
                      updateData.tokenA === CONFIG.NaturaAddress
                    ? provider.utils.fromWei(updateData.amountA, "ether") +
                      " NAT"
                    : updateData.orderType === "buy" &&
                      updateData.tokenA === CONFIG.USDTAddress
                    ? provider.utils.fromWei(updateData.amountA, "lovelace") +
                      " USDT"
                    : updateData.orderType === "buy" &&
                      updateData.tokenA === CONFIG.NaturaAddress
                    ? provider.utils.fromWei(updateData.amountA, "ether") +
                      " NAT"
                    : null
                }
                onChange={(e) => setAmount(e.target.value)}
              />
              <br />
              <button onClick={() => edit()}>Update</button>
            </Modal_form>
          </Modal_body>
        </Modal_inner>
      </Modal>
    </>
  );
};

export default EditModal;
