import React, { useState, useEffect } from "react";
import { CONFIG } from "../abi/Config";
import NaturaAbi from "../abi/NaturaAbi.json";
import SwapAbi from "../abi/SwapAbi.json";
import USDTAbi from "../abi/USDTAbi.json";

import { useSelector } from "react-redux";
import axios from "axios";
import Web3 from "web3";

const useFetchUserData = (account, refetch, setRefetch) => {
  const web3 = new Web3(process.env.REACT_APP_ALCHEMY_TEST_KEY);
  const [userListings, setUserListings] = useState([]);
  const [userData, setUserData] = useState([]);

  // const web3Store = useSelector((state) => state.web3);
  // const web3 = web3Store.web3;
  const loadData = async () => {
    if (account) {
      if (refetch) {
        const contract = new web3.eth.Contract(
          SwapAbi,
          CONFIG.SwapContractAddress
        );
        // call the ordersCount function from the smart contract
        const resp = await contract.methods.getOrderByUser(account).call();
        setUserListings(resp);
        setRefetch(false);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [account, refetch]);

  return { userListings };
};

export default useFetchUserData;
