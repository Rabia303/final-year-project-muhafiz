# 🛡️ Muhafiz – Karachi Crime Safety & Risk Zone Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-brightgreen)
![Made with](https://img.shields.io/badge/made%20with-React%20%7C%20Flask%20%7C%20MongoDB-blue)

**Muhafiz** is a smart safety platform built to help Karachi citizens make informed decisions by visualizing crime zones, reporting incidents, and choosing safer routes based on real-time and historical crime data.

---

## 🌍 Live Demo

🔗 Coming Soon — hosted on **[Vercel](https://vercel.com/)** / **[Netlify](https://www.netlify.com/)** / **[GitHub Pages](https://pages.github.com/)**  
📱 Optimized for mobile and desktop!

---

## 📌 Table of Contents

- [🌟 Features](#-features)
- [📊 Crime Dataset](#-crime-dataset)
- [🧠 Project Goal](#-project-goal)
- [🏗️ System Architecture](#-system-architecture)
- [🧰 Tech Stack](#-tech-stack)
- [📂 Folder Structure](#-folder-structure)
- [🚀 Getting Started](#-getting-started)
- [🔐 Admin Panel](#-admin-panel)
- [💬 Community Discussion Forum](#-community-discussion-forum)
- [📈 Analytics Dashboard](#-analytics-dashboard)
- [📸 Screenshots](#-screenshots)
- [🧑‍💻 Contributors](#-contributors)
- [📄 License](#-license)

---

## 🌟 Features

- 🔥 Interactive heatmaps (zone & severity-based)
- 🛣️ Real-time safe route recommendation
- 🧠 Zone-based risk classification with ML logic
- 🧵 Community forum for reporting threats & incidents
- ⚙️ Admin panel for managing users, incidents, analytics
- 📅 Incident filter by area, date, type, urgency
- 📍 Town/subdivision crime visualization

---

## 📊 Crime Dataset

- 📌 Karachi-focused synthetic crime dataset (100,000+ records)
- 🔴 Zone & subdivision risk tagging
- 🎯 Incident fields: location, category, severity (1–5), zone (🔴🟠🟡🟢), urgency
- 🧪 Generated using:
  - Police reports
  - NGO research
  - Web-scraped sources
  - Severity scoring logic

---

## 🧠 Project Goal

> Empower citizens with transparent crime data & safe route intelligence  
> Bridge the gap between real-time incident reporting and actionable safety guidance

---

## 🏗️ System Architecture

```text
Frontend (React) <--> Express.js API <--> MongoDB (Cloud Atlas)
                               ↑
                      Flask ML API (Route Scoring)
````

* 🔐 JWT Auth (Admin)
* 🧠 ML logic (Python/Flask): risk-aware route selection using Dijkstra-based scoring

---

## 🧰 Tech Stack

| Layer     | Technologies                        |
| --------- | ----------------------------------- |
| Frontend  | React.js, Leaflet, CSS              |
| Backend   | Node.js, Express.js                 |
| ML Engine | Python, Flask, Pandas, Scikit-learn |
| Database  | MongoDB Atlas                       |
| Auth      | JWT, bcrypt                         |
| Maps      | Leaflet, Google Maps API (optional) |

---

## 📂 Folder Structure

```
muhafiz/
├── client/             # React frontend
├── server/             # Express backend (auth, API)
├── ml-engine/          # Flask API for ML-safe route logic
├── dataset/            # CSV + data generation scripts
├── public/             # Screenshots/static assets
├── README.md
```

---

## 🚀 Getting Started

### 📦 Prerequisites

* Node.js & npm
* Python 3.x
* MongoDB Atlas URI
* Google API Key (optional)

### ⚙️ Installation

```bash
# Clone repo
git clone https://github.com/your-username/muhafiz.git
cd muhafiz

# Backend setup
cd server
npm install
npm run dev

# Frontend setup
cd ../client
npm install
npm run dev

# ML Engine
cd ../ml-engine
pip install -r requirements.txt
python safe_route.py
```

* Frontend: `http://localhost:5173`
* Backend: `http://localhost:5000`
* ML Route API: `http://localhost:5001`

---

## 🔐 Admin Panel

* Login with JWT token
* Manage:

  * Users
  * Incidents
  * Posts and Discussions
  * Analytics

---

## 💬 Community Discussion Forum

* 📌 Area-based discussion channels
* 🧵 Nested replies, reactions (👍, 👎, 🚨)
* 🖼️ Media upload (suspicious images, videos)
* ⛔ Admin moderation
* 🕵️ Anonymous mode

---

## 📈 Analytics Dashboard

* 📊 Total incidents overview
* 🗺️ Heatmap toggles (zone vs severity)
* ⏱️ Date & crime type filters
* 🧠 Most dangerous areas by time

---

## 📸 Screenshots

> Add these screenshots to `/public/screenshots/` and update links below

| Heatmap View                               | Safer Route                            | Admin Panel                            |
| ------------------------------------------ | -------------------------------------- | -------------------------------------- |
| ![Heatmap](public/screenshots/heatmap.png) | ![Route](public/screenshots/route.png) | ![Admin](public/screenshots/admin.png) |

---

## 🧑‍💻 Contributors

| Name         | Role                         |
| ------------ | ---------------------------- |
| Rabia Imtiaz | Full Stack Dev, ML & Dataset |

Want to contribute? Open a PR or contact via email!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## ✉️ Contact

📬 [rabiaimtiaz@email.com](mailto:rabiaimtiaz@email.com)
🌐 LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)

---

## ⭐ Support & Feedback

If you like this project, consider giving it a ⭐ on GitHub
Have ideas or suggestions? Feel free to open an issue or feature request!

```
