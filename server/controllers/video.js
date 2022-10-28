import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can update only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("The video has been deleted.");
    } else {
      return next(createError(403, "You can delete only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
};

export const random = async (req, res, next) => { // random koi bhi video aaega
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);   // 40 random video show krega
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });  //  -1 kiya mtlb most view video 
                                                                                    // sort krke most view video find kiya    
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        return await Video.find({ userId: channelId });
      })
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));  // i want all subcribed video in a  single array for this we use flat
                                                                                                               // this is javascript sorting method  by which we get newest video first
  } catch (err) {
    next(err);
  }
};

export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};





// //Pattern matching using $regex operator
// This operator provides regular expression capabilities for pattern matching stings in the queries. Or in other words,
//  this operator is used to search for the given string in the specified collection. It is helpful when we don’t know the 
//  exact field value that we are looking in the document. For example, a collection containing 3 documents i.e.,

// {
// name: "Tony",
// position: "Backend developer"
// }  
// {
// name: "Bruce",
// position: "frontend developer"
// }  
// {
// name: "Nick",
// position: "HR Manager"
// } 
// and we are looking for developer information. So, with the help of the $regex operator, 
// we create a pattern(i.e., {position: {$regex: “developer”}}) 
// that will return only those documents that contain developer string.




// $options:

// In MongoDB, the following <options> are available for use with regular expression:

// i: To match both lower case and upper case pattern in the string.
// m: To include ^ and $ in the pattern in the match i.e. to specifically search for ^ and $ inside the string. 
// Without this option, these anchors match at the beginning or end of the string.
// x: To ignore all white space characters in the $regex pattern.
// s: To allow the dot character “.” to match all characters including newline characters.
