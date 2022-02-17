import { useEffect, useState } from "react";
import { sceneEvents } from "../../events/EventsCenter";
import { useAppSelector } from "../../hooks";

export default function GameTitle() {
  const coinsCollected = useAppSelector((state) => state.pickup.coinsCollected);
  const aliensKilled = useAppSelector((state) => state.pickup.aliensKilled);
  const [playerHealth, setPlayerHealth] = useState(5);

  useEffect(() => {
    sceneEvents.on("player-health-changed", handlePlayerHealthChanged, this);
  }, []);

  function handlePlayerHealthChanged(health) {
    // console.log({ health });
    setPlayerHealth(health);
  }

  return (
    <>
      <div style={{ color: "white" }}>
        <div>
          Coins Collected: {coinsCollected}, Player Health: {playerHealth},
          Aliens Killed: {aliensKilled}
        </div>
      </div>
    </>
  );
}
