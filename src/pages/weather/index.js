import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCity,
  getCities,
  getMyCoords,
  getWeatherByCity,
  getWeatherByCoords,
  removeCity,
  selectWeather,
} from "../../store/weatherReducer";
import {
  Box,
  Button,
  FormControl,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";

const CitiesList = styled(List)`
  overflow: auto;
  max-height: 300px;
`;

const CityItem = styled(ListItem)`
  border: 1px solid;
  border-radius: 5px;
  margin-bottom: 5px;

  ${(props) =>
    props.select === "true" &&
    css`
      background-color: darkseagreen;
    `}
`;

CityItem.propTypes = {
  select: PropTypes.string,
};

const WeatherPage = () => {
  const weatherState = useSelector(selectWeather);
  const dispatch = useDispatch();
  const [selectedCity, setSelectedCity] = useState(null);

  const cityExistsValidate = function (errorMessage) {
    return this.test(`city-exist-validate`, errorMessage, function (value) {
      const { path, createError } = this;

      return (
        (value &&
          weatherState.cities &&
          Array.isArray(weatherState.cities) &&
          !weatherState.cities.includes(value)) ||
        createError({ path, message: errorMessage })
      );
    });
  };

  yup.addMethod(yup.string, "cityExistsValidate", cityExistsValidate);

  let citySchema = yup.object().shape({
    city: yup.string().cityExistsValidate("city exsits or empty"),
  });

  const { register, handleSubmit, control } = useForm({
    resolver: yupResolver(citySchema),
  });

  useEffect(() => {
    if (!weatherState.cities) {
      dispatch(getCities());
    }

  }, []);

  useEffect(() => {
    if (!weatherState.myCoords) {
      dispatch(getMyCoords());
    }

    if (weatherState.myCoords) {
      dispatch(
        getWeatherByCoords({
          lat: weatherState.myCoords.lat,
          long: weatherState.myCoords.long,
        })
      );
    }
  }, [weatherState.myCoords]);

  const onSelectCity = (city) => {
    setSelectedCity(city);
    dispatch(getWeatherByCity(city));
  };

  const onAddCity = (data) => {
    if (data) {
      dispatch(addCity(data.city));
    }
  };

  const onRemoveCity = (city) => {
    dispatch(removeCity(city));
    if (city === selectedCity)
    {
      setSelectedCity(null);
      dispatch(getMyCoords());
    }
  };

  return (
    <div>
      <Grid
        container
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          item
          container
          justifyContent="center"
          alignItems="flex-start"
          mt={3}
        >
          <Grid
            item
            container
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            xl={6}
            lg={7}
            md={6}
            sm={6}
            xs={12}
          >
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              columnSpacing={1}
            >
              <Grid item xs={9}>
                <Controller
                  render={({ field, formState }) => (
                    <FormControl fullWidth>
                      <TextField
                        {...field}
                        {...register("city")}
                        label="City"
                        error={!!formState.errors?.city}
                      />
                      <Box color="red">
                        {!!formState.errors?.city?.message
                          ? formState.errors.city.message
                          : null}
                      </Box>
                    </FormControl>
                  )}
                  name="city"
                  control={control}
                  defaultValue=""
                />
              </Grid>
              <Grid item>
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleSubmit(onAddCity)}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            <Grid item container justifyContent="center" alignItems="center">
              <Grid item lg={8} xs={12}>
                <CitiesList>
                  {weatherState.cities
                    ? weatherState.cities.map((city, index) => (
                        <CityItem
                          key={index}
                          select={(selectedCity === city).toString()}
                          component="div"
                        >
                          <ListItemButton
                            style={{
                              textAlign: "center",
                              backgroundColor: "lightgray",
                              borderRadius: 5,
                            }}
                            onClick={() => onSelectCity(city)}
                          >
                            <ListItemText primary={city} />
                          </ListItemButton>
                          <Button
                            sx={{ marginLeft: 3 }}
                            variant="contained"
                            onClick={() => onRemoveCity(city)}
                          >
                            Remove
                          </Button>
                        </CityItem>
                      ))
                    : null}
                </CitiesList>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xl={6}
            lg={5}
            md={6}
            sm={6}
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              {weatherState.error ? (
                <h1>{weatherState.error.message}</h1>
              ) : weatherState.weather ? (
                <>
                  <Typography variant="h6">
                    City: {weatherState.weather.name}
                  </Typography>
                  <Typography variant="h6">
                    Temp: {weatherState.weather.main.temp}
                  </Typography>
                  <Typography variant="h6">
                    Pressure: {weatherState.weather.main.pressure}
                  </Typography>
                  <Typography variant="h6">
                    Humidity: {weatherState.weather.main.humidity}
                  </Typography>
                </>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default WeatherPage;