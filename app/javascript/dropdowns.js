var $dropdown = $(".dropdown > .dropdown-group");
var $dropdownToggle = $(".dropdown-toggle");
var $dropdownMenu = $(".dropdown-menu");
var showClass = "show";
let day = '';
let dt = '';
let pf = '';
let tf = '';
let restid = '';
var filterSelection = '';
var customFilter = [];
var priceDataGlobal = 9999;

if (window.matchMedia("(min-width: 768px)").matches) {
// $('body').on('click','.dropdown-toggle',function(e){

  $('body').on('click',function(e){
    $dropdownMenu.removeClass(showClass);
    $dropdownToggle.removeClass(showClass);
    $('.btn-group').removeClass(showClass);
    // $dropdownToggle.attr("aria-expanded", "false");
    if(e.target.class == "price-item"){
      const textContent = e.target.textContent;
      const priceData = e.target.getAttribute("data-price-filter");
      // console.log(priceData);
      if (textContent) {
        $('#price-content').text(textContent);
        $('#price-content').attr('data-price-filter', priceData);
        priceDataGlobal = priceData;
        // console.log(priceData);
      }
    }
    if(e.target.class == "type-item") {
      e.preventDefault();
      var clickedItem = $(this).data('dishType');
      if ($.inArray(clickedItem, customFilter) < 0) { //if it's not in there already, put it in
        if (clickedItem == 0) { //clear all type filters
          customFilter = [];
          $('.select-icon').css('background-color', 'white');
          $('.type-item').css('font-family', 'gothamlight');
        } else {
          if (clickedItem == 1 && customFilter.includes(2)) {
            customFilter.splice(customFilter.indexOf(2), 1);
            $('[data-dish-type=2]').find('.select-icon').css('background-color', 'white');
            $('[data-dish-type=2]').css('font-family', 'gothamlight');
          } else if (clickedItem == 2 && customFilter.includes(1)) {
            customFilter.splice(customFilter.indexOf(1), 1);
            $('[data-dish-type=1]').find('.select-icon').css('background-color', 'white');
            $('[data-dish-type=2]').css('font-family', 'gothamlight');
          }
          customFilter.push(clickedItem);
          $(this).find('.select-icon').css('background-color', '#2fc2a2');
          $(this).css('font-family', 'gothambook');
        }
        // console.log(customFilter);
      } else { //if it's in there and you click it, remove it
        customFilter.splice($.inArray(clickedItem, customFilter), 1);
        $(this).find('.select-icon').css('background-color', 'white');
        $(this).css('font-family', 'gothamlight');
      }
    }
    if(e.target.class == "dropdown-toggle" || "type-item"){
      const $this = $(e.target);
      console.log($this.closest('.btn-group').find($dropdownToggle).attr("aria-expanded"));
      if($this.closest('.btn-group').find($dropdownToggle).attr("aria-expanded") == "true"){
        console.log('ok')
        $dropdownMenu.removeClass(showClass);
        $dropdownToggle.removeClass(showClass);
        $('.btn-group').removeClass(showClass);
        $dropdownToggle.attr("aria-expanded", "false");
      } else {
        // console.log($this.closest('.btn-group').find($dropdownToggle))
        // console.log($this.closest('.btn-group').find($dropdownMenu))
        // console.log($this)
        $dropdownToggle.attr("aria-expanded", "false");
        $this.closest('.btn-group').find($dropdownToggle).attr("aria-expanded", "true");
        $this.closest('.btn-group').find($dropdownMenu).addClass(showClass);
        $this.closest('.btn-group').addClass(showClass);
      }
      day = $('#cateringDate').html();
      dt = $('#time-content').html();
      // initAutocomplete();
      restid = $('.menu-container').data('rest-id')
      $.ajax({
        method: "POST",
        headers: {
          'Accept': 'application/javascript',
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        },
        dataType: 'script',
        url: '/dashboard/update_filter_selections',
        data: {
          day: day.substring(0, day.indexOf(',')).trim(),
          delivery_time: dt.substring(0, dt.indexOf('-')).trim(),
          price_filter: priceDataGlobal,
          type_filter: customFilter,
          restaurant_id: restid,
          outerscope: true
        }

      }).then(function () {

      });
    }
  });

  $dropdown.hover(
    function() {
      const $this = $(this);
      $this.addClass(showClass);
      $this.find($dropdownToggle).attr("aria-expanded", "true");
      $this.find($dropdownMenu).addClass(showClass);
    },
    function() {
      const $this = $(this);
      $this.removeClass(showClass);
      $this.find($dropdownToggle).attr("aria-expanded", "false");
      $this.find($dropdownMenu).removeClass(showClass);
    }
  );
} else {
$dropdown.off("mouseenter mouseleave");
}
