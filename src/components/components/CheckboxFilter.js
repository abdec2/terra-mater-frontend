import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearFilter } from '../../store/actions';
import { nftStatusesState } from './../../store/selectors'
import { useEffect } from 'react';
import { fetchStatus, fetchCollectionNfts } from './../../store/actions/thunks'
import { useState } from 'react';

const CheckboxFilter = ({selStatus, setSelStatus, setPage}) => {
    const dispatch = useDispatch();
    const nftStatus = useSelector(nftStatusesState);

    const toggleStatus = (event) => {
        const { value, checked } = event.target
        setPage(1)
        if(checked) {
            setSelStatus([...selStatus, value])
        } else {
            setSelStatus(selStatus.filter(item => item !== value))
        }
    }

    useEffect(()=>{
        dispatch(fetchStatus());
    }, [dispatch])

    return (
        <>
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
                            onChange={toggleStatus}
                        />
                        <label htmlFor={item.Status.toLowerCase()}>{item.Status}</label>
                    </div>
                  ))}
              </div>
          </div>

          
        </>
    );
}

export default memo(CheckboxFilter)