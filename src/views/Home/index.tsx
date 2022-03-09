import React, { useEffect, useMemo, useState } from 'react';
import Unity, { UnityContext } from "react-unity-webgl";
import { useMethod, useRandomNumber } from 'hooks/useContract';
import useBeacon from 'hooks/useBeacon';
import HorseOdds from './components/HorseOdds';
import RaceTimer from './components/RaceTimer';
import PlaceBet from './components/PlaceBet';
import BetTicketCard from './components/BetTicket';
import Loader from 'components/Loader';

const unityContext = new UnityContext({
  loaderUrl: "Build/1.loader.js",
  dataUrl: "Build/1.data",
  frameworkUrl: "Build/1.framework.js",
  codeUrl: "Build/1.wasm",
});

const Home = () => {
  const [storage, setStorage] = useState<any>({});
  const { getStorage } = useMethod();
  const { loading, address } = useBeacon();
  const randomNumber = useRandomNumber();

  useEffect(() => {
    getStorage(setStorage);
  }, [getStorage])

  useEffect(function () {
    console.log("useEffect");
    unityContext.on("loaded", function () {
      console.log("loaded")
    });

    unityContext.on("progress", function (progression) {
      console.log("progression", progression)
      //setProgression(progression);
    });

    unityContext.on("GameOver", function (userName, score) {
      console.log("GameOver", userName, score)
    });

    unityContext.on("FinishRace", function (horse: string, time: string) {
      console.log("FinishRace", horse, time)
    });
  }, []);

  const startRace = () => {
    console.log("startRace")
    unityContext.send("GameController", "StartRaceNow", 45);
  }

  const buttonStyle = useMemo(() => {
    if (!randomNumber) {
      return "text-white bg-gray-400 dark:bg-gray-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center w-36"
    } else {
      return "text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-36"
    }
  }, [randomNumber])

  return (
    <div className="container mx-auto">
      {loading && (
        <Loader />
      )}      
      <div className="px-4 mt-4 md:mt-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-2">
            <HorseOdds></HorseOdds>
            <button
              type="button"
              className={buttonStyle}
              onClick={startRace}
              disabled={!randomNumber}
            >
              Start Race
            </button>
          </div>
          <div id="race-footage" className="col-span-12 lg:col-start-3 lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 rounded-lg px-4 py-6 ring-1 ring-slate-900/5 shadow-xl h-full">
              <Unity className="w-full" unityContext={unityContext} />
            </div>
          </div>
          <div id="race-state-card" className="col-span-12 lg:col-start-11 lg:col-span-2">
            <RaceTimer storage={storage}></RaceTimer>
          </div>
        </div>
      </div>
      <div className="px-4 my-4 md:mt-8">
        <div className="grid grid-cols-12 gap-4">
          <div id="place-bet-card" className="col-span-12 md-col-span-6 lg:col-span-3">
            <PlaceBet></PlaceBet>
          </div>
          <div className="col-span-12 md-col-span-6 lg:col-start-4 lg:col-span-9">
            <BetTicketCard
              storage={storage}
              userAddress={address}
            ></BetTicketCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
