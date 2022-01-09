/*
whenever we call the api, we are always searching within the US
and narrowing our search by music events only
*/
apiKey="nWu4c2uaSG2JYUTkGTzuHTAwSuZR1GDX"
const eventSearchUrl = `https://app.ticketmaster.com/discovery/v2/events?classificationName=music&countryCode=US&sort=name,asc&apikey=${apiKey}`
const attractionSearchUrl = `https://app.ticketmaster.com/discovery/v2/attractions?classificationName=music&countryCode=US&apikey=${apiKey}`

async function searchTicketmasterEvents(cityName, stateCode, artist, startDate, endDate) {
  let searchUrl = eventSearchUrl
  // we will always require a city and state so append the values to the url
  searchUrl += `&city=${encodeURIComponent(cityName)}`

    //the select statement returns null if no value is entered, so a check for null is needed
  searchUrl += stateCode == null ? "" : `&stateCode=${stateCode}`

  // artist is optional so we only want to append to the url if the value exists
  if (artist) {
    let attractionIds
    attractionIds = await getAttractionIds(artist)
    searchUrl += `&attractionId=${attractionIds}`
  }

  // start date and end date are both optional so only execute logic if either exists 
  if (startDate || endDate) {
    // if one of these is null, we want to use * to search by all dates before or after
    !startDate ? startDate = '*' : startDate += 'T00:00:00'
    !endDate ? endDate = '*' : endDate += 'T00:00:00'
  }
  // searchUrl += `&localStartEndDateTime=${startDate},${endDate}`
  // TODO: add alphabet sort to search url
  // maybe add sort type as a parameter so we can use this on the discover page
  let eventSearchResponse = await (await fetch(searchUrl)).json()

  // only format the events when we get results from our search
  if (eventSearchResponse.page.totalElements > 0) {
    return formatEvents(eventSearchResponse._embedded.events)
  } else { 
    // TODO: better handle searches with 0 responses
    return []
  }
}

/* 
return event data with the following info: name, price min and max, ticket link,
images, local date, venue name, venue location 
*/
function formatEvents(events) {
  const formattedEventData = events.map( ({name, priceRanges, url, images, dates, _embedded}) => {
    return { 
      title: name, 
      // some events don't have a price range, so then we return a default value
      price_min: priceRanges ? priceRanges[0].min.toString() : "N/A",
      price_max: priceRanges ? priceRanges[0].max.toString() : "N/A",
      url, 
      image: images[0],
      date: dates.start.localDate,
      time: dates.start.localTime,
      venue: 
        `${_embedded.venues[0].name}, ${_embedded.venues[0].city.name}, ${_embedded.venues[0].state.stateCode}`
    }
  })

  return formattedEventData
}

async function getAttractionIds(artist) {
  let response = await( await fetch(`${attractionSearchUrl}&keyword=${encodeURIComponent(artist)}`)).json()
  let attractions = response._embedded.attractions
  return attractions.map(attraction => attraction.id).join(',')
}
