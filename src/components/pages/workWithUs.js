import React from 'react';
import emailjs from 'emailjs-com';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import { useState, useRef } from 'react';
import axios from 'axios';
import { CONFIG } from '../../config/config';
import api from '../../core/api';
import { Spinner } from 'react-bootstrap';

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #212428;
    border-bottom: 0;
    box-shadow: 0 4px 20px 0 rgba(10,10,10, .8);
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: #fff;
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: none !important;
  }
  header#myHeader .logo .d-4{
    display: block !important;
  }
  .navbar .search #quick_search{
    border-radius: 20px;
  }
  .navbar .navbar-item .lines {
    border-bottom: 2px solid #ff343f;
  }
  .navbar .mainside a{
    text-align: center;
    color: #fff !important;
    background: #ff343f;
    border-radius: 30px;
  }
  .navbar .mainside a:hover {
    box-shadow: 2px 2px 20px 0 #ff343f;
    transition: all .3s ease;
  }
  .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
    background: #fff;
  }
  .item-dropdown{
    color: #fff !important;
    background: rgba(33, 36, 40, .9);
    box-shadow: 2px 2px 30px 0px rgba(20, 20, 20, 0.1);
  }
  .item-dropdown .dropdown a{
    color: #fff !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .item-dropdown .dropdown a:hover{
    color: #fff !important;
    background: #ff343f;
  }
  footer.footer-light .subfooter span img.d-1{
    display: none !important;
  }
  footer.footer-light .subfooter span img.d-4{
    display: inline-block !important;
  }
  .de_countdown{
    right: 10px;
    color: #fff;
  }
  .author_list_pp{
    margin-left:0;
  }
  footer.footer-light .subfooter{
    border-top: 1px solid rgba(255,255,255,.1);
  }
  #scroll-to-top div {
    background: #ff343f;
  }
  @media only screen and (max-width: 1199px) { 
    .navbar {
      background: #212428;
    }
  }
`;

const WorkWithUs = function () {
  const [loading, setLoading] = useState(false)
  const name = useRef()
  const surname = useRef()
  const email = useRef()
  const phone = useRef()
  const position = useRef()
  const msg = useRef()

  function sendEmail(e) {
    setLoading(true)
    const success = document.getElementById("success");
    const button = document.getElementById("buttonsent");
    const failed = document.getElementById("failed");
    e.preventDefault();

    axios.post(`${api.baseUrl}/api/email`, {
      to: CONFIG.CONTACT_EMAIL,
      subject: "Work With Us Form",
      html: `
      <p>Name: ${name.current.value}</p>
      <p>Surname: ${surname.current.value}</p>
      <p>Email: ${email.current.value}</p>
      <p>Phone: ${phone.current.value}</p>
      <p>Asking Position: ${position.current.value}</p>
      <p>Note: ${msg.current.value}</p>
      `
    }).then(res => {
      success.classList.add('show');
      button.classList.add('show');
      failed.classList.remove('show');
      setLoading(false)
    }).catch(e => {
      failed.classList.add('show');
      console.log(e)
      setLoading(false)
    })

  }

  return (
    <div className="greyscheme">
      <GlobalStyles />

      <section className='jumbotron breadcumb no-bg' style={{ background: 'url("./img/background/6.jpg")' }}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row'>
              <div className="col-md-12 text-center">
                <h1>WORK WITH US</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='container'>
        <div className='row'>
          <div className='col-lg-8 offset-lg-2 mb-3'>
            {/* <h3>Do you have any question?</h3> */}
            <div className='mb-5'>
              <p>
                FIND OUT MORE ABOUT OUR HARMONIOUS PARADISE
                <a href='https://harmonious-paradise.gitbook.io/harmonious-paradise-project/' target="_blank" > here </a>
                and WORK WITH US
              </p>
            </div>
            <div className="form-side">
              <form className="formcontact" onSubmit={sendEmail}>
                <input ref={name} disabled={loading} type="text" className="form-control" name="name" placeholder="Name" required />
                <input ref={surname} disabled={loading} type="text" className="form-control" name="surname" placeholder="Surname" required />
                <input ref={email} disabled={loading} type="email" className="form-control" name="email" placeholder="Email" required />
                <input ref={phone} disabled={loading} type="text" className="form-control" name="phone" placeholder="Phone" required />
                <input ref={position} disabled={loading} type="text" className="form-control" name="position" placeholder="Asking Position" required />
                <textarea ref={msg} disabled={loading} name="note" className="form-control" placeholder="Note" required />
                <div id='success' className='hide'>Your message has been sent...</div>
                <div id='failed' className='hide'>Message failed...</div>
                {
                  loading ? (
                    <div className=" btn-main color-2" style={{ cursor: "default" }}>
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className='ms-2'>Loading...</span>
                    </div>
                  ) : (
                    <input type='submit' id='buttonsent' value='Submit Now' className="btn btn-main color-2" />
                  )
                }
              </form>
            </div>
          </div>

          {/* <div className='col-md-4'>
           
           <div className="padding40 box-rounded mb30">
              <h3>US Office</h3>
              <address className="s1">
                <span><i className="id-color fa fa-map-marker fa-lg"></i>08 W 36th St, New York, NY 10001</span>
                <span><i className="id-color fa fa-phone fa-lg"></i>+1 333 9296</span>
                <span><i className="id-color fa fa-envelope-o fa-lg"></i><span className='btn'>contact@example.com</span></span>
                <span><i className="id-color fa fa-file-pdf-o fa-lg"></i><span className='btn'>Download Brochure</span></span>
              </address>
            </div>

            <div className="padding40 box-rounded mb30 text-light">
              <h3>AU Office</h3>
              <address className="s1">
                <span><i className="fa fa-map-marker fa-lg"></i>100 Mainstreet Center, Sydney</span>
                <span><i className="fa fa-phone fa-lg"></i>+61 333 9296</span>
                <span><i className="fa fa-envelope-o fa-lg"></i><span className='btn'>contact@example.com</span></span>
                <span><i className="fa fa-file-pdf-o fa-lg"></i><span className='btn'>Download Brochure</span></span>
              </address>
            </div>

          </div> */}

        </div>
      </section>
      <Footer />
    </div>
  );
}
export default WorkWithUs;