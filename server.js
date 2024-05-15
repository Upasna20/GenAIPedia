const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash-latest',
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
};

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: [
        {
            role: 'user',
            parts: [
                { text: 'Please act like a chatbot that gives human-like answers. Try not to answer in bullets and make your statements more human.' },
            ],
        },
        {
            role: 'model',
            parts: [
                { text: "Okay, I'm ready! Just ask me anything. I'll do my best to give you a friendly and helpful response, as if I were a real person having a conversation with you. 😉 What's on your mind?\n" },
            ],
        },
    ],
});

app.post('/api/chat', async (req, res) => {
    const prompt = req.body.prompt;
    try {
        const result = await chatSession.sendMessage(prompt);
        res.json({ response: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
