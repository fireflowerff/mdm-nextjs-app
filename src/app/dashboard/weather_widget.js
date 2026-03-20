import { getWeatherData } from "@/lib/weather";

export default async function WeatherWidget(props) {
  const weatherPromise = getWeatherData(); // You could later dynamicize this

  const weather = await weatherPromise;

  return (
    <div>
      <section className="bg-gradient-to-br from-indigo-600 to-blue-500 p-6 rounded-2xl text-white shadow-lg">
        {weather ? (
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Local Weather</p>
              <h2 className="text-4xl font-bold mt-1">{weather.temp}°C</h2>
              <p className="text-blue-100">
                {weather.city}, {weather.regionName}, {weather.country}
              </p>
              <p className="text-blue-100"> {weather.condition}</p>
            </div>
            <span className="text-5xl" role="img" aria-label="weather-icon">
              {weather.icon}
            </span>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm opacity-75 italic">
              Updating local forecast...
            </p>
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-xs font-light">
          <span>Wind: {weather?.windspeed ?? 0} km/h</span>
          <span>Source: Open-Meteo</span>
        </div>
      </section>
    </div>
  );
}
