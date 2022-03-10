import { useCallback, useEffect, useState } from "react";
import useBeacon from "./useBeacon";

export const useAddress = () => {
  const { wallet } = useBeacon();
  const [address, setAddress] = useState("");

  useEffect(() => {
    setAddress("");
    wallet
      ?.getPKH()
      .then((address) => {
        console.log("userAddress", address)
        setAddress(address)
      })
      .catch(console.error);
  }, [wallet]);

  return address;
};

export const useBalace = () => {
  const {Tezos, address} = useBeacon();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (address) {
      Tezos.tz
        .getBalance(address)
        .then((balance) => setBalance(balance.toNumber()))
        .catch(console.error);
    }
  }, [Tezos, address]);

  return balance;
};

export const useRandomNumber = () => {
  const { Tezos } = useBeacon();
  const [randomNumber, setRandomNumber] = useState<number>(0);

  useEffect(() => {
    Tezos.wallet.at("KT18hPvyyVF86AHLkMBKPPHXZb8TFogphbxi")
      .then(contract => {
        console.log("contract2", contract);
        return contract.storage();
      })
      .then((storage: any) => {
        console.log("storage2", storage);
        setRandomNumber(storage.toNumber());
      })
  }, [Tezos]);

  return randomNumber;
};

export const useAdminMethod = () => {
  const { contract } = useBeacon();

  const readyRace = useCallback(() => {
    return contract?.methods
      .readyRace(60)
      .send()
      .then((result) => {
        console.info("readyRace", result);
        return result;
      })
      .catch((error) => {
        console.error("readyRace", error);
      });
  }, [contract]);

  const startRace = useCallback(() => {
    return contract?.methods
      .startRace()
      .send()
      .then((result) => {
        console.info("startRace", result);
        return result;
      })
      .catch((error) => {
        console.error("startRace", error);
      });
  }, [contract]);

  const finishRace = useCallback(() => {
    return contract?.methods
      .takeReward()
      .send()
      .then((result) => {
        console.info("finishRace", result);
        return result;
      })
      .catch((error) => {
        console.error("finishRace", error);
      });
  }, [contract]);

  return {
    readyRace,
    startRace,
    finishRace,
  };
};

export const useMethod = () => {
  const { contract } = useBeacon();

  const getStorage = useCallback((setStorage) => {
    return contract?.storage().then((storage) => {
      console.log("storage", storage);
      setStorage(storage);
    });
  }, [contract]);

  const placeBet = useCallback((raceId, horseId, payout, amount) => {
    /*if (contract) {
      const methods = contract.parameterSchema.ExtractSignatures();
      console.log(JSON.stringify(methods, null, 2));

      const incrementParams = contract.methods.placeBet(raceId, horseId, payout).toTransferParams();
      console.log(JSON.stringify(incrementParams, null, 2));
    }*/
    console.log("placeBet", raceId, horseId, payout, amount)

    return contract?.methods
      .placeBet(horseId, payout, raceId)
      .send({ amount: amount })
      .then((result) => {
        console.info("placeBet", result);
        return result;
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, [contract]);

  const takeReward = useCallback(() => {
    return contract?.methods
      .takeReward()
      .send()
      .then((result) => {
        console.info("takeReward", result);
        return result;
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, [contract]);

  return {
    getStorage,
    placeBet,
    takeReward,
  };
};
