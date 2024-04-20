import React, { useEffect, useState } from 'react'
import Sidebar from '../component/Sidebar'
import "./Profile.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faCakeCandles, faCalendarDays, faLocationDot, faHeart, faRetweet, faComment } from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { API_BASE_URL } from "../Config/config"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom'


const Profile = () => {
  const { UserId } = useParams()
  const [image, setImage] = useState({ preview: " ", data: " " })
  // console.log(UserId)
  const [UserData, setUserData] = useState()
  const [loading, setloading] = useState(true)
  const [userTweet, setUserTweet] = useState([])
  const [followed, setFollowed] = useState(false)
  const [btn, setbtn] = useState("follow")
  const [Name, setName] = useState("")
  const [date, setdate] = useState("")
  const [Show, setShow] = useState(false)
  const [Reply, setReply] = useState("")
  const [Liked, setLiked] = useState(false)
  const [Location, setLocation] = useState("")
  const loggedInUser = JSON.parse(localStorage.getItem("user"))
  const Dispatch = useDispatch()
  // console.log(loggedInUser._id)
  const config = {
    headers: {
      "Content-type": "application/json",
      "authorization": "Bearer " + localStorage.getItem("token")
    }

  }

  /**
   * The function `ProfileData` is an asynchronous function that retrieves user profile data from an API
   * and sets the data in the state variables.
   */
  const ProfileData = async () => {
    try {
      const data = await axios.get(`${API_BASE_URL}/auth/User/${UserId}`)
      if (data.status === 200) {
        if (data.data.user.Followers.find(p => p === loggedInUser._id)) {
          console.log("you followed this profile")
          setFollowed(true)
          setbtn("Unfollow")
        }
        setUserData(data.data.user)
        setUserTweet(data.data.UserTweet)
        setloading(false)
        setName(data.data.user.Name)
        setdate(data.data.user.DOB)

        console.log(data)
      }

    }
    catch (err) {
      console.log(err)
      setloading(false)
      toast.error(err.response.data.msg || "Internal server Error")
    }
  }

  const clickBtn = async () => {
    try {
      if (followed) {
        const resp = await axios.get(`${API_BASE_URL}/Unfollow/User/${UserId}`, config)
        if (resp.status === 200) {
          console.log(resp.data)
          setbtn("follow")
          setFollowed(false)
          toast.info(`you Unfollowed ${UserData.Name}`)
        }
      }
      else if (!followed) {
        const resp = await axios.get(`${API_BASE_URL}/follow/User/${UserId}`, config)
        if (resp.status === 200) {
          console.log(resp.data)
          setbtn("Unfollow")
          setFollowed(true)
          toast.info(`you followed ${UserData.Name}`)
        }
      }
      ProfileData()
    } catch (err) {
      console.log(err)
    }

  }
  /**
   * The above code defines a function that handles file uploads by creating a preview of the image and
   * sending it to a server using axios.
   * @param event - The event parameter is an object that represents the event that triggered the file
   * handling function. In this case, it is likely an event object that is generated when a file is
   * selected by the user in an input field.
   */

  const handleFile = (event) => {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0]
    }
    setImage(img)
  }
  const handleImageupload = async () => {
    try {
      const formdata = new FormData()
      formdata.append('file', image.data)
      // console.log(formdata)
      const response = await axios.post(`${API_BASE_URL}/upload`, formdata)
      // console.log(formdata)
      return response;

    }
    catch (err) {
      console.log(err)
    }
  }


  const uploadProfilePic = async () => {
    try {
      const response = await handleImageupload()
      const data = await axios.put(`${API_BASE_URL}/User/uploadPP`, {
        ProfilePic: `${API_BASE_URL}/files/${response.data.filename}`
      }, config)
      if (response.status === 200) {
        console.log(data.data)
        Dispatch({ type: "LOGIN_SUCCESS", payload: data.data.tweets })
        ProfileData()
        setImage({ preview: "", data: "" })

        toast.info("Profile Picture Updated")
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  const EditData = async () => {
    try {
      const data = await axios.put(`${API_BASE_URL}/Edit/User`, {
        Name: Name,
        DOB: date,
        Location: Location
      }, config)
      if (data.status === 201) {
        Dispatch({ type: "LOGIN_SUCCESS", payload: data.data.user })
        ProfileData()
        console.log(data.data)
        toast.info("profile has been updated")
        setName("")
        setdate("")
        setLocation("")
      }
    } catch (err) {
      console.log(err)
    }

  }
  const comment = (e) => {
    e.preventDefault()
    if (Show) {
      setShow(false)
    } else
      setShow(true)

  }
  /**
   * The function ReplyTweet is an asynchronous function that sends a reply to a tweet using an axios
   * post request.
   * @param id - The id parameter is the unique identifier of the tweet that you want to reply to.
   * @param e - The parameter "e" is an event object that is passed to the function when an event (such
   * as a form submission) occurs. It is commonly used to prevent the default behavior of the event, such
   * as preventing a form from being submitted or a link from being followed. In this case, the
   */
  const ReplyTweet = async (id, e) => {
    try {
      e.preventDefault()
      const replied = await axios.post(`${API_BASE_URL}/Reply/tweet/${id}`, {
        Content: Reply
      }, config)


      if (replied.status === 200) {
        toast.success("you Replied the tweet")
        ProfileData()
        setShow(false)
        setReply("")
      }
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * The function `action` is an asynchronous function that handles liking and disliking a tweet, and
   * updates the state accordingly.
   * @param id - The `id` parameter is the ID of the tweet that the user wants to like or dislike.
   */
  const action = async (id) => {
    try {
      if (!Liked) {
        const likedT = await axios.get(`${API_BASE_URL}/Like/tweet/${id}`, config)
        if (likedT.status === 200) {
          toast.info("You Liked the Tweet")

          setLiked(true)

        }

      } else if (Liked) {
        const DislikeT = await axios.get(`${API_BASE_URL}/DisLike/tweet/${id}`, config)
        if (DislikeT.status === 200) {
          toast.warn("You Dislike the Tweet")

          setLiked(false)

        }

      }
      ProfileData()
    } catch (err) {
      console.log(err)
      toast.error(err.response.data.msg || "Internal server Error")
    }
  }

  useEffect(() => {
    ProfileData(UserId)
  }, [UserId])

  return (
    //
    <div className='container'>
      <div className='row'>
        <div className='col-2'>
          <Sidebar />
        </div>
        <div className='col-10 profile' >
          {loading ? (<p>loading</p>) : (
            <div className='row ' style={{ backgroundColor: "#c2e9fb" }} >
              <div className='d-flex  bg-light justify-content-between' style={{ marginTop: "140px", backgroundColor: "rgb(29 ,161 ,242)" }}>
                <img className="profile-pic ms-md-2" style={{ height: "100px", width: "100px", borderRadius: "100px" }} src={UserData.ProfilePic} alt={`${UserData.Name}'s Profile Picture`} />
                {loggedInUser._id === UserId ? (
                  <div>
                    <button className='btn btn-outline-primary my-3 mx-1 ms-5 text-center   h-50' data-bs-toggle="modal" data-bs-target="#DPModal"> Upload Profile Photo</button>

                    <button className='btn btn-outline-secondary my-3 mx-1 h-50' data-bs-toggle="modal" data-bs-target="#EditModal">Edit</button>
                  </div>
                ) : (<button className='btn btn-dark my-3 h-50' onClick={() => clickBtn()}>{btn}</button>)}
              </div>

              <div className='bg-light'>
                <p className='fw-bold mx-4' >{UserData.Name}</p>
                <p className='text-muted mx-4' style={{ marginTop: "-20px" }}>@{UserData.UserName}</p>
                <div className='row'>
                  <div className='col-12'>
                    <FontAwesomeIcon className='me-1' icon={faCakeCandles} /> DOB  {new Date(UserData.DOB).getDate()}-{new Date(UserData.DOB).getMonth() + 1}-{new Date(UserData.DOB).getFullYear()}
                    <FontAwesomeIcon className="ms-5" icon={faLocationDot} /> Location {UserData.Location}
                  </div>

                  <div className='col-12'>
                    <FontAwesomeIcon className='me-2' icon={faCalendarDays} />Joined {new Date(UserData.createdAt).getDate()}-{new Date(UserData.createdAt).getMonth() + 1}-{new Date(UserData.createdAt).getFullYear()}
                  </div>
                </div>
                <div className='d-flex my-3 '>
                  <h6 className='fw-bold '>{UserData.Following.length} Following </h6>
                  <h6 className='fw-bold mx-3'> {UserData.Followers.length} Followers </h6>
                </div>
              </div>
              <div className='bg-light' >
                <h4 className='text-center'>Tweets and Reply</h4>
                <hr />
                {userTweet.map(P => {
                  return (
                    <div className="card w-75  mt-2  ms-5">
                      <div className='d-flex '>
                        <img className="profile-pic ms-md-2" src={UserData.ProfilePic} alt={`${UserData.Name}'s Profile Picture`} />
                        <p className=' card-text fw-bold ' >{UserData.Name}</p>
                        <p className='card-text text-muted mb-0'>- {new Date(P.createdAt).getDate()}-{new Date(P.createdAt).getMonth() + 1}-{new Date(P.createdAt).getFullYear()} </p>
                      </div>
                      <div className="card-body">
                        <h6 className="card-title">{P.Content}</h6>
                        {P.Image ?
                          <div className='photo-wrapper '>
                            <img
                              src={P.Image}
                              className="img-fluid "
                              alt="Tweet Image"
                            />
                          </div>
                          : ""}
                        <div className='mt-4'>
                          <FontAwesomeIcon className='mx-3 btn' onClick={(e) => action(P._id)} icon={faHeart} style={{ color: "#ec0909" }} />{P.Likes.length}
                          <FontAwesomeIcon className='mx-3 btn' onClick={(e) => comment(e)} icon={faComment} style={{ color: "#a2b9e2", }} />

                          <FontAwesomeIcon className='mx-3 btn' icon={faRetweet} style={{ color: "#19c836", }} />
                          {Show ?
                            <form className='d-flex' onSubmit={(e) => ReplyTweet(P._id, e)}>
                              <input className='form-control w-50' type='text' onChange={(e) => setReply(e.target.value)} placeholder='Reply your tweet' />
                              <input className="btn btn-tweet ms-2" type='submit' />
                            </form> : ""
                          }
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        <div className="modal fade" id="DPModal" tabindex="-1" aria-labelledby="twitterModelLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="twitterModelLabel">Upload Profile Pic</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className='note'>
                  <p><span className='text'>Note: The image should be square in shape.</span></p>
                </div>
                <div className='choose-file mt-2'>
                  <input type='file' onChange={(e) => handleFile(e)} />
                </div>
                {(image.preview) ?
                  <img className='img-fluid mt-2' src={image.preview} alt="Uploaded Preview" /> : " "
                }
              </div>
              <div className="modal-footer">
                <button typer="button" className="btn btn-secondary " data-bs-dismiss="modal" aria-label="Close">Close</button>
                <button type="button" onClick={(e) => uploadProfilePic()} data-bs-dismiss="modal" className="btn btn-primary">Save Profile Pic</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="EditModal" tabindex="-1" aria-labelledby="twitterModelLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="twitterModelLabel">Edit Profile</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <label htmlFor="name" className='ms-2 mb-2'>Name</label>
                <input type='text' className='form-control mb-2' value={Name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
                <label htmlFor="name" className='ms-2 mb-2'>Location</label>
                <input type='text' className='form-control mb-2' value={Location} onChange={(e) => setLocation(e.target.value)} placeholder='Location' />
                <label htmlFor="name" className='ms-2 mb-2 mb-2'>Date of Birth</label>
                <input type='date' className='form-control' value={date} onChange={(e) => setdate(e.target.value)} placeholder='Date Of Birth' />
              </div>
              <div className="modal-footer">
                <button typer="button" className="btn btn-secondary " data-bs-dismiss="modal" aria-label="Close">Close</button>
                <button type="button" onClick={(e) => EditData(e)} data-bs-dismiss="modal" className="btn btn-primary">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
