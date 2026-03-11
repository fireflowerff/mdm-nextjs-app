export async function getCapitalWeather(lat, lng) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code&wind_speed_unit=ms`;
    const response = await fetch(url);
    const data = await response.json();

    // Mapping weather codes to Emojis (WMO standards)
    const interpretCode = (code) => {
      if (code === 0) return "☀️ Sunny";
      if (code <= 3) return "☁️ Partly Cloudy";
      if (code >= 51 && code <= 67) return "🌧️ Rain";
      if (code >= 71 && code <= 77) return "❄️ Snow";
      return "☁️ Overcast";
    };

    return {
      temp: data.current.temperature_2m,
      condition: interpretCode(data.current.weather_code),
      time: data.current.time,
    };
  } catch (err) {
    return null;
  }
}
