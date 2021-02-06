$(() => {
  const $makeReservationForm = $(`
<section class="property-listings">
<form method="POST" action="/api/reservations" id="reservation-form" class="reservation-form">
  <label for="start-date">Start Date</label>
  <input type="date" name="start-date">
  <label for="end-date">End Date</label>
  <input type="date" name="end-date">
  <input type="submit">
</form>
</section>
  `);
  window.$makeReservationForm = $makeReservationForm;


  $makeReservationForm.on('submit', function(event) {
    event.preventDefault();

    const data = $(this).serialize();
    makeReservation(data)
      .then(getMyDetails)
      .then(() => {

        views_manager.show('listings');
      });
  });
});
