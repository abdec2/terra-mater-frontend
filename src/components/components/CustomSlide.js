import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

const CustomSlide = ({ index, avatar, banner, username, collectionId, status }) => {
  const navigate = useNavigate()
    const navigateTo = (link) => {
        navigate(link)
    }
  
  return (
    <div className='itm' index={index}>
      <div className="nft_coll">
          <div className="nft_wrap">
              <span><img src={avatar} className="lazy img-fluid" width={'100%'} alt=""/></span>
          </div>
          {/* <div className="nft_coll_pp">
              <span onClick={()=> window.open("/colection/" + collectionId, "_self")}><img className="lazy" src={avatar} alt=""/></span>
              <i className="fa fa-check"></i>
          </div> */}
          <div className="nft_coll_info mt-3">
            {
              status.toLowerCase() === "active" ? (
                <span onClick={()=> navigateTo("/colection/" + collectionId)}><h4>{ username }</h4></span>
              ) : (
                <span><h4>{ username }</h4></span>
              )
            }
          </div>
      </div>
    </div>
  )
}

export default memo(CustomSlide);