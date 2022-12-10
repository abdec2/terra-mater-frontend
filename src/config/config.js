import WalletConnectProvider from "@walletconnect/web3-provider";

export const providerOptions = {
    /* See Provider Options Section */
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        rpc: {
          80001: process.env.REACT_APP_ALCHEMY_KEY
        }
      }
    }
};

export const CONFIG = {
  USDT_ADDRESS: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  MARKETPLACE_ADDRESS: '0xaBfB6a3D21eB1ad803CC706BF2Fe955Ff5520E73',
  CHAIN_ID: 137, 
  NETWORK: 'Polygon Mainnet',
  BLOCKCHAIN_EXPLORER: 'https://polygonscan.com/', 
  CONTACT_EMAIL: 'info@terramaternfts.com'
}