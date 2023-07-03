import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "bootstrap";
import Swal from "sweetalert2";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import "./stake.css";
import Web3Modal from "web3modal";

const Container = styled.div`
  display: flex;
  justify-content: start;
  align-items: start;
  padding: 10px;
  gap: 10px;
  flex-direction: column;
`;
const MainContainer = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: start;
  gap: 20px;
  border-radius: 5px;
  margin-top: 10px;
  flex-wrap: wrap;
  background: #1a1b1e;
  padding: 20px;
  width: 500px;
  @media (max-width: 670px) {
    width: 100%;
  }
`;
const Tenures = styled.div`
  background: #b6b6b6;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
  color: #000;
  width: 100px;
  text-align: center;
  ${({ selected }) => selected && "background-color: #ff343f; color: #fff;"}
`;
const Heading = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #b6b6b6;
`;
const SubHeading = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #778787;
`;

const BUTTON = styled.div`
  text-align: center;
  padding: 11px;
  border-radius: 5px;
  width: 150px;
  font-size: 15px;
  background: #ff343f;
  color: #fff;
  cursor: pointer;
`;
const Stake = () => {
  const [selected, setSelected] = useState(0);
  const [tenure, setTenure] = useState(0);
  const [amount, setAmount] = useState(0);
  const tenures = [1, 3, 6, 9, 12, 100];
  return (
    <>
      <div>
        <Container>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                width: "100%",
              }}
            >
              <Heading style={{ textAlign: "start" }}>
                Lock Period :{" "}
                <span>
                  {tenure === 0
                    ? "1 Month"
                    : tenure === 1
                    ? "3 Months"
                    : tenure === 2
                    ? "6 Months"
                    : tenure === 3
                    ? "9 Months"
                    : tenure === 4
                    ? "12 Months"
                    : tenure === 5
                    ? "100 Years"
                    : 0}
                </span>
              </Heading>
              <Heading>
                APY :{" "}
                <span>
                  {tenure === 0
                    ? "12%"
                    : tenure === 1
                    ? "36%"
                    : tenure === 2
                    ? "72%"
                    : tenure === 3
                    ? "108%"
                    : tenure === 4
                    ? "144%"
                    : tenure === 5
                    ? "1200%"
                    : 0}
                </span>
              </Heading>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
                gap: "10px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "start",
                  flexDirection: "column",
                }}
              >
                <MainContainer>
                  <SubHeading>Select Tenure: </SubHeading>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "start",
                      gap: "10px",
                      flexWrap: "wrap",
                      width: "100%",
                    }}
                  >
                    {tenures.map((item, index) => (
                      <>
                        <Tenures
                          selected={tenure === index}
                          onClick={() => setTenure(index)}
                        >
                          {item} {item === 100 ? "Years" : "Months"}
                        </Tenures>
                      </>
                    ))}
                  </div>
                  <hr
                    style={{
                      width: "100%",
                      height: "1px",
                      backgroundColor: "#fff",
                    }}
                  />

                  <SubHeading>Enter Amount: </SubHeading>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "start",
                      flexDirection: "column",
                      gap: "10px",
                      flexWrap: "wrap",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "start",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        width: "100%",
                      }}
                    >
                      <p>
                        Balance:{" "}
                        <span
                          style={{
                            color: "#fff",
                          }}
                        >
                          0
                        </span>
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "start",
                          width: "100%",
                          gap: "10px",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Enter Amount"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            background: "#778787",
                            border: "none",
                            outline: "none",
                            marginBottom: "10px",
                          }}
                          className="custom-input"
                        />
                        <BUTTON>Approve</BUTTON>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "start",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        width: "100%",
                      }}
                    >
                      <p>
                        Staked Balance:{" "}
                        <span
                          style={{
                            color: "#fff",
                          }}
                        >
                          0
                        </span>
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "start",
                          width: "100%",
                          gap: "10px",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Withdraw Amount"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            background: "#778787",
                            border: "none",
                            outline: "none",
                            marginBottom: "10px",
                          }}
                          className="custom-input"
                        />
                        <BUTTON>Withdraw</BUTTON>
                      </div>
                    </div>
                  </div>
                </MainContainer>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Stake;
