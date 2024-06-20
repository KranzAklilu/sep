"use client";

import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";

const EventMap = ({ lng, lat }: { lng: number; lat: number }) => {
  return (
    <div className="h-[600px] rounded-lg border border-dashed p-8">
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ""}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <Map
          defaultZoom={18}
          defaultCenter={{ lat, lng }}
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log(
              "camera changed:",
              ev.detail.center,
              "zoom:",
              ev.detail.zoom,
            )
          }
        ></Map>
      </APIProvider>
    </div>
  );
};
export default EventMap;
