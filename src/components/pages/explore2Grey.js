import React from 'react';
import CategoryTabs from '../../myFiles/components/CategoryTabs';
import ColumnNewThreeColRedux from '../components/ColumnNewThreeColRedux';
import Footer from '../components/footer';

//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../Styles';
//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO


const explore = () => (
  <div className="greyscheme">
    <StyledHeader theme={theme} />
    <section className='container-fluid px-2 px-md-5 min-vh-100'>
      <div className="row">
        <div className="spacer-double"></div>
        <h2 className='text-center'>Explore, collect, and sell NFTs</h2>
      </div>
      <div className='row'>
        <div className="spacer-double"></div>
        <div className="col-md-12">
          <CategoryTabs />
        </div>
      </div>
    </section>


    <Footer />
  </div>

);
export default explore;