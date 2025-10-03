const APIKey = '302b913080778e4d1c7646fd134a413e';

const getCoordinatesByCityName = async (cityName) => {
    const APILink = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKey}`;

    try {
        const response = await fetch(APILink);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); 
        console.log(data);
        return data; 
    } catch (error) {
        console.error('Помилка при отриманні координат:', error);
        return null;
    }
}

const getWeatherInCityByName = async (cityName) => {
    const coordinatesData = await getCoordinatesByCityName(cityName);
    
    if (!coordinatesData || coordinatesData.length === 0) {
        console.error('Не вдалося отримати координати міста');
        return null;
    }

    const { lat, lon } = coordinatesData[0];
    const APILink = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;

    try {
        const response = await fetch(APILink);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); 
        console.log(data);
        return data; 
    } catch (error) {
        console.error('Помилка при отриманні погоди:', error);
        return null;
    }
}

const getWeatherInCityByCoordinates = async (lat, lon) => {
    const APILink = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;

    try {
        const response = await fetch(APILink);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); 
        console.log(data);
        return data; 
    } catch (error) {
        console.error('Помилка при отриманні погоди:', error);
        return null;
    }
}

export { getWeatherInCityByName, getWeatherInCityByCoordinates };