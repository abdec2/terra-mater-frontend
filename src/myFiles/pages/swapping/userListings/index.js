import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import { dataOne } from "../listingTables/listingData";
import styled from "styled-components";
import EditModal from "./EditModal";
import useFetchUserData from "../hooks/useFetchUserData";
import { CONFIG } from "../abi/Config";
import { useSelector } from "react-redux";
import SwapAbi from "../abi/SwapAbi.json";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Web3 from "web3";
const Button = styled.button`
  background: #ff343f;
  color: #fff;
  border: none;
  padding: 2px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  :hover {
    box-shadow: 0px 0px 10px #ff343f;
    transition: 0.3s;
  }
`;
const MySwal = withReactContent(Swal);
const UserTable = (props) => {
  const { currency, currentAcc, Listings, setRefetch, setIsLoading, provider } =
    props;
  const web3 = new Web3(process.env.REACT_APP_ALCHEMY_KEY);
  const [OpenModal, setOpenModal] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [loading, setLoading] = useState(false);
  const [currenctIndex, setCurrentIndex] = useState();
  const modalHandle = (item, reversedIndex) => {
    setOpenModal(true);
    setUpdateData(item);
    console.log(item);
  };

  useEffect(() => {
    if (Listings.length > 0) {
      setLoading(false);
    }
    [...Listings]?.reverse().map((item, index) => {
      const reversedIndex = Listings.length - 1 - index;
      // 21 - 1  - 0 = 20
      // 21 - 1  - 1 = 19
      // 21 - 1  - 2 = 18
      // 21 - 1  - 3 = 17
      // .....
      console.log(reversedIndex);
    });
  }, [Listings]);
  // const filteredListings = [...Listings];
  // // .filter(
  // //   (item) =>
  // //     item.orderType === "sell" &&
  // //     item.tokenA.toLowerCase() === CONFIG.NaturaAddress.toLowerCase() &&
  // //     parseInt(item.status) !== 0 &&
  // //     parseInt(item.status) !== 2
  // // )
  // // .sort((a, b) => {
  // //   const priceA =
  // //     a.tokenA.toLowerCase() === CONFIG.NaturaAddress.toLowerCase()
  // //       ? parseFloat(web3.utils.fromWei(a.price, "ether"))
  // //       : parseFloat(web3.utils.fromWei(a.price, "mwei"));

  // //   const amountA =
  // //     a.tokenA.toLowerCase() === CONFIG.NaturaAddress.toLowerCase()
  // //       ? parseFloat(web3.utils.fromWei(a.amountA, "ether"))
  // //       : parseFloat(web3.utils.fromWei(a.amountA, "mwei"));

  // //   const totalValueA = priceA * amountA;

  // //   const priceB =
  // //     b.tokenA.toLowerCase() === CONFIG.NaturaAddress.toLowerCase()
  // //       ? parseFloat(web3.utils.fromWei(b.price, "ether"))
  // //       : parseFloat(web3.utils.fromWei(b.price, "mwei"));

  // //   const amountB =
  // //     b.tokenA.toLowerCase() === CONFIG.NaturaAddress.toLowerCase()
  // //       ? parseFloat(web3.utils.fromWei(b.amountA, "ether"))
  // //       : parseFloat(web3.utils.fromWei(b.amountA, "mwei"));

  // //   const totalValueB = priceB * amountB;

  // //   return totalValueA - totalValueB;
  // // })
  // // .reverse();
  const cancel = async (item, index) => {
    if (parseInt(item.status) === 1) {
      try {
        setIsLoading(true);
        console.log(index);
        const contract = new provider.eth.Contract(
          SwapAbi,
          CONFIG.SwapContractAddress
        );
        const estimateGas = await contract.methods
          .cancelOrder(index)
          .estimateGas({
            from: currentAcc,
          });
        const data = await contract.methods.cancelOrder(index).send({
          from: currentAcc,
          gasLimit: estimateGas.toString(),
        });
        console.log(data);
        MySwal.fire({
          title: "Cancelled!",
          text: "Your order has been cancelled.",
          icon: "success",
        });
        setRefetch(true);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        MySwal.fire({
          title: "Error!",
          text: "Something went wrong.",
          icon: "error",
        });
        setIsLoading(false);
      }
    } else if (parseInt(item.status) === 2) {
      MySwal.fire({
        title: "Already Cancelled!",
        text: "You have already cancelled this order.",
        icon: "warning",
      });
    }
  };
  return (
    <>
      {OpenModal ? (
        <EditModal
          setOpenModal={setOpenModal}
          updateData={updateData}
          provider={provider}
          currentAcc={currentAcc}
          currenctIndex={currenctIndex}
          setRefetch={setRefetch}
          setIsLoading={setIsLoading}
        />
      ) : null}
      <Table responsive>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Price/Token</th>
            <th>Token</th>
            <th>Amount</th>
            <th>Listing Type</th>
            <th>Edit / Cancel</th>
          </tr>
        </thead>
        <>
          {loading ? (
            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                Loading...
              </td>
            </tr>
          ) : (
            <>
              {[...Listings]?.reverse().map((item, index) => {
                const reversedIndex = Listings.length - 1 - index;
                return parseInt(item.status) !== 0 &&
                  item.owner === currentAcc &&
                  parseInt(item.status) !== 2 ? (
                  <>
                    <tbody>
                      <tr key={index}>
                        <td>{item.owner}</td>

                        {item.tokenA === CONFIG.NaturaAddress ? (
                          <td>
                            {web3.utils.fromWei(item.price, "lovelace")} USDT
                          </td>
                        ) : (
                          <td>{web3.utils.fromWei(item.price, "ether")} NAT</td>
                        )}
                        {item.orderType === "sell" ? (
                          <>
                            {item.tokenA === CONFIG.NaturaAddress ? (
                              <td>Natura</td>
                            ) : (
                              <td>USDT</td>
                            )}
                          </>
                        ) : (
                          <>
                            {item.tokenA === CONFIG.NaturaAddress ? (
                              <td>Natura</td>
                            ) : (
                              <td>USDT</td>
                            )}
                          </>
                        )}
                        {item.tokenA === CONFIG.NaturaAddress ? (
                          <td>{web3.utils.fromWei(item.amountA, "ether")}</td>
                        ) : (
                          <td>
                            {web3.utils.fromWei(item.amountA, "lovelace")}{" "}
                          </td>
                        )}
                        <td>{item.orderType}</td>
                        <td>
                          <Button
                            onClick={() => {
                              modalHandle(item, reversedIndex);
                              setCurrentIndex(reversedIndex);
                            }}
                          >
                            Edit
                          </Button>{" "}
                          <span
                            style={{
                              color: "#ff343f",
                            }}
                          >
                            &#124;
                          </span>{" "}
                          <Button onClick={() => cancel(item, reversedIndex)}>
                            Cancel
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </>
                ) : null;
              })}{" "}
            </>
          )}
        </>
      </Table>
    </>
  );
};

export default UserTable;
