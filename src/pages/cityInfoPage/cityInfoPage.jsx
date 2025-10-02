'use client';

//react
const { useState, useEffect } = require("react");

//components
import Button from '@/components/button/button';

//styles
import './cityInfoPage.scss'

//assets
import { getWeatherInCityByCoordinates } from '@/assets/api'; 

const CityInfoPage = () => {
  const [cityData, setCityData] = useState({})
  const [loading, setLoading] = useState(true)

  const dataTitles = {
    temp: ['Temp', '°C'],
    feelsLike: ['Feels like', '°C'],
    humidity: ['Humidity', '%'],
    pressure: ['Pressure', 'hPa'],
    clouds: ['Clouds', '%'],
    windSpeed: ['Wind speed', 'm/s'],
    windGust: ['Wind gust', 'm/s'],
    dt: ['Time', ''],
    rain: ['Rain', 'mm'],
    uvi: ['UV Index', ''],
    dayOfWeek: ['Day', ''],
    day: ['Day temp', '°C'],
    min: ['Min temp', '°C'],
    max: ['Max temp', '°C'],
    night: ['Night temp', '°C'],
    eve: ['Evening temp', '°C'],
    morn: ['Morning temp', '°C']
  }

  const getCityData = async (lat, lon, name) => {
    setLoading(true)
    const weatherData = await getWeatherInCityByCoordinates(lat, lon);
    if (weatherData) {
      const hourlyWeatherData = [];
      const dailyWeatherData = [];

      if(weatherData.hourly && weatherData.hourly.length > 0){
        for(let i = 0; i < 24; i++){
          hourlyWeatherData.push({
            dt: new Date(weatherData.hourly[i].dt * 1000).getHours() + ':00',
            temp: weatherData.hourly[i].temp,
            feelsLike: weatherData.hourly[i].feels_like,
            humidity: weatherData.hourly[i].humidity,
            pressure: weatherData.hourly[i].pressure,
            clouds: weatherData.hourly[i].clouds,
            windSpeed: weatherData.hourly[i].wind_speed,
            windGust: weatherData.hourly[i].wind_gust,
          })
        }
      }

      if(weatherData.daily && weatherData.daily.length > 0){
        for(let i = 0; i < weatherData.daily.length; i++){
          const dayData = weatherData.daily[i];
          dailyWeatherData.push({
            dt: new Date(dayData.dt * 1000).toLocaleDateString(),
            dayOfWeek: new Date(dayData.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
            tempDay: {
              day: dayData.temp.day,
              min: dayData.temp.min,
              max: dayData.temp.max,
              night: dayData.temp.night,
              eve: dayData.temp.eve,
              morn: dayData.temp.morn
            },
            feelsLike: {
              day: dayData.feels_like.day,
              night: dayData.feels_like.night,
              eve: dayData.feels_like.eve,
              morn: dayData.feels_like.morn
            },
            humidity: dayData.humidity,
            pressure: dayData.pressure,
            clouds: dayData.clouds,
            windSpeed: dayData.wind_speed,
            windGust: dayData.wind_gust,
            rain: dayData.rain,
            uvi: dayData.uvi
          })
        }
      }
      
      setCityData({
        name: name,
        current: {
          temp: weatherData.current.temp,
          feelsLike: weatherData.current.feels_like,
          humidity: weatherData.current.humidity,
          pressure: weatherData.current.pressure,
          clouds: weatherData.current.clouds,
          windSpeed: weatherData.current.wind_speed,
          windGust: weatherData.current.wind_gust
        },
        hourly: hourlyWeatherData,
        daily: dailyWeatherData
      });
      console.log('Updated cityData:', cityData);
      setLoading(false)
    }
  }

  const updateWeatherData = () => {
    setCityData({})
    const cityDataJSON = localStorage.getItem('cityData');
    const cityDataLocalStorage = cityDataJSON ? JSON.parse(cityDataJSON) : {};

    if (cityDataLocalStorage.lat && cityDataLocalStorage.lon && cityDataLocalStorage.name) {
      getCityData(cityDataLocalStorage.lat, cityDataLocalStorage.lon, cityDataLocalStorage.name)
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    updateWeatherData()
  }, [])

  return (
      <div className="city-info-page-wrapper">
        <div className="city-info-page-container">
          <div className="city-info-page-title">
            Weather in {cityData.name}:
          </div>
          <Button text={'Update weather data'} onClick={updateWeatherData}/>
          
          <div className="city-info-page-subtitle">
            Right now:
          </div>
          <div className="city-info-page-info-container">
            {cityData.current && Object.keys(cityData.current).length > 0 ? (
                Object.entries(cityData.current).map(([key, value], index) => (
                  <div className="city-info-page-info-text" key={`city-info-page-info-text-${index}`}>
                    {dataTitles[key] ? `${dataTitles[key][0]}: ${value} ${dataTitles[key][1]}` : `${key}: ${value}`}
                  </div>
                ))
              ) : (
                <div className="city-info-page-info-text">
                  {loading ? "Loading weather data for now" : "No data available"}
                </div>
            )}
          </div>

          <div className="city-info-page-subtitle">
            Hourly for next 24 hours:
          </div>
          <div className="city-info-page-info-container hourly-container">
            {cityData.hourly && cityData.hourly.length > 0 ? (
                cityData.hourly.map((hourData, index) => (
                  <div className="city-info-page-info-hourly" key={`city-info-page-info-hourly-${index}`}>
                    {hourData && Object.keys(hourData).length > 0 ? (
                        Object.entries(hourData).map(([key, value], index) => (
                          <div className="city-info-page-info-text" key={`city-info-page-info-text-hourly-${index}`}>
                            {dataTitles[key] ? `${dataTitles[key][0]}: ${value} ${dataTitles[key][1]}` : `${key}: ${value}`}
                          </div>
                        ))
                      ) : (
                        null
                    )}
                  </div>
                ))
              ) : (
                <div className="city-info-page-info-text">
                  {loading ? "Loading hourly data..." : "No hourly data available"}
                </div>
            )}
          </div>

          <div className="city-info-page-subtitle">
            7-Day Forecast:
          </div>
          <div className="city-info-page-info-container daily-container">
            {cityData.daily && cityData.daily.length > 0 ? (
                cityData.daily.map((dayData, index) => (
                  <div className="city-info-page-info-daily" key={`city-info-page-info-daily-${index}`}>
                    <div className="city-info-page-info-text daily-day">
                      {dayData.dayOfWeek} ({dayData.dt})
                    </div>
                  
                    <div className="city-info-page-info-text">
                      {dataTitles.max[0]}: {Math.round(dayData.tempDay.max)} {dataTitles.max[1]}
                    </div>
                    <div className="city-info-page-info-text">
                      {dataTitles.min[0]}: {Math.round(dayData.tempDay.min)} {dataTitles.min[1]}
                    </div>

                    <div className="city-info-page-info-text">
                      {dataTitles.day[0]}: {Math.round(dayData.tempDay.day)} {dataTitles.day[1]}
                    </div>
                    <div className="city-info-page-info-text">
                      {dataTitles.night[0]}: {Math.round(dayData.tempDay.night)} {dataTitles.night[1]}
                    </div>
                    <div className="city-info-page-info-text">
                      {dataTitles.humidity[0]}: {dayData.humidity} {dataTitles.humidity[1]}
                    </div>
                    {dayData.rain ? (
                      <div className="city-info-page-info-text">
                        {dataTitles.rain[0]}: {dayData.rain} {dataTitles.rain[1]}
                      </div>
                    ) : (
                      <div className="city-info-page-info-text">
                        {dataTitles.rain[0]}: No rain today
                      </div>
                    )}
                    <div className="city-info-page-info-text">
                      {dataTitles.windSpeed[0]}: {dayData.windSpeed} {dataTitles.windSpeed[1]}
                    </div>
                    <div className="city-info-page-info-text">
                      {dataTitles.uvi[0]}: {dayData.uvi}
                    </div>
                  </div>
                ))
              ) : (
                <div className="city-info-page-info-text">
                  {loading ? "Loading daily forecast..." : "No daily forecast available"}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default CityInfoPage;