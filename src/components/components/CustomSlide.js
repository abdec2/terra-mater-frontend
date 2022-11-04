import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

const CustomSlide = ({ index, avatar, banner, username, collectionId, status }) => {
  const navigate = useNavigate()
  const navigateTo = (link) => {
    navigate(link)
  }

  return (
    <div className='itm' index={index}>
      <div className="m-2">
        <div className="">
          <span className="d-flex flex-column" onClick={() => navigateTo("/colection/" + collectionId)} style={{cursor: 'pointer'}}>
            <img src={avatar} className="lazy img-fluid rounded-4" width={'100%'} alt="" />
            <span ><h5 style={{marginTop: '-35px'}} className="px-4 text-truncate">{username}</h5></span>
          </span>
        </div>
        
      </div>
    </div>
  )
}

export default memo(CustomSlide);