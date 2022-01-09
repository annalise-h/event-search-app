async function mergeEvents(cityName, state, artist, startDate, endDate) {
  // start by getting both ticketmaster and seatgeek event search responses 
  const ticketmasterEvents = await searchTicketmasterEvents(cityName, state, artist, startDate, endDate)
  const seatgeekEvents = await seatgeekSearch(artist, state, cityName, startDate, endDate)

  let combinedEvents = ticketmasterEvents.map(ticketmasterEvent => {
    let matchedSeatGeekEvent = checkForSeatGeekMatch(ticketmasterEvent, seatgeekEvents)
    if (matchedSeatGeekEvent) {
      seatgeekEvents.splice(seatgeekEvents.indexOf(matchedSeatGeekEvent), 1)
      let combinedEvent = {
        ...ticketmasterEvent
      }
      combinedEvent.url += `/n ${matchedSeatGeekEvent.url}`
      return combinedEvent 
    } else {
      return ticketmasterEvent
    }
  })

  combinedEvents = combinedEvents.concat(seatgeekEvents)
  console.log(combinedEvents)
  return combinedEvents
}

function checkForSeatGeekMatch(ticketmasterEvent, seatgeekEvents) {
  const matchedEvent = seatgeekEvents.filter((seatgeekEvent) => {
    if (seatgeekEvent.date == ticketmasterEvent.date && seatgeekEvent.time == ticketmasterEvent.time) {
      return seatgeekEvent
    }
  })

  return matchedEvent[0]
}

mergeEvents('', '', 'justin bieber', '', '')