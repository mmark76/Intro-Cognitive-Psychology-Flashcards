import { useEffect, useState } from "react";

export function OfflineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return <span className={`status-pill ${online ? "online" : "offline"}`}>{online ? "Online" : "Offline"}</span>;
}
