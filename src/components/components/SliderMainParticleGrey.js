import React from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import { useNavigate } from 'react-router-dom';
import colection from '../pages/colection';
import { Button } from 'react-bootstrap';

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;
const inline = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
  .d-inline{
    display: inline-block;
   }
`;

const Slidermainparticle = ({ collection }) => {
  const navigate = useNavigate()
    const navigateTo = (link) => {
        navigate(link)
    }
    console.log(collection)
  return (
    <div className="container ">

      <div className="row align-items-center">
        <div className="col-4">
          <div><img src="/img/logo.png" width={100} alt=""/></div>
        </div>
        <div className="spacer-10"></div>
      </div>
      <div className="row align-items-center">
        <div className="col-12">
          <div className="spacer-single"></div>
          <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
            <h1 className="text-center text-uppercase">Collection {collection && collection.data[0].attributes.
          name }
            </h1>
            <h3 className="text-center">First NFT Incubator and marketplace owned by people</h3>
          </Reveal>
          
          <div className="spacer-50"></div>
          <Reveal className='onStep d-inline' keyframes={fadeInUp} delay={800} duration={900} triggerOnce>
            <div className='w-50 mx-auto d-flex align-items-center justify-content-center'> 
              <a onClick={() => navigateTo('/about')} className='px-5 py-2 border rounded-5 text-white' style={{cursor: 'pointer', zIndex: '50'}}>Show me more</a>
            </div>
          </Reveal>
          <div className="spacer-50"></div>
        </div>
      </div>
    </div>
  )
};
export default Slidermainparticle;