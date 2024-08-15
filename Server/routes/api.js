const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    createConversation,
    fetchConversation,
    createMessage,
    fetchMessage,
    receiverData
} = require("../controllers")
router.get('/', (req, res) => {
    res.send({ message: "Welcome", success: "okay" });
})
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/conversation', createConversation)
router.get('/conversation/:userId', fetchConversation)
router.post('/message', createMessage)
router.get("/message/:conversationId", fetchMessage)
router.get('/users/:userId', receiverData)
module.exports = router;