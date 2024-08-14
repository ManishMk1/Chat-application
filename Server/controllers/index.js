const Users = require('../models/Users');
const Conversation = require('../models/Conversation');
const Messages = require('../models/Messages');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//register User
async function registerUser(req,res,next){
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            res.status(400).send("Please fill all required fields");
        } else {
            const isAlreadyExist = await Users.findOne({ email });
            if (isAlreadyExist) { res.status(400).send("User Already Exists"); }
            else {

                const newUser = new Users({ fullName, email });
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    newUser.set('password', hashedPassword);
                    newUser.save();
                    next();
                })
                return res.status(200).send("User registered successfully");
            }

        }
    }
    catch (error) {
        console.log(error, "Error");
    }
}

// login User
async function loginUser(req,res,next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send("Please fill all required fields");
        } else {
            const user = await Users.findOne({ email });
            if (!user) {
                res.status(400).send('User email or password is incorrect');
            } else {
                const validateUser = await bcrypt.compare(password, user.password);
                if (!validateUser) {
                    res.status(400).send('User email or password is incorrect');
                } else {
                    const payload = {
                        userId: user._id,
                        email: user.email
                    }
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_A_JWT_SECRET_KEY';
                    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
                        await Users.updateOne({ _id: user._id, }, {
                            $set: { token }
                        })
                        await user.save();
                        return res.status(201).json({ user: { email: user.email, fullName: user.fullName, id: user._id }, token: token })
                    })
                }

            }
        }


    } catch (error) {
        console.log(error, "Error");
    }
}

//Create Conversation
async function createConversation(req,res){
    try {
        const { senderId, receiverId } = req.body;
        const newConversation = new Conversation({ members: [senderId, receiverId] });
        await newConversation.save();
        res.status(200).send('Conversation created Successfully');
    } catch (error) {
        console.log(error, "Error");
    }
}
 
// Fetch Conversation
async function fetchConversation(req,res){
    try {
        const userId = req.params.userId;
        const conversation = await Conversation.find({ members: { $in: [userId] } });
        const conversationUserData = Promise.all(conversation.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await Users.findById(receiverId);
            return { user: { receiverId: user._id, email: user.email, fullName: user.fullName }, conversationId: conversation._id }
        }))
        res.status(200).json(await conversationUserData);
    } catch (error) {
        console.log(error, "error");
    }
}

// Create Message
async function createMessage(req,res){
    try {

        const { conversationId, senderId, message, receiverId = '' } = req.body;
        if (!senderId || !message) {
            return res.status(400).send('Please fill all required fields');
        }
        if (conversationId === 'new' && receiverId) {
            const newConversation = new Conversation({ members: [senderId, receiverId] });
            newConversation.save();
            const newMessage = new Messages({ conversationId: newConversation._id, senderId, message });
            await newMessage.save();
           return res.status(200).send("Message sent successfully");
        } else if (!conversationId && !receiverId) {
            return res.status(400).send("Fill out all details");
        }
        const newMessage = new Messages({ conversationId, senderId, message });
        await newMessage.save();
        return res.status(200).send("Message sent successfully");

    } catch (error) {
        console.log(error, "error");
    }
}

//fetch Messages
async function fetchMessage(req,res){
    try {
        const checkMessages = async (conversationId) => {
            const messages = await Messages.find({ conversationId });
            const messageUserData = Promise.all(messages.map((async (message) => {
                const user = await Users.findById(message.senderId);
                return { user: { id: user._id, email: user.email, fullName: user.fullName }, message: message.message }
            })))
            res.status(200).json(await messageUserData);
        }
        const conversationId = req.params.conversationId;
        if (conversationId === 'new') {
            const checkConversation = await Conversation.find({ members: { $all: [req.query.senderId, req.query.receiverId] } })
            if (checkConversation.length > 0) {
                checkMessages(checkConversation[0]._id);
            } else {
                return res.status(200).json([]);
            }

        } else {
            checkMessages(conversationId);
        }

    } catch (error) {
        console.log(error, "Error");
    }
}
// receiver User Data fetching
async function receiverData(req,res){
    try {
        const userId = req.params.userId;
        const users = await Users.find({ _id: { $ne: userId } });
        const userData = users.map((user) => {
            return { user: { email: user.email, fullName: user.fullName, receiverId: user._id } }
        })
        res.status(200).json(userData);
    } catch (error) {
        console.log("error", error);
    }
}
module.exports={
    registerUser,
    loginUser,
    createConversation,
    fetchConversation,
    createMessage,
    fetchMessage,
    receiverData
}