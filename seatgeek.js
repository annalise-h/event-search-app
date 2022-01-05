const key = "client_id=MjUwMDcwMjN8MTYzOTcwNzE2MS43OTAwOTU"; //seetgeek API key

//following function takes in variables [Artist name, City, State, Start date, and End date] as inputs.
//function returns events of type "concert" based on the inputs
async function seatgeekSearch(artistInput, state, city, dateStart, dateEnd) {
  //function limted to events of type "concert"
  const typeOfEvent = "concert";
  const urlifySearch = artistInput.replace(" ", "-");
  //returns list of 30 events
  const response = await fetch(
    `https://api.seatgeek.com/2/events?per_page=30&performers[primary].slug=${urlifySearch}&taxonomies.name=${typeOfEvent}&venue.state=${state}&venue.city=${city}&datetime_local.gte=${dateStart}&datetime_local.lte=${dateEnd}&${key}`
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
        artist: data.events[index].performers[0].name, //extract image from event list
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
