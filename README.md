# 🚀 DailyCart – AI-Based Inventory Management System

DailyCart is an AI-powered inventory management system designed to help businesses efficiently manage stock, analyze sales, and predict future demand using machine learning.

---

## 🔥 Features

- 📦 Product & Inventory Management  
- 🧾 Sales & Invoice Management  
- 📊 Reports & Analytics Dashboard  
- 🔔 Low Stock, Overstock & Expiry Alerts  
- 🤖 AI Demand Forecasting (Linear Regression)  
- 📈 Sales Trends & Category Analysis  
- 💬 AI Chat Assistant (Gemini API)  
- 📡 Supplier Notification System (Telegram Bot Integration)  

---

## 🧠 AI Module

- Uses **Linear Regression (Scikit-learn)** for forecasting  
- Predicts **next 7 days sales**  
- Generates **monthly estimates**  
- Detects trends: *Increasing, Decreasing, Stable*  
- Includes fallback logic for low or no data  

---

## 🛠️ Tech Stack

**Frontend:** React.js  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**AI Service:** Python (FastAPI), Scikit-learn  
**Charts:** Recharts  
**Integration:** Gemini API, Telegram Bot API  

---

## 📂 Project Structure
client/        → React frontend  
server/        → Node.js backend  
ml-service/    → Python AI forecasting service  

---

## ⚙️ Installation & Setup

### 1. Clone the repository
git clone https://github.com/SujalDesale/ai-inventory-system.git
cd ai-inventory-system

### 2. Install dependencies
npm install
cd client && npm install

### 3. Setup environment variables
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_api_key
SUPPLIER_CHAT_ID=your_telegram_chat_id

### 4. Run backend
cd server
npm run dev

### 5. Run frontend
cd client
npm start

### 6. Run AI service
cd ml-service
uvicorn main:app --reload

---

# 👨‍💻 Author

Sujal Desale
