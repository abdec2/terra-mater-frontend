import React, { forwardRef, memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Footer from './../../../components/components/footer';
import * as selectors from '../../../store/selectors';
import { fetchCollections, fetchCollectionNfts, searchCollectionNFT } from "../../../store/actions/thunks";
import { useParams } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from 'react-bootstrap/Spinner';
import NftCard from '../../../components/components/NftCard';
import Form from 'react-bootstrap/Form';
import auth from './../../../core/auth'


import "./profile.css"


//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../../../components/Styles';
import { DiscordIcon, EtherscanIcon, TwitterIcon, UsdtIcon, WebsiteIcon } from "./../../components/Icons";
import TooltipIcon from "./../../components/TooltipIcon";
import { Button, Modal } from "react-bootstrap";
import CheckboxFilter from "../../../components/components/CheckboxFilter";
import { clearFilter, clearCollectionNfts } from "../../../store/actions";
import Tabs from "../../components/Tabs";
import useFetchNFT from "../../../hooks/useFetchNft";
import axios from "axios";
import api from "../../../core/api";
//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO

const CustomToggle = forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    className="px-2"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}

  </a>
));

const Profile = function () {
  const userInfo = auth.getUserInfo()
  const [fetchNFTs, setFetchNfts] = useState(true)
  const [page, setPage] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileInput, setFileInput] = useState()
  const nfts = useFetchNFT(userInfo.address, fetchNFTs, setFetchNfts, page, setPage)
  console.log(nfts)

  const handleUploadClose = () => setShowUpload(false);
  const handleUploadShow = () => setShowUpload(true);

  const createAvatar = async (file) => {
    try {
      const data = new FormData()
      data.append("data", JSON.stringify({"users_permissions_user": userInfo.id}))
      data.append("files.avatar", fileInput[0])
      await axios.post(`${api.baseUrl}/api/user-avatars`, data, {
        headers: {
          Authorization: `Bearer ${auth.getToken()}`
        }
      })
    } catch (e) {
      setLoading(false)
      console.log(e)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const avatar = await getAvatar()
    console.log(fileInput[0])

    if (avatar.length > 0) {
      const formdata = new FormData()
      formdata.append('files', fileInput[0])
      formdata.append('ref', "api::user-avatar.user-avatar")
      formdata.append('refId', avatar[0].id)
      formdata.append('field', 'avatar')

      if(avatar[0].attributes.avatar.data)  {
        await axios.delete(`${api.baseUrl}/api/upload/files/${avatar[0].attributes.avatar.data.id}`, {
          headers: {
            Authorization: `Bearer ${auth.getToken()}`
          }
        })
      }

      await axios.post(`${api.baseUrl}/api/upload`, formdata, {
        headers: {
          Authorization: `Bearer ${auth.getToken()}`
        }
      })
    } else {
      await createAvatar()
    }
    setLoading(false)
    document.location.reload()

  }

  const getAvatar = async () => {
    try {
      const res = await axios.get(`${api.baseUrl}/api/user-avatars?populate=*&filters[users_permissions_user]=${userInfo.id}`)
      console.log(res.data.data)
      setAvatar(res.data.data[0]?.attributes.avatar.data?.attributes.url)
      return res.data.data
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getAvatar()
  }, [avatar])

  return (
    <div className="greyscheme">
      {
        loading && (
          <div className="loadingDiv">
            <div className="spinnerDIv">
              <Spinner animation="border" variant="secondary" /> 
            </div>
              
          </div>
        )
      }
      <StyledHeader theme={theme} />
      <section id='profile_banner' className='jumbotron breadcumb ' style={{ background: 'url("./img/background/6.jpg")' }}>
        <div className='mainbreadcumb'>
          <h1 className="text-center">Profile</h1>
        </div>
      </section>
      <section className='container-fluid d_coll no-top no-bottom pb-5 mb-5'>
        <div className='row'>
          <div className="col-md-12">
            <div className="px-2 px-md-5" >
              <div className="bg-success position-relative border-white border border-4 rounded-circle p-1 uploadDiv" style={{ width: '150px', height: '150px', marginTop: '-120px', cursor: 'pointer', background: `url("${avatar}") no-repeat` }} onClick={handleUploadShow}>

              </div>
            </div>
            <div className="px-2 px-md-5 d-flex  align-items-start justify-content-between flex-column flex-md-row flex-md-row-reverse">
              <div className="d-flex align-items-center justify-content-center collection-social-icon-parent ms-auto">

              </div>
              <div className="mt-4 d-flex align-items-center">
                <h2 className="fw-normal m-0 me-2 fs-2">
                  {/* {hotCollections && hotCollections.name} */}
                  {`${userInfo.address.slice(0, 5)}...${userInfo.address.slice(37, 42)}`}
                </h2>
                <i className="fa fa-check text-white bg-primary p-1 rounded-5 " style={{ marginTop: '-15px' }}></i>
              </div>

            </div>
          </div>
        </div>

      </section>

      <section className="container-fluid px-2 px-md-5 no-top">
        <div className="row">
          <div className="col-12">
            <Tabs nfts={nfts} setFetchNfts={setFetchNfts} />
          </div>
        </div>

      </section>

      <Footer />
      {
        showUpload && (
          <div className='checkout'>
            <div className='maincheckout'>
              <button className='btn-close' onClick={handleUploadClose}>x</button>
              <div className='heading'>
                <h3>Upload Image</h3>
              </div>
              <div className='mt-3'>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.File id="uploadFile" label="Upload image" required accept=".jpg, .jpeg, .gif, .png" onChange={(e) => setFileInput(e.target.files)} />
                  </Form.Group>
                  <button className="btn-main lead" type="submit">Upload</button>
                </Form>
              </div>
              <div className="d-flex flex-row">
                <div className="w-100 px-2">

                </div>
              </div>

            </div>
          </div>
        )
      }


      {/* <Modal show={showUpload} onHide={handleUploadClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUploadClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUploadClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
}
export default memo(Profile);