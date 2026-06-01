import { useEffect, useState } from "react";
import { Magnetometer } from "expo-sensors";
import { Platform } from "react-native";

export function useMagnetometer() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  const [heading , setHeading] = useState(0);

  useEffect(()=>{
    let subscription : {remove:()=>void} | undefined;

    void(async()=>{

      const isAvailable = await Magnetometer.isAvailableAsync();
      setAvailable(isAvailable);
      if(!isAvailable) return;

      Magnetometer.setUpdateInterval(100);

      subscription = Magnetometer.addListener((data)=>{
        setX(data.x);
        setY(data.y);
        setZ(data.z);
        setHeading(getHeading(data.x , data.y))

      })

    })();

    return ()=>subscription?.remove()

  },[])

  return {
    available , 
    x,
    y,
    z,
    heading
  }

}

// Convert x,y into degrees. 0° = north (depends on device orientation).
function getHeading(x: number, y: number) {
  const radians =
    Platform.OS === "ios" ? Math.atan2(x, y) : Math.atan2(-x, -y);

  const degrees = (radians * 180) / Math.PI;
  return (degrees + 360) % 360;
}
