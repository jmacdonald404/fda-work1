$('#autocomplete').on('mouseenter mouseleave click change', function() {
  let value = $(this).val();
  updateValue('#reviewAddress', value);
})

// initialize
let timeValue = $('#time-content').text();
let addressValue = $('#autocomplete').val();
let dateValue = $('#cateringDate').text();

updateValue('#reviewTime', timeValue);
updateValue('#summaryHeaderTime', timeValue);
updateValue('#reviewAddress', addressValue);
updateValue('#reviewDate', dateValue);

function updateValue(selector, value) {
  $(selector).text(value);
}