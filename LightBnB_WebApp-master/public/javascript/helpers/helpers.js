$(() => {
  function removeReservationBtn() {
    $('button').remove();
    return false;
  }
  window.removeReservationBtn = removeReservationBtn;
});