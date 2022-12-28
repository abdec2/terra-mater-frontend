import WalletConnectProvider from "@walletconnect/web3-provider";

export const providerOptions = {
    /* See Provider Options Section */
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        rpc: {
          80001: process.env.REACT_APP_ALCHEMY_TEST_KEY
        }
      }
    }
};

// export const CONFIG = {
//   USDT_ADDRESS: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
//   MARKETPLACE_ADDRESS: '0xaBfB6a3D21eB1ad803CC706BF2Fe955Ff5520E73',
//   CHAIN_ID: 137,
//   CHAIN_ID_HEX: '0x89', 
//   NETWORK: 'Polygon Mainnet',
//   BLOCKCHAIN_EXPLORER: 'https://polygonscan.com/', 
//   CONTACT_EMAIL: 'info@terramaternfts.com'
// } 

export const CONFIG = {
  USDT_ADDRESS: '0x0950D64525706842a16c5BD73c14F38fBd610c9B',
  MARKETPLACE_ADDRESS: '0xcb6c0d13efd873252A71EA3CC87aEd118C843f9b',
  NATURA_TOKEN_ADDRESS: '0x1Bf5cf1b2BcF4b916edDD0D66c4D95a731b29961',
  STAKING_ADDRESS: '0x0037687d4B834dDCa364a3CDBa6612c9948583Ad',
  CHAIN_ID: 80001,
  CHAIN_ID_HEX: '0x13881', 
  CHAIN_FOR_MORALIS: 'mumbai',
  NETWORK: 'Mumbai Testnet',
  BLOCKCHAIN_EXPLORER: 'https://mumbai.polygonscan.com/', 
  CONTACT_EMAIL: 'info@terramaternfts.com'
}

export const STAKE_NFT_CONTRACTS = [
  {
    pid: 0,
    tokenAddress: '0x4fc1fA447263D9154a7dbD43D9855Dd2B994d33d'
  }
]


// REACT_APP_ALCHEMY_TEST_KEY="https://polygon-mumbai.g.alchemy.com/v2/O8JIBzfmoIBtG8UGWYcWtvhrv_sAeglX"

// old mplace contract testnet 0xd213C6c0b5d50A9eC0600bFcf97BD5923301CA94