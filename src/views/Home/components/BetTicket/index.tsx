import React, { useEffect, useState, useCallback } from 'react';
import BetTicket from './BetTicket'
import { defaultHorses } from 'hourse'
import { useInterval } from "hooks/useInterval"

function BetTicketCard({ storage, userAddress }) {
  const [betTickes, setBetTickets] = useState([]);

  const updateTickets = useCallback(() => {
    if (storage && userAddress) {
      storage.bets?.get(userAddress)
        /*.then((userBets: MichelsonMap<string, any>) => {
          console.log("userBets", userBets)
          return userBets?.get('1');
        })*/
        .then(raceBets => {
          console.log("raceBets", raceBets)
          return raceBets?.map((ticket: any) => ({
            horseId: ticket.horseId.toNumber(),
            horseName: getHorseName(ticket.horseId.toNumber()),
            betAmount: convertTezos(ticket.amount.toNumber()),
            payout: ticket.payout.toNumber(),
          }))
        })
        .then(tickets => {
          console.log("tickets", tickets)
          tickets && setBetTickets(tickets)
        })
    }
  }, [storage, userAddress, setBetTickets])

  useInterval(() => {
    updateTickets()
  }, 2000)

  const getHorseName = (horseId) => {
    const horse = defaultHorses.find(it => it.id === horseId);
    return horse?.name;
  }

  const convertTezos = (mutez) => {
    return mutez / 1000000;
  }

  return (
    <div className="flex gap-4">
      { betTickes.map((ticket: any, index: number) => (
        <BetTicket key={index} {...ticket}></BetTicket>
      ))}
    </div>
  );
}

export default BetTicketCard;