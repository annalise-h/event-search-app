const key = "client_id=MjUwMDcwMjN8MTYzOTcwNzE2MS43OTAwOTU";
let searchVal = "dua lipa";
let urlifySearch = encodeURIComponent(searchVal);
let urlifySearch2 = searchVal.replace(" ", "-");
async function start() {
  const response = await fetch(
    `https://api.seatgeek.com/2/events?performers[primary].slug=${urlifySearch2}&${key}`
  );
  const data = await response.json();
  console.log(data);
}

// start();

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
    return data2[index].name.toLowerCase();
  });
  let data4 = data3.sort((a, b) => (a > b ? 1 : -1));
  console.table(data4);
}

getTaxonomies();

async function searchVenueByLocation() {
  let state = "GA";
  let city = "savannah";
  let typeOfEvent = "concert";
  const response = await fetch(
    `https://api.seatgeek.com/2/events?per_page=30&taxonomies.name=${typeOfEvent}&venue.state=${state}&venue.city=${city}&${key}`
  );
  const data = await response.json();
  let data2 = data.events;
  let data3 = data2.map((element, index) => {
    return data2[index].title.toLowerCase();
  });
  let data4 = data3.sort((a, b) => (a > b ? 1 : -1));
  console.table(data4);
}

searchVenueByLocation();
