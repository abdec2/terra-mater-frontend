import React from 'react';
import { Link } from 'react-router-dom';

const footer= () => (
  <footer className="footer-light">
           
            <div className="subfooter">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="d-flex  align-items-center justify-content-between flex-column flex-lg-row gap-3">
                                <div className="de-flex-col">
                                    <span onClick={()=> window.open("", "_self")} className="d-flex align-items-center justify-content-center">
                                        <img alt="" className="" style={{width: '50px'}} src="./img/logo.png" />
                                        
                                        <span className="copy">&copy; Copyright 2022, Terra Mater</span>
                                    </span>
                                </div>
                                <div className="de-flex-col">
                                    {/* <div className="social-icons">
                                        <span onClick={()=> window.open("", "_self")}><i className="fa fa-facebook fa-lg"></i></span>
                                        <span onClick={()=> window.open("", "_self")}><i className="fa fa-twitter fa-lg"></i></span>
                                        <span onClick={()=> window.open("", "_self")}><i className="fa fa-linkedin fa-lg"></i></span>
                                        <span onClick={()=> window.open("", "_self")}><i className="fa fa-pinterest fa-lg"></i></span>
                                        <span onClick={()=> window.open("", "_self")}><i className="fa fa-rss fa-lg"></i></span>
                                    </div> */}
                                </div>
                                {/* <div className='de-flex-col'>Powered by: <a className='ms-2' href='http://brdigitech.com' target='_blank'>Brdigitech</a></div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
);
export default footer;