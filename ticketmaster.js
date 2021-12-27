/*
whenever we call the api, we are always searching within the US
and narrowing our search by music events only
*/
const eventSearchUrl = 'https://app.ticketmaster.com/discovery/v2/events?classificationName=music&countryCode=US&apikey=M9MAwXQGG4GsWcLELZRygN0xaMztNO5y'
const attractionSearchUrl = 'https://app.ticketmaster.com/discovery/v2/attractions?classificationName=music&countryCode=US&apikey=M9MAwXQGG4GsWcLELZRygN0xaMztNO5y'

async function searchEvents(cityName, artist, startDate, endDate) {
  let searchUrl = eventSearchUrl
  // we will always require a location so append the value to the url
  searchUrl += `&city=${encodeURIComponent(cityName)}`

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
    searchUrl += `&localStartEndDateTime=${startDate},${endDate}`
  }

  // TODO: add alphabet sort to search url
  // maybe add sort type as a parameter so we can use this on the discover page
  let eventSearchResponse = await (await fetch(searchUrl)).json()

  // only format the events when we get results from our search
  if (eventSearchResponse.page.number > 0) {
    formatEvents(eventSearchResponse._embedded.events)
  } else {
    // TODO: better handle searches with 0 responses
    console.log('no results found')
  }
}

/* 
return event data with the following info: name, price min and max, ticket link,
images, local date, venue name, venue location 
*/
function formatEvents(events) {
  const formattedEventData = events.map( ({name, priceRanges, url, images, dates, _embedded}) => {
    return { 
      name, 
      // some events don't have a price range, so then we return a default value
      price_min: priceRanges ? priceRanges[0].min.toString() : "N/A",
      price_max: priceRanges ? priceRanges[0].max.toString() : "N/A",
      url, 
      images, 
      date: dates.start.localDate, 
      //TODO: condence venue name and address
      venue_name: _embedded.venues[0].name, 
      venue_address_1: _embedded.venues[0].address.line1,
      venue_city: _embedded.venues[0].city.name,
      venue_state: _embedded.venues[0].state.stateCode,
    }
  })

  return formattedEventData
}

async function getAttractionIds(artist) {
  let response = await( await fetch(`${attractionSearchUrl}&keyword=${encodeURIComponent(artist)}`)).json()
  let attractions = response._embedded.attractions
  return attractions.map(attraction => attraction.id).join(',')
}
