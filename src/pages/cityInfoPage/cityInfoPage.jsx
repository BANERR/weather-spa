'use client';

const { useState, useEffect } = require("react");

const CityInfoPage = () => {
  const [cityData, setCityData] = useState({})

  useEffect(()=>{
      const cityNameJSON = localStorage.getItem('cityName');
      const cityName = cityNameJSON ? JSON.parse(cityNameJSON) : '';
      setCityData({
        name: cityName
      })
  },[])

  return (
      <div>
        <h1>Погода в {cityData.name}</h1>
      </div>
  );
}

export default CityInfoPage;