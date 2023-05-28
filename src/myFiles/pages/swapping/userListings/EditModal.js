import React, { useState } from "react";
import styled from "styled-components";
import { RxCross1 } from "react-icons/rx";
import Dropdown from "react-bootstrap/Dropdown";

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
const EditModal = (props) => {
  const { setOpenModal } = props;
  const [listingType, setListingType] = useState("");
  const [selectedTokenOne, setSelectedTokenOne] = useState("Select your Token");
  const [selectedTokenTwo, setSelectedTokenTwo] = useState("Select your Token");
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
                    Enter the amount at which you want your single token to be
                    sold at
                  </label>
                  <input type="text" placeholder="Enter the amount" />
                  <label>Enter the amount of tokens you want to sell</label>
                  <input type="text" placeholder="Enter the amount" />

                  <button>
                    <span>Edit listing</span>
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
                      {selectedTokenTwo}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => handleTokenSelectionTwo("Natura")}
                      >
                        Natura
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleTokenSelectionTwo("USDT")}
                      >
                        USDT
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <label>
                    Enter your preferred price at which you want to buy the
                    token
                  </label>
                  <input type="text" placeholder="Enter the amount" />
                  <label>Enter the amount of tokens you want to buy</label>
                  <input type="text" placeholder="Enter the amount" />

                  <button>
                    <span>Edit listing</span>
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

export default EditModal;
