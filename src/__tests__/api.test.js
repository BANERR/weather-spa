// src/__tests__/api.test.js
import { getWeatherInCityByName, getWeatherInCityByCoordinates } from '../assets/api';

global.fetch = jest.fn();

describe('API functions', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('getWeatherInCityByName працює', async () => {
    const mockData = { current: { temp: 20 } };
    
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ lat: 50.45, lon: 30.52 }]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

    const result = await getWeatherInCityByName('Kyiv');

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockData);
  });

  test('getWeatherInCityByCoordinates працює', async () => {
    const mockData = { current: { temp: 18 } };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const result = await getWeatherInCityByCoordinates(50.45, 30.52);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);
  });
});