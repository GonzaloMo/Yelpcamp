const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    console.log('Hello from the blueprint router!');
});

module.exports = router;
