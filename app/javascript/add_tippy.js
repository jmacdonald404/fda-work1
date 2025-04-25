// import {
//   createPopperLite as createPopper,
//   preventOverflow,
//   flip,
// } from '@popperjs/core';
import tippy from 'tippy.js';

import { TempusDominus } from '@eonasdan/tempus-dominus';
window.tippy = tippy;

console.log('begin loading tippy, checking what page is rendered');
if(!document.querySelector("#loginSubmit")&&(!document.querySelector("#signUpSubmit"))&&(!document.querySelector('.modalcard-orderhistory'))&&(!document.querySelector('.modalaccount'))) {
  console.log('not on signup or login or orders or account, continuing to load tippy');


  const template = document.getElementById('tooltip-select2');
  const template2 = document.getElementById('tooltip-unavailable');
  console.log(template.nodeType);
  console.log(template2.nodeType);
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
  console.log('tippy should be correctly loaded at this point');

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
  document.querySelector('body').onclick = function(){
    autoSave();
  };
} else {
  console.log('on signup or login or orders or account page, not loading tippy');
}



// window.tempusDominus = TempusDominus;


document.addEventListener('DOMContentLoaded', () => {
  console.log('domloaded');

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