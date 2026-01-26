# 🍎 FoodSnap AI

An AI-powered nutrition tracking app that analyzes food photos using Google Gemini to provide detailed nutritional information, personalized feedback, and health insights.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-12.8-FFCA28?logo=firebase)

## ✨ Features

- 📸 **Smart Food Capture** - Take photos or upload images of your meals
- 🤖 **AI Analysis** - Powered by Google Gemini 1.5 Flash for accurate food recognition
- 📊 **Detailed Nutrition** - Get calorie estimates, macros, and portion sizes
- 🎭 **Personalized Personas** - Choose from Gamer, Learner, Athlete, or Navigator modes
- 🌙 **Dark Mode** - Beautiful dark theme support
- 📱 **Mobile First** - Optimized for mobile devices with camera access

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/foodsnap-ai.git
cd foodsnap-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router 7
- **Styling**: TailwindCSS, Framer Motion
- **AI**: Google Gemini 1.5 Flash API
- **Image Hosting**: imgbb API
- **Backend**: Firebase (Authentication ready)
- **Build Tool**: Vite
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Button, ThemeToggle, etc.
│   └── BottomNav.jsx
├── context/         # React Context (Auth, Theme)
├── pages/           # Route pages
│   ├── Welcome.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Capture.jsx
│   ├── Analysis.jsx
│   └── Trends.jsx
└── utils/           # Utility functions
    ├── gemini.js    # Gemini AI integration
    ├── imgbb.js     # Image upload
    └── firebase.js  # Firebase config
```

## 🎭 Personas

| Persona | Focus |
|---------|-------|
| 🎮 **Gamer** | Gamified feedback, energy focus |
| 📚 **Learner** | Educational nutrition facts |
| 🏃 **Athlete** | Macros, performance fuel |
| 🧭 **Navigator** | Health condition monitoring |

## 🔧 Environment Variables

Create a `.env` file for production:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect the Vite configuration
3. Deploy!

The `vercel.json` is pre-configured for SPA routing.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using React and Google Gemini AI
