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
//   NETWORK: 'Polygon Mainnet',
//   BLOCKCHAIN_EXPLORER: 'https://polygonscan.com/', 
//   CONTACT_EMAIL: 'info@terramaternfts.com'
// }

export const CONFIG = {
  USDT_ADDRESS: '0x0950D64525706842a16c5BD73c14F38fBd610c9B',
  MARKETPLACE_ADDRESS: '0xd213C6c0b5d50A9eC0600bFcf97BD5923301CA94',
  NATURA_TOKEN_ADDRESS: '0x22E2C2b5053BE2CE134218803418B862582cd6d9',
  STAKING_ADDRESS: '0x83DC5Cf8Ff7e8AbeD6297C3FcDf11488C5bFEeDB',
  CHAIN_ID: 80001, 
  NETWORK: 'Mumbai Testnet',
  BLOCKCHAIN_EXPLORER: 'https://mumbai.polygonscan.com/', 
  CONTACT_EMAIL: 'info@terramaternfts.com'
}


// REACT_APP_ALCHEMY_TEST_KEY="https://polygon-mumbai.g.alchemy.com/v2/O8JIBzfmoIBtG8UGWYcWtvhrv_sAeglX"