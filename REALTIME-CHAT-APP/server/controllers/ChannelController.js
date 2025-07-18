import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;

    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const validMembers = await User.find({
      _id: {
        $in: members,
      },
    });

    if (validMembers.length !== members.length) {
      return res.status(400).json({ message: "Some Members are not found." });
    }

    const newChannel = new Channel({
      name,
      members,
      admin: admin._id,
    });

    await newChannel.save();
    return res.status(201).json({ channel: newChannel, message: "Channel created successfully" });
  } catch (error) {
    console.log("Error in createChannel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserChannels = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ members: userId }, { admin: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(201).json({ channels, message: "Channels retrieved successfully" });
  } catch (error) {
    console.log("Error in getUserChannels:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId)
      .populate({
        path: "message",
        populate: {
          path: "sender",
          select: "_id email firstName lastName image color",
        },
      })
      .sort({ createdAt: -1 });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const messages = channel.message;

    return res.status(200).json({ messages, message: "Messages retrieved successfully" });
  } catch (error) {
    console.log("Error in getChannelMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
