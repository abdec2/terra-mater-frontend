import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import { dataOne } from "../listingTables/listingData";
import styled from "styled-components";
import EditModal from "./EditModal";
import useFetchUserData from "../hooks/useFetchUserData";
import { CONFIG } from "../abi/Config";
import { useSelector } from "react-redux";
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

const UserTable = (props) => {
  const { currency, account, userListings } = props;
  const [OpenModal, setOpenModal] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const [loading, setLoading] = useState(true);
  const web3Store = useSelector((state) => state.web3);
  const web3 = web3Store.web3;
  const modalHandle = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    console.log(userListings.length);
    if (userListings.length > 0) {
      setLoading(false);
    }
  }, [userListings]);
  return (
    <>
      {OpenModal ? <EditModal setOpenModal={setOpenModal} /> : null}
      <Table responsive hover>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Price</th>
            <th>Token</th>
            <th>Amount</th>
            <th>Listing Type</th>
            {/* <th>Edit</th> */}
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
              {userListings.map(
                (item, index) => (
                  <>
                    <tbody>
                      <tr key={index}>
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
                        {/* <td>
                          <Button onClick={modalHandle}>Edit</Button>
                        </td> */}
                      </tr>
                    </tbody>
                  </>
                )

                // <>
                //   <tbody>
                //     <tr>
                //       <td>{data.advertisor}</td>
                //       <td>{data.price}</td>
                //       <td>{data.limit}</td>
                //       <td>{data.paymentMethod}</td>
                //       <td>
                //         <Button onClick={modalHandle}>Edit</Button>
                //       </td>
                //     </tr>
                //   </tbody>
                // </>
              )}{" "}
            </>
          )}
        </>
      </Table>
    </>
  );
};

export default UserTable;
