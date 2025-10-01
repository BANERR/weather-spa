'use client';

//styles
import './cityCard.scss';

//react
import { useRouter } from 'next/navigation';

const CityCard = ({cityData}) => {

    const router = useRouter();

    const handlClick = () => {
        localStorage.setItem('cityName', JSON.stringify(cityData.name));
        router.push(`/city/${cityData.name.replace(/\s/g, '')}`)
    }

    return(
        <div className="city-card-wrapper" 
            onClick={() => handlClick()}
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
            </div>
        </div>
    )
}

export default CityCard;