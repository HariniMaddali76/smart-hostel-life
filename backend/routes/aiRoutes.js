const express = require("express");

const {
    getAIInsights
} = require("../controllers/aiController");

const router = express.Router();

router.get("/insights", getAIInsights);

module.exports = router;