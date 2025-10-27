
import L from 'leaflet';

const createIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const defaultIcon = createIcon('blue');

const iconColors = ['red', 'green', 'orange', 'yellow', 'violet', 'grey', 'black', 'gold', 'blue', 'purple'];
export const coloredIcons = iconColors.map(createIcon);

export const getRandomIcon = () => {
  const randomIndex = Math.floor(Math.random() * coloredIcons.length);
  return coloredIcons[randomIndex];
};
