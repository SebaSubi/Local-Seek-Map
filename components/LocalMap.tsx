import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function LocalMap({
  localCoordinates,
}: {
  localCoordinates: string;
}) {
  const coordinates = localCoordinates
    ? localCoordinates.split(",")
    : ["-32.07610421122643", "-60.463953793765896"];

  return (
    <MapView
      className="h-full w-full"
      initialRegion={{
        latitude: Number(coordinates[0]),
        longitude: Number(coordinates[1]),
        latitudeDelta: 0.015,
        longitudeDelta: 0.01,
      }}
      provider={PROVIDER_GOOGLE}
    >
      {localCoordinates && (
        <Marker
          coordinate={{
            latitude: Number(coordinates[0]),
            longitude: Number(coordinates[1]),
          }}
          title="Location of Service" //change to name
          description="Description of Service" //idk what to put here
        />
      )}
    </MapView>
  );
}
