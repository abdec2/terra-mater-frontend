import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "bootstrap";
import Swal from "sweetalert2";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import Web3Modal from "web3modal";

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
  background: #1a1b1e;
`;
const Heading = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #b6b6b6;
`;
const RewardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  padding: 10px;
  border-radius: 5px;
  width: 300px;
  flex-direction: column;
  background: #515959;
  margin-bottom: 10px;
`;
const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  width: 1220px;
  background-color: #ff343f,
  margin: 10px 10px;
  @media (max-width: 1220px) {
    width: 100%;
  }
`;
const SubHeading = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #ff343f;
`;
const Paragraph = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #fff;
`;
const Rewards = () => {
  const rewardsTenure = [
    {
      id: 1,
      name: "1 Month",
      subTitle: "Rewards Earned: 0.00 NAT",
      subTitle2: "Stake Amount: 0.00 NAT",
    },
    {
      id: 3,
      name: "3 Months",
      subTitle: "Rewards Earned: 0.00 NAT",
      subTitle2: "Stake Amount: 0.00 NAT",
    },
    {
      id: 6,
      name: "6 Months",
      subTitle: "Rewards Earned: 0.00 NAT",
      subTitle2: "Stake Amount: 0.00 NAT",
    },
    {
      id: 9,
      name: "9 Months",
      subTitle: "Rewards Earned: 0.00 NAT",
      subTitle2: "Stake Amount: 0.00 NAT",
    },
    {
      id: 12,
      name: "12 Months",
      subTitle: "Rewards Earned: 0.00 NAT",
      subTitle2: "Stake Amount: 0.00 NAT",
    },
    {
      id: 100,
      name: "100 Years",
      subTitle: "Rewards Earned: 0.00 NAT",
      subTitle2: "Stake Amount: 0.00 NAT",
    },
  ];
  return (
    <>
      <Container>
        <Heading>CLAIMABLE AFTER TENURE COMPLETION</Heading>
        <MainContainer>
          {rewardsTenure.map((item) => (
            <RewardContainer key={item.id}>
              <SubHeading>{item.name}</SubHeading>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#ff343f",
                  margin: "10px 10px",
                }}
              />
              <Paragraph
                style={{
                  color: "#fff",
                }}
              >
                {item.subTitle}
              </Paragraph>
              <Paragraph
                style={{
                  color: "#fff",
                }}
              >
                {item.subTitle2}
              </Paragraph>
            </RewardContainer>
          ))}
        </MainContainer>
      </Container>
    </>
  );
};

export default Rewards;
