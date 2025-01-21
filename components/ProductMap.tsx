import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";

export default function ProductMap({ locals }: { locals: any[] }) {
  const [coordinates, setCoordinates] = useState<string[][]>([]);

  useEffect(() => {
    if (locals.length > 0) {
      setCoordinates(locals.map((local) => local.location.split(",")));
    } else {
      setCoordinates([["-32.07610421122643", "-60.463953793765896"]]);
    }
  }, [locals]);

  return (
    <MapView
      className="h-full w-full"
      initialRegion={{
        latitude: -32.07610421122643,
        longitude: -60.463953793765896,
        latitudeDelta: 0.028,
        longitudeDelta: 0.028,
      }}
    >
      {locals &&
        coordinates.map((coordinate, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: Number(coordinate[0]),
              longitude: Number(coordinate[1]),
            }}
            title="Disponible" //change to name
            description={`El producto esta disponible en el local: ${locals[index].name}`} //idk what to put here
          />
        ))}
    </MapView>
  );
}
