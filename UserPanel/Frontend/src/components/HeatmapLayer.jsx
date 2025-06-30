// Updated HeatmapLayer.js
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ data, mode }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !data.length) return;

    // Different gradients based on mode
    const gradient = mode === 'zone' 
      ? {
          0.1: '#B0E0E6',  // Powder Blue (White)
          0.25: '#32CD32', // Lime Green (Green)
          0.5: '#FFFF00',  // Yellow
          0.75: '#FFA500', // Orange
          1.0: '#FF0000'   // Red
        }
      : {
          0.1: '#B0E0E6',
          0.3: '#00BFFF',  // Deep Sky Blue
          0.5: '#7CFC00',  // Lawn Green
          0.7: '#FFD700',  // Gold
          1.0: '#FF4500'   // Orange Red
        };

    const heatLayer = L.heatLayer(data, {
      radius: 27,
      blur: 20,
      maxZoom: 16,
      minOpacity: 0.5,
      gradient
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, data, mode]);

  return null;
};

export default HeatmapLayer;