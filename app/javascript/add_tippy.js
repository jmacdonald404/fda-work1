// import {
//   createPopperLite as createPopper,
//   preventOverflow,
//   flip,
// } from '@popperjs/core';
import tippy from 'tippy.js';

import { TempusDominus } from '@eonasdan/tempus-dominus';
window.tippy = tippy;


if(!document.querySelector("#loginSubmit")&&(!document.querySelector("#signUpSubmit"))){
  const template = document.getElementById('tooltip-select2');
  const template2 = document.getElementById('tooltip-unavailable');
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
}

// window.tempusDominus = TempusDominus;

document.addEventListener('DOMContentLoaded', () => {
  console.log('domloaded');
  const element = document.getElementById('datetimepicker1');
  
  if (element) {
    new TempusDominus(element, {
      // Your Tempus Dominus options here
      display: {
        icons: {
          time: 'fa-solid fa-clock',
          date: 'fa-solid fa-calendar',
        },
      },
    });
  }
});