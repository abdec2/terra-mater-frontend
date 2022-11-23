import WalletConnectProvider from "@walletconnect/web3-provider";

export const providerOptions = {
    /* See Provider Options Section */
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        rpc: {
          5: process.env.REACT_APP_ALCHEMY_KEY
        }
      }
    }
};

export const CONFIG = {
  USDT_ADDRESS: '0xdfDF0464A524fB62aa76b0299595D51A9aF428Fe',
  MARKETPLACE_ADDRESS: '0xD04413fD98b5063872080F9BDFa92DE883983D44',
  CHAIN_ID: 5, 
  NETWORK: 'Goerli',
  BLOCKCHAIN_EXPLORER: 'https://goerli.etherscan.io/'
}