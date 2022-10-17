import React, { useEffect } from 'react';
import Particle from '../components/Particle';
import SliderMainParticleGrey from '../components/SliderMainParticleGrey';
import FeatureBox from '../components/FeatureBox';
import CarouselCollectionRedux from '../components/CarouselCollectionRedux';
import CarouselNewRedux from '../components/CarouselNewRedux';
import AuthorListRedux from '../components/AuthorListRedux';
import Footer from '../components/footer';

//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../Styles';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchNewCollection } from '../../store/actions/thunks/collections';
import * as selectors from '../../store/selectors';
//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO



const HomeOne = () => {
  const dispatch = useDispatch()
  const newCollectionStore = useSelector(selectors.newCollection)

  console.log(newCollectionStore)

  useEffect(() => {
    dispatch(fetchNewCollection())
  }, [dispatch])

  return (
    <div className="greyscheme">
      <StyledHeader theme={theme} />
      <section className="jumbotron no-bg relative" style={{ backgroundImage: `url(${'./img/background/8.jpg'})` }}>
        <Particle />
        <SliderMainParticleGrey collection={newCollectionStore}  />
      </section>

      {/* <section className='container no-bottom'>
        <div className="row">
            <div className="col-lg-2 col-sm-4 col-6 mb30">
                <span className="box-url">
                    <img src="./img/wallet/1.png" alt="" className="mb20"/>
                    <h4>Metamask</h4>
                </span>
            </div>

            <div className="col-lg-2 col-sm-4 col-6 mb30">
                <span className="box-url">
                    <img src="./img/wallet/2.png" alt="" className="mb20"/>
                    <h4>Bitski</h4>
                </span>
            </div>       

            <div className="col-lg-2 col-sm-4 col-6 mb30">
                <span className="box-url">
                    <img src="./img/wallet/3.png" alt="" className="mb20"/>
                    <h4>Fortmatic</h4>
                </span>
            </div>    

            <div className="col-lg-2 col-sm-4 col-6 mb30">
                <span className="box-url">
                    <img src="./img/wallet/4.png" alt="" className="mb20"/>
                    <h4>WalletConnect</h4>
                </span>
            </div>

            <div className="col-lg-2 col-sm-4 col-6 mb30">
                <span className="box-url">
                    <img src="./img/wallet/5.png" alt="" className="mb20"/>
                    <h4>Coinbase Wallet</h4>
                </span>
            </div>

            <div className="col-lg-2 col-sm-4 col-6 mb30">
                <span className="box-url">
                    <img src="./img/wallet/6.png" alt="" className="mb20"/>
                    <h4>Arkane</h4>
                </span>
            </div>                                       
        </div>
      </section> */}

      <section className='container-fluid no-top no-bottom'>
        <div className='row'>
          <div className="spacer-double"></div>
          <div className='col-lg-12 mb-2'>
            <h2 className='ms-3'>New Release</h2>
          </div>
        </div>
        <CarouselNewRedux />
      </section>

      {/* <section className='container no-top no-bottom'>
        <div className='row'>
          <div className="spacer-double"></div>
          <div className='col-lg-12'>
              <h2>Top Sellers</h2>
          </div>
          <div className='col-lg-12'>
            <AuthorListRedux/>
          </div>
        </div>
      </section> */}

      <section className='container-fluid no-top no-bottom'>
        <div className='row'>
          <div className="spacer-double"></div>
          <div className='col-lg-12 mb-2'>
            <h2 className='ms-3'>Coming Soon</h2>
          </div>
          <div className='col-lg-12'>
            <CarouselNewRedux />
            {/* <CarouselCollectionRedux /> */}
          </div>
        </div>
      </section>

      {/* <section className='container no-top'>
        <div className='row'>
          <div className="spacer-double"></div>
          <div className='col-lg-12 mb-3'>
            <h2>Create and Sell Now</h2>
          </div>
          <FeatureBox />
        </div>
      </section> */}

      <Footer />

    </div>
  )
}
export default HomeOne;