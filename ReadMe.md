# AI Meal Scanner

A full-stack mobile and web application that uses AI to analyze food images and extract nutritional data.

## Tech Stack
- **Frontend:** React Native (Expo), TypeScript
- **Backend:** Node.js, Express
- **AI:** Google Gemini API

## Features (Coming Soon)
- [ ] Scan food images via camera
- [ ] AI-powered nutritional breakdown
- [ ] Save meals to a daily diary

## What I Learned Building This MVP

Building this simple full-stack app helped me connect the dots between the frontend and backend.

- **React Native / Expo:** Learned how to build a mobile-first UI that runs in the browser using `<View>` and `<Text>` instead of standard HTML.
- **State Management:** Used `useState` to manage the app's memory (loading states, holding the image, and storing the AI's response).
- **Base64 Image Encoding:** Learned how to use Expo's ImagePicker to convert physical images into text strings (Base64) so they can be sent over HTTP.
- **Node.js & Express:** Created a custom backend server from scratch with CORS configured to handle cross-port requests.
- **API Integration:** Connected the backend to the Google Gemini API to analyze images and return structured JSON nutrition data.
- **Environment Variables:** Used `dotenv` to keep the Google API key hidden from the public.