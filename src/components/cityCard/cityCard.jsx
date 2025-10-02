'use client';

import Button from '../button/button';
//styles
import './cityCard.scss';

//react
import { useRouter } from 'next/navigation';

const CityCard = ({cityData, onDelete}) => {

    const router = useRouter();

    const handleClick = () => {
        localStorage.setItem('cityData', JSON.stringify({name: cityData.name, lat: cityData.lat, lon: cityData.lon}));
        router.push(`/city/${cityData.name.replace(/\s/g, '')}`)
    }

    const handleDeleteClick = (e) => {
        e.stopPropagation(); // Запобігає виклику handleClick при кліку на кнопку видалення
        if (window.confirm(`Видалити ${cityData.name}?`)) {
            onDelete();
        }
    }

    return(
        <div className="city-card-wrapper" 
            onClick={handleClick}
            onMouseEnter={() => router.prefetch(`/city/${cityData.name.replace(/\s/g, '')}`)}
        >
            <div className="city-card-container">
                
                <div className="city-card-info">
                    Name: {cityData.name}
                </div>
                <div className="city-card-info">
                    Temp: {cityData.temp} °C
                </div>
                <div className="city-card-info">
                    Feels like: {cityData.feelsLike} °C
                </div>
                <div className="city-card-info">
                    Humidity: {cityData.humidity} %
                </div>
                <div className="city-card-info">
                    Pressure: {cityData.pressure} hPa
                </div>
                <div className="city-card-info">
                    Clouds: {cityData.clouds} %
                </div>
                <div className="city-card-info">
                    Wind speed: {cityData.windSpeed} m/s
                </div>
                <div className="city-card-info">
                    Wind gust: {cityData.windGust} m/s
                </div>
                <div className="city-card-info">
                    Time: {new Date().toLocaleTimeString()}
                </div>
                <Button text={'Delete city'} onClick={(e)=>handleDeleteClick(e)}/>

            </div>
        </div>
    )
}

export default CityCard;