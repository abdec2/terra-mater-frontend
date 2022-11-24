import Web3 from "web3";
import Web3Modal from "web3modal";

import axios from "axios"
import api from "../../core/api"
import * as actions from './../../store/actions';
import { CONFIG, providerOptions } from "../../config/config";
import auth from "../../core/auth";


export const connectWallet = async (dispatch) => {
    const web3Modal = new Web3Modal({
        providerOptions // required
    });

    const provider = await web3Modal.connect();

    const web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();

    const account = accounts[0];

    const token = await axios.get(`${api.baseUrl}/webthree-auth/token/${account}`);
    console.log(token)

    const signMessage = await web3.eth.personal.sign(`Your authentication token : ${token.data.token}`, account);

    const result = await axios.get(`${api.baseUrl}/webthree-auth/authenticate/${account}/${signMessage}`);
    console.log(result.data)
    if (result.data.user) {
        auth.setToken(result.data.jwt, true)
        auth.setUserInfo(result.data.user, true)
        dispatch(actions.addWeb3({ account, provider, web3}))
        const network = await web3.eth.getChainId()
        if (network !== CONFIG.CHAIN_ID) {
            switchNetwork(provider)
        }
    } else {
        alert('something went wrong')
    }

}

export const switchNetwork = async (provider) => {
    try {

        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x5' }],
        });
        console.log("You have switched to the right network")

    } catch (switchError) {

        // The network has not been added to MetaMask
        if (switchError.code === 4902) {
            console.log("Please add the Polygon network to MetaMask")
        }
        console.log("Cannot switch to the network")

    }
}