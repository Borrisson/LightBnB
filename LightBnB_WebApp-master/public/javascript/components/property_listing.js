$(() => {
  window.propertyListing = {};

  function createListing(property, isReservation) {
    return `
    <article id="${property.id}" class="property-listing">
        <section class="property-listing__preview-image">
          <img src="${property.thumbnail_photo_url}" alt="house">
        </section>
        <section class="property-listing__details">
          <h3 class="property-listing__title">${property.title}</h3>
          <ul class="property-listing__details">
            <li>number_of_bedrooms: ${property.number_of_bedrooms}</li>
            <li>number_of_bathrooms: ${property.number_of_bathrooms}</li>
            <li>parking_spaces: ${property.parking_spaces}</li>
          </ul>
          ${isReservation ?
        `<p>${moment(property.start_date).format('ll')} - ${moment(property.end_date).format('ll')}</p>`
        : ``}
          <footer class="property-listing__footer">
            <div class="property-listing__rating">${Math.round(property.average_rating * 100) / 100}/5 stars</div>
            <div class="property-listing__price">$${property.cost_per_night}/night</div>
          </footer>
        </section>
        <div>
        <button class="reservation-button" id="reservation-button-${property.id}">Make Reservation</button>
        </div>
      </article>
    `
  }

  window.propertyListing.createListing = createListing;


  $('body').on('click', '.reservation-button', function () {
    views_manager.show('reservation');
    $('article').first().remove();
    $(this)
    .closest('article')
    .clone()
    .appendTo('.property-listings');
    $(`<input type="hidden" value="${$(this).closest('article').attr('id')}" name="property-id">`).appendTo('form');
    removeReservationBtn();
    return false;
  });
});