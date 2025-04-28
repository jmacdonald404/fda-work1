// import {
//   createPopperLite as createPopper,
//   preventOverflow,
//   flip,
// } from '@popperjs/core';
import tippy from 'tippy.js';

import { TempusDominus } from '@eonasdan/tempus-dominus';
window.tippy = tippy;

console.log('begin loading tippy, checking what page is rendered');

var filterSelection = '';
var customFilter = [];
var priceDataGlobal = 9999;




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
  // document.querySelector('body').onclick = function(){
  //   autoSave();
  // };
// } else {
//   console.log('on signup or login or orders or account page, not loading tippy');
// }



// window.tempusDominus = TempusDominus;

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

function deleteCateringDish(catering_dish_id) {
  $.ajax({
    method: "delete",
    url: '/dashboard/delete_catering_dish',
    headers: {"X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      catering_dish_id: catering_dish_id
    }
  })
    .then(function () {
      // Turbolinks.visit(window.location, {action: "replace"});
    })
}

function deleteCateringDishReviewModal(catering_dish_id) {
  let dish_id_selector = "[data-catering-dish-id=" + `'${catering_dish_id}'` + "]"
  $.ajax({
    method: "delete",
    url: '/dashboard/delete_catering_dish',
    headers: {"X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
    },
    data: {
      catering_dish_id: catering_dish_id
    }
  })
    .then(function () {
      $(`div.dish-container > .dish-quantity${dish_id_selector}`).parent().remove();
      $(`.dish-container_summary > td > .dish-quantity${dish_id_selector}`).parents('.dish-container_summary').remove();
      if ($('.dish-container_summary > td > .dish-quantity').length < 1) {
        // Turbolinks.visit(window.location, {action: "replace"});
      } else {
        updateTotal();
      }
    })
}
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
      headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
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
        $('#reviewOrderModal').modal('show');
        $.ajax({
          method: "post",
          headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
          },
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
$('body').on('click','#paymentGoBack', function(e) {
  e.stopPropagation();
  $('#paymentModal').modal('hide');
  if ($('#cardBrand').html().length) {
    $('#cardSelectModal').modal('show');
  } else {
    $('#reviewOrderModal').modal('show');
  }
});
$('body').on('click', '#reviewGoBack', function(){
  document.cookie = 'awaiting_review=false';
  $('#reviewOrderModal').modal('hide');
});
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
  let day = $('#cateringDate').html();
  let dt = $('#time-content').html();
  let pf = priceDataGlobal;
  let tf = customFilter;
  // initAutocomplete();
  let restid = $('.menu-container').data('rest-id')
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

document.addEventListener('DOMContentLoaded', () => {
  console.log('domloaded');
  if(!document.querySelector("#loginSubmit")&&(!document.querySelector("#signUpSubmit"))&&(!document.querySelector('.modalcard-orderhistory'))&&(!document.querySelector('.modalaccount'))) {
    console.log('not on signup or login or orders or account, continuing to load tippy');


    const template = document.getElementById('tooltip-select2');
    const template2 = document.getElementById('tooltip-unavailable');
    // console.log(template.nodeType);
    // console.log(template2.nodeType);
    template.style.display = template2.style.display = "block";
    tippy(document.getElementById('tt-unavail'), {
      maxWidth: 483,
      arrow: false,
      theme: 'main',
      content: template2
    });
    tippy(document.getElementById('select2'), {
      maxWidth: 483,
      arrow: false,
      theme: 'main',
      content: template
    });
    if($('#tt-ontime').length > 0){
      const template3 = document.getElementById('tt-ontime');
      template3.style.display = "block"
      tippy(document.getElementById('tt-qm'), {
        maxWidth: 483,
        arrow: false,
        theme: 'main',
        content: template3
      });
    }
    console.log('tippy should be correctly loaded at this point');
  }
  updateTotal();
  $('.modal').hide();
  $('.modal-backdrop').hide();
  document.getElementsByTagName('body')[0].style.overflow = 'auto'


  let twoday = new Date();
  twoday.setDate(twoday.getDate() + 2);




  const element = document.getElementById('dropdownDate');
  // const element = document.getElementById('datetimepicker1');

  if (element) {
    const picker = new TempusDominus(element, {
      // Your Tempus Dominus options here
      defaultDate: twoday,
      display: {
        icons: {
          time: 'fa-solid fa-clock',
          date: 'fa-solid fa-calendar',
        },
        components : {
          clock: false,
          hours: false,
          minutes: false,
          seconds: false
        }
      },
      localization: {
        format: 'dddd, MMMM d'
      },
      restrictions: {
        minDate: twoday
      }
    });
    // document.getElementsByClassName('tempus-dominus-widget')[0].addEventListener('click', function(){
    //   let a = $('.day.active').attr('aria-label'); //human-readable
    //   let b = $('.day.active').attr('data-value'); //date string
    //   console.log('e')
    //   $('#cateringDate').attr('data-date-selected', b)
    //   $('#cateringDate').text(a);
    // }) this ain't the way
  }
});