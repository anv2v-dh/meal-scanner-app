/*const express = require('express'); //importing express
const cors = require('cors'); //importing cross origin resource sharing
require('dotenv').config(); //.env is the sensitive file, dotenv is a package that is being imported here that reads the .env file and reads the key value pairs and makes them accessible where it is needed

const app = express(); //creating the app
const PORT = 3000; //creating the port

app.use(cors()); //this function declr lets both ends talk w one another that is cors
app.use(express.json({ limit: '10mb' })); //file size increasing right now because express doesnt allow big files generally

app.get('/', (req, res) => {
  res.send('Meal Scanner Backend is running!');
}); // a request, resolve function that sends a message on the page on the port 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});// terminal display and gives the port makes the server listen on specific port for requests*/

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai'); //ai tool imported
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); //initializing gemini by taking key from .env file we created 

app.get('/', (req, res) => {
  res.send('Meal Scanner Backend is running!');
});

//taking the image giving it to the model, providing it the prompt getting back the response, cleaning it with error handling
app.post('/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `
      You are a nutrition expert. Analyze this food image.
      Return ONLY a JSON object with this exact structure, no other text:
      {
        "foodName": "Name of the food",
        "calories": 000,
        "protein": 00,
        "carbs": 00,
        "fat": 00
      }
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
    ]);

    const responseText = result.response.text();
    
    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    
    res.json(JSON.parse(cleanJson));

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});
//

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});