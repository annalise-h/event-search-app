let results = [];
let searchButton = document.querySelector(".btn");
let search = document.getElementById("search");
$("#search").submit(function (e) {
  e.preventDefault();
  let city = document.getElementById("cityInput").value;
  let state = document.getElementById("stateInput").value;
  let keyInput = document.getElementById("keywordInput").value;
  let dateInput = document.getElementById("dateInput").value;
  if (dateInput.length == 0) {
    dateStart = "";
    dateEnd = "";
  } else {
    startAndEndDate = dateInput.split(" - ");
    dateStart = startAndEndDate[0].replace(new RegExp("/", "g"), "-");
    dateEnd = startAndEndDate[1].replace(new RegExp("/", "g"), "-");
  }

  async function test() {
    const artist = await seatgeekSearch(
      keyInput,
      state,
      city,
      dateStart,
      dateEnd
    );
    loadTable(artist);
    loadArtist(artist);
  }
  test();
  function loadTable(artist) {
    if (artist.length > 0) {
      $("#output").html(`<div class="row h-500px w-500px"">
                    <img
                      alt=""
                    />
                  </div>
                  <div class="row">
                    <table class="table table-striped table-hover" style="text-align:center; vertical-align:middle" id=finalTable>
                      <thead>
                        <th scope="col" onclick="sortTable(0)"><i id="sortDate" class="fas fa-sort-up"></i> Date</th>
                        <th scope="col" onclick="sortTable(1)"><i id="sortVenue" class="fas fa-sort-up"></i> Venue</th>
                        <th scope="col" onclick="sortTable(2)"><i id="sortPrice" class="fas fa-sort-up"></i> Tickets</th>
                      </thead>
                      <tbody id="tableOutput"></tbody>
                  </table>
                  </div>`);
    } else {
      $("#output").html(`
            <div row justify-content-center mt-4>
              <div col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6  align='center'>
                <h4>No concerts</h4>
              </div>
            </div>
            `);
    }
  }
  function loadArtist(artist) {
    let tableRef = document.getElementById("tableOutput");
    artistArray = artist.map(function (event) {
      let newRow = tableRef.insertRow();
      let dateCell = newRow.insertCell(0);
      dateCell.id = `${event.date}${event.time}`;
      let venueCell = newRow.insertCell(1);
      venueCell.id = `${event.venue}`;
      let urlCell = newRow.insertCell(2);
      urlCell.id = `${event.price_min}`;
      let combinedDateTime = `${event.date}T${event.time}`;
      let formattedDateTime = moment(combinedDateTime).format(
        "dddd MMMM Do YYYY, h:mma"
      );
      dateCell.innerHTML = formattedDateTime;
      venueCell.innerHTML = `${event.venue}`;
      urlCell.innerHTML = `
                              <a
                                class="btn btn-danger"
                                href="${event.url}"
                              >
                                Seatgeek from $${event.price_min}
                              </a>`;
    });
    return artistArray.join("");
  }
});
function sortTable(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("finalTable");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "desc";
  /* Make a loop that will continue until
    no switching has been done: */
  toggleArrow(n);
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
      first, which contains table headers): */
    for (i = 1; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
        one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.id > y.id) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.id < y.id) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "desc") {
        dir = "asc";
        switching = true;
      }
    }
  }
}
//rotate sorting arrow
function toggleArrow(n) {
  if (n == 0) {
    let getArrow = document.getElementById("sortDate");
    getArrow.classList.toggle("down");
  } else if (n == 1) {
    let getArrow = document.getElementById("sortVenue");
    getArrow.classList.toggle("down");
  } else {
    let getArrow = document.getElementById("sortPrice");
    getArrow.classList.toggle("down");
  }
}
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
