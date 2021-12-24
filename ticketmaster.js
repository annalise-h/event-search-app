/*
whenever we call the api, we are always searching within the US
and narrowing our search by music events only
*/

const eventSearchUrl = 'https://app.ticketmaster.com/discovery/v2/events?classificationName=music&countryCode=US&apikey=M9MAwXQGG4GsWcLELZRygN0xaMztNO5y'
const attractionSearchUrl = 'https://app.ticketmaster.com/discovery/v2/attractions?classificationName=music&countryCode=US&apikey=M9MAwXQGG4GsWcLELZRygN0xaMztNO5y'

/* 
functions to search ticketmaster api by location / artist / date
return event data with the following info: name, price range, location, date,
image, ticket link
NOTE: All these functions return promises, need to pass the data
into a render function
*/ 

async function getEventsByLocation (cityName) {
  if (!cityName) return

  const response = await fetch(`${eventSearchUrl}&city=${encodeURIComponent(cityName)}`)
  const result = await response.json()
  const events = result._embedded.events
  
  const eventsData = events.map( ({name, priceRanges, url, images, dates}) => {
    return { name, priceRanges, url, images, dates, date: dates.start.localDate}
  })

  return eventsData
}

// this function expects a date in the YYYY-mm-dd format
async function getEventsByDate(startDate, endDate) {
  if (!startDate && !endDate) return

  startDate == null ? startDate = '*' : startDate += 'T00:00:00'
  endDate == null ? endDate = '*' : endDate += 'T00:00:00'

  const response = 
    await fetch(`${eventSearchUrl}&localStartEndDateTime=${startDate},${endDate}`)
  const result = await response.json()
  const events = result._embedded.events

  const eventsData = events.map( ({name, priceRanges, url, images, dates}) => {
    return { name, priceRanges, url, images, date: dates.start.localDate}
  })

  return eventsData
}

async function getEventsByArtist(artist) {
  if (!artist) return

  // first search artist name using attractions endpoint
  let response = 
    await fetch(`${attractionSearchUrl}&keyword=${encodeURIComponent(artist)}`)
  let result = await response.json()
  const attractions = result._embedded.attractions
  const attractionIDs = attractions.map(attraction => attraction.id).join(',')
  
  // use attraction ids to search to specific events
  response = await fetch(`${eventSearchUrl}&attractionId=${attractionIDs}`)
  result = await response.json();
  //searching for certain artist throws a TypeError , whereas some will return successfully
  try{
    const events = result._embedded.events
    console.log(events);
    const eventsData = events.map( ({name, priceRanges, url, images, dates}) => {
      return { name, priceRanges, url, images, date: dates.start.localDate}
    })
  
    console.log(eventsData)
    return eventsData
  }catch(e){
    if(e instanceof TypeError ){
      console.log(e);
    }
  }


}

// TODO: combine all of these into a single search function


$(document).ready(function(){
      $("#search").submit(function(e){
        e.preventDefault();
        let locationInput = $("#locationInput").val();
        let dateInput = $("#dateInput").val();
        let startAndEndDate = dateInput.split(" - ")
        // console.log(startAndEndDate)
        let keywordInput = $("#keywordInput").val();
        // getEventsByArtist(keywordInput)
        getEventsByLocation(locationInput)
        // getEventsByDate(startAndEndDate[0], startAndEndDate[1]);
        
      })
      $(function() {
        $('input[name="daterange"]').daterangepicker({
          opens: 'left'
        }, function(start, end, label) {
          return [start.format('YYYY-MM-DD'),end.format('YYYY-MM-DD')];
        });
      });

})