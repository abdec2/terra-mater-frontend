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
import CarouselComingSoon from '../../myFiles/components/CarouselComingSoon';
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

      <section className='container-fluid no-top no-bottom'>
        <div className='row'>
          <div className="spacer-double"></div>
          <div className='col-lg-12 mb-2'>
            <h2 className='ms-3'>New Release</h2>
          </div>
        </div>
        <CarouselCollectionRedux />
      </section>

      <section className='container-fluid no-top no-bottom'>
        <div className='row'>
          <div className="spacer-double"></div>
          <div className='col-lg-12 mb-2'>
            <h2 className='ms-3'>Coming Soon</h2>
          </div>
          <div className='col-lg-12'>
            {/* <CarouselNewRedux /> */}
            <CarouselComingSoon />
          </div>
        </div>
      </section>
      <div className="spacer-50"></div>
      <div className="spacer-50"></div>
      <section className='container-fluid px-3 no-top mt-5'>
        <FeatureBox />
        {/* <div className="d-flex flex-column flex-md-row align-items-center justify-content-center ">
          <div className='px-5 py-3 py-md-0 text-center'><h3 className='mb-0'>Contact us</h3></div>
          <div className='px-5 py-3 py-md-0 text-center'><h3 className='mb-0'>Work with us</h3></div>
          <div className='px-5 py-3 py-md-0 text-center'><h3 className='mb-0'>Do you have a project?</h3></div>
        </div>   */}
      </section>

      <Footer />

    </div>
  )
}
export default HomeOne;