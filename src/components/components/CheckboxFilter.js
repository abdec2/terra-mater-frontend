import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterCategories, filterStatus, filterItemsType, filterCollections } from '../../store/actions';
import { categoriesState, nftStatusesState, hotCollectionsState } from './../../store/selectors'
import { useEffect } from 'react';
import {
    fetchCategories,
    fetchStatus, 
    fetchHotCollections
} from './../../store/actions/thunks'

const CheckboxFilter = () => {
    const dispatch = useDispatch();
    const categories1 = useSelector(categoriesState);
    const nftStatus = useSelector(nftStatusesState);
    const collection = useSelector(hotCollectionsState).data;

    const handleCategory = useCallback((event) => {
        const { value } = event.target;
        console.log(value)
        dispatch(filterCategories({value: value, singleSelect: false}));
    }, [dispatch]);
    
    const handleStatus = useCallback((event) => {
        const { value } = event.target;
        dispatch(filterStatus({value: value, singleSelect: false}));
    }, [dispatch]);
    
    // const handleItemsType = useCallback((event) => {
    //     const { id } = event.target;
    //     dispatch(filterItemsType({value: id, singleSelect: false}));
    // }, [dispatch]);

    const handleCollections = useCallback((event) => {
        const { value } = event.target;
        dispatch(filterCollections({value: value, singleSelect: false}));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchStatus());
        dispatch(fetchHotCollections());
    }, [dispatch]);

    return (
        <>
            <div className="item_filter_group">
              <h4>Select Categories</h4>
              <div className="de_form">
                  { categories1 && categories1.map((item, index) => (
                    <div className="de_checkbox" key={index}>
                        <input 
                            id={item.category.toLowerCase()} 
                            name={item.category.toLowerCase()} 
                            type="checkbox" 
                            value={item.id}
                            onChange={handleCategory}
                        />
                        <label htmlFor={item.category.toLowerCase()}>{item.category}</label>
                    </div>
                  ))}
              </div>
          </div>

          <div className="item_filter_group">
              <h4>Status</h4>
              <div className="de_form">
                { nftStatus && nftStatus.map((item, index) => (
                    <div className="de_checkbox" key={index}>
                        <input 
                            id={item.Status.toLowerCase()} 
                            name={item.Status.toLowerCase()} 
                            type="checkbox" 
                            value={item.id}
                            onChange={handleStatus}
                        />
                        <label htmlFor={item.Status.toLowerCase()}>{item.Status}</label>
                    </div>
                  ))}
              </div>
          </div>

          <div className="item_filter_group">
              <h4>Collections</h4>
              <div className="de_form">
              { collection && collection.map((item, index) => (
                    <div className="de_checkbox" key={index}>
                        <input 
                            id={item.id} 
                            name={item.id} 
                            type="checkbox" 
                            value={item.id}
                            onChange={handleCollections}
                        />
                        <label htmlFor={item.id}>{item.name}</label>
                    </div>
                ))}
              </div>
          </div>
        </>
    );
}

export default memo(CheckboxFilter)