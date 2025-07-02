# 🛡️ Muhafiz – Karachi Crime Safety & Risk Zone Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-brightgreen)
![Made with](https://img.shields.io/badge/made%20with-React%20%7C%20Flask%20%7C%20MongoDB-blue)

**Muhafiz** is a full-stack safety intelligence platform built to help Karachi citizens make informed, safer decisions using real-time crime awareness, incident reporting, and AI-assisted safe route suggestions.

> 🎓 Final Year Computer Science Project | Combines Full Stack Development, ML, GIS, and Data Engineering

---

## 🤝 Abstract

**Muhafiz** addresses the critical issue of urban crime in Karachi by providing an all-in-one solution for visualizing high-risk zones, recommending safer paths, and encouraging citizen-led reporting. It is built with React, Flask, Node.js, and MongoDB, and powered by a custom-built dataset of over 100,000 synthetic and scraped crime records.

---

## ❗ Problem Statement

Karachi lacks a public crime data portal or intelligent platform for route safety and real-time awareness. Citizens have no tool to know which areas are dangerous, what incidents are happening, or how to avoid high-risk zones.

---

## ✅ Solution Provided

Muhafiz solves this by:

* Visualizing real-time and historical crime patterns
* Recommending safer routes based on zone risk
* Offering a community forum for reporting & discussion
* Providing analytics to police and public bodies

---

## 🌟 Features

* 📈 Crime heatmaps (severity-based, zone-based)
* 🚣️ Real-time safer route with ML scoring
* 🚶️ Town/subdivision level zone classification (red/orange/yellow/green)
* 🧡 Community forum with anonymous reporting
* ⚖️ Admin dashboard for users/posts/moderation
* 📅 Crime filters by date/type/urgency
* 📊 Power BI dashboard for data analysis

---

## 📊 Dataset Collection Journey (Real Effort)

> **Data collection was the most challenging and time-consuming part of this project**

### ❌ No Public Crime Dataset

* Contacted NGOs, searched police APIs – nothing available
* No structured datasets for Karachi crime were found

### 🔍 Attempted Web Scraping

* Used Selenium, BeautifulSoup, requests, headless browsers
* Results were inconsistent, blocked, or irrelevant
* Spent weeks writing custom scrapers with no clean output

### ✅ Outscraper + Google Search Engine

* Used [Outscraper](https://outscraper.com) + Google Custom Search API
* Scraped each **town and subdivision** in Karachi manually
* Collected incident headlines, crime types, partial locations

### 📍 Geo Mapping & Structure

* Raw data lacked lat/long and proper tags
* Cleaned 1800+ rows manually
* Used geocoding to assign coordinates
* Added severity scoring (1–5), zone tagging (Red, Orange, Yellow, Green)

### 🔎 Found Bias in High-Risk Towns

* Most dangerous areas had less data due to underreporting
* Realized scraped data wasn’t enough for ML

### ✨ Synthetic Data Generation

* Used insights + `faker` library to generate 100,000+ records
* Data fields:

  * `incidentId`, `town`, `subdivision`, `category`, `severity`, `urgency`, `date`, `zone`
* Built final dataset with **18 towns** and **170 subdivisions**

### ❌ Why No Clustering/KMeans?

* My data already had clean risk zone logic
* 4 months spent building data manually
* Clustering didn’t add value

### ✨ Final Outcome

* Public, police, NGOs can view zone trends
* Citizens can safely plan routes and report issues

---

## 📚 ML Route Logic

1. Map turned into weighted graph using Leaflet roads
2. Crimes increase weight of nearby nodes
3. Zones, severity, and urgency alter weights
4. Dijkstra's algorithm used to calculate safest path

---

## 📈 Crime Dataset Summary

* 📌 Focus: Karachi
* 💡 100,000+ records (synthetic + scraped)
* ⚖️ Fields: town, subdivision, type, date, severity, urgency, zone
* ⚙️ Generation: scraping + rule-based logic + Faker

---

## 🔹 System Architecture

```text
Frontend (React) <--> Express.js API <--> MongoDB Atlas
                              ↑
                      Flask ML API (Route Scoring)
```

---

## 🔧 Tech Stack

| Layer     | Tech                            |
| --------- | ------------------------------- |
| Frontend  | React.js, Leaflet, CSS          |
| Backend   | Node.js, Express.js             |
| ML Engine | Python, Flask, Pandas, Dijkstra |
| Database  | MongoDB Atlas                   |
| Auth      | JWT, bcrypt                     |

---

## 📁 Folder Structure

```
muhafiz/
├── user-panel/
│   ├── frontend/         # React frontend for users
│   └── backend/          # Express backend for users
├── admin-panel/
│   ├── frontend/         # React frontend for admins
│   └── backend/          # Express backend for admins
├── dataset/              # Scraped + synthetic data
├── ml-api/               # Flask API for safe route
├── public/               # Static assets (screenshots, video)
├── README.md
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js & npm
* Python 3.x
* MongoDB Atlas URI
* Google Maps API Key (optional)

### Installation

```bash
# Clone repo
git clone https://github.com/your-username/muhafiz.git
cd muhafiz

# User Panel
cd user-panel/backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev

# Admin Panel
cd ../../admin-panel/backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev

# ML Engine
cd ../../ml-api
pip install -r requirements.txt
python safe_route.py
```

---

## 🌐 Ports Configuration

| Component           | Port | URL                                            |
| ------------------- | ---- | ---------------------------------------------- |
| User Frontend       | 5173 | [http://localhost:5173](http://localhost:5173) |
| Admin Frontend      | 5174 | [http://localhost:5174](http://localhost:5174) |
| User Backend (API)  | 5000 | [http://localhost:5000](http://localhost:5000) |
| Admin Backend (API) | 5002 | [http://localhost:5002](http://localhost:5002) |
| ML API (Flask)      | 5001 | [http://localhost:5001](http://localhost:5001) |

---

## 🔐 Admin Panel

* JWT-secured login
* Manage users, incidents, posts
* View Power BI data & stats

---

## 💬 Community Forum

* Area-based channels (e.g., Lyari, Clifton)
* Reactions, nested replies, media
* Admin controls + anonymous posting

---

## 📊 Analytics Dashboard

* Toggle: zone/severity heatmaps
* Filters: date, category, location
* Most affected areas by time

---

## 🎥 Media & Showcase

### Panels & Screens

| Admin                                        | User                                           |
| -------------------------------------------- | ---------------------------------------------- |
| ![Admin](public/screenshots/admin-login.png) | ![User](public/screenshots/user-dashboard.png) |

### Data Insights

| Map                                      | Charts                                        |
| ---------------------------------------- | --------------------------------------------- |
| ![Zone](public/screenshots/zone-map.png) | ![Charts](public/screenshots/data-charts.png) |

### Report & Slides

| Report                                        | Presentation                                        |
| --------------------------------------------- | --------------------------------------------------- |
| ![PDF](public/screenshots/project-report.png) | ![Slide](public/screenshots/presentation-slide.png) |

### Power BI

| Dashboard                                  | Trends                                         |
| ------------------------------------------ | ---------------------------------------------- |
| ![BI](public/screenshots/powerbi-main.png) | ![Trend](public/screenshots/powerbi-trend.png) |

### Video

* 🎥 [Watch Demo](https://youtu.be/your-link)
* Or play: `/public/media/demo-video.mp4`

---

## 🏆 Key Learnings

* 📈 End-to-end scraping + geocoding pipeline
* 🤓 ML integration with Dijkstra + real data
* 🔒 Authenticated admin system
* 🛍️ Reddit-style nested forum with moderation
* 📊 Power BI dashboards for public safety

---

## 🔮 Future Enhancements

* Predict next red/yellow/green zones using ML
* Add mobile app for field agents
* Integrate verified NGO/police feeds
* Push alerts for users entering red zones

---

## 👨‍💼 Contributor

| Name         | Role                          |
| ------------ | ----------------------------- |
| Rabia Imtiaz | Full Stack Dev, Data Engineer |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📩 Contact

* Email: [rabiaimtiaz@email.com](mailto:rabiaimtiaz@email.com)
* LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)

---

## ⭐ Support

If you liked this project, give it a ⭐ on GitHub. Open issues or contribute via PR. Thank you!
