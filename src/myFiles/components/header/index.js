import Web3 from "web3";
import Web3Modal from "web3modal";
import { Form, NavDropdown } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Search from './search-popup'
import {
    Link,
    useNavigate,
    useMatch,
    useResolvedPath
} from "react-router-dom";
import { connectWallet, switchNetwork } from './../../../components/menu/connectWallet';
import * as actions from './../../../store/actions';
import auth from '../../../core/auth';
import { CONFIG, providerOptions } from './../../../config/config'
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, forwardRef } from "react";


const NavLink = (props) => {
    let resolved = useResolvedPath(props.to);
    let match = useMatch({ path: resolved.pathname, end: true });

    return (
        <Link
            {...props}
            className={`${props.className} ${match ? 'active' : 'non-active'}`}
        />
    )
};

const CustomToggle = forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        className="p-3 p-lg-0 nav-link fw-normal text-truncate"
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        &#x25bc;
    </a>
));



const Index = () => {
    const [islogin, setIsLogin] = useState(false);
    const [account, setAccount] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const web3Store = useSelector(state => state.web3)
    const userData = auth.getUserInfo();
    console.log(web3Store)

    const handleLogout = () => {
        auth.clearAppStorage();
        dispatch(actions.delWeb3())
        setIsLogin(false)
        navigate('/')
    }

    // const addLoginState = async (account) => {
    //     const web3Modal = new Web3Modal({
    //         providerOptions // required
    //     });

    //     const provider = await web3Modal.connect();

    //     const web3 = new Web3(provider);
    //     const network = await web3.eth.getChainId()
    //     if(network !== CONFIG.CHAIN_ID) {
    //         switchNetwork(provider)
    //     }
    //     dispatch(actions.addWeb3({ account, provider, web3 }))
    // }

    useEffect(() => {
        if (userData && userData.address) {
            setIsLogin(true)
            //addLoginState(userData.address)
        } else {
            setIsLogin(false)
        }
        console.log(web3Store.account)
        if (typeof web3Store.account === 'string') {
            setAccount(web3Store.account)
        }
    }, [web3Store.account, account]);

    return (
        <Navbar variant="dark" expand="lg" bg="dark">
            <Container fluid className="px-2 px-md-5">
                <Navbar.Brand className='d-flex align-items-center me-5'>
                    <Link to="/" >
                        <img
                            src="/img/logo.png"
                            className="img-fluid d-block"
                            style={{ width: '80px' }}
                            alt="#"
                        />
                    </Link>
                    <Link to="/">
                        <div className='fw-bold ms-2' style={{ color: 'rgba(255,255,255,.55)' }}>TERRA MATER</div>
                    </Link>

                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className='w-100'>
                    {/* <div className="d-none d-md-block ms-5 me-5"></div>
                    <div className="d-none d-md-block ms-5 me-5"></div> */}
                    <Nav className="align-items-center w-100 justify-content-center ">
                        <div className="px-5 py-2"><NavLink className='p-3 p-lg-0 nav-link fw-normal text-truncate' to="/explore">Collections</NavLink></div>
                        <div className="px-5 py-2"><NavLink className='p-3 p-lg-0 nav-link fw-normal text-truncate' to="/about">About</NavLink></div>
                        <div className="px-5 py-2"><NavLink className='p-3 p-lg-0 nav-link fw-normal text-truncate' to="/dashboard">Dashboard</NavLink></div>
                        <div className="px-5 py-2"><NavLink className='p-3 p-lg-0 nav-link fw-normal text-truncate' to="/nft-staking">NFT Staking</NavLink></div>
                        {
                            !islogin && (
                                <div className="px-5 py-2"><Nav.Link className='p-3 p-lg-0 fw-normal' onClick={() => connectWallet(dispatch)}>Connect Wallet</Nav.Link></div>
                            )
                        }
                        {
                            islogin && (
                                <div className="px-5 py-2">
                                    <Dropdown>
                                        <Dropdown.Toggle as={CustomToggle} id="my-wallet-dd">
                                            <span className="fw-normal me-2">My Wallet</span>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu variant="dark" className="bg-dark p-2" style={{ border: '1px solid #333' }}>
                                            <Dropdown.Header>
                                                <h5 className="text-white mb-1">My Wallet</h5>
                                                {`${userData.address.slice(0, 5)}....${userData.address.slice(37, 42)}`}
                                            </Dropdown.Header>
                                            <Dropdown.Divider />
                                            <Dropdown.Item className="p-2 fw-normal" onClick={() => navigate('/Profile')}>
                                                My Profile
                                            </Dropdown.Item>
                                            <Dropdown.Item className="p-2 fw-normal" onClick={handleLogout}>Sign Out</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            )
                        }

                    </Nav>
                    <div className='p-3 p-lg-0 ms-lg-5 d-flex justify-content-center'>
                        <Form.Control as="select" className='mb-0 bg-dark text-white text-center' style={{ color: 'rgba(255,255,255,.55)', width: '120px' }}>
                            <option value="0">English</option>
                            <option value="1">Italiano</option>
                        </Form.Control>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Index