# 💧 StreamLyne- Water source mapping for urban and rural areas

A mobile application designed to map water sources, track water quality, allow users to report outbreaks, and visualize real-time data on urban sanitation — built with **React Native**, **Supabase**, and **Expo**.

---

## 📱 Features

### 🔍 Real-time Location Mapping

* View water sources like **borewells**, **valves**, and **pumping stations** on an interactive map.
* Use **Google Maps Directions API** to navigate to the nearest source.

### 📊 Water Quality Visualization

* View graphs based on **pH**, **turbidity**, **hardness**, and **contamination** from uploaded lake water quality CSV files.
* Understand overall water health and "Water Quality Status" per lake.

### 🚨 Outbreak Reporting

* Report disease outbreaks at specific water points.
* Automatically notify users if a location has a previously reported outbreak.

### 💬 Review System

* Leave reviews on water sources based on personal experience.
* View others' reviews to decide which sources to trust.

### 📍 Nearest Source Finder

* Get a list of the **top 5 nearest** water sources based on your GPS location.

---

## ⚙️ Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Frontend       | React Native (Expo)                |
| Backend        | Supabase (Database + Auth)         |
| Maps & Routing | React Native Maps, Google Maps API |
| Data Parsing   | `expo-file-system`, GeoJSON & CSV  |
| Charts         | `react-native-chart-kit`           |
| Auth           | Supabase Email/Password Auth       |

---

## 🧠 Planned Machine Learning Enhancements

> (Optional future extensions)

* Outbreak risk prediction using historical data.
* Anomaly detection to trigger sanitation alerts.
* Clustering of outbreak hotspots.

---

## 🗂️ Folder Structure

```
/assets               → GeoJSON and CSV files
/screens              → Screens like Home, Login, Signup, Statistics
/supabaseClient.js    → Supabase config
App.js                → Navigation + Asset loading
```

---

## 🚀 Getting Started

### ✅ Prerequisites

* Node.js & npm
* Expo CLI: `npm install -g expo-cli`

### 🔧 Installation

```bash
git clone https://github.com/your-username/sanitation-mapping-app.git
cd sanitation-mapping-app
npm install
expo start
```

> You must add your Supabase credentials in `supabaseClient.js`.

---

## 🗃️ Database Tables on Supabase

* `reviews`: `{ review, latitude, longitude, user_id, user_email }`
* `outbreaks`: `{ disease, description, latitude, longitude }`

---

## 📈 Performance Evaluation

* Visual comparison of **data visualization times** vs platforms like Tableau.
* Metrics: time to load, scroll performance, and chart responsiveness.

---

## 📌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

[MIT](LICENSE)
