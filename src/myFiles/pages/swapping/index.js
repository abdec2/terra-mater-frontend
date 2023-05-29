import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { StyledHeader } from "../../../components/Styles";
import Footer from "../../../components/components/footer";
import Switch from "./switch";
import ListingModal from "./ListingModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDispatch, useSelector } from "react-redux";
import BuyTable from "./listingTables/BuyTable";
import Dropdown from "react-bootstrap/Dropdown";
import SellTable from "./listingTables/SellTable";
import UserTable from "./userListings";
import useFetchUserData from "./hooks/useFetchUserData";
import useFetchListings from "./hooks/useFetchAllListings";
import { reconnectWallet } from "../../../components/menu/connectWallet";
import TradeTable from "./listingTables/BuyTable";
const Container_header = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`;
const CurrencyOptions = styled.div`
  display: flex;
  gap: 10px;
  cursor: pointer;
  margin-left: 20px;
`;
const CurrencyOption = styled.div`
  padding: 10px;
  border-radius: 5px;
  :hover {
    background: #ff343f;
    color: #fff;
  }
  ${({ selected }) => selected && "background-color: #ff343f; color: #fff;"}
`;
const ListingBtn = styled.div`
  cursor: pointer;
`;
const HighlightedHeading = styled.div`
  cursor: pointer;
  :hover {
    color: #ff343f;
  }
`;
const Contained = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.5px solid #1a1b1e;
  height: 70px;
  flex-wrap: nowrap;
  @media (max-width: 500px) {
    flex-wrap: wrap;
    height: 100px;
    justify-content: start;
    padding-left: 20px;
    padding-right: 20px;
  }
`;
const theme = "GREY"; //LIGHT, GREY, RETRO
const Swapping = () => {
  const dispatch = useDispatch();
  const [account, setAccount] = useState("");
  const [currency, setCurrency] = useState("USDT");
  const [value, setValue] = useState("buy");
  const [modal, setModal] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const [condition, setCondition] = useState("buy");
  const web3Store = useSelector((state) => state.web3);
  const web3 = web3Store.web3;
  const selectCurrency = (props) => {
    setCurrency(props);
  };

  const { userListings } = useFetchUserData(account, refetch, setRefetch);
  const { Listings } = useFetchListings();

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
  useEffect(() => {
    if (typeof web3Store.account === "string") {
      setAccount(web3Store.account);
    }
  }, [web3Store.account, account]);
  useFetchUserData(account);
  const OpenModal = () => {
    if (!account) {
      Swal.fire({
        title: "Please login to create listing",
        icon: "warning",
        background: "#000",
      });
    } else {
      setModal(true);
    }
  };

  return (
    <div className="greyscheme">
      <StyledHeader theme={theme} />
      {modal ? (
        <ListingModal
          setModal={setModal}
          account={account}
          setRefetch={setRefetch}
        />
      ) : null}
      <section
        id="profile_banner"
        className="jumbotron breadcumb "
        style={{ background: 'url("./img/background/6.jpg")' }}
      >
        <div className="mainbreadcumb">
          <h1 className="text-center">Swap your tokens</h1>
        </div>
      </section>
      <section className="container-fluid d_coll no-top no-bottom pb-5 mb-5">
        <div className="row">
          <div className="col-md-12">
            <Contained className="mx-2 mx-md-5">
              <Container_header>
                <Switch value={value} setValue={setValue} />
                <CurrencyOptions>
                  <CurrencyOption
                    selected={currency === "USDT"}
                    onClick={() => selectCurrency("USDT")}
                  >
                    USDT
                  </CurrencyOption>
                  <CurrencyOption
                    selected={currency === "Natura"}
                    onClick={() => selectCurrency("Natura")}
                  >
                    Natura
                  </CurrencyOption>
                </CurrencyOptions>
              </Container_header>
              <div>
                {!account ? (
                  <HighlightedHeading
                    className="text-center"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => reconnectWallet(dispatch)}
                  >
                    Connect your wallet to create listings
                  </HighlightedHeading>
                ) : (
                  <>
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
                        Manage your listings
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <ListingBtn onClick={OpenModal}>
                            Create your own listing
                          </ListingBtn>
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setCondition("userListings")}
                        >
                          Your Listings
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setCondition("buy")}>
                          Back
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                )}
              </div>
            </Contained>
            {condition === "buy" ? (
              <div className="mx-2 mx-md-5 mt-4">
                <TradeTable
                  currency={currency}
                  Listings={Listings}
                  value={value}
                />
              </div>
            ) : condition === "userListings" ? (
              <>
                <div className="mx-2 mx-md-5 mt-4">
                  <UserTable
                    currency={currency}
                    account={account}
                    userListings={userListings}
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Swapping;
