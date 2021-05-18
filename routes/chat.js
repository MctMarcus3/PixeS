const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("chats/chat");
});

module.exports = router;