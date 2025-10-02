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
                            windGust: cityData.current.wind_gust,
                            lat: city.lat,
                            lon: city.lon
                        });
                    }
                } catch (error) {
                    console.error(`Error ${city.name}:`, error);
                }
            }
            
            setCitiesList(loadedCities);
        }
        setLoading(false)
    };

    useEffect(() => {
        loadCities();
    }, []);

    const handleAddCity = async () => {
        if (!newCityName.trim()) {
            showNotification('Enter city name', 'error');
            return;
        }

        try {
            const citiesJSON = localStorage.getItem('citiesList');
            const prevCitiesList = citiesJSON ? JSON.parse(citiesJSON) : [];
            
            if (prevCitiesList.some(city => city.name.toLowerCase() === newCityName.toLowerCase())) {
                showNotification('This city has already been added', 'error');
                return;
            }

            const coordinatesData = await getWeatherInCityByName(newCityName);
            
            if (!coordinatesData || coordinatesData.length === 0) {
                showNotification('City not found', 'error');
                return;
            }

            const newCity = {
                name: newCityName,
                lat: coordinatesData.lat,
                lon: coordinatesData.lon
            };

            const updatedCities = [...prevCitiesList, newCity];
            localStorage.setItem('citiesList', JSON.stringify(updatedCities));

            // Оновлюємо список міст без повторного завантаження всіх даних
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
                    windGust: weatherData.current.wind_gust,
                    lat: newCity.lat,
                    lon: newCity.lon
                }]);
            }

            showNotification('City successfully added!');
            setNewCityName('');
            
        } catch (error) {
            console.error('Error adding city:', error);
            showNotification('Error adding city', 'error');
        }
    };

    const handleDeleteCity = (cityName) => {
        const citiesJSON = localStorage.getItem('citiesList');
        const prevCitiesList = citiesJSON ? JSON.parse(citiesJSON) : [];
        
        const updatedCities = prevCitiesList.filter(city => city.name !== cityName);
        localStorage.setItem('citiesList', JSON.stringify(updatedCities));
        
        // Оновлюємо стан без повторного виклику loadCities
        setCitiesList(prev => prev.filter(city => city.name !== cityName));
        showNotification(`City ${cityName} is deleted`, 'success');
    };

    const handleDeleteAllCities = () => {
        if (citiesList.length === 0) {
            showNotification('The list of cities is empty.', 'error');
            return;
        }

        if (window.confirm('Are you sure you want to delete all cities?')) {
            localStorage.removeItem('citiesList');
            setCitiesList([]);
            showNotification('All cities have been removed', 'success');
        }
    };

    useEffect(() => {
        console.log('Updated list of cities:', citiesList);
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
                    <Button text={'Delete all'} onClick={handleDeleteAllCities} className="delete-all-btn"/>
                </div>

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
                                onDelete={() => handleDeleteCity(city.name)}
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