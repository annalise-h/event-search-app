const key = "client_id=MjUwMDcwMjN8MTYzOTcwNzE2MS43OTAwOTU";
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
  console.table([concertTitle, venue, url]);
  console.log(data);
}

start();

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
  console.table(data4);
}

getTaxonomies();

async function searchVenueByLocation() {
  let state = "GA";
  let city = "atlanta";
  let typeOfEvent = "concert";
  let dateStart = "2021-01-01";
  let dateEnd = "2021-12-31";
  const response = await fetch(
    `https://api.seatgeek.com/2/events?per_page=30&taxonomies.name=${typeOfEvent}&venue.state=${state}&venue.city=${city}&datetime_local.gte=${dateStart}&datetime_local.lte=${dateEnd}&${key}`
  );
  const data = await response.json();
  let data2 = data.events;
  let data3 = data2.map((element, index) => {
    return data2[index].title.toLowerCase(); //extract titles from event list
  });
  let data4 = data3.sort((a, b) => (a > b ? 1 : -1)); //alphabetize end list
  console.table(data4);
}

searchVenueByLocation();
