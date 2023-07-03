import React from 'react';
import ReactDOM from 'react-dom';
import "./assets/animated.css";
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/elegant-icons/style.css';
import '../node_modules/et-line/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import './assets/style.scss';
import './assets/style_grey.scss';
import './index.css';
import App from './components/app';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";

//redux store
import { Provider } from 'react-redux'
import store from './store';

import ScrollToTop from './ScrollToTop'


import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygon, mainnet } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'



const chains = [polygon, mainnet]
const projectId = 'f238c9785b201aaf8e96bf1c0db6cf30'

const { publicClient } = configureChains(chains, [alchemyProvider({apiKey: 'KwdNTss7Go5WLH7wCom08CDrwHGyMEsK'}), w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)



ReactDOM.render(
	<>
		<WagmiConfig config={wagmiConfig}>
			<Provider store={store}>
				<BrowserRouter>
					<ScrollToTop />
					<App />
				</BrowserRouter>
			</Provider>
		</WagmiConfig>
		<Web3Modal projectId={projectId} ethereumClient={ethereumClient} defaultChain={polygon} />
	</>,
	document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();