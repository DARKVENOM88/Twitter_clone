import React, { useEffect, useState } from 'react';
import './Home.css';
import { API_BASE_URL } from '../Config/config';
import Sidebar from '../component/Sidebar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faRetweet, faComment, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [image, setImage] = useState({ preview: "", data: "" });
  const [Content, setContent] = useState("");
  const [loading, setloading] = useState(false);
  const [tweets, settweets] = useState([]);
  const [Liked, setLiked] = useState(false);
  const [Reply, setReply] = useState("");
  const [Show, setShow] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const Navigate = useNavigate();

  const config = {
    headers: {
      "Content-type": "application/json",
      "authorization": "Bearer " + localStorage.getItem("token")
    }
  };

  const handleFile = (event) => {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0]
    };
    setImage(img);
    setloading(true);
  };

  const handleImageupload = async () => {
    try {
      const formdata = new FormData();
      formdata.append('file', image.data);
      const response = await axios.post(`${API_BASE_URL}/upload`, formdata);
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  const tweet = async (e) => {
    try {
      e.preventDefault();
      if (loading) {
        const imageRes = await handleImageupload();
        const tweetdata = await axios.post(`${API_BASE_URL}/Create/tweet`, {
          Content: Content,
          Image: `${API_BASE_URL}/files/${imageRes.data.filename}`
        }, config);
        if (tweetdata.status === 201) {
          toast.success("tweet Uploaded");
          setImage({ preview: "", data: "" });
          setContent("");
          setloading(false);
          showAlltweet();
        }
        return;
      }
      const tweetdata = await axios.post(`${API_BASE_URL}/Create/tweet`, {
        Content: Content
      }, config);
      if (tweetdata.status === 201) {
        toast.success("tweet Uploaded");
        setImage({ preview: "", data: "" });
        setContent("");
      }
      showAlltweet();
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.msg || "Internal server Error");
    }
  };

  const showAlltweet = async () => {
    try {
      const data = await axios.get(`${API_BASE_URL}/tweet`);
      if (data.status === 200) {
        settweets(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTweet = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/Delete/tweet/${id}`, config);
      if (response.status === 200) {
        toast.warn("tweeet deleted");
        showAlltweet();
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.msg || "Internal server Error");
    }
  };

  const action = async (id) => {
    try {
      if (!Liked) {
        const likedT = await axios.get(`${API_BASE_URL}/Like/tweet/${id}`, config)
        if (likedT.status === 200) {
          toast.info("You Liked the Tweet")

          setLiked(true)
          showAlltweet()
        }

      } else if (Liked) {
        const DislikeT = await axios.get(`${API_BASE_URL}/DisLike/tweet/${id}`, config)
        if (DislikeT.status === 200) {
          toast.warn("You Dislike the Tweet")

          setLiked(false)
          showAlltweet()
        }
      }
    } catch (err) {
      console.log(err)
      toast.error(err.response.data.msg || "Internal server Error" || "Internal server Error")
    }
  }
  /**
   * The function `ReplyTweet` is an asynchronous function that sends a reply to a tweet using an HTTP
   * POST request.
   * @param id - The `id` parameter is the unique identifier of the tweet that you want to reply to. It
   * is used to specify which tweet you are replying to.
   * @param e - The parameter `e` is an event object that is passed to the function when it is
   * triggered by an event, such as a form submission. It is commonly used to prevent the default
   * behavior of the event, such as form submission, by calling the `preventDefault()` method on it.
   */
  const ReplyTweet = async (id, e) => {
    try {
      e.preventDefault()
      const replied = await axios.post(`${API_BASE_URL}/Reply/tweet/${id}`, {
        Content: Reply
      }, config)
      if (replied.status === 200) {
        toast.success("you Replied the tweet")
        showAlltweet()
        setShow(false)
        setReply("")
      }
    } catch (err) {
      console.log(err.response.data.msg || "Internal server Error")
    }


  }
  /**
   * The function `tweetDetails` takes an `id` parameter and navigates to the tweet details page with
   * the specified `id`.
   * @param id - The id parameter is the unique identifier of a tweet.
   */
  const tweetDetails = (id) => {
    Navigate(`/TweetDetails/${id}`)
  }
  const comment = (e) => {
    e.preventDefault()
    if (Show) {
      setShow(false)
    } else
      setShow(true)

  }

  /**
   * The function `Retweet` is an asynchronous function that sends a GET request to a specified URL with
   * a given ID, and if the request is successful, it shows all tweets and displays a toast message
   * saying "you Retweeted".
   * @param id - The `id` parameter is the unique identifier of the tweet that you want to retweet.
   */
  const Retweet = async (id) => {
    try {
      const retweetdata = await axios.get(`${API_BASE_URL}/Retweet/${id}`, config)
      if (retweetdata.status === 200) {
        // console.log(retweetdata.data.data.Retweet)
        showAlltweet()
        toast.info("you Retweeted")
      }

    } catch (err) {
      console.log(err)
      toast.error(err.response.data.msg || "Internal server Error")
    }

  }
  const otherProfile = (id) => {
    Navigate(`/Profile/${id}`)
  }


  useEffect(() => {
    showAlltweet();
  }, []);

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-2'>
          <Sidebar />
        </div>
        <div className='home col-10'>
          <div className='d-flex justify-content-between '>
            <h3 className='fw-bold homehead'>Home</h3>
            <button className='btn btn-tweet  buttonHome' data-bs-toggle="modal" data-bs-target="#twitterModel">Tweet</button>
          </div>

          {tweets.map(p => {
            return (

              <div className="card w-75 ms-5 mt-2">
                <div className='d-flex mt-2 justify-content-end'>
                  {p.TweetedBy._id === user._id ? <FontAwesomeIcon onClick={() => deleteTweet(p._id)} className='me-2' icon={faTrash} /> : ""}
                </div>
                {p.Retweet.length > 0 ? <p className='text-muted ms-3 fs-6 fw-bold'> <FontAwesomeIcon icon={faRetweet} onClick={() => Retweet()} style={{ color: "#19c836", }} />Retweeted by {p.Retweet[0].Name}  </p> : ""}
                <div className='d-flex '>
                  <img className="profile-pic ms-md-2" onClick={() => otherProfile(p.TweetedBy._id)} src={p.TweetedBy.ProfilePic} alt="Profile Picture" />
                  <p className=' card-text fw-bold  me-2'>{p.TweetedBy.Name}</p>
                  <p className='fs-6 text-muted mb-0'>  {new Date(p.createdAt).getDate()}/{new Date(p.createdAt).getMonth() + 1}/{new Date(p.createdAt).getFullYear()}</p>

                </div>
                <div className="card-body cardbody">
                  <h6 className="card-title fs-4 ms-2" onClick={(e) => tweetDetails(p._id)}>{p.Content}</h6>
                  {p.Image ?
                    <div className='photo-wrapper '>
                      <img
                        src={p.Image}
                        className="img-fluid " // Use 'img-fluid' to ensure responsive images
                        alt="Logo"
                      />
                    </div>

                    : ""}

                  <div className='mt-4'>
                    <FontAwesomeIcon className='me-1 btn' onClick={(e) => action(p._id)} icon={faHeart} style={{ color: "#ec0909" }} />{p.Likes.length}
                    <FontAwesomeIcon className='me-1 btn' onClick={(e) => comment(e)} icon={faComment} style={{ color: "#a2b9e2", }} />

                    <FontAwesomeIcon className=' btn' onClick={(e) => Retweet(p._id)} icon={faRetweet} style={{ color: "#19c836", }} />{p.Retweet.length}
                    {Show ?
                      <form className='d-flex' onSubmit={(e) => ReplyTweet(p._id, e)}>
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
      <div className="modal fade" id="twitterModel" tabindex="-1" aria-labelledby="twitterModelLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="twitterModelLabel">New Tweet</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className='row'>
                <div className='col'>
                  <div>
                    <textarea id='tweetContent' className='form-control mb-3' placeholder='What&apos;s happening?' rows='3' value={Content} onChange={(e) => setContent(e.target.value)}></textarea>
                  </div>
                </div>
              </div>
              <div className='mb-3'>
                {/* Hide the file input */}
                <input type="file" id="fileInput" className="form-control" accept=".jpg,.jpeg,.png" style={{ display: 'none' }} onChange={(e) => handleFile(e)} />
                {/* Replace the file input with an icon */}
                <i className="fa-solid fa-image position-absolute start-0 bottom-0 m-3" style={{ cursor: 'pointer' }} onClick={() => document.getElementById('fileInput').click()}></i>
              </div>

              {(image.preview) ?
                <img className='img-fluid' src={image.preview} /> : " "

              }
            </div>
            <div className="modal-footer">
              <button typer="button" className="btn btn-secondary " data-bs-dismiss="modal" aria-label="Close">Close</button>
              <button type="button" onClick={(e) => tweet(e)} data-bs-dismiss="modal" className="btn btn-primary">Tweet</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
