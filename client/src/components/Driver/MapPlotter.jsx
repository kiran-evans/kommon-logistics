import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useEffect } from 'react';
import mapStyle from './mapStyle.json';
import { CircularProgress } from '@mui/material';

const MapPlotter = (props) => {

  const MAP_KEY = import.meta.env.KL_TOM_TOM_API_KEY;
  
  const [markers, setMarkers] = useState([]);
  const [theMap, setTheMap] = useState();
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMarker = (location) => { // Add marker to map and update markers array in state
    const marker = new tt.Marker().setLngLat(location).addTo(theMap);
    setMarkers([...markers, marker]);
  }

  const calculateRoute = async () => {
    locations.forEach(location => {
      addMarker(location);
    });

    if (locations.length < 2) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await services.calculateRoute({
        key: MAP_KEY,
        locations: locations
      });
      const geojson = res.toGeoJson();

      theMap.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        minzoom: 10,
        maxzoom: 24,
        paint: {
          'line-color': '#272',
          'line-width': 5
        }
      })

      setIsLoading(false);
    } catch (err) {
      return console.log(err);
    }
  }

  const getLocations = async () => {
    let pointsList = [];
    props.assignedDeliveries.forEach(d => {
      pointsList.push({ query: d.location, bestResult: true, countrySet: 'GB' });
    });

    const geocodes = await services.geocode({
      batchMode: 'async',
      key: MAP_KEY,
      batchItems: pointsList,
    });

    if (geocodes.batchItems.length === props.assignedDeliveries.length) {
      pointsList = [];
      geocodes.batchItems.forEach(g => {
        pointsList.push(g.results[0].position);
      });
      setLocations(pointsList);
      return;
    }
  }

  const createMap = async () => {
    const newMap = await tt.map({
      key: MAP_KEY,
      container: 'map',
      center: locations[0],
      zoom: 12,
      style: mapStyle
    });
    setTheMap(newMap);
  }

  useEffect(() => {
    setIsLoading(true);
    getLocations();
  }, []);

  useEffect(() => {
    createMap();
  }, [locations]);

  useEffect(() => {
    calculateRoute();
  }, [theMap]);

  return (
    <>
    {isLoading && <div className="loadingSpinner"><CircularProgress /> Loading map...</div>}
    <div id="map">
    </div>
    </>
  );
}

MapPlotter.propTypes = {
  assignedDeliveries: PropTypes.array.isRequired,
}

export default MapPlotter;