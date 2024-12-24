import MapView, { Marker } from "react-native-maps";

import { useLocalServiceIdStore } from "../libs/localServiceZustang";

export default function LocalMap() {
  const localCoordinates = useLocalServiceIdStore(
    (state) => state.localCoordinates
  );

  const coordinates = localCoordinates.split(",");

  return (
    <MapView
      className="h-full w-full"
      initialRegion={{
        latitude: Number(coordinates[0]),
        longitude: Number(coordinates[1]),
        latitudeDelta: 0.015,
        longitudeDelta: 0.01,
      }}
    >
      <Marker
        coordinate={{
          latitude: Number(coordinates[0]),
          longitude: Number(coordinates[1]),
        }}
        title="Location of Service" //change to name
        description="Description of Service" //idk what to put here
      />
    </MapView>
  );
}
