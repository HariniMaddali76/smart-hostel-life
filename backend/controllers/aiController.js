const { GoogleGenerativeAI } = require("@google/generative-ai");
const Complaint = require("../models/Complaint");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAIInsights = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("student", "name email")
            .sort({ createdAt: -1 });

        if (complaints.length === 0) {
            return res.json({
                insights: "No complaints available for analysis."
            });
        }

        const complaintData = complaints.map((complaint) => ({
            category: complaint.category,
            description: complaint.description,
            status: complaint.status
        }));

        const model = genAI.getGenerativeModel({
          model: "gemini-3.6-flash"
      }); 

        const prompt = `
You are an AI assistant for a hostel management system.

Analyze the following hostel complaint data:

${JSON.stringify(complaintData, null, 2)}

Return ONLY valid JSON.

Use exactly this structure:

{
  "mostCommonCategory": "string",
  "pending": 0,
  "resolved": 0,
  "problems": [
    "string"
  ],
  "recommendations": [
    "string"
  ]
}

Rules:
- mostCommonCategory should be the most frequent complaint category.
- pending should be the exact number of Pending complaints.
- resolved should be the exact number of Resolved complaints.
- problems should contain important recurring problems found in the data.
- recommendations should contain two practical recommendations for the hostel administrator.
- Do not invent information.
- Do not include markdown.
- Do not include code fences.
`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        res.json({
            insights: response
        });

    }catch (error) {
    console.error("AI Insights Error:", error);

    res.status(500).json({
        message: error.message
    });
}
}
module.exports = {
    getAIInsights
};