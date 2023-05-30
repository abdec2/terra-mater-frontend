import React from "react";
import Accordion from "react-bootstrap/Accordion";
import styled from "styled-components";
import "./accordion.css";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const ContainerInner = styled.div`
  width: 93%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 500px) {
    width: 95%;
  }
`;
const Heading = styled.div`
  font-size: 35px;
  font-weight: 600;
  color: #fff;
  @media (max-width: 500px) {
    font-size: 20px;
  }
`;
const Faq = () => {
  const data = [
    {
      Question: "What is an NFT marketplace?",
      Answer:
        "An NFT marketplace is an online platform where you can buy, sell, and trade non-fungible tokens (NFTs). These marketplaces typically operate on a blockchain network and provide a secure way to buy and sell NFTs.",
    },
    {
      Question: "What are NFTs?",
      Answer:
        "NFTs are unique digital assets that are stored on a blockchain network. They are typically used to represent ownership of digital content, such as artwork, music, videos, and other types of digital media.",
    },
    {
      Question: "How do I buy NFTs?",
      Answer:
        "To buy NFTs, you need to create an account on an NFT marketplace and link it to a compatible cryptocurrency wallet. Once you have added funds to your wallet, you can browse the marketplace and purchase NFTs using cryptocurrency.",
    },
    {
      Question: "Can I sell my own NFTs on a marketplace?",
      Answer:
        "Yes, most NFT marketplaces allow users to sell their own NFTs. You will need to create an account and follow the platform's guidelines for listing your NFTs. ",
    },
    {
      Question: "What is the difference between NFTs and cryptocurrencies?",
      Answer:
        " NFTs and cryptocurrencies are both digital assets that are stored on a blockchain network, but they serve different purposes. NFTs are unique digital assets that represent ownership of digital content, while cryptocurrencies are used as a means of exchange or store of value.",
    },
    {
      Question: "Are NFTs a good investment?",
      Answer:
        "Like any investment, there is always a level of risk involved. The value of NFTs can be volatile and unpredictable, and it is important to do your research and understand the market before investing.",
    },
    {
      Question: "What happens after I buy an NFT?",
      Answer:
        "After you purchase an NFT, it will be transferred to your cryptocurrency wallet. You will then have ownership of the NFT and can choose to keep it, trade it, or sell it on a marketplace.",
    },
    {
      Question: "Can NFTs be stolen?",
      Answer:
        "NFTs are stored on a blockchain network, which provides a high level of security. However, it is still important to take precautions to protect your digital assets, such as using a secure wallet and enabling two-factor authentication.",
    },
    {
      Question: "How does NFT staking work?",
      Answer:
        "NFT staking works by depositing your NFTs into a staking smart contract. The smart contract then holds your NFTs for a specified period of time, during which you will earn rewards for staking your NFTs.",
    },
  ];
  return (
    <>
      <Container>
        <Heading>Frequently Asked Questions</Heading>
        <ContainerInner className="mt-5">
          {data.map((item, index) => (
            <Accordion key={index} className="accordion-item">
              <Accordion.Item eventKey={`${index}`}>
                <Accordion.Header>{item.Question}</Accordion.Header>
                <Accordion.Body>{item.Answer}</Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))}
        </ContainerInner>
      </Container>
    </>
  );
};

export default Faq;
