import { Button, Grid } from "@mui/material";
import {
  DistanceMatrixService,
  LoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import React, { useState } from "react";
import { useEffect } from "react";
import Geocode from "react-geocode";
import Loading from "./Loading";
import LocationTable from "./LocationTable";
const GAPI_KEY = process.env.REACT_APP_GAPI_KEY;
const sampleLocations = [
  {
    location: "Ôfour, Park Avenue, Montreal, QC, Canada",
    name: "Ôfour",
    address: "3452 Av du Parc, Montréal, QC H2X 2H5, Canada",
    lat: 45.5088195,
    lng: -73.57268479999999,
    first: false,
    last: false,
    food: false,
    double: false,
  },
  {
    location:
      "McConnell Engineering Building, Boulevard Robert-Bourassa, Montreal, QC, Canada",
    name: "McConnell Engineering Building",
    address: "3380 Blvd Robert-Bourassa, Montréal, QC H2X 2G6, Canada",
    lat: 45.5060618,
    lng: -73.57643200000001,
    first: true,
    last: false,
    food: false,
    double: false,
  },
  {
    name: "Piranha Bar",
    location: "Piranha Bar, Saint-Catherine Street West, Montreal, QC, Canada",
    address: "680 Sainte-Catherine O, Montréal, QC H3B 1C2, Canada",
    lat: 45.5028519,
    lng: -73.5699419,
    first: false,
    last: false,
    food: false,
    double: true,
  },
  {
    name: "Bar Tipsy Cow",
    location: "Bar Tipsy Cow, Park Avenue, Montreal, QC, Canada",
    address: "3575 Av du Parc, Montréal, QC H2X 3P9, Canada",
    lat: 45.5106171,
    lng: -73.575124,
    first: false,
    last: false,
    food: false,
    double: false,
  },
  {
    name: "Bar Bifteck St-Laurent",
    location:
      "Bar Bifteck St-Laurent, Saint Laurent Boulevard, Montreal, QC, Canada",
    address: "3702 Boul. Saint-Laurent, Montréal, QC H2X 2V4, Canada",
    lat: 45.5145656,
    lng: -73.57438499999999,
    first: false,
    last: false,
    food: false,
    double: false,
  },
  {
    name: "Gert's Bar & Café",
    location: "Gert's Bar & Café, Mc Tavish Street, Montreal, QC, Canada",
    address: "3480 Rue McTavish, Montréal, QC H3A 1X9, Canada",
    lat: 45.5036082,
    lng: -73.5781314,
    first: false,
    last: false,
    food: false,
    double: false,
  },
  {
    name: "M4 Burritos Peel",
    location: "M4 Burritos Peel, Peel Street, Montreal, QC, Canada",
    address: "2053 Rue Peel, Montréal, QC H3A 1T6, Canada",
    lat: 45.5014586,
    lng: -73.5755732,
    first: false,
    last: false,
    food: true,
    double: false,
  },
  {
    name: "Basha Sherbrooke",
    location: "Basha Sherbrooke, Sherbrooke Street West, Montreal, QC, Canada",
    address: "666 Rue Sherbrooke O, Montréal, QC H3A 1E7, Canada",
    lat: 45.5049667,
    lng: -73.573189,
    first: false,
    last: false,
    food: false,
    double: false,
  },
  {
    name: "Brutopia",
    location: "Brutopia, Crescent Street, Montreal, QC, Canada",
    address: "Brutopia, Rue Crescent, Montréal, QC H3G 2B1, Canada",
    lat: 45.4967389,
    lng: -73.574433,
    first: false,
    last: false,
    food: false,
    double: false,
  },
  {
    name: "Jet Night Club",
    location: "Jet Night Club, Crescent Street, Montreal, QC, Canada",
    address: "2020 Rue Crescent, Montréal, QC H3G 2B8, Canada",
    lat: 45.4980837,
    lng: -73.577844,
    first: false,
    last: true,
    food: false,
    double: false,
  },
];

export default function LocationInputs(props) {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    window.localStorage.setItem("places", JSON.stringify(places));
    console.log("saving places", places);
  }, [places]);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    if (props.initialLocations) {
      setPlaces(props.initialLocations);
    }
  }, [props.initialLocations]);
  useEffect(() => {
    if (places.length < 3) {
      setErrorMessage("Not enough locations");
      return;
    }
    setErrorMessage(null);
  }, [places]);
  const [calculatingDistances, setCalulatingDistances] = useState(false);
  const inputRef = React.useRef();
  const editLocation = (index, field, value) => {
    setPlaces(
      places.map((place, i) =>
        i !== index ? place : { ...place, [field]: value }
      )
    );
  };
  function handleLoad() {}
  const removeLocation = (index) => {
    setPlaces(places.filter((_, i) => i !== index));
  };

  const handleModifyMatrix = (matrix) => {
    const formattedMatrix = matrix.rows.map((row) =>
      row.elements.map((el) => Math.ceil(el.duration.value / 60))
    );
    const submittedPlaces = places
      .sort((a, b) =>
        a.first ? -1 : b.first ? 1 : a.last ? 1 : b.last ? -1 : 0
      )
      .map((p, i) => ({ ...p, id: i }));
    // const newPlaces = [
    //   ...submittedPlaces,
    //   ...submittedPlaces.filter((p) => p.double),
    // ];
    // const locations = newPlaces.sort((a, b) =>
    //   a.first ? -1 : b.first ? 1 : a.last ? 1 : b.last ? -1 : 0
    // );

    const newMatrix = new Array(submittedPlaces.length)
      .fill(0)
      .map((e) => new Array(submittedPlaces.length).fill(0));

    for (let i = 0; i < submittedPlaces.length; i++) {
      for (let j = 0; j < submittedPlaces.length; j++) {
        const indexes = [
          submittedPlaces.findIndex((p) => p.id === submittedPlaces[i].id),
          submittedPlaces.findIndex((p) => p.id === submittedPlaces[j].id),
        ];
        newMatrix[i][j] = formattedMatrix[indexes[0]][indexes[1]];
      }
    }
    props.onSubmit(submittedPlaces, newMatrix);
    // console.log(locations, newMatrix);
  };
  const caluclateDistance = () => {
    setCalulatingDistances(true);
  };
  function hanldePlacesChanged(e, newPlaces, other) {
    console.log(e, newPlaces, other);
  }
  const [text, setText] = useState("");
  const addPlace = (location, address, lat, lng) => {
    setPlaces([
      ...places,
      {
        location,
        address,
        lat,
        lng,
        name: location.split(",")[0],
        first: false,
        last: false,
        food: false,
        double: false,
      },
    ]);
  };
  const onSubmit = () => {
    console.log(text, inputRef.current.value);
    Geocode.setApiKey(GAPI_KEY);
    Geocode.fromAddress(inputRef.current.value).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
        addPlace(
          inputRef.current.value,
          response.results[0].formatted_address,
          lat,
          lng
        );
        setText("");
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <div>
      <LoadScript
        id="script-loader"
        googleMapsApiKey={GAPI_KEY}
        libraries={["places"]}
      >
        {!calculatingDistances && (
          <>
            <StandaloneSearchBox
              onLoad={handleLoad}
              onPlacesChanged={hanldePlacesChanged}
            >
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Search for a location"
                style={{
                  boxSizing: `border-box`,
                  border: `1px solid transparent`,
                  width: `650px`,
                  height: `48px`,
                  padding: `0 12px`,
                  borderRadius: `3px`,
                  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                  fontSize: `18px`,
                  outline: `none`,
                  textOverflow: `ellipses`,
                  margin: "10px auto",
                }}
              />
            </StandaloneSearchBox>
            <Button
              variant="contained"
              onClick={onSubmit}
              style={{ marginBottom: "20px" }}
            >
              Add Location
            </Button>
          </>
        )}

        {calculatingDistances && (
          <DistanceMatrixService
            options={{
              destinations: places.map((place) => ({
                lat: place.lat,
                lng: place.lng,
              })),
              origins: places.map((place) => ({
                lat: place.lat,
                lng: place.lng,
              })),
              travelMode: "WALKING",
            }}
            callback={(response) => {
              setCalulatingDistances(false);
              handleModifyMatrix(response);
            }}
          />
        )}
      </LoadScript>
      {calculatingDistances && (
        <Loading message="If this takes more than 5s reload the page :)" />
      )}
      {places.length > 0 && (
        <>
          {!calculatingDistances && (
            <LocationTable
              locations={places}
              onChange={editLocation}
              removeLocation={removeLocation}
            />
          )}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              backgroundColor: "#4287f5",
              width: "100%",
              height: "80px",
              boxShadow: `0 -4px 6px rgba(0, 0, 0, 0.3)`,
              flexDirection: "column-reverse",
              padding: "10px",
            }}
          >
            {errorMessage !== null ? (
              <div style={{ fontSize: "30px", paddingTop: "10px" }}>
                {errorMessage}
              </div>
            ) : (
              <Button
                disabled={errorMessage !== null}
                size="large"
                variant="contained"
                color="success"
                onClick={caluclateDistance}
                style={{ alignSelf: "flex-start" }}
              >
                Calculate Distances
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
