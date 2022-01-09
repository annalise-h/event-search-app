/*
  Search event listeners and callback functions
*/

$(document).ready(() => {
  $("#search").submit(async function (e) {
    submitSearch(e)
  })
})

async function submitSearch(e) {
  e.preventDefault();

  let artistInput = $("#keywordInput").val()
  if (!artistInput) return

  //input values 
  let city = $("#cityInput").val();
  let state = $("#stateInput").val();
  let dateInput = $("#dateInput").val();
  let startAndEndDate = dateInput.split(" - ");

  let startDate
  let endDate

  if (dateInput.length == 0) {
    startDate = "";
    endDate = "";
  } else {
    startDate = new Date(startAndEndDate[0]).toISOString().split('T')[0]
    endDate = new Date(startAndEndDate[1]).toISOString().split('T')[0]
  }

  const allEvents = await getAndMergeEvents(city, state, artistInput, startDate, endDate)

  if (allEvents.length < 1) {
    noSearchesFound(artistInput)
  } else {
    loadEventCards(allEvents)
    appendPriceButtons(allEvents)
    numberOfSearchesFound(allEvents)
  }
}

// when no events are found, we want to display that to the user
function noSearchesFound(artist) {
  const output = $("#output");
  const searchInfo = $("#searchInfo");

  output.empty();
  searchInfo.empty();
  output.append(
    `
    <div class="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8" >
      <div class="card mb-3">
        <div class="row">
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title"><i class='fa fa-exclamation-circle text-danger'></i> Oops</h5>
                <p class="card-text">
                  No concerts were found for '${capitalize(artist)}'
                </p>
            </div>
          </div>
          <div class="col-md-4">
          </div>
        </div>
      </div>
    </div>
    `
  )
}

//capitalizes first letter of given string
function capitalize(str){
  if(str !== "" && str !== null){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

function loadEventCards(events){
  const output = $("#output")

  events.map(function(event){
    let combinedDateTime = `${event.date}T${event.time}`
    let formattedDateTime = moment(combinedDateTime).format('dddd MMMM Do YYYY, h:mma')
    output.append(
      `
        <div class="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 seatgeek" align="center">
          <div class="card mb-3">
            <div class="row">
              <div class="col-md-6">
                <img src="${event.image}" width="100%" height="280px" alt="...">
              </div>
              <div class="col-md-6 d-flex align-items-center">
                <div class="card-body">
                  <h5 class="card-title">${event.title.toUpperCase()}</h5>
                  <p class="card-text"><i class='fa fa-map-marker'></i>  ${event.venue}</p>
                  <p class="card-text"><i class='fa fa-calendar'></i> ${formattedDateTime}</p>
                  ${appendPriceButtons(event)}
                </div>
              </div>
            </div>
          </div>
      </div>
    `
    )
  })
}

function appendPriceButtons(event) {
  console.log(event)
  let priceStr = ''

  if (event.urls.ticketmasterUrl) {
    priceStr += `<p class="card-text" style="display:inline">From Ticketmaster</p>
        <a class="btn btn-primary mb-2"
        href="${event.urls.ticketmasterUrl}" 
        target="_blank">${priceAvailablity(event.price_min)}
        </a>` 
    } 
  if (event.urls.seatgeekUrl) {
    if (event.urls.seatgeekUrl) priceStr += '</br>'
    priceStr += `<p class="card-text" style="display:inline">From Seatgeek</p>
      <a class="btn btn-primary mb-2" 
      href="${event.urls.seatgeekUrl}" 
      target="_blank">${priceAvailablity(event.price_min)}
    </a>`
  }

  return priceStr
}

function numberOfSearchesFound(events){
  const searchInfo = $("#searchInfo")

  numberOfSearchResults = events.length
  searchInfo.empty();
  searchInfo.append(
  `
    <div class="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
        <b>${numberOfSearchResults} results found</b>
    </div>
  `)
}


function priceAvailablity(str){
  if (str === null) {
    return "No purchase price available";
  } else {
    if (Number(str) % 1 !== 0) str += 0
    return "$" + str;
  }
};
  
//bootstrap validation

(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

//date picker
$(function () {
  $('input[name="datefilter"]').daterangepicker({
    autoUpdateInput: false,
    locale: {
      cancelLabel: "Clear",
    },
  });

  $('input[name="datefilter"]').on(
    "apply.daterangepicker",
    function (ev, picker) {
      $(this).val(
        picker.startDate.format("MM/DD/YYYY") +
          " - " +
          picker.endDate.format("MM/DD/YYYY")
      );
    }
  );

  $('input[name="datefilter"]').on(
    "cancel.daterangepicker",
    function (ev, picker) {
      $(this).val("");
    }
  );
});

/*
  Seatgeek data fetch & manipulation
*/

const key = "client_id=MjUwMDcwMjN8MTYzOTcwNzE2MS43OTAwOTU"; //seetgeek API key

//following function takes in variables [Artist name, City, State, Start date, and End date] as inputs.
//function returns events of type "concert" based on the inputs
async function seatgeekSearch(artistInput, state, city, dateStart, dateEnd) {
  //function limted to events of type "concert"

  const typeOfEvent = "concert";
  const urlifySearch = artistInput.replace(" ", "-");
  //if any of the inputs from the form are blank, remove them from query. Artist is only required field.
  
  //the select statement returns null if no value is entered
  let stateSearch = state == null ? "" : `&venue.state=${state}`;
  let citySearch = city == "" ? "" : `&venue.city=${city}`;

  let startDateSearch =
    dateStart == "" ? "" : `&datetime_local.gte=${dateStart}`;
  let endDateSearch = dateEnd == "" ? "" : `&datetime_local.lte=${dateEnd}`;
  //returns list of 30 events
  const response = await fetch(
    //this only works if city is required
     `https://api.seatgeek.com/2/events?per_page=30&performers[primary].slug=${urlifySearch}&taxonomies.name=${typeOfEvent}&${stateSearch}${citySearch}${startDateSearch}${endDateSearch}&${key}`
  );
  const data = await response.json();
  let events = data.events;
  // get output for requested information
  let output = events.map(
    (
      { title, venue, url, datetime_local },
      index
    ) => {
      let dateFull = datetime_local.split("T");
      return {
        artist: data.events[index].performers[0].name, //extract image from event list
        title: title.toLowerCase(), //extract titles from event list
        venue: `${venue.name}, ${venue.display_location}`, //extract venue & venue city from event list
        urls: { seatgeekUrl: url }, //extract seatgeek link from event list
        date: dateFull[0], //extract date of event from event list
        time: dateFull[1],
        price_min: data.events[index].stats.lowest_price, //extract low price of event from event list
        price_max: data.events[index].stats.highest_price, //extract high price of event from event list
        image: data.events[index].performers[0].image, //extract image of artistfrom event list
      };
    }
  );
  //sort return based on title of event (a-z)
  let sortedEvents = output.sort((a, b) => (a.title > b.title ? 1 : -1));
  return sortedEvents;
}


/*
  Ticketmaster data fetch & manipulation
*/

/*
whenever we call the api, we are always searching within the US
and narrowing our search by music events only
*/
apiKey="nWu4c2uaSG2JYUTkGTzuHTAwSuZR1GDX"
const eventSearchUrl = `https://app.ticketmaster.com/discovery/v2/events?classificationName=music&countryCode=US&sort=name,asc&apikey=${apiKey}`
const attractionSearchUrl = `https://app.ticketmaster.com/discovery/v2/attractions?classificationName=music&countryCode=US&apikey=${apiKey}`

async function searchTicketmasterEvents(cityName, stateCode, artist, startDate, endDate) {
  let searchUrl = eventSearchUrl

  // if no events are found for the artist we want to return an empty array
  let attractionIds
  attractionIds = await getAttractionIds(artist)
  if (attractionIds) {
    searchUrl += `&attractionId=${attractionIds}`
  } else {
    return []
  }

  // append city to the search url if it exists
  if (cityName) searchUrl += `&city=${encodeURIComponent(cityName)}`

  //the select statement returns null if no value is entered, so a check for null is needed
  if (stateCode) searchUrl += `&stateCode=${stateCode}`

  // start date and end date are both optional so only execute logic if either exists 
  if (startDate || endDate) {
    // if one of these is null, we want to use * to search by all dates before or after
    !startDate ? startDate = '*' : startDate += 'T00:00:00'
    !endDate ? endDate = '*' : endDate += 'T00:00:00'
  }
  let eventSearchResponse = await (await fetch(searchUrl)).json()

  return formatEvents(eventSearchResponse._embedded.events)
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
      urls: { ticketmasterUrl: url },
      image: images[0].url,
      date: dates.start.localDate,
      time: dates.start.localTime,
      venue: 
        `${_embedded.venues[0].name}, ${_embedded.venues[0].city.name}, ${_embedded.venues[0].state.stateCode}`
    }
  })

  return formattedEventData
}

async function getAttractionIds(artist) {
  let attractionIdsResponse = await( await fetch(`${attractionSearchUrl}&keyword=${encodeURIComponent(artist)}`)).json()
  if (attractionIdsResponse.page.totalElements === 0) {
    return false
  }
  let attractions = attractionIdsResponse._embedded.attractions
  return attractions.map(attraction => attraction.id).join(',')
}

/* 
  Merge the data returned from Seatgeek + Ticketmaster into a single events array
*/ 

async function getAndMergeEvents(cityName, state, artist, startDate, endDate) {
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
      combinedEvent.urls = {
        ticketmasterUrl: ticketmasterEvent.urls.ticketmasterUrl,
        seatgeekUrl: matchedSeatGeekEvent.urls.seatgeekUrl
      }
      return combinedEvent 
    } else {
      return ticketmasterEvent
    }
  })

  combinedEvents = combinedEvents.concat(seatgeekEvents)

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