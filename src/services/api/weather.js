import { httpClient } from "../httpClient/httpClient";

export const weatherService = {
  getByCoords(lat, long) {
    return httpClient.get("weather", {
      lat: lat,
      lon: long,
    });
  },
  getByCity(city) {
    return httpClient.get("weather", {
      q: city,
    });
  },
};
