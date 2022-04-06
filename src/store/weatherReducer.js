import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { weatherService } from "../services/api/weather";
import { globalUtils } from "../utils/global";
import { constants } from "../constants";

const initialState = {
  loading: false,
  error: null,
  weather: null,
  myCoords: null,
  cities: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setWeather(state, action) {
      state.weather = action.payload;
    },
    setMyCoords(state, action) {
      state.myCoords = action.payload;
    },
    addCityAction(state, action) {
      state.cities =
        state.cities && Array.isArray(state.cities)
          ? [...state.cities, action.payload]
          : [action.payload];
      globalUtils.setLocalData(constants.KEY_CITIES, state.cities);
    },
    removeCityAction(state, action) {
      state.cities =
        state.cities && Array.isArray(state.cities)
          ? state.cities.filter((v) => v !== action.payload)
          : state.cities;
      globalUtils.setLocalData(constants.KEY_CITIES, state.cities);
    },
    setCities(state, action) {
      state.cities = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setWeather,
  setMyCoords,
  setCities,
  addCityAction,
  removeCityAction,
} = weatherSlice.actions;

export const selectWeather = (state) => state.weather;

export const getWeatherByCoords = createAsyncThunk(
  "weather/getWeatherByCoords",
  async ({ lat, long }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await weatherService.getByCoords(lat, long);
      if (response.data) {
        dispatch(setWeather(response.data));
      } else {
        dispatch(setError(response.data.error));
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        dispatch(setError(e.response.data));
      } else {
        console.log(e);
        dispatch(setError("Internal Error"));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getWeatherByCity = createAsyncThunk(
  "weather/getWeatherByCity",
  async (city, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await weatherService.getByCity(city);
      if (response.data) {
        dispatch(setWeather(response.data));
      } else {
        dispatch(setError(response.data.error));
      }
    } catch (e) {
      console.log(e.response);
      if (axios.isAxiosError(e) && e.response) {
        dispatch(setError(e.response.data));
      } else {
        console.log(e);
        dispatch(setError("Internal Error"));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getMyCoords = createAsyncThunk(
  "weather/getMyCoords",
  async (_, { dispatch }) => {
    try {
      dispatch(setError(null));

      navigator.geolocation.getCurrentPosition(
        (response) => {
          dispatch(
            setMyCoords({
              lat: response.coords.latitude,
              long: response.coords.longitude,
            })
          );
        },
        (response) => {
          dispatch(setError({ message: response.message }));
        }
      );
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        dispatch(setError(e.response.data));
      } else {
        console.log(e);
        dispatch(setError("Internal Error"));
      }
    }
  }
);

export const addCity = createAsyncThunk(
  "weather/addCity",
  async (city, { dispatch }) => {
    try {
      dispatch(setError(null));
      if (city) {
        dispatch(addCityAction(city));
      } else {
        dispatch(setError("empty city"));
      }
    } catch (e) {
      console.log(e);
      dispatch(setError("Internal Error"));
    }
  }
);

export const removeCity = createAsyncThunk(
  "weather/removeCity",
  async (city, { dispatch }) => {
    try {
      dispatch(setError(null));
      dispatch(removeCityAction(city));
    } catch (e) {
      console.log(e);
      dispatch(setError("Internal Error"));
    }
  }
);

export const getCities = createAsyncThunk(
  "weather/getCities",
  async (city, { dispatch }) => {
    try {
      dispatch(setError(null));
      dispatch(setCities(globalUtils.getLocalData(constants.KEY_CITIES) ?? []));
    } catch (e) {
      console.log(e);
      dispatch(setError("Internal Error"));
    }
  }
);

export default weatherSlice.reducer;
