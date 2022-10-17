import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
// import logo from './../../assets/logo.png'
import { connectWallet } from './connectWallet'
import {
  Link,
  useNavigate,
  useMatch,
  useResolvedPath
} from "react-router-dom";
import useOnclickOutside from "react-cool-onclickoutside";
import auth from '../../core/auth';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import * as actions from './../../store/actions';
import Web3 from "web3";
import Web3Modal from "web3modal";
import { providerOptions } from './../../config/config'

setDefaultBreakpoints([
  { xs: 0 },
  { l: 1199 },
  { xl: 1200 }
]);

const NavLink = (props) => {
  let resolved = useResolvedPath(props.to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link
      {...props}
      className={match ? 'active' : 'non-active'}
    />
  )
};



const Header = function ({ className }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const web3Store = useSelector(state => state.web3)
  const userData = auth.getUserInfo();
  console.log(userData)
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const [openMenu3, setOpenMenu3] = React.useState(false);
  const [islogin, setIsLogin] = React.useState(false);
  const handleBtnClick = () => {
    setOpenMenu(!openMenu);
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
  };
  const handleBtnClick2 = () => {
    setOpenMenu2(!openMenu2);
  };
  const handleBtnClick3 = () => {
    setOpenMenu3(!openMenu3);
  };
  const closeMenu = () => {
    setOpenMenu(false);
  };
  const closeMenu1 = () => {
    setOpenMenu1(false);
  };
  const closeMenu2 = () => {
    setOpenMenu2(false);
  };
  const closeMenu3 = () => {
    setOpenMenu3(false);
  };

  const ref = useOnclickOutside(() => {
    closeMenu();
  });
  const ref1 = useOnclickOutside(() => {
    closeMenu1();
  });
  const ref2 = useOnclickOutside(() => {
    closeMenu2();
  });
  const ref3 = useOnclickOutside(() => {
    closeMenu3();
  });


  const [showmenu, btn_icon] = useState(false);
  const [showpop, btn_icon_pop] = useState(false);
  const [shownot, btn_icon_not] = useState(false);
  const closePop = () => {
    btn_icon_pop(false);
  };
  const closeNot = () => {
    btn_icon_not(false);
  };
  const refpop = useOnclickOutside(() => {
    closePop();
  });
  const refpopnot = useOnclickOutside(() => {
    closeNot();
  });

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
    dispatch(actions.addWeb3({account}))
  }

  useEffect(() => {
    
    if (userData && userData.address) {
      setIsLogin(true)
      addLoginState(userData.address)
    } else {
      setIsLogin(false)
    }
    console.log(web3Store.account)
  }, [web3Store.account]);

  useEffect(() => {
    const header = document.getElementById("myHeader");
    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
      btn_icon(false);
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        totop.classList.add("show");

      } else {
        header.classList.remove("sticky");
        totop.classList.remove("show");
      } if (window.pageYOffset > sticky) {
        closeMenu();
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);
  return (
    <header className={`navbar white ${className}`} id="myHeader">
      <div className='container'>
        <div className='row w-100-nav'>
          <div className='logo px-0'>
            <div className='navbar-title navbar-item p-2'>
              <NavLink to="/">
                <img
                  src="/img/logo.png"
                  className="img-fluid d-block"
                  style={{width: '80px'}}
                  alt="#"
                />
                <img
                  src="/img/logo.png"
                  className="img-fluid"
                  style={{width: '80px'}}
                  alt="#"
                />
              </NavLink>
            </div>
          </div>

          {/* <div className='search'>
            <input id="quick_search" className="xs-hide" name="quick_search" placeholder="search item here..." type="text" />
          </div> */}

          <BreakpointProvider>
            <Breakpoint l down>
              {showmenu &&
                <div className='menu'>
                  <div className='navbar-item'>
                    <NavLink to="/home" onClick={() => btn_icon(!showmenu)}>
                      Home
                    </NavLink>
                  </div>
                  <div className='navbar-item'>
                    <NavLink to="/explore2" onClick={() => btn_icon(!showmenu)}>
                      Explore
                    </NavLink>
                  </div>
                </div>
              }
            </Breakpoint>

            <Breakpoint xl>
              <div className='menu'>
                <div className='navbar-item'>
                  <NavLink to="/home" onClick={() => btn_icon(!showmenu)}>
                    Home
                  </NavLink>
                </div>
                <div className='navbar-item'>
                  <NavLink to="/explore2" onClick={() => btn_icon(!showmenu)}>
                    Explore
                  </NavLink>
                </div>

              </div>
            </Breakpoint>
          </BreakpointProvider>

          <div className='mainside'>
            {
              !islogin && (
                <div className='connect-wal'>
                  <a onClick={() => connectWallet(dispatch)}>Connect Wallet</a>
                </div>
              )
            }
            {
              islogin && (
                <div className="logout">
                  <NavLink to="/createOptions">Create</NavLink>
                  
                  <div id="de-click-menu-profile" className="de-menu-profile" onClick={() => btn_icon_pop(!showpop)} ref={refpop}>
                    <img src="../../img/author_single/author_thumbnail.jpg" alt="" />
                    {showpop &&
                      <div className="popshow">
                        <div className="d-wallet">
                          <h4>My Wallet</h4>
                          <span id="wallet" className="d-wallet-address">{web3Store.account.slice(0,5)+'...'+web3Store.account.slice(37,42)}</span>
                          {/* <button id="btn_copy" title="Copy Text">Copy</button> */}
                        </div>
                        <div className="d-line"></div>
                        <ul className="de-submenu-profile">
                          <li>
                            <span>
                              <i className="fa fa-user"></i> My profile
                            </span>
                          </li>
                          <li>
                            <span>
                              <i className="fa fa-pencil"></i> Edit profile
                            </span>
                          </li>
                          <li onClick={handleLogout}>
                            <span>
                              <i className="fa fa-sign-out"></i> Sign out
                            </span>
                          </li>
                        </ul>
                      </div>
                    }
                  </div>
                </div>
              )
            }


          </div>

        </div>

        <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
          <div className="menu-line white"></div>
          <div className="menu-line1 white"></div>
          <div className="menu-line2 white"></div>
        </button>

      </div>
    </header>
  );
}
export default Header;