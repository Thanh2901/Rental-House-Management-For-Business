import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
    const mapRef = useRef(null); // Initialize as null for clarity
    const mapContainerRef = useRef(null);

    useEffect(() => {
        // Replace with your real Mapbox access token
        mapboxgl.accessToken = 'pk.eyJ1IjoiYOUR_USERNAME_HERE','...'; // Get this from mapbox.com

        // Initialize the map
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current, // Reference to the DOM element
            style: 'mapbox://styles/mapbox/standard', // Map style (required)
            center: [0, 0], // Initial center [lng, lat] (required)
            zoom: 1 // Initial zoom level (required)
        });

        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div
            id="map-container"
            ref={mapContainerRef}
            style={{ width: '100%', height: '400px' }} // Set dimensions
        />
    );
};

export default Map;