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
import { connectWallet } from './../../../components/menu/connectWallet';
import * as actions from './../../../store/actions';
import auth from '../../../core/auth';
import { providerOptions } from './../../../config/config'
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
        className="px-2"
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
        navigate('/')
    }

    const addLoginState = async (account) => {
        const web3Modal = new Web3Modal({
            providerOptions // required
        });

        const provider = await web3Modal.connect();

        const web3 = new Web3(provider);
        dispatch(actions.addWeb3({ account }))
    }

    useEffect(() => {

        if (userData && userData.address) {
            setIsLogin(true)
            addLoginState(userData.address)
        } else {
            setIsLogin(false)
        }
        console.log(web3Store.account)
        if(typeof web3Store.account === 'string') {
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
                    <div className="d-none d-md-block ms-5 me-5"></div>
                    <div className="d-none d-md-block ms-5 me-5"></div>
                    <Nav className="align-items-center w-100 justify-content-between m-auto ">
                        <NavLink className='p-3 p-lg-0 nav-link fw-normal' to="/explore">Collections</NavLink>
                        <NavLink className='p-3 p-lg-0 nav-link fw-normal' to="/about">About</NavLink>
                        {
                            !islogin && (
                                <Nav.Link className='p-3 p-lg-0 fw-normal' onClick={() => connectWallet(dispatch)}>Connect Wallet</Nav.Link>
                            )
                        }
                        {
                            islogin && (
                                <Dropdown>
                                    <Dropdown.Toggle as={CustomToggle} id="my-wallet-dd">
                                        <span className="fw-normal me-2">My Wallet</span>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu variant="dark" className="bg-dark p-2" style={{border: '1px solid #333'}}>
                                        <Dropdown.Header>
                                            <h5 className="text-white mb-1">My Wallet</h5>
                                            {`${account.slice(0,5)}....${account.slice(37,42)}`}
                                        </Dropdown.Header>
                                        <Dropdown.Divider  />
                                        <Dropdown.Item className="p-2 fw-normal">
                                            My Profile
                                        </Dropdown.Item>
                                        <Dropdown.Item className="p-2 fw-normal" onClick={handleLogout}>Sign Out</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )
                        }
                        <div className='p-3 p-lg-0'>
                            <Form.Control as="select" className='px-5 py-1 mb-0 bg-dark text-white' style={{ color: 'rgba(255,255,255,.55)' }}>
                                <option value="0">English</option>
                                <option value="1">Italiano</option>
                            </Form.Control>
                        </div>
                        <div className='mb-4 mb-lg-0'>
                            <Search />
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Index