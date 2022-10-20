import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from "./../../components/components/constants";
import CustomSlide from "./../../components/components/CustomSlide";
import * as selectors from '../../store/selectors';
import { fetchComingSoonCollections } from "../../store/actions/thunks";
import api from "../../core/api";


const CarouselCollectionRedux = () => {

  const dispatch = useDispatch();
  const store = useSelector(state => state)
  const hotCollectionsState = useSelector(selectors.ComingSoonCollectionState);
  const hotCollections = hotCollectionsState.data ? hotCollectionsState.data : [];

  console.log("Store", store)
  console.log(hotCollections)
  useEffect(() => {
    dispatch(fetchComingSoonCollections());
  }, [dispatch]);

  return (
    <div className='nft'>
      {
        hotCollections.length > 0 ? (
          <Slider {...settings}>
            {hotCollections.length > 0 && hotCollections.map((item, index) => (
              <CustomSlide
                key={index}
                index={index + 1}
                avatar={(item.feature_img.data !== null) ? item.feature_img.url : `https://via.placeholder.com/300?text=${item.name}`}
                banner={api.baseUrl + item.banner.url}
                username={item.name}
                status={item.status}
                // uniqueId={item.unique_id}
                collectionId={item.id}
              />
            ))}
          </Slider>
        ) : (
          <h2 className="text-center fw-normal">No Items to display</h2>
        )
      }
    </div>
  );
}

export default memo(CarouselCollectionRedux);
