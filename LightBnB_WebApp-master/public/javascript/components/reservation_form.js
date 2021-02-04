$(() => {
  const $makeReservation = $(`
<section class="property-listings">
<form id="reservation-form" class="reservation-form">
  <label for="start-date">Start Date</label>
  <input type="date" name="start-date">
  <label for="end-date">End Date</label>
  <input type="date" name="end-date">
  <input type="submit">
</form>
</section>
  `);
  window.$makeReservation = $makeReservation;
});
