const key = "client_id=MjUwMDcwMjN8MTYzOTcwNzE2MS43OTAwOTU";

//search seatgeek for events matching artist name
let searchVal = "billie Eilish";
let urlifySearch = encodeURIComponent(searchVal);
let urlifySearch2 = searchVal.replace(" ", "-");
async function start() {
  const response = await fetch(
    `https://api.seatgeek.com/2/events?performers[primary].slug=${urlifySearch2}&${key}`
  );
  const data = await response.json();
  let concertTitle = data.events.map((e, index) => {
    return data.events[index].title;
  });
  let venue = data.events.map((e, index) => {
    return `${data.events[index].venue.name}, ${data.events[index].venue.display_location}`;
  });
  let url = data.events.map((e, index) => {
    return data.events[index].url;
  });
  let image = data.events.map((e, index) => {
    return data.events[index].performers[0].image;
  });
  // console.table([concertTitle, image, venue, url]);
  // console.log(data);
}

start();

//Get list of genres available on seatgeek (21 total)
async function getGenres() {
  const response = await fetch(
    `https://api.seatgeek.com/2/genres?per_page=30&${key}`
  );
  const data = await response.json();
  let data2 = data.genres;
  let data3 = data2.map((element, index) => {
    return data2[index].name;
  });
  //   console.table(data3);
}

getGenres();

//get list of event types available on seatgeek (75 total)
async function getTaxonomies() {
  const response = await fetch(
    `https://api.seatgeek.com/2/taxonomies?per_page=30&${key}`
  );
  const data = await response.json();
  let data2 = data.taxonomies;
  let data3 = data2.map((element, index) => {
    return data2[index].name.toLowerCase(); //extract titles from event list
  });
  let data4 = data3.sort((a, b) => (a > b ? 1 : -1)); //alphabetize end list
  // console.table(data4);
}

getTaxonomies();

//following function takes in variables [City, State, Start date, and End date] as inputs.
//function returns events of type "concert" based on the inputs
async function searchVenueByLocation() {
  let state = "GA";
  let city = "atlanta";
  let typeOfEvent = "concert";
  let dateStart = "2021-01-01";
  let dateEnd = "2021-12-31";
  let output = {};
  let outputKeys = ["eventTitles", "eventVenue", "eventURL", "eventDate"];
  const response = await fetch(
    `https://api.seatgeek.com/2/events?per_page=30&taxonomies.name=${typeOfEvent}&venue.state=${state}&venue.city=${city}&datetime_local.gte=${dateStart}&datetime_local.lte=${dateEnd}&${key}`
  );
  const data = await response.json();
  let events = data.events;
  console.log(data);
  let eventTitles = events.map((element, index) => {
    return events[index].title.toLowerCase(); //extract titles from event list
  });
  output[outputKeys[0]] = eventTitles.sort((a, b) => (a > b ? 1 : -1)); //alphabetize end list
  let eventVenue = events.map((element, index) => {
    return events[index].venue.name; //extract titles from event list
  });
  output[outputKeys[1]] = eventVenue;
  let eventURL = events.map((element, index) => {
    return events[index].url; //extract titles from event list
  });
  output[outputKeys[2]] = eventURL.sort((a, b) => (a > b ? 1 : -1));
  let eventDate = events.map((element, index) => {
    return events[index].datetime_local; //extract titles from event list
  });
  output[outputKeys[3]] = eventDate;
  console.table(output);
}

searchVenueByLocation();
