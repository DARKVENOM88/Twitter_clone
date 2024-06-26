const Tweet = require("../models/Tweet")

/* The `exports.Createtweet` function is responsible for creating a new tweet. It is an asynchronous
function that takes in the request (`req`), response (`res`), and next middleware function (`next`)
as parameters. */
exports.Createtweet = async (req, res, next) => {
    try {
        const { Content,Image } = req.body
        if (!Content) {
            return res.status(400).json({ msg: "content is required" })
        }
        const data = new Tweet({
            Content: Content,
            TweetedBy: req.user,
            Image:Image
        })
        const tweets = await data.save()
        req.user.Tweets.push(tweets._id)
        req.user.save()
        return res.status(201).json({ msg: "User tweets", tweets })
    } catch (err) {
        console.log(err)
    }

}

/* The `exports.liketweet` function is responsible for handling the functionality of liking a tweet. */
exports.liketweet = async (req, res, next) => {
    try {
        const { tweetId } = req.params
        const data = await Tweet.findById(tweetId)
        if (!data) {
            return res.status(404).json({ msg: "no tweets found" })
        }
        // if (data.Likes.find(p => p._id.toString() === req.user._id.toString())) {
        //     return res.status(400).json({ msg: "user has already liked the tweet" })
        // }
         data.Likes.push(req.user)
       await data.save()
        return res.status(200).json({ msg: `${req.user.Name} has liked the tweet` })

    }
    catch (err) {
        console.log(err)
    }
}
/* The `exports.Disliketweet` function is responsible for handling the functionality of disliking a
tweet. It takes in the request (`req`), response (`res`), and next middleware function (`next`) as
parameters. */
exports.Disliketweet = async (req, res, next) => {
    try {
        const { tweetId } = req.params
        const data = await Tweet.findById(tweetId)
        if (!data) {
            return res.status(404).json({ msg: "no tweets found" })
        }    
           data.Likes.pull(req.user)
           await data.save()
            return res.status(200).json({ msg: `${req.user.Name} has disliked the tweet` })
        
       
    }
    catch (err) {
        console.log(err)
    }
}

/* The `Replytweet` function is responsible for handling the functionality of replying to a tweet. It
takes in the request (`req`), response (`res`), and next middleware function (`next`) as parameters. */
exports.Replytweet = async (req, res, next) => {
    try {
        const { tweetId } = req.params
        const { Content } = req.body
        const data = await Tweet.findById(tweetId)
        if (!data) {
            return res.status(404).json({ msg: "no tweets found" })
        }
        const reply = new Tweet({
            Content: Content,
            TweetedBy: req.user
        })
        const Replydata = await reply.save()
        data.Reply.push(Replydata._id)
        req.user.Tweets.push(Replydata._id)
        await data.save()
        await req.user.save()
        return res.status(200).json({ msg: `${req.user.Name} replied`, Replydata })

    }
    catch (err) {
        console.log(err)
    }
}



/* The `gettweetDetail` function is an asynchronous function that retrieves the details of a specific
tweet from the database. It takes in the request (`req`), response (`res`), and next middleware
function (`next`) as parameters. */
exports.gettweetDetail = async (req, res, next) => {
    try {
        const {tweetId}=req.params
        const Twt=await Tweet.findById(tweetId).populate("TweetedBy" ,"Name createdAt ProfilePic")
        if(!Twt){
            return res.status(404).json({msg:"Tweet  not found"})
        }
        const ReplyData=await Tweet.find({_id:Twt.Reply}).populate("TweetedBy" ,"Name createdAt ProfilePic").populate("Retweet","Name")
        console.log(Twt.Reply)
        return  res.status(200).json({tweetDetail:Twt,ReplyData:ReplyData})
      
    } catch (err) {
        console.log(err)
    }

}




/* The `getAlltweetDetail` function is an asynchronous function that retrieves all tweet details from
the database. It uses the `Tweet` model to find all tweets and populates the `TweetedBy` and
`Retweet` fields with the corresponding user details. The tweets are sorted in descending order
based on their creation time. If no tweets are found, it returns a 404 status with a message.
Otherwise, it returns a 200 status with the tweet data in JSON format. */
exports.getAlltweetDetail = async (req, res, next) => {
    try {

        const data = await Tweet.find({}).populate("TweetedBy","Name UserName  ProfilePic").populate("Retweet","Name") .sort({ createdAt: -1 })
        if (!data) {
            return res.status(404).json({ msg: "no tweets found" })
        }
         
        return res.status(200).json(data)

    } catch (err) {
        console.log(err)
    }

}

/* The `deleteTweet` function is an asynchronous function that handles the deletion of a tweet. It
takes in the request (`req`), response (`res`), and next middleware function (`next`) as parameters. */
exports.deleteTweet = async (req, res, next) => {
    try {
        const { tweetId } = req.params
        const data = await Tweet.findById(tweetId)
        if (!data) {
            return res.status(404).json({ msg: "no tweets found" })
        }
      //  console.log(data)
        if (data.TweetedBy.toString() === req.user._id.toString()) {
            await Tweet.findByIdAndDelete(tweetId)
           await  req.user.Tweets.pull(tweetId)
            await req.user.save()
            return res.status(200).json({ msg: "user has delete the Tweet" })

        }

        return res.status(400).json({ msg: "user cant delete this tweet" })

    } catch (err) {
        console.log(err)
    }

}

/* The `exports.retweet` function is an asynchronous function that handles the retweet functionality.
It takes in the request (`req`), response (`res`), and next middleware function (`next`) as
parameters. */
exports.retweet=async(req,res,next)=>{
  try{
    const { tweetId } = req.params
    const data = await Tweet.findById(tweetId)
    if (!data) {
        return res.status(404).json({ msg: "no tweets found" })
    }
    if (data.Retweet.find(p => p._id.toString() === req.user._id.toString())) {
            return res.status(400).json({ msg: "user has already retweeted" })
        }
    data.Retweet.push(req.user)
    await data.save()
    return res.status(200).json({data,msg:"user has retweeted"})
  }
  catch(err){
    console.log(err)
  }

}