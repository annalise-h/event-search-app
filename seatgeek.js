const key = "client_id=MjUwMDcwMjN8MTYzOTcwNzE2MS43OTAwOTU"; //seetgeek API key

//search seatgeek for events matching artist name
async function seatgeekSearchByArtist(artistInput) {
  let urlifySearch = artistInput.replace(" ", "-");
  const response = await fetch(
    `https://api.seatgeek.com/2/events?per_page=30&performers[primary].slug=${urlifySearch}&${key}`
  );
  const data = await response.json();
  let output = data.events.map(
    (
      { title, venue, url, datetime_local, images, price_low, price_high },
      index
    ) => {
      // image = data.events.performers[0].image;
      return {
        title: title.toLowerCase(), //extract titles from event list
        venue: `${venue.name}, ${venue.display_location}`, //extract venue & venue city from event list
        url, //extract seatgeek link from event list
        dates: datetime_local, //extract date of event from event list;
        image: data.events[index].performers[0].image, //extract image of artist from event list;
        price_low: data.events[index].stats.lowest_price, //extract low price of event from event list
        price_high: data.events[index].stats.highest_price, //extract high price of event from event list
      };
    }
  );
  //sort return based on title of event (a-z)
  let sortedArtists = output.sort((a, b) => (a.title > b.title ? 1 : -1));
  return sortedArtists;
}

//Get list of genres available on seatgeek (21 total)
// async function getGenres() {
//   const response = await fetch(
//     `https://api.seatgeek.com/2/genres?per_page=30&${key}`
//   );
//   const data = await response.json();
//   let data2 = data.genres;
//   let data3 = data2.map((element, index) => {
//     return data2[index].name;
//   });
//   //   console.table(data3);
// }
// getGenres();

//get list of event types available on seatgeek (75 total)
// async function getTaxonomies() {
//   const response = await fetch(
//     `https://api.seatgeek.com/2/taxonomies?per_page=30&${key}`
//   );
//   const data = await response.json();
//   let data2 = data.taxonomies;
//   let data3 = data2.map((element, index) => {
//     return data2[index].name.toLowerCase(); //extract titles from event list
//   });
//   let data4 = data3.sort((a, b) => (a > b ? 1 : -1)); //alphabetize end list
//   // console.table(data4);
// }
// getTaxonomies();

//following function takes in variables [City, State, Start date, and End date] as inputs.
//function returns events of type "concert" based on the inputs
async function seatgeekSearchVenueByLocation(state, city, dateStart, dateEnd) {
  //function limted to events of type "concert"
  const typeOfEvent = "concert";
  //returns list of 30 events
  const response = await fetch(
    `https://api.seatgeek.com/2/events?per_page=30&taxonomies.name=${typeOfEvent}&venue.state=${state}&venue.city=${city}&datetime_local.gte=${dateStart}&datetime_local.lte=${dateEnd}&${key}`
  );
  const data = await response.json();
  console.log(data);
  let events = data.events;
  // get output for requested information
  let output = events.map(
    (
      { title, venue, url, datetime_local, price_low, price_high, image },
      index
    ) => {
      return {
        title: title.toLowerCase(), //extract titles from event list
        venue: `${venue.name}, ${venue.display_location}`, //extract venue & venue city from event list
        url, //extract seatgeek link from event list
        dates: datetime_local, //extract date of event from event list
        price_low: data.events[index].stats.lowest_price, //extract low price of event from event list
        price_high: data.events[index].stats.highest_price, //extract high price of event from event list
        image: data.events[index].performers[0].image, //extract image of artistfrom event list
      };
    }
  );
  //sort return based on title of event (a-z)
  let sortedEvents = output.sort((a, b) => (a.title > b.title ? 1 : -1));
  return sortedEvents;
}
