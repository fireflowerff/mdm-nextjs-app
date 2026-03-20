// src/lib/weather_client.js
"use client";

export async function getWeatherData() {
  try {
    // 1. Get Public IP
    const ipRes = await fetch("https://api.ipify.org/?format=json");
    if (!ipRes.ok) throw new Error("IP lookup failed");
    const { ip } = await ipRes.json();
    //    console.log("Current IP:", ip);

    // 2. Lookup Geolocation via IP (http://ip-api.com/json/[ipaddress])

    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    if (!geoRes.ok) throw new Error("Geo info lookup failed");
    const geo = await geoRes.json();

    console.log("JSON from ip-api client");
    console.log(geo); // Default to Hong Kong if Geo lookup fails
    const lat = geo.status === "success" ? geo.lat : 22.3193;
    const lon = geo.status === "success" ? geo.lon : 114.1694;
    const cityName = geo.status === "success" ? geo.city : "Hong Kong";
    const regionName = geo.status === "success" ? geo.regionName : "Earth";
    const country = geo.status === "success" ? geo.country : "Earth";

    // 3. Get Weather from Open-Meteo using those coordinates
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`,
      { next: { revalidate: 3600 } },
    );

    if (!weatherRes.ok) throw new Error("Weather fetch failed");

    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    // Helper for icons
    const getStatus = (code) => {
      // Reference: https://open-meteo.com/en/docs
      if (code === 0) return { label: "Clear Sky", icon: "☀️" };
      if (code <= 3) return { label: "Partly Cloudy", icon: "🌤️" };
      if (code <= 48) return { label: "Foggy", icon: "🌫️" };
      if (code <= 55) return { label: "Drizzle", icon: "🌦️" };
      if (code <= 65) return { label: "Rainy", icon: "🌧️" };
      if (code <= 77) return { label: "Snowy", icon: "❄️" };
      if (code <= 82) return { label: "Rain Showers", icon: "🌦️" };
      if (code <= 86) return { label: "Snow Showers", icon: "🌨️" };
      if (code >= 95) return { label: "Thunderstorm", icon: "⛈️" };

      return { label: "Variable", icon: "⛅" };
    };

    const status = getStatus(current.weathercode);

    return {
      temp: Math.round(current.temperature),
      condition: status.label,
      icon: status.icon,
      city: cityName,
      regionName: geo.regionName || "", // Make sure these match the ip-api fields
      country: geo.country || "",
      windspeed: current.windspeed,
    };
  } catch (error) {
    console.error("Location/Weather Error:", error);
    return null;
  }
}
