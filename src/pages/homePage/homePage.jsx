"use client";

//react
import { useEffect, useState } from "react";

//styles
import "./homePage.scss";

//components
import Button from "@/components/button/button";
import CityCard from "@/components/cityCard/cityCard";

//assets
import { getWeatherInCityByName, getWeatherInCityByCoordinates } from '@/assets/api'

const HomePage = () => {
    const [citiesList, setCitiesList] = useState([]);
    const [newCityName, setNewCityName] = useState('');
    const [loading, setLoading] = useState(true)
    const [notification, setNotification] = useState({ 
        message: '', 
        type: 'success' 
    });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: 'success' }), 3000);
    };

    const loadCities = async () => {
        setLoading(true)
        setCitiesList([])
        const citiesJSON = localStorage.getItem('citiesList');
        const citiesListLocalStorage = citiesJSON ? JSON.parse(citiesJSON) : [];
        
        if (citiesListLocalStorage.length > 0) {
            const loadedCities = [];
            
            for (const city of citiesListLocalStorage) {
                try {
                    let cityData;
                    if (city.lat && city.lon) {
                        cityData = await getWeatherInCityByCoordinates(city.lat, city.lon);
                    } else {
                        cityData = await getWeatherInCityByName(city.name);
                    }
                    
                    if (cityData) {
                        loadedCities.push({
                            name: city.name,
                            temp: cityData.current.temp,
                            feelsLike: cityData.current.feels_like,
                            humidity: cityData.current.humidity,
                            pressure: cityData.current.pressure,
                            clouds: cityData.current.clouds,
                            windSpeed: cityData.current.wind_speed,
                            windGust: cityData.current.wind_gust
                        });
                    }
                } catch (error) {
                    console.error(`Помилка завантаження ${city.name}:`, error);
                }
            }
            
            setCitiesList(loadedCities);
            setLoading(false)
            console.log(citiesList)
        }
    };

    useEffect(() => {
        loadCities();
    }, []);

    const handleAddCity = async () => {
        if (!newCityName.trim()) {
            showNotification('Введіть назву міста', 'error');
            return;
        }

        try {
            const citiesJSON = localStorage.getItem('citiesList');
            const prevCitiesList = citiesJSON ? JSON.parse(citiesJSON) : [];
            
            if (prevCitiesList.some(city => city.name.toLowerCase() === newCityName.toLowerCase())) {
                showNotification('Це місто вже додано', 'error');
                return;
            }

            const coordinatesData = await getWeatherInCityByName(newCityName);
            
            if (!coordinatesData || coordinatesData.length === 0) {
                showNotification('Місто не знайдено', 'error');
                return;
            }

            const newCity = {
                name: newCityName,
                lat: coordinatesData.lat,
                lon: coordinatesData.lon
            };

            const updatedCities = [...prevCitiesList, newCity];
            localStorage.setItem('citiesList', JSON.stringify(updatedCities));

            const weatherData = await getWeatherInCityByCoordinates(newCity.lat, newCity.lon);
            if (weatherData) {
                setCitiesList(prev => [...prev, {
                    name: newCityName,
                    temp: weatherData.current.temp,
                    feelsLike: weatherData.current.feels_like,
                    humidity: weatherData.current.humidity,
                    pressure: weatherData.current.pressure,
                    clouds: weatherData.current.clouds,
                    windSpeed: weatherData.current.wind_speed,
                    windGust: weatherData.current.wind_gust
                }]);
            }

            showNotification('Місто успішно додано!');
            setNewCityName('');
            
        } catch (error) {
            console.error('Помилка при додаванні міста:', error);
            showNotification('Помилка при додаванні міста', 'error');
        }
    };

    // Логування змін у списку міст
    useEffect(() => {
        console.log('Оновлений список міст:', citiesList);
    }, [citiesList]);

    return (
        <div className="home-page-wrapper">
            <div className="home-page-container">
                <div className="home-page-title">
                    Weather in different cities:
                </div>
                
                <div className="home-page-input-container">
                    <input
                        type="text"
                        value={newCityName}
                        onChange={(e) => setNewCityName(e.target.value)}
                        placeholder="Enter city name"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCity()}
                    />
                    <Button text={'Add city'} onClick={handleAddCity}/>
                    <Button text={'Update weather'} onClick={loadCities}/>
                </div>

                {/* Сповіщення */}
                {notification.message && (
                    <div className={`notification notification--${notification.type}`}>
                        {notification.message}
                    </div>
                )}

                <div className="home-page-cities-list-contain">
                    {citiesList && citiesList.length > 0 ? (
                        citiesList.map((city, index) => (
                            <CityCard
                                key={`${city.name}-${index}`}
                                cityData={city}
                            />
                        ))
                    ) : (
                        <div className="home-page-cities-subtitle">
                            {loading ? "Loading..." : "Add city for watching weather"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;