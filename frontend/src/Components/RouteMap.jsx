import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
} from "react-google-maps";
const GAPI_KEY = process.env.REACT_APP_GAPI_KEY;
const colors = ["#ffba6b", "#6bfff5", "#ff6bfd", "#42f572", "#eff542"];
const MapWithAMarker = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: 45.5060618, lng: -73.576432 }}
    >
      {props.routes[0].map((location) => (
        <Marker
          position={location}
          label={location.name}
          labelStyle={{
            display: "block !important",
            textAlign: "center",
            width: "100px",
            backgroundColor: "#7fffd4",
            fontSize: "14px",
            padding: "5px",
          }}
        />
      ))}
      {props.routes.map((r, i) => (
        <Polyline path={r} options={{ strokeColor: colors[i] }} />
      ))}
    </GoogleMap>
  ))
);
const RouteMap = ({ routes }) => (
  <>
    <MapWithAMarker
      routes={routes}
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GAPI_KEY}&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `400px` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  </>
);
export default RouteMap;
