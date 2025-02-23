/*global $*/
/*global add*/
var qawst = 0;
function updateDishes() {
    var typeslist = [];
    $('.dishcard').each(function () {
      var dishFlags = [];
      var filterDishPrice = $(this).find('.dishcard_price').text().replace(/\D/g, '');
      // currently filtering by grabbing the data id associated with each filter type declared in _nav_dropdown
      // and comparing that against the text inside each dish card. There ought to be stricter declarations for
      // individual/shared portions at some point, as well as a data id for the df/gf/vg options in each dish card,
      // assuming assets will take their place in the near future rather than text.
      $(this).find('.dishcard_badge-container span').each(function () {
        if ($(this).find('.dishdietary').text() == "DF") dishFlags.push(4);
        if ($(this).find('.dishdietary').text() == "GF") dishFlags.push(3);
        if ($(this).text() == "VG") dishFlags.push(5);
      });
      $(this).find('.subselection-card').each(function () {
        if ($(this).find('#sub-name').text() == "Sharing platter") dishFlags.push(2);
      });
      // testvar = checker(dishFlags,customFilter);
      // console.log(`filterdishprice[${filterDishPrice}] > filterselection[${filterSelection}] = ${filterDishPrice > filterSelection}. ${dishFlags} contains(not) ${customFilter}? ${testvar}`);
      if (filterDishPrice > filterSelection || !checker(dishFlags, customFilter)) { //if price on card is higher than filtered price, hide
        $(this).parent().css('display', 'none');
      } else {
        $(this).parent().css('display', 'inherit');
      }
    })
    if (customFilter.length) {
      if (customFilter.includes(1))
        typeslist.push("Individual");
      if (customFilter.includes(2))
        typeslist.push("Sharing");
      if (customFilter.includes(3))
        typeslist.push("GF");
      if (customFilter.includes(4))
        typeslist.push("DF");
      if (customFilter.includes(5))
        typeslist.push("Vegan");
      $('#type-content').html(typeslist.join(", "));
    } else {
      $('#type-content').html('Dish Types');
    }
  };
if($('#loginSubmit').length||$('#signUpSubmit').length){

// } else if(!$('.modalaccount').length){
} else if($('#maincontent').length){
$('#reviewOrderModal').off('show.bs.modal');
updateTotal();
var dh = $(document).height();
var wh = $(window).height();
var lefttarget = $('#summaryTarget').offset().left + 40;
var offset = 0;
var calc1 = 0;
$('.summary-card').css('left', lefttarget + 'px');

$('.summary-card').css('top', (730) + 'px');
$('#order-summary-card').removeClass("fix-card");
$('#order-summary-card').removeClass("bottom-card");

setTimeout(function () {
  dh = $(document).height();
  wh = $(window).height();
  offset = $("#order-summary-card").height() - 440;
  $('.bottom-card').css('top', (dh - 2455 - offset) + 'px');
  if (dh - $("#order-summary-card").height() < 1305) {
    //add div w/ height = 1305 - dh - summarycardheight (1305 is roughly the space outside of dh - cart height)
    $("#maincontent").append(`<div style="min-height:${1305-(dh-$("#order-summary-card").height())}px"></div>`)
  }
}, 1000)
$(document).on("resize click", function (e) {
  dh = $(document).height();
  wh = $(window).height();
  offset = $("#order-summary-card").height() - 440;
  lefttarget = $('#summaryTarget').offset().left + 40;
  // $('.bottom-card').css('top',(-615)+'px');
  $('.bottom-card').css('top', (dh - 2455 - offset) + 'px');
  $('.summary-card').css('left', lefttarget + 'px');
  // autoSave();
})
$('body').on('click','.minus',function(){
  autoSave();
});
$('body').on('click','.plus',function(){
  autoSave();
});
$(window).on("resize", function (e) {
  dh = $(document).height();
  wh = $(window).height();
  lefttarget = $('#summaryTarget').offset().left + 40;
  $('.summary-card').css('left', lefttarget + 'px');
})
offset = $("#order-summary-card").height() - 440;
calc1 = dh - wh - offset;
var winfoot = wh + 456;
$(document).off('scroll');
$(document).on("scroll", function (e) {
  var wst = $(window).scrollTop();
  var calc2 = calc1 - wh + 456;
  // console.log(wst)
  // if (wst > 695 && wst < calc2) {
  //   $('#order-summary-card').addClass("fix-card");
  // } else {
  //   $('#order-summary-card').removeClass("fix-card");
  // }
  // if (wst > 440+600-offset) {


  if (wst > dh - 456 - 440 - 165 - offset) {
    console.log('bottom');
    $('#order-summary-card').addClass("bottom-card");
    $('#order-summary-card').removeClass("fix-card");
    $('.bottom-card').css('top', (dh - 2455 - offset) + 'px');
    //$('.bottom-card').css('position','relative');
  } else if (wst > 640) {
    // } else if (wst > 695) {
    console.log('scrolling');
    $('#order-summary-card').addClass("fix-card");
    $('#order-summary-card').removeClass("bottom-card");
    $('.summary-card').css('top', (0) + 'px');
  } else {
    console.log('top');
    $('.summary-card').css('top', (635) + 'px');
    $('#order-summary-card').removeClass("fix-card");
    $('#order-summary-card').removeClass("bottom-card");
  }
})
$('body').on('show.bs.modal', '#reviewOrderModal', function () {
  console.log('h')
  setTimeout(function () {
    $('.modal-backdrop.show').attr('style', 'opacity: 1 !important; background-color: rgba(45, 57, 88, 0.85) !important;');
  }, 500)

  // $('.modal-backdrop').css('opacity', '1.0 !important');
  $('body').on('click', '#reviewGoBack', function(){
    document.cookie = 'awaiting_review=false';
  });
  $('body').on("hidden.bs.modal",'#reviewOrderModal', function(){
    document.cookie = 'awaiting_review=false';
  })
  $('body').on('click', '#continuePaymentSubmit', function () {
    $('#reviewOrderModal').modal('hide');
    document.cookie = 'awaiting_review=false';

    if ($('#cardLast4').html().length) {
      $('#cardSelectModal').modal('show');
      console.log("cu has token");
      console.log('endpoint 1')
    } else {
      $('#paymentModal').modal('show');
      // console.log("ok");
      console.log('endpoint 2')
    }


  })
  let summaryItems = $('.dish-container_summary');
  summaryItems.each(function (element) {
    let quantity = "";
    let dish_id = "";
    var that = $(this);
    var utensils = 0;
    if ($('.dish-container').length > 0) {
      $('.dish-container').each(function () {
        var subid = $(this).find('.dish-quantity').data('dishId');
        var cquantity = $(this).find('.input-number').val();
        var qmult = $(this).find('.input-number').data('quantAdjusted');
        utensils += parseInt(qmult);
        if (subid == $(that).find('.dish-quantity').data('dishId')) {
          $(that).find('.input-number').val(cquantity);
        }
      });
    }

    quantity = $(this).find('.input-number').val()
    var price = $(this).find('[data-dish-price]').data('dishPrice')
    var dishTotal = parseInt(quantity) * parseInt(price)
    $(this).find('[data-dish-total-id]').text(`$${dishTotal}`)
    $('.dish-quantity > input').each(function (i) {
      if (i < $('.dish-quantity > input').length - 1) {
        $('.utensil-total').val(utensils);
      }
    })
  })
})

// $('[data-type="minus"], [data-type="plus"]').click(function(){
$('body').on('click', '.cart-minus, .cart-plus', function () {
  const quantity = $(this).parents('.btn-group').parent().find('.input-number');
  const dish_id = $(this).parent().parent().parent().data('dishId');
  const menu_dish = "[data-dish-id=" + `'${dish_id}'` + "]";
  const dish_total_id = "[data-dish-total-id=" + `'${dish_id}'` + "]";
  const type = $(this).parent().data('type');
  addQuantity(quantity, type, menu_dish, dish_total_id);
  updateTotal(dish_total_id);
});

$('body').on('click', '.dish-delete', function () {
  let catering_dish_id = '';
  if ($(this).data('cateringDishId')) {
    catering_dish_id = $(this).data('cateringDishId');
    deleteCateringDishReviewModal(catering_dish_id);
  } else {
    console.log('hello')
    catering_dish_id = $(this).siblings('.dish-quantity').data('cateringDishId');
    deleteCateringDish(catering_dish_id);
  }
  setTimeout(function () {
    offset = $("#order-summary-card").height() - 440;
    var wst = $(window).scrollTop();
    if (wst > 440 + 600 - offset) {
      $('#order-summary-card').addClass("bottom-card");
      $('#order-summary-card').removeClass("fix-card");
    } else if (wst > 695) {
      $('#order-summary-card').addClass("fix-card");
      $('#order-summary-card').removeClass("bottom-card");
    } else {
      $('#order-summary-card').removeClass("fix-card");
      $('#order-summary-card').removeClass("bottom-card");
    }
  }, 500);
  day = $('#cateringDate').html();
  dt = $('#time-content').html();
  pf = priceDataGlobal;
  tf = customFilter;
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
      day: day.substr(0, day.indexOf(',')).trim(),
      delivery_time: dt.substr(0, dt.indexOf('-')).trim(),
      price_filter: pf,
      type_filter: tf,
      restaurant_id: restid,
      outerscope: true
    }

  }).then(function () {

  });
})

function addQuantity(quantity, type, menu_dish, dish_total_id) {
  let dish_quantity = parseInt(quantity.val());
  // let test24 = $(menu_dish);
  let test24 = $(menu_dish).find('input').data('quantAdjusted');
  let mult = parseInt(test24)/dish_quantity;

  console.log(mult);
  console.log("okay")

  if (type === 'minus') {
    dish_quantity = dish_quantity - 1
    if (dish_quantity > 0) {
      quantity.val(dish_quantity);
      $(`.dish-container ${menu_dish}`).find('input').val(dish_quantity);
      $(`.dish-container_summary ${menu_dish}`).find('input').val(dish_quantity);
      $(menu_dish).data('dishQuantity', dish_quantity);
      $(menu_dish).find('input').data('quantAdjusted',parseInt(test24)-mult);
    } else {
      1
    }
  } else {
    dish_quantity = dish_quantity + 1
    if (dish_quantity > 0) {
      quantity.val(dish_quantity);
      $(`.dish-container ${menu_dish}`).find('input').val(dish_quantity);
      $(`.dish-container_summary ${menu_dish}`).find('input').val(dish_quantity);
      $(`${menu_dish}`).find('input').val(dish_quantity);
      $(menu_dish).data('dishQuantity', dish_quantity);
      $(menu_dish).find('input').data('quantAdjusted',parseInt(test24)+mult);
    } else {
      1
    }
  }
}

function deleteCateringDish(catering_dish_id) {
  $.ajax({
    method: "delete",
    url: '/dashboard/delete_catering_dish',
    data: {
      catering_dish_id: catering_dish_id
    }
  })
    .then(function () {
      Turbolinks.visit(window.location, {action: "replace"});
    })
}

function deleteCateringDishReviewModal(catering_dish_id) {
  let dish_id_selector = "[data-catering-dish-id=" + `'${catering_dish_id}'` + "]"
  $.ajax({
    method: "delete",
    url: '/dashboard/delete_catering_dish',
    data: {
      catering_dish_id: catering_dish_id
    }
  })
    .then(function () {
      $(`div.dish-container > .dish-quantity${dish_id_selector}`).parent().remove();
      $(`.dish-container_summary > td > .dish-quantity${dish_id_selector}`).parents('.dish-container_summary').remove();
      if ($('.dish-container_summary > td > .dish-quantity').length < 1) {
        Turbolinks.visit(window.location, {action: "replace"});
      } else {
        updateTotal();
      }
    })
}

function updateTotal(dish_total_id) {
  let items = $('.dish-container');
  let summaryItems = $('.dish-container_summary');
  let totalArr = []
  if (items.length > 0) {
    items.each(function (element) {
      let quantity = "";
      let dish_id = "";
      quantity = $(this).children().closest('.dish-quantity').find('.input-number').val();
      var price = $(this).children().find('.dish-price').data('dishPrice');
      var dishTotal = parseInt(quantity) * parseInt(price);

      let dish_total_id = $(this).find('.dish-quantity').data('dishId');
      let dish_total_selector = "[data-dish-total-id=" + `'${dish_total_id}'` + "]"
      $(dish_total_selector).text(`$${dishTotal}`)

      $(this).children().find('.dish-price').text(`$${dishTotal}`)

      totalArr.push(dishTotal);
    })
  }

  let delivery_fee = parseInt($('[data-delivery-fee]').data('deliveryFee'))
  let preDelSubtotal = totalArr.reduce(function (a, b) {
    return a + b;
  }, 0)
  let subtotal = preDelSubtotal
  let gst = ((subtotal + delivery_fee) * 0.05)
  let gstDisplay = ((subtotal + delivery_fee) * 0.05).toFixed(2)
  let total = (delivery_fee + subtotal + gst).toFixed(2)

  $('[data-subtotal]').text('$' + subtotal.toFixed(2))
  $('[data-gst]').text('$' + gstDisplay)
  $('[data-total]').text('$' + total)
}

function autoSave() {
  let catering_order_id = $('#catering_order_id').val();
  let items = $('.dish-container');
  let delivery_date = $('#cateringDate').data('dateSelected');
  let time_pre = $('#time-content').html();
  let delivery_time = time_pre.substr(1, time_pre.indexOf('-') - 2);
  // let delivery_time = $('#time-content').text()[0, $('#time-content').text().index("-")-1];
  let delivery_address = $('#locationField > input').val();
  let total_price = 0;

  let cateringItemsArr = [];

  if (items.length > 0) {
    total_price = Number($('[data-total]').html().replace(/[^0-9.-]+/g, "")) * 100;
    items.each(function (element) {
      let quantity = "";
      let dish_id = "";
      quantity = $(this).children().closest('.dish-quantity').find('.input-number').val();
      dish_id = $(this).children().closest('.dish-quantity').data('cateringDishId');

      cateringItemsArr.push({id: dish_id, quantity: quantity});
    })
    $.ajax({
      method: "POST",
      url: '/dashboard/bulk_update_catering_dishes',
      data: {
        catering_order_id: catering_order_id,
        catering_dishes_attributes: JSON.stringify(cateringItemsArr),
        delivery_date: delivery_date,
        delivery_time: delivery_time,
        delivery_address: delivery_address,
        total_price: total_price
      }
    })
  }

  cateringItemsArr = [];
}

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

//setInterval(function(){autoSave();}, 20000) // Every 20 seconds, save the catering order.
// setInterval(function(){autoSave();}, 200000) // Every 20 seconds, save the catering order.
}
var filterSelection = '';
var customFilter = [];
var priceDataGlobal = 9999;


if($('#loginSubmit').length||$('#signUpSubmit').length){

// } else if(!$('.modalaccount').length){
} else if($('#maincontent').length){
  $('#loaderModal').modal('show');

  var day = $('#cateringDate').html();
  var dt = $('#time-content').html();
  var pf = priceDataGlobal;
  var tf = customFilter;
  // initAutocomplete();
  var restid = $('.menu-container').data('rest-id');
  $.ajax({
    method: "POST",
    headers: {
      'Accept': 'application/javascript',
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    url: '/dashboard/update_filter_selections',
    dataType: 'script',
    data: {
      day: day.substr(0, day.indexOf(',')).trim(),
      delivery_time: dt.substr(0, dt.indexOf('-')).trim(),
      price_filter: pf,
      type_filter: tf,
      restaurant_id: restid,
      outerscope: true,
      test: "true"
    }

  }).then(function () {

  });
  console.log('turbolinks?');
  if(qawst) {
    $('#loaderModal').modal('show');
    console.log(qawst + "qawst");
    setTimeout(function(){
      $(window).scrollTop(qawst);
      console.log('setting qawst' + qawst);
      setTimeout(function(){
        $('#loaderModal').modal('hide');
      }, 200); // make this a promise
    }, 100);
    // $('#loaderModal').modal('hide');
  }


  var checker = (arr, target) => target.every(v => arr.includes(v));

  //when turbolinks loads, bind the click event, get the cost filter data, refresh the filtered items
  var filterSelection = $('#price-content').data('priceFilter');

  // $('body').on('click', '.btn-group > #dropdownDate', function (e) {
  //   e.preventDefault();
  //   var datepicker = $("#cateringDatePicker");
  //   console.log('test');
  //   console.log(datepicker);
  //   $(datepicker).modal('show');
  // });
  // $('.time-item').off('click');
  $('body').on('click', '.time-item', function (e) {
    const textContent = e.target.textContent;
    if (textContent) {
      let time_id = $(this).attr('id');
      $('#time-content').text(textContent);
      $('#time-content').attr('data-time-selected', time_id);
      $('#summaryHeaderTime').text(textContent);
      $('#reviewTime').text(textContent);
    }
    day = $('#cateringDate').html();
    dt = $('#time-content').html();
    pf = priceDataGlobal;
    tf = customFilter;
    $('#loaderModal').modal('show');
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
        day: day.substr(0, day.indexOf(',')).trim(),
        delivery_time: dt.substr(0, dt.indexOf('-')).trim(),
        price_filter: pf,
        type_filter: tf,
        restaurant_id: restid,
        container: 'time'
      }
    }).then(function () {

    })
  });

  // $('.price-item').off('click');
  $('body').on('click', '.price-item', function (e) {
    const textContent = e.target.textContent;
    const priceData = e.target.getAttribute("data-price-filter");
    // console.log(priceData);
    if (textContent) {
      $('#price-content').text(textContent);
      $('#price-content').attr('data-price-filter', priceData);
      priceDataGlobal = priceData;
      // console.log(priceData);
    }
    day = $('#cateringDate').html();
    dt = $('#time-content').html();
    pf = priceData;
    tf = customFilter;
    $('#loaderModal').modal('show');
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
        day: day.substr(0, day.indexOf(',')).trim(),
        delivery_time: dt.substr(0, dt.indexOf('-')).trim(),
        price_filter: pf,
        type_filter: tf,
        restaurant_id: restid,
        container: 'price'
      }
    }).then(function () {

    })
    filterSelection = $(this).data('priceFilter');
    updateDishes();
  });

  // $('.type-item').off('click');
  $('body').on('click', '.type-item', function (e) {
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
    day = $('#cateringDate').html();
    dt = $('#time-content').html();
    pf = priceDataGlobal;
    tf = customFilter;
    $('#loaderModal').modal('show');
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
        day: day.substr(0, day.indexOf(',')).trim(),
        delivery_time: dt.substr(0, dt.indexOf('-')).trim(),
        price_filter: pf,
        type_filter: tf,
        restaurant_id: restid,
        container: 'type'
      }
    }).then(function () {

    })
    updateDishes();
  });
  updateDishes();
}
var changedDateSummary = '';
var changedDateReview = '';

$('[data-persist="date"]').off('click');
$('#datepickerModal').off('change.datetimepicker');

const cateringDate = '#cateringDate';
const currentDate = $('#cateringDate').data('dateSelected');

if(changedDateSummary) {
  $('#summaryHeaderDate').text(changedDateSummary);
  $('#reviewDate').text(changedDateReview);
}
// $('#datepickerModal').datetimepicker({
//   date: ndate,
//   // defaultDate: moment().add(2, 'days'),
//   format: 'MM/DD/YYYY',
//   inline: true,
//   minDate: add(ndate,{days:2}),
//   maxDate: add(ndate,{days:180}),
// });

let oldDate = $('#cateringDate').text();
// let changedDate = '';
// let changedDateSummary = '';
let changed = false;
let saved = false;

$('#datepickerModal').on('change.datetimepicker', function(e){
  changed = true;
  var changedDate = e.date.format("dddd, MMMM Do");
  changedDateSummary = e.date.format("ddd, MMM Do");
  changedDateReview = e.date.format("dddd, MMMM Do, YYYY");
  var changedDateY = e.date.format('DD/MM/YYYY');
  // changedDateY = e.date.format('L') ;
  $(cateringDate).data('dateSelected', changedDateY);
})

// Save button
$('.modaldatepicker-button_update').on('click', function() {
  if (changed && changedDate) {
    $(cateringDate).text(changedDateSummary);
    $('#summaryHeaderDate').text(changedDateSummary);
    $('#reviewDate').text(changedDateReview);
    saved = true;
  }
  day = $('#cateringDate').html();
  dt = $('#time-content').html();
  pf = $('#price-content').data('priceFilter');
  tf = customFilter;
  restid = $('.menu-container').data('rest-id')
  $.ajax({
    method: "POST",
    headers: {
      'Accept': 'application/javascript',
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    url: '/dashboard/update_filter_selections',
    dataType: 'script',
    data: {
      day: day.substr(0, day.indexOf(',')).trim(),
      delivery_time: dt.substr(0, dt.indexOf('-')).trim(),
      price_filter: pf,
      type_filter: tf,
      restaurant_id: restid,
      test: "okay"
    }
  })
  $('#loaderModal').modal('show');
  $('#cateringDatePicker').modal('hide');
})

// On Close
$('#cateringDatePicker').on('hide.bs.modal', function() {
  if (!saved) {
    $('#cateringDate').text(oldDate);
  } else {
    oldDate = changedDate;
  }
})

$('#cateringDatePicker').on('hidden.bs.modal', function() {
  changed = false;
  saved = false;
})
function getCV(a) {
  var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}
if(getCV('awaiting_review') == "true" ){
  $('#reviewOrderModal').modal('show');
  document.cookie = 'awaiting_review=false';
}
if(!$('#loginSubmit')) {

} else {
  $('body').on('keyup',function(e){
    if (e.which == 13) {
      var validation = Array.prototype.filter.call(forms, function(form) {
          let password = $('#loginInputPassword').val()
          let email = $('#loginInputEmail').val();

          let loginParams = {
            email: email,
            password: password,
          };

          // let catering_order = $('#catering_order_id').val();
          let catering_order = getCV('catering_order_id');
          console.log(catering_order)

          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            // form.classList.add('was-validated');
          //} else {
            $.ajax({
              method: "post",
              headers: {
                'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
              },
              url: '/dashboard/login',
              data: {user: loginParams, catering_order_id: catering_order, b: 'test2'}
            }).then(function() {
              $('#loginModal').modal('hide');
              // Turbolinks.visit(window.location, { action: "replace" })
            }).catch(function(response) {
              $('.loginform').removeClass('was-validated');
              if (response.responseJSON.invalid_password) { //we still get a json response here that needs to be masked eventually...
                // $('#loginInputPassword').addClass('is-invalid');
                // $('.invalid-password').text('Invalid Password');
                // $('.invalid-password').show();
                $('.invalid-credentials').text('Invalid login credentials');
                $('.invalid-credentials').show();
              } else if (response.responseJSON.invalid_user) {
                // $('#loginInputEmail').addClass('is-invalid');
                // $('.invalid-user').text('Invalid Email');
                // $('.invalid-user').show();
                $('.invalid-credentials').text('Invalid login credentials');
                $('.invalid-credentials').show();
              }
            })
          }
          // form.classList.add('was-validated');
      });

    }
  })
}
var forms = document.getElementsByClassName('loginform');
$('body').on('click','#loginSubmit', function(event) {
  var validation = Array.prototype.filter.call(forms, function(form) {

    console.log("starting login")
    // $('#loginModal').modal('hide');
    let password = $('#loginInputPassword').val()
    let email = $('#loginInputEmail').val();
    // let catering_order = $('#catering_order_id').val();
    let catering_order = getCV('catering_order_id');
    console.log(catering_order)

    let loginParams = {
      email: email,
      password: password,
    }

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      // form.classList.add('was-validated');
      //console.log("validity false")
    //} else {
      //console.log("validity true")
      $.ajax({
        method: "post",
        headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
        url: '/dashboard/login',
        data: {user: loginParams, catering_order_id: catering_order, a: 'test'}
      }).then(function() {
        $('#loginModal').modal('hide');
        //Turbolinks.visit(window.location, { action: "replace" })
      }).catch(function(response) {
        $('.loginform').removeClass('was-validated');
        if (response.responseJSON.invalid_password) {
          // $('#loginInputPassword').addClass('is-invalid');
          // $('.invalid-password').text('Invalid Password');
          // $('.invalid-password').show();
          $('.invalid-credentials').text('Invalid login credentials');
          $('.invalid-credentials').show();
        } else if (response.responseJSON.invalid_user) {
          // $('#loginInputEmail').addClass('is-invalid');
          // $('.invalid-user').text('Invalid Email');
          // $('.invalid-user').show();
          $('.invalid-credentials').text('Invalid login credentials');
          $('.invalid-credentials').show();
        }
      })
    }
    // form.classList.add('was-validated');
  })
});
function selectFirstAddress (input) {
  google.maps.event.trigger(input, 'keydown', {keyCode:40});
  google.maps.event.trigger(input, 'keydown', {keyCode:13});
}
let bannerEvent = $("#banner_event");
bannerEvent.off('click');
bannerEvent.on('click', function(event) {
  console.log('test')
  event.preventDefault();
  $('#bannerModal').modal('show');
})
var inputAddress = $("#catering_order_address").val();
$('#autocomplete').val(inputAddress)
$('#reviewAddress').text(inputAddress)
$('#orderCheckout').off('click');
$('#orderCheckout').on('click', function() {
    let catering_order_id = $('#catering_order_id').val();
    let items = $('.dish-container');
    let delivery_date = $('#cateringDate').data('dateSelected');
    let time_pre = $('#time-content').html();
    let delivery_time = time_pre.substr(1,time_pre.indexOf('-')-2);
    let delivery_address = $('#locationField > input').val();
    let total_price = Number($('[data-total]').html().replace(/[^0-9.-]+/g, "")) * 100;

    let cateringItemsArr = [];

    if (items.length > 0) {
      items.each(function (element) {
        let quantity = "";
        let dish_id = "";
        quantity = $(this).children().closest('.dish-quantity').find('.input-number').val();
        dish_id = $(this).children().closest('.dish-quantity').data('cateringDishId');

        cateringItemsArr.push({id: dish_id, quantity: quantity});
      })
      console.log(cateringItemsArr)
      $.ajax({
        method: "POST",
        url: '/dashboard/bulk_update_catering_dishes',
        data: {
          catering_order_id: catering_order_id,
          catering_dishes_attributes: JSON.stringify(cateringItemsArr),
          delivery_date: delivery_date,
          delivery_time: delivery_time,
          delivery_address: delivery_address,
          total_price: total_price
        }
      })
        .then(function () {
          // $('#reviewOrderModal').modal('show');
          $.ajax({
            method: "post",
            url: '/dashboard/check_dish_minimum',
            data: {
              // token_id: hiddenInput.value
            },
            success: function () {
              console.log("chkdsh: logged in")
            },
            error: function (xhr, textStatus, errorThrown) {
              console.log("payment error" + errorThrown + xhr.responseText);
            }
          })
            .then()
            .catch(function (error) {
              let message = error.responseJSON.error.message
              let errorElement = document.getElementById('card-errors');
              errorElement.textContent = message;
              console.log("payment catch" + error);
            })
        })
        .catch(function (error) {
        })

      cateringItemsArr = [];
    }
  })
$('#loginCheckout').off('click');
$('#loginCheckout').on('click', function() {
    let catering_order_id = $('#catering_order_id').val();
    let items = $('.dish-container');
    let delivery_date = $('#cateringDate').data('dateSelected');
    let time_pre = $('#time-content').html();
    let delivery_time = time_pre.substr(1,time_pre.indexOf('-')-2);
    let delivery_address = $('#locationField > input').val();
    let total_price = Number($('[data-total]').html().replace(/[^0-9.-]+/g, "")) * 100;

    let cateringItemsArr = [];

    if (items.length > 0) {
      items.each(function (element) {
        let quantity = "";
        let dish_id = "";
        quantity = $(this).children().closest('.dish-quantity').find('.input-number').val();
        dish_id = $(this).children().closest('.dish-quantity').data('cateringDishId');

        cateringItemsArr.push({id: dish_id, quantity: quantity});
      })
      $.ajax({
        method: "POST",
        url: '/dashboard/bulk_update_catering_dishes',
        data: {
          catering_order_id: catering_order_id,
          catering_dishes_attributes: JSON.stringify(cateringItemsArr),
          delivery_date: delivery_date,
          delivery_time: delivery_time,
          delivery_address: delivery_address,
          total_price: total_price
        }
      })
        .then(function () {
          // $('#reviewOrderModal').modal('show');
          $.ajax({
            method: "post",
            url: '/dashboard/check_dish_minimum',
            data: {
              // token_id: hiddenInput.value
            },
            success: function () {
              console.log("chkdsh: not logged in")
            },
            error: function (xhr, textStatus, errorThrown) {
              console.log("payment error" + errorThrown + xhr.responseText);
            }
          })
            .then()
            .catch(function (error) {
              let message = error.responseJSON.error.message
              let errorElement = document.getElementById('card-errors');
              errorElement.textContent = message;
              console.log("payment catch" + error);
            })
        })
        .catch(function (error) {
        })

      cateringItemsArr = [];
    }
  })
$(function () {
    const oldDate = $('#dropdownTime').text();
});
$('.modal-backdrop.show').attr('style', 'opacity: 0.99 !important');
if(qawst) {
  $(window).delay(500).scrollTop(qawst);
}
if(getCV('awaiting_review') == "true" ){
  $('#reviewOrderModal').modal('show');
}

jQuery.loadScript = function (url, callback) {
  jQuery.ajax({
    url: url,
    dataType: 'script',
    success: callback,
    async: true
  });
}


$(document).on('turbolinks:request-start turbolinks:before-visit ready', function(){
  $(document).off('resize click');
  $(document).off('scroll');
  $(window).off('resize');
  $('body').off('click');
  $('#loaderModal').modal('show');
  $('.modal-backdrop.show').attr('style', 'opacity: 0.98 !important');
});


$(document).on('turbolinks:request-end',function(){
  // console.log('req end')
})
document.addEventListener('DOMContentLoaded', () => {
  $('body').on('shown.bs.modal','#orderCompleteModal', () => {
    // $('#loaderModal').modal('hide');
    $(document).scrollTop(0);
    $('#nav-container').css('z-index','4444');
    $('#inputSms').on('input', () => {
    })
    $('#orderCompleteModal').on('hide.bs.modal', () => {
      //clear cookies with ajax here
      document.cookie = "catering_order_id" + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
      window.location.href = '/dashboard';
    })
    $('#continueSmsSubmit').off('click');
    $('#continueSmsSubmit').on('click', () => {
      const smsNumber = $('#inputSms').val();
      if ($('#inputSms').val().length > 0) {
        $('#orderCompleteModal').hide();
        $('#loaderModal').show();
        $.ajax({
          method: "post",
          url: '/dashboard/update_sms_number',
          data: {
            sms_number: smsNumber
          }
        })
        .then(function() {
          // window.location.href = '/dashboard';
          $('#loaderModal').hide();
          $('#orderCompleteModal').show();
          $('#smssubtarget').html('for ' + smsNumber);
          $('#smssub2').show();
          $('#smssub1').hide();
          $('#inputSms').hide();
          $('#continueSmsSubmit').hide();


        })
        .catch(function(error) {
        })
      }
    })
  })
  var bound = false;
  $('body').on('shown.bs.modal','#cardSelectModal', function() {
    // $('#cardGoBack').off('click');
    $('body').on('click','#cardGoBack', function(e) {
      e.stopPropagation();
      $('#cardSelectModal').modal('hide');
      $('#reviewOrderModal').modal('show');
    });
    // console.log('h')
      // $(document).on('turbolinks:load', function() {
      // Create a Stripe client
      // var stripe = Stripe($('meta[name="stripe-key"]').attr('content'));
      //
      // // Create an instance of Elements.
      // var elements = stripe.elements();
      //
      // // Custom styling can be passed to options when creating an Element.
      // // (Note that this demo uses a wider set of styles than the guide below.)
      // var style = {
      //   iconStyle: 'solid',
      //   base: {
      //     color: '#32325d',
      //     fontFamily: '"SF-Pro-Display-Regular", Helvetica, sans-serif',
      //     fontSmoothing: 'antialiased',
      //     fontSize: '16px',
      //     '::placeholder': {
      //       color: '#aab7c4'
      //     }
      //   },
      //   invalid: {
      //     color: '#fa755a',
      //     iconColor: '#fa755a'
      //   }
      // };
      //
      // // Create an instance of the card Element.
      // var card = elements.create('card', {style: style});
      //
      // // Add an instance of the card Element into the `card-element` <div>.
      // card.mount('#card-element');
      //
      // // Handle real-time validation errors from the card Element.
      // card.addEventListener('change', function(event) {
      //   var displayError = document.getElementById('card-errors');
      //   if (event.error) {
      //     displayError.textContent = event.error.message;
      //   } else {
      //     displayError.textContent = '';
      //   }
      // });

      // Handle form submission.
      let cardButton = $("#addCard");
      cardButton.off('click');
      cardButton.on('click', function (event) {
        event.preventDefault();
        $('#cardSelectModal').modal('hide');
        $('#paymentModal').modal('show');
      });
      let cardPayButton = $("#cardSubmit");
      cardPayButton.off('click');
      cardPayButton.on('click', function (event) {
        event.preventDefault();
        $('#cardSelectModal').modal('hide');
        $('#loaderModal').modal('show');
        // if ($('input:checked').val()=='saved-card-1'){
        let catering_order_id = $('#catering_order_id').val();
        let items = $('.dish-container');
        let delivery_date = $('#cateringDate').data('dateSelected');
        let time_pre = $('#time-content').html();
        let delivery_time = time_pre.substr(1,time_pre.indexOf('-')-2);
        let delivery_address = $('#locationField > input').val();
        let total_price = Number($('[data-total]').html().replace(/[^0-9.-]+/g,""))*100;
        let quantity = "";
        let dish_id = "";
        let cateringItemsArr = [];
        if (items.length > 0) {
          items.each(function(element) {
            quantity = $(this).children().closest('.dish-quantity').find('.input-number').val();
            dish_id = $(this).children().closest('.dish-quantity').data('cateringDishId');

            cateringItemsArr.push({id: dish_id, quantity: quantity});
          })
        }

        $.ajax({
          method: "post",
          url: '/dashboard/preauth_payment',
          data: {
            catering_order_id: catering_order_id,
            catering_dishes_attributes: JSON.stringify(cateringItemsArr),
            delivery_date: delivery_date,
            delivery_time: delivery_time,
            delivery_address: delivery_address,
            total_price: total_price
          },

          // dataType: 'json', //add in proper user facing error messages with this line
          success: function () {
            console.log("payment success");
            $('#cardSelectModal').modal('hide');
            $('#orderCompleteModal').modal('show');
          },
          error: function (xhr, textStatus, errorThrown) {
            console.log("payment error" + errorThrown + xhr.responseText);
          }
        })
        //   }else{
        //     stripe.createToken(card).then(function(result) {
        //       if (result.error) {
        //         // Inform the user if there was an error.
        //         var errorElement = document.getElementById('card-errors');
        //         errorElement.textContent = result.error.message;
        //       } else {
        //         console.log(result);
        //         // Send the token to your server.
        //         stripeTokenHandler(result.token);
        //       }
        //     });
        //   }
        //
        // });
        //
        // // Submit the form with the token ID.
        // function stripeTokenHandler(token) {
        //   // Insert the token ID into the form so it gets submitted to the server
        //   var form = document.getElementById('card-form');
        //   var hiddenInput = document.createElement('input');
        //   hiddenInput.setAttribute('type', 'hidden');
        //   hiddenInput.setAttribute('name', 'stripeToken');
        //   hiddenInput.setAttribute('value', token.id);
        //   form.appendChild(hiddenInput);
        //
        //   // Submit the form
        //   $.ajax({
        //     method: "post",
        //     url: '/dashboard/preauth_payment',
        //     data: {
        //       token_id: hiddenInput.value
        //     },
        //     // dataType: 'json', //add in proper user facing error messages with this line
        //     success: function() {
        //       console.log("payment success");
        //       $('#cardSelectModal').modal('hide')
        //       $('#orderCompleteModal').modal('show')
        //     },
        //     error: function(xhr, textStatus, errorThrown) {
        //       console.log("payment error" + errorThrown + xhr.responseText);
        //     }
        //   })
        // .then()
        // .catch(function(error) {
        //   let message = error.responseJSON.error.message
        //   let errorElement = document.getElementById('card-errors');
        //   errorElement.textContent = message;
        //   console.log("payment catch" + error);
        // })
      })
  })
  $('body').on('shown.bs.modal','#paymentModal', function() {
    $('#paymentGoBack').off('click');

    console.log('le' + $('#cardBrand').html().length)
    $('body').on('click','#paymentGoBack', function(e) {
      e.stopPropagation();
      $('#paymentModal').modal('hide');
      if ($('#cardBrand').html().length) {
        $('#cardSelectModal').modal('show');
      } else {
        $('#reviewOrderModal').modal('show');
      }
    });
    // $('#paymentGoBack').on('click', function(e) {
    //   e.stopPropagation();
    //   $('#paymentModal').modal('hide');
    //   if ($('#cardBrand').html().length) {
    //     $('#cardSelectModal').modal('show');
    //   } else {
    //     $('#reviewOrderModal').modal('show');
    //   }
    // });
    // paymentButton
    //   Create a Stripe client.
    var stripe = Stripe($('meta[name="stripe-key"]').attr('content'));

    // Create an instance of Elements.
    var elements = stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    var style = {
      iconStyle: 'solid',
      base: {
        color: '#32325d',
        fontFamily: '"SF-Pro-Display-Regular", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    // Create an instance of the card Element.
    var card = elements.create('card', {style: style});

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element');

    // Handle real-time validation errors from the card Element.
    card.addEventListener('change', function (event) {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    // Handle form submission.
    let paymentButton = $("#paymentSubmit");
    paymentButton.off('click');
    paymentButton.on('click', function (event) {
      event.preventDefault();

      stripe.createToken(card).then(function (result) {
        if (result.error) {
          // Inform the user if there was an error.
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          console.log(result);
          // Send the token to your server.
          stripeTokenHandler(result.token);
        }
      });
    })

    // sth begin

    // Submit the form with the token ID.
    function stripeTokenHandler(token) {
      // Insert the token ID into the form so it gets submitted to the server
      var form = document.getElementById('payment-form');
      var hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', 'stripeToken');
      hiddenInput.setAttribute('value', token.id);
      form.appendChild(hiddenInput);

      // Submit the form
      $.ajax({
        method: "post",
        url: '/dashboard/check_payment_source',
        data: {
          token_id: hiddenInput.value
        },
        // dataType: 'json', //add in proper user facing error messages with this line
        success: function () {
          console.log("payment success");
          $('#paymentModal').modal('hide');
          // $('#orderCompleteModal').modal('show')
          $('#cardSelectModal').modal('show');
        },
        error: function (xhr, textStatus, errorThrown) {
          console.log("payment error" + errorThrown + xhr.responseText);
        }
      })
        .then()
        .catch(function (error) {
          let message = error.responseJSON.error.message
          let errorElement = document.getElementById('card-errors');
          errorElement.textContent = message;
          console.log("payment catch" + error);
        })
    }
    // sth end
  // })


  })
  // $('#loaderModal').modal('hide');
  $('body').on('shown.bs.modal','#loaderModal', function(){
    $('.modal-backdrop.show').attr('style', 'opacity: 0.98 !important; background-color: #eee !important;');
    console.log('loader popup')
  });
  $('body').on('click', '#login', function(){
    console.log('login click')
    $('.modal-backdrop.show').attr('style', 'opacity: 0.98 !important; background-color: #eee !important;');
    $('#loaderModal').modal('show');
  });
  $('body').on('click', '#sign-up', function(){
    console.log('signup click')
    $('.modal-backdrop.show').attr('style', 'opacity: 0.98 !important; background-color: #eee !important;');
    $('#loaderModal').modal('show');
  });
  $('body').on('click', '#continuePaymentSubmit', function () {
    $('#reviewOrderModal').modal('hide');
    document.cookie = 'awaiting_review=false';

    if ($('#cardLast4').html().length) {
      $('#cardSelectModal').modal('show');
      console.log("cu has token");
      console.log('endpoint 1')
    } else {
      $('#paymentModal').modal('show');
      // console.log("ok");
      console.log('endpoint 2')
    }
  });
  $('body').on('shown.bs.modal','#reviewOrderModal', function(e) {
    $('.modal-backdrop.show').attr('style', 'opacity: 1 !important; background-color: rgba(45, 57, 88, 0.85) !important;');
  });
  $('body').on('shown.bs.modal','#cardSelectModal', function(e) {
    $('.modal-backdrop.show').attr('style', 'opacity: 1 !important; background-color: rgba(45, 57, 88, 0.85) !important;');
  });
  $('body').on('shown.bs.modal','#paymentModal', function(e) {
    $('.modal-backdrop.show').attr('style', 'opacity: 1 !important; background-color: rgba(45, 57, 88, 0.85) !important;');
  });
  $('body').on('click', '#banner_event', function(){
    console.log('banner click')
    $('.modal-backdrop.show').attr('style', 'opacity: 0.95 !important; background-color: rgba(45, 57, 88, 0.85) !important;');
  })

  $('body').on('focusout', 'input#autocomplete', function() {
    selectFirstAddress(this);
  });

  $('body').on('click', '#cancelOrder', function(event){
    event.preventDefault();
    event.stopImmediatePropagation();
    console.log('test')
    // $('#reviewOrderModal').modal('hide');
    $('#confirmCancel').modal('show');
    setTimeout(function(){
      $('.modal-backdrop').remove();
      console.log('modalbackdropremove');
      $(".dashboardpage-body").append(`<div class="modal-backdrop show"></div>`);
    },100);
    $('#confirmCancel').css('margin-top',$(window).scrollTop());
  });

  $('body').on('click','#orderCancelReturn',function(event) {
    event.preventDefault();
    $('.modal-backdrop').remove();
  });

  $('body').on('click', '#orderCancelSubmit', function (event) {
    event.preventDefault();
    $('#loaderModal').modal('show');
    $('#confirmCancel').modal('hide');
    let orderid = $('#order-number').data('order-number');
    $.ajax({
      method: "post",
      url: '/orders/cancel_request',
      data: {
        order: orderid
      },
      success: function () {
        console.log("sending cancel order request");
        Turbolinks.visit(window.location, {action: "replace"});
        // $('#orderCompleteModal').modal('show');
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("cancel order error" + errorThrown + xhr.responseText);
      }
    })
  })

  $('body').on('click','#skipOrder', function () {
    $.ajax({
      method: "post",
      url: '/dashboard/place_catering_order',
      data: {
        preauth_payment: false
      }
    })
      .then(function () {
        $('#reviewOrderModal').modal('hide')
        $('#paymentModal').modal('hide')
        $('#cardSelectModal').modal('hide')
        $('#orderCompleteModal').modal('show')
      })
      .catch(function (error) {
      })
  })

// Select first address on enter in input
  $('body').on('keydown', 'input#autocomplete', function(e) {
    if (e.keyCode == 13) {
      selectFirstAddress(this);
    }
  });
  if(getCV('awaiting_review') == "true" ){
    $('#reviewOrderModal').modal('show');
    // document.cookie = 'awaiting_review=false';
  }

  var $dropdown = $(".dropdown > .dropdown-group");
  var $dropdownToggle = $(".dropdown-toggle");
  var $dropdownMenu = $(".dropdown-menu");
  var showClass = "show";

  if (window.matchMedia("(min-width: 768px)").matches) {
    // $('body').on('click','.dropdown-toggle',function(e){
    $('body').on('click',function(e){
      $dropdownMenu.removeClass(showClass);
      $dropdownToggle.removeClass(showClass);
      $('.btn-group').removeClass(showClass);
      // $dropdownToggle.attr("aria-expanded", "false");
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


  if($('#maincontent').length) {
    if (typeof google == 'undefined') $.loadScript('https://maps.googleapis.com/maps/api/js?key=APIKEYHGOESHERE&libraries=places', function(){
      initAutocomplete();
    });
    setTimeout(function () {
      initAutocomplete();
    }, 500);

    $('body').on('click','#newsletterSubscribe',function(event){
      event.stopPropagation();
      event.preventDefault();
      var forms = document.getElementsByClassName('needs-validation');
      var validation = Array.prototype.filter.call(forms, function(form) {
        $('.is-invalid').removeClass('is-invalid');
        $('.needs-validation').get(0).classList.remove('was-validated');
        $('#newsletterEmailError').hide();
        $('#newsletterEmailError').css('color','red');
        let errors = false;
        let emailInput = $('#newsletterEmail').val();

        if (!emailInput.length) {
          form.classList.remove('was-validated');
          errors = true;
          event.preventDefault();
          event.stopPropagation();
          $('#newsletterEmail')[0].classList.add('is-invalid');
          $('#newsletterEmailError').text('Cannot be blank');
          $('#newsletterEmailError').show()
        } else if (!(/\S+@\S+\.\S+/.test(emailInput))) {
          form.classList.remove('was-validated');
          errors = true;
          event.preventDefault();
          event.stopPropagation();
          $('#newsletterEmail')[0].classList.add('is-invalid');
          $('#newsletterEmailError').text('Invalid email format');
          $('#newsletterEmailError').show()
        }
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else if (form.checkValidity() && !errors) {
          $.ajax({
            method: "post",
            url: '/newsletter_subscribers',
            data: {email: emailInput}
          }).then(function() {
            $('#newsletterEmailError').text('Signed up successfully!');
            $('#newsletterEmailError').css('color','green');
            $('#newsletterEmailError').show();
            setTimeout(function(){
              //Turbolinks.visit(window.location, {action: "replace"})
            },300)
          })
        }
      })

    });

  } else {
    $('#order-summary-card').hide();
  }
  if($('.modalaccount').length) {
    console.log('account page loaded');

    setInterval(function () {
      $('.pac-container').removeClass('pac-test');
      $('.pac-container').addClass('pac-test');
    }, 1500);

    if (typeof google == 'undefined') $.loadScript('https://maps.googleapis.com/maps/api/js?key=APIKEYGOESHERE&libraries=places', function(){
      initAutocomplete();
    });
    initAutocomplete();
    $('#summaryContainer').hide();
    $('body').on('focusout', 'input#autocomplete3', function() {
      selectFirstAddress(this);
    });

// Select first address on enter in input
    $('body').on('keydown', 'input#autocomplete3', function(e) {
      if (e.keyCode == 13) {
        selectFirstAddress(this);
      }
    });
  }
  if($('.modalcard-header-orderhistory').length){
    console.log('order history page loaded');
    setInterval(function () {
      $('#dishmodal-container').attr('style','display:none');
      $('#cardselect-container').attr('style','display:none');
      $('#payment-container').attr('style','display:none');
      $('#ordercomplete-container').attr('style','display:none');
      $('#review-container').attr('style','display:none');
    }, 150);
  }
  if($('#signUpSubmit').length) {
    // if (typeof google == 'undefined') $.loadScript('https://maps.googleapis.com/maps/api/js?key=APIKEYGOESHERE&libraries=places', function(){
    //   initAutocomplete();
    // });
    console.log('signup page loaded');
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission


    //googleplaces
    // Select first address on focusout
    setInterval(function () {
      $('.pac-container').removeClass('pac-test2');
      $('.pac-container').addClass('pac-test2');
    }, 1500);

    $('body').on('focusout', 'input#autocomplete2', function() {
      selectFirstAddress(this);
    });

// Select first address on enter in input
    $('body').on('keydown', 'input#autocomplete2', function(e) {
      if (e.keyCode == 13) {
        selectFirstAddress(this);
      }
    });

    $('body').on('click','#signUpSubmit', function(event) {
      var validation = Array.prototype.filter.call(forms, function(form) {
        console.log('signup test')
        $('.is-invalid').removeClass('is-invalid');
        $('.needs-validation').get(0).classList.remove('was-validated');
        let errors = false;
        let password = $('#inputPassword').val()
        let passwordConfirm = $('#inputPasswordConfirm').val()
        let catering_order = $('#catering_order_id').val()
        let addressInput = $('#autocomplete2').val();
        let officeNameInput = $('#inputOfficeName').val();
        let firstNameInput = $('#inputFirstName').val();
        let lastNameInput = $('#inputLastName').val();
        let emailInput = $('#inputEmail').val();

        if (!officeNameInput.length) {
          form.classList.remove('was-validated');
          errors = true;
          event.preventDefault();
          event.stopPropagation();
          $('#inputOfficeName')[0].classList.add('is-invalid');
          $('#officeNameError').text('Cannot be blank');
        }

        if(!firstNameInput.length) {
          form.classList.remove('was-validated');
          errors = true;
          event.preventDefault();
          event.stopPropagation();
          $('#inputFirstName')[0].classList.add('is-invalid');
          $('#firstNameError').text('Cannot be blank');
        }

        if(!lastNameInput.length) {
          form.classList.remove('was-validated');
          errors = true;
          event.preventDefault();
          event.stopPropagation();
          $('#inputLastName')[0].classList.add('is-invalid');
          $('#lastNameError').text('Cannot be blank');
        }

        if(!emailInput.length) {
          form.classList.remove('was-validated');
          errors = true;
          event.preventDefault();
          event.stopPropagation();
          $('#inputEmail')[0].classList.add('is-invalid');
          $('#emailError').text('Cannot be blank');
        }

        else if(!(/\S+@\S+\.\S+/.test(emailInput))) {
          form.classList.remove('was-validated');
          errors = true;
          event.preventDefault();
          event.stopPropagation();
          $('#inputEmail')[0].classList.add('is-invalid');
          $('#emailError').text('Invalid email format');
        }

        if (!addressInput.length) {
          form.classList.remove('was-validated');
          errors = true;
          event.preventDefault();
          event.stopPropagation();
          $('#autocomplete2')[0].classList.add('is-invalid');
          $('#addressError').text('Must be valid address');
        }


        if (password.length < 8) {
          form.classList.remove('was-validated');
          errors = true;
          event.preventDefault();
          event.stopPropagation();
          $('#inputPassword')[0].classList.add('is-invalid');
          $('#passwordError').text('Must be at least 8 characters.')
        }

        if (passwordConfirm.length < 8) {
          form.classList.remove('was-validated');
          errors = true;
          event.preventDefault();
          event.stopPropagation();
          $('#inputPasswordConfirm')[0].classList.add('is-invalid');
          $('#passwordConfirmError').text('Must be at least 8 characters.')
        }

        if (!errors) {
          if (password !== passwordConfirm) {
            form.classList.remove('was-validated');
            errors = true;
            event.preventDefault();
            event.stopPropagation();
            $('#inputPassword')[0].classList.add('is-invalid');
            $('#passwordError').text('Password does not match')
            $('#passwordConfirmError').text('Password does not match')
            $('#inputPasswordConfirm')[0].classList.add('is-invalid');
          }
        }

        if (!errors) {
          $('#inputPasswordConfirm')[0].classList.remove('is-invalid');
          $('#inputPassword')[0].classList.remove('is-invalid');
          // form.classList.add('was-validated');
        }

        let officeName = $('#inputOfficeName').val();
        // let officeAddress = $('#inputOfficeAddress').val();
        let officeAddress = $('#autocomplete2').val();
        let firstName = $('#inputFirstName').val();
        let lastName = $('#inputLastName').val();
        let email = $('#inputEmail').val();
        let address2 = $('#inputOfficeAddress2').val();

        let userParams = {
          office_name: officeName,
          office_address: officeAddress,
          address2: address2,
          name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          password_confirmation: passwordConfirm
        }

        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else if (form.checkValidity() && !errors) {
          $.ajax({
            method: "post",
            headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
            url: '/dashboard/sign_up',
            data: {user: userParams, catering_order_id: catering_order}
          }).then(function() {
            $('#signUpModal').modal('hide');
            window.location.href = '/dashboard';
            // Turbolinks.visit(window.location, { action: "replace" })
            setTimeout(function(){
              //Turbolinks.visit(window.location, {action: "replace"})
            },300)
          })
        }

        setTimeout(function(){
          // console.log('hhhhhh')
          if ($('.modal:visible').length) { // check whether parent modal is opend after child modal close
            $('body').addClass('modal-open'); // if open mean length is 1 then add a bootstrap css class to body of the page
          }
        },500)

      })
    });
    $('body').on('keyup', function (e) {
      if (e.which == 13) {
        var validation = Array.prototype.filter.call(forms, function(form) {
          $('.needs-validation').get(0).classList.remove('was-validated')
          $('.is-invalid').removeClass('is-invalid');
          let errors = false;
          let password = $('#inputPassword').val()
          let passwordConfirm = $('#inputPasswordConfirm').val()
          let officeNameInput = $('#inputOfficeName').val();
          let firstNameInput = $('#inputFirstName').val();
          let lastNameInput = $('#inputLastName').val();
          let emailInput = $('#inputEmail').val();

          if (!officeNameInput.length) {
            form.classList.remove('was-validated');
            errors = true;
            event.preventDefault();
            event.stopPropagation();
            $('#inputOfficeName')[0].classList.add('is-invalid');
            $('#officeNameError').text('Cannot be blank');
          }

          if(!firstNameInput.length) {
            form.classList.remove('was-validated');
            errors = true;
            event.preventDefault();
            event.stopPropagation();
            $('#inputFirstName')[0].classList.add('is-invalid');
            $('#firstNameError').text('Cannot be blank');
          }

          if(!lastNameInput.length) {
            form.classList.remove('was-validated');
            errors = true;
            event.preventDefault();
            event.stopPropagation();
            $('#inputLastName')[0].classList.add('is-invalid');
            $('#lastNameError').text('Cannot be blank');
          }

          if(!emailInput.length) {
            form.classList.remove('was-validated');
            errors = true;
            event.preventDefault();
            event.stopPropagation();
            $('#inputEmail')[0].classList.add('is-invalid');
            $('#emailError').text('Cannot be blank');
          }

          else if(!(/\S+@\S+\.\S+/.test(emailInput))) {
            form.classList.remove('was-validated');
            errors = true;
            event.preventDefault();
            event.stopPropagation();
            $('#inputEmail')[0].classList.add('is-invalid');
            $('#emailError').text('Invalid email format');
          }

          if (password.length < 8) {
            form.classList.remove('was-validated');
            errors = true;
            event.preventDefault();
            event.stopPropagation();
            $('#inputPassword')[0].classList.add('is-invalid');
            $('#passwordError').text('Must be at least 8 characters.')
          }

          if (passwordConfirm.length < 8) {
            form.classList.remove('was-validated');
            errors = true;
            event.preventDefault();
            event.stopPropagation();
            $('#inputPasswordConfirm')[0].classList.add('is-invalid');
            $('#passwordConfirmError').text('Must be at least 8 characters.')
          }

          if (!errors) {
            if (password !== passwordConfirm) {
              form.classList.remove('was-validated');
              errors = true;
              event.preventDefault();
              event.stopPropagation();
              $('#inputPassword')[0].classList.add('is-invalid');
              $('#passwordError').text('Password does not match')
              $('#passwordConfirmError').text('Password does not match')
              $('#inputPasswordConfirm')[0].classList.add('is-invalid');
            }
          }

          if (!errors) {
            $('#inputPasswordConfirm')[0].classList.remove('is-invalid');
            $('#inputPassword')[0].classList.remove('is-invalid');
            // form.classList.add('was-validated');
          }

          let officeName = $('#inputOfficeName').val();
          // let officeAddress = $('#inputOfficeAddress').val();
          let officeAddress = $('#autocomplete2').val();
          let firstName = $('#inputFirstName').val();
          let lastName = $('#inputLastName').val();
          let email = $('#inputEmail').val();
          let address2 = $('#inputOfficeAddress2').val();

          let userParams = {
            office_name: officeName,
            office_address: officeAddress,
            address2: address2,
            name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            password_confirmation: passwordConfirm
          }

          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          } else if (form.checkValidity() && !errors) {
            $.ajax({
              method: "post",
              url: '/dashboard/sign_up',
              data: {user: userParams}
            }).then(function () {
              $('#signUpModal').modal('hide');
              setTimeout(function(){
                //Turbolinks.visit(window.location, {action: "replace"})
              },300);

            })
          }
        })
      }
    });
  }
  else if($('#loginSubmit').length) {
    var forms = document.getElementsByClassName('loginform');
    // $('body').on('keyup',function(e){
    //   if (e.which == 13) {
    //     console.log('e')
    //     var validation = Array.prototype.filter.call(forms, function(form) {
    //       let password = $('#loginInputPassword').val()
    //       let email = $('#loginInputEmail').val();
    //
    //       console.log(email)
    //
    //       let loginParams = {
    //         email: email,
    //         password: password,
    //       };
    //
    //       // let catering_order = $('#catering_order_id').val();
    //       let catering_order = getCV('catering_order_id');
    //       console.log(catering_order)
    //       // if (form.checkValidity() === false) {
    //       console.log('chkv')
    //       event.preventDefault();
    //       event.stopPropagation();
    //       // form.classList.add('was-validated');
    //       //} else {
    //       $.ajax({
    //         method: "post",
    //         url: '/dashboard/login',
    //         data: {user: loginParams, catering_order_id: catering_order}
    //       }).then(function() {
    //         $('#loginModal').modal('hide');
    //         // Turbolinks.visit(window.location, { action: "replace" })
    //       }).catch(function(response) {
    //         $('.loginform').removeClass('was-validated');
    //         if (response.responseJSON.invalid_password) { //we still get a json response here that needs to be masked eventually...
    //           // $('#loginInputPassword').addClass('is-invalid');
    //           // $('.invalid-password').text('Invalid Password');
    //           // $('.invalid-password').show();
    //           $('.invalid-credentials').text('Invalid login credentials');
    //           $('.invalid-credentials').show();
    //         } else if (response.responseJSON.invalid_user) {
    //           // $('#loginInputEmail').addClass('is-invalid');
    //           // $('.invalid-user').text('Invalid Email');
    //           // $('.invalid-user').show();
    //           $('.invalid-credentials').text('Invalid login credentials');
    //           $('.invalid-credentials').show();
    //         }
    //       })
    //       // }
    //       // form.classList.add('was-validated');
    //     });
    //   }
    // })
    // $('body').on('click','#loginSubmit', function(event) {
    //   var validation = Array.prototype.filter.call(forms, function(form) {
    //
    //     console.log("starting login")
    //     // $('#loginModal').modal('hide');
    //     let password = $('#loginInputPassword').val()
    //     let email = $('#loginInputEmail').val();
    //     // let catering_order = $('#catering_order_id').val()
    //     let catering_order = getCV('catering_order_id');
    //     console.log(catering_order)
    //     let loginParams = {
    //       email: email,
    //       password: password,
    //     }
    //
    //     // if (form.checkValidity() === false) {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     // form.classList.add('was-validated');
    //     //console.log("validity false")
    //     //} else {
    //     //console.log("validity true")
    //     $.ajax({
    //       method: "post",
    //       url: '/dashboard/login',
    //       data: {user: loginParams, catering_order_id: catering_order}
    //     }).then(function() {
    //       $('#loginModal').modal('hide');
    //       //Turbolinks.visit(window.location, { action: "replace" })
    //     }).catch(function(response) {
    //       $('.loginform').removeClass('was-validated');
    //       if (response.responseJSON.invalid_password) {
    //         // $('#loginInputPassword').addClass('is-invalid');
    //         // $('.invalid-password').text('Invalid Password');
    //         // $('.invalid-password').show();
    //         $('.invalid-credentials').text('Invalid login credentials');
    //         $('.invalid-credentials').show();
    //       } else if (response.responseJSON.invalid_user) {
    //         // $('#loginInputEmail').addClass('is-invalid');
    //         // $('.invalid-user').text('Invalid Email');
    //         // $('.invalid-user').show();
    //         $('.invalid-credentials').text('Invalid login credentials');
    //         $('.invalid-credentials').show();
    //       }
    //     })
    //     // }
    //     // form.classList.add('was-validated');
    //   })
    // });
  } else {
    // tippy2(document.querySelectorAll('img.restaurant-info-icon'), {
    //   maxWidth: 483,
    //   arrow: false
    // });
    if (typeof google == 'undefined') $.loadScript('https://maps.googleapis.com/maps/api/js?key=APIKEYGOESHERE&libraries=places', function(){
      initAutocomplete();
    });

  }
})