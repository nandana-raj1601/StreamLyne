
# 🌊 StreamLyne

**StreamLyne** is a mobile application designed to improve water sanitation awareness and access in rural and urban areas. It allows users to **view mapped water sources**, **report disease outbreaks**, **leave reviews**, and **visualize water quality statistics**—all while leveraging **Supabase** for backend services and **Google Maps API** for location features.

---

## 📱 Features

* 🔍 **View Nearby Water Sources** (borewells, valves, pumping stations)
* 📍 **Live Location Tracking** and map interaction
* 📊 **CSV-based Water Quality Visualization** (pH, turbidity, etc.)
* 🚨 **Report Disease Outbreaks** at specific water locations
* 💬 **Leave and View Reviews** for water sources
* 🧭 **Get Directions** to the selected water source using Google Maps
* 🗂️ **GeoJSON Layer Toggling** for different infrastructure layers

---

## 🧠 Technologies Used

| Layer             | Technology                         |
| ----------------- | ---------------------------------- |
| **Frontend**      | React Native + Expo                |
| **Mapping**       | react-native-maps, Google Maps API |
| **Backend**       | Supabase (Database + Auth)         |
| **Data Handling** | CSV & GeoJSON Parsing              |
| **Charts**        | react-native-chart-kit             |

---

## ⚙️ Setup Instructions

1. **Clone the repo**

   ```powershell
   git clone https://github.com/nandana-raj1601/StreamLyne.git
   cd StreamLyne
   ```

2. **Install dependencies**

   ```powershell
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

4. **Run the app**

   ```powershell
   npx expo start
   ```



## 📂 Folder Structure

```
StreamLyne/
├── assets/
├── screens/
│   ├── HomeScreen.js
│   ├── StatisticsScreen.js
│   └── ReviewsScreen.js
├── supabaseClient.js
├── App.js
├── app.json
└── .env
```

---

## 🔒 Security

* API keys are stored in environment variables and **excluded via `.gitignore`**.
* User authentication and review attribution are managed securely via **Supabase Auth**.

---

## 📜 License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute this software with appropriate attribution.

---
