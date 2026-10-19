// const express = require("express");

// const {
//     generatePersonas,
//     chatWithPersona
// } = require("../controllers/personaController");

// const router = express.Router();

// // Generate synthetic personas
// router.post("/generate", generatePersonas);

// // Chat with selected synthetic persona
// router.post("/chat", chatWithPersona);

// module.exports = router;
//2
const express = require("express");

const {
    generatePersonas,
    chatWithPersona,
    surveyWithPersonas,
    extractInsights
} = require("../controllers/personaController");

const router = express.Router();

// Generate synthetic personas
router.post("/generate", generatePersonas);

// Chat with selected synthetic persona
router.post("/chat", chatWithPersona);

// Survey all selected synthetic personas
router.post("/survey", surveyWithPersonas);
router.post("/insights", extractInsights);
module.exports = router;