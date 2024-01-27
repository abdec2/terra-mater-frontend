// import WalletConnectProvider from "@walletconnect/web3-provider";

// export const providerOptions = {
//     /* See Provider Options Section */
//     walletconnect: {
//       package: WalletConnectProvider, // required
//       options: {
//         rpc: {
//           137: process.env.REACT_APP_ALCHEMY_KEY
//         }
//       }
//     }
// };

export const CONFIG = {
  USDT_ADDRESS: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  MARKETPLACE_ADDRESS: "0x39614596930AF7218F755B0CCEf454632BDe4EAA", //0x1542042e57EdfcF25C4853aDD2D93278C88CbAe7 old contract
  NATURA_TOKEN_ADDRESS: "0x011b00704cC46819e9C6f356Cb3759C230d2bcf4",
  STAKING_ADDRESS: "0x714fD0312D5eFF351Cf0B60cF215604CB2859E1d",
  Swapping_Contract: "0x16424Af0C67915708f7bde86B04A45e920a2BBeE", //0x24fC4A50aBFF949Ad837283Bb78cD64Db761530b
  HELPER_CONTRACT: "0xa0E6075533C0461AF1342ad093C48316DBc2D75d",
  CHAIN_ID: 137,
  CHAIN_ID_HEX: "0x89",
  CHAIN_FOR_MORALIS: "polygon",
  NETWORK: "Polygon Mainnet",
  BLOCKCHAIN_EXPLORER: "https://polygonscan.com/",
  CONTACT_EMAIL: "info@terramaternfts.com",
};

// export const CONFIG = {
//   USDT_ADDRESS: '0x0950D64525706842a16c5BD73c14F38fBd610c9B',
//   MARKETPLACE_ADDRESS: '0xcb6c0d13efd873252A71EA3CC87aEd118C843f9b',
//   NATURA_TOKEN_ADDRESS: '0x1Bf5cf1b2BcF4b916edDD0D66c4D95a731b29961',
//   STAKING_ADDRESS: '0x0037687d4B834dDCa364a3CDBa6612c9948583Ad',
//   CHAIN_ID: 80001,
//   CHAIN_ID_HEX: '0x13881',
//   CHAIN_FOR_MORALIS: 'mumbai',
//   NETWORK: 'Mumbai Testnet',
//   BLOCKCHAIN_EXPLORER: 'https://mumbai.polygonscan.com/',
//   CONTACT_EMAIL: 'info@terramaternfts.com'
// }

export const STAKE_NFT_CONTRACTS = [
  {
    pid: 0,
    tokenAddress: "0x73D953924A781EBc463fF5030df77316d19B4572",
  },
  {
    pid: 1,
    tokenAddress: "0x0a898C1c6b9eD3859B5CE6670D0741C558F1AD6A",
  },
  {
    pid: 2,
    tokenAddress: "0x1e081B71BD2ad3f500FDc95e32Ee25fFD96fFb96",
  },
  {
    pid: 3,
    tokenAddress: "0xf3730AdC3c034791d096EaF9E457a061C44f2113",
  },
];

// REACT_APP_ALCHEMY_TEST_KEY="https://polygon-mumbai.g.alchemy.com/v2/O8JIBzfmoIBtG8UGWYcWtvhrv_sAeglX"

// old mplace contract testnet 0xd213C6c0b5d50A9eC0600bFcf97BD5923301CA94
