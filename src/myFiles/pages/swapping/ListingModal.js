import React, { useState } from "react";
import styled from "styled-components";
import { RxCross1 } from "react-icons/rx";
import Dropdown from "react-bootstrap/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { CONFIG } from "./abi/Config";
import NaturaAbi from "./abi/NaturaAbi.json";
import USDTAbi from "./abi/USDTAbi.json";
import SwapAbi from "./abi/SwapAbi.json";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useFetchUserData from "./hooks/useFetchUserData";

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
const ListingModal = (props) => {
  const dispatch = useDispatch();
  const web3Store = useSelector((state) => state.web3);
  const web3 = web3Store.web3;
  const { setModal, account, setRefetch } = props;
  const [listingType, setListingType] = useState("");
  const [selectedTokenOne, setSelectedTokenOne] = useState("Select your Token");
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const closeModal = () => {
    setModal(false);
  };
  const ChoseListingType = (props) => {
    setListingType(props);
  };
  const handleTokenSelection = (token) => {
    setSelectedTokenOne(token);
  };
  const handleChange = (e) => {
    setPrice(e.target.value);
    console.log(amount);
  };
  const handleAmount = (e) => {
    setAmount(e.target.value);
    console.log(price);
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
  // ----------------------------- >
  // approving natura for contract |
  // ----------------------------- >
  const handleApproveNatura = async () => {
    console.log("approve");
    const tokenContract = CONFIG.NaturaAddress;
    const tokenContractInstance = new web3.eth.Contract(
      NaturaAbi,
      tokenContract
    );
    const AMOUNT = web3.utils.toWei(amount, "ether");
    const estimateGas = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, AMOUNT)
      .estimateGas({ from: web3Store.account });
    const approve = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, AMOUNT)
      .send({ from: web3Store.account, gasLimit: estimateGas.toString() });
  };
  // --------------------------- >
  // approving USDT for contract |
  // --------------------------- >
  const handleApproveUSDT = async () => {
    console.log("approve");
    const tokenContract = CONFIG.USDTAddress;
    const tokenContractInstance = new web3.eth.Contract(USDTAbi, tokenContract);
    const AMOUNT = web3.utils.toWei(amount, "lovelace");
    const estimateGas = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, AMOUNT)
      .estimateGas({ from: web3Store.account });
    const approve = await tokenContractInstance.methods
      .approve(CONFIG.SwapContractAddress, AMOUNT)
      .send({ from: web3Store.account, gasLimit: estimateGas.toString() });
  };
  // ---------------- >
  // creating listing |
  // ---------------- >
  const CreateListing = async () => {
    let tokenA;
    if (listingType === "sell") {
      tokenA =
        selectedTokenOne === "Natura"
          ? CONFIG.NaturaAddress
          : CONFIG.USDTAddress;
    } else {
      tokenA =
        selectedTokenOne === "USDT" ? CONFIG.NaturaAddress : CONFIG.USDTAddress;
    }
    const tokenContract = CONFIG.SwapContractAddress;
    const tokenContractInstance = new web3.eth.Contract(SwapAbi, tokenContract);
    // const AMOUNT =
    //   tokenA === CONFIG.NaturaAddress
    //     ? web3.utils.toWei(amount, "ether")
    //     : web3.utils.toWei(amount, "lovelace");
    console.log(amount);
    const estimateGas = await tokenContractInstance.methods
      .createOrder(tokenA, amount, price, listingType.toString())
      .estimateGas({ from: web3Store.account });
    const createOrder = await tokenContractInstance.methods
      .createOrder(tokenA, amount, price, listingType.toString())
      .send({ from: web3Store.account, gasLimit: estimateGas.toString() });
    console.log(createOrder);
  };
  // ---------------------------------- >
  // calling approve and create listing |
  // ---------------------------------- >
  const handleCreateListing = async () => {
    console.log("create listing");

    try {
      if (listingType === "sell") {
        if (selectedTokenOne === "Natura") {
          console.log("natura");
          await handleApproveNatura();
          await CreateListing();
        } else {
          console.log("usdt");
          await handleApproveUSDT();
          await CreateListing();
        }
      } else if (listingType === "buy") {
        if (selectedTokenOne === "Natura") {
          await handleApproveUSDT();
          await CreateListing();
        } else {
          await handleApproveNatura();
          await CreateListing();
        }
      }
      setRefetch(true);
      MySwal.fire({
        title: "Success!",
        text: "You have created a listing",
        icon: "success",
      });
      setModal(false);
      setListingType("");
      setSelectedTokenOne("Select your Token");
      setAmount(0);
      setPrice(0);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(listingType);
  useFetchUserData(account);
  return (
    <>
      <Modal>
        <Modal_inner>
          <Modal_header>
            <Heading>Create Listing</Heading>
            <RxCross1
              size="20px"
              color="white"
              cursor="pointer"
              onClick={closeModal}
            />
          </Modal_header>
          <Modal_body>
            <div className="row">
              <div className="inner_row">
                <label>Please Chose in between</label>
                <button onClick={() => ChoseListingType("sell")}>
                  Sell Token
                </button>
                <button onClick={() => ChoseListingType("buy")}>
                  Buy Token
                </button>
              </div>
            </div>
            {listingType === "sell" ? (
              <>
                <Modal_form>
                  <label>Select which token you want to sell</label>
                  <Dropdown
                    style={{
                      width: "100%",
                    }}
                  >
                    <Dropdown.Toggle
                      as={CustomToggle}
                      variant="success"
                      id="dropdown-basic"
                    >
                      {selectedTokenOne}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => handleTokenSelection("Natura")}
                      >
                        Natura
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleTokenSelection("USDT")}
                      >
                        USDT
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <label>
                    Enter the price at which you want your single token to be
                    sold at{" "}
                    {selectedTokenOne === "Natura"
                      ? "in USDT"
                      : selectedTokenOne === "USDT"
                      ? "in Natura"
                      : null}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      selectedTokenOne === "Natura"
                        ? "Enter the price in USDT"
                        : selectedTokenOne === "USDT"
                        ? "Enter the price in Natura"
                        : "Enter the price"
                    }
                    onChange={handleChange}
                    value={price}
                  />
                  <label>Enter the amount of tokens you want to sell</label>
                  <input
                    type="text"
                    placeholder="Enter the amount"
                    onChange={handleAmount}
                    value={amount}
                  />

                  <button onClick={handleCreateListing}>
                    <span>Create Listing</span>
                  </button>
                </Modal_form>
              </>
            ) : listingType === "buy" ? (
              <>
                <Modal_form>
                  <label>Select which token you want to buy</label>
                  <Dropdown
                    style={{
                      width: "100%",
                    }}
                  >
                    <Dropdown.Toggle
                      as={CustomToggle}
                      variant="success"
                      id="dropdown-basic"
                    >
                      {selectedTokenOne}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => handleTokenSelection("Natura")}
                      >
                        Natura
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleTokenSelection("USDT")}
                      >
                        USDT
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <label>
                    Enter your price you want to pay per token{" "}
                    {selectedTokenOne === "Natura"
                      ? "in USDT"
                      : selectedTokenOne === "USDT"
                      ? "in Natura"
                      : null}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      selectedTokenOne === "Natura"
                        ? "Enter the amount in USDT"
                        : selectedTokenOne === "USDT"
                        ? "Enter the amount in Natura"
                        : "Enter the amount"
                    }
                    onChange={handleChange}
                    value={price}
                  />
                  <label>Enter the amount of tokens you want to buy</label>
                  <input
                    type="text"
                    placeholder="Enter the amount"
                    onChange={handleAmount}
                    value={amount}
                  />

                  <button onClick={handleCreateListing}>
                    <span>Create Listing</span>
                  </button>
                </Modal_form>
              </>
            ) : null}
          </Modal_body>
        </Modal_inner>
      </Modal>
    </>
  );
};

export default ListingModal;
