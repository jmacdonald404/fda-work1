// import {
//   createPopperLite as createPopper,
//   preventOverflow,
//   flip,
// } from '@popperjs/core';
import tippy from 'tippy.js';

import { TempusDominus } from '@eonasdan/tempus-dominus';
window.tippy = tippy;

console.log('begin loading tippy, checking what page is rendered');
if(!document.querySelector("#loginSubmit")&&(!document.querySelector("#signUpSubmit"))) {
  console.log('not on signup or login, continuing to load tippy');


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
} else {
  console.log('on signup or login page, not loading tippy');
}



// window.tempusDominus = TempusDominus;


document.addEventListener('DOMContentLoaded', () => {
  console.log('domloaded');
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