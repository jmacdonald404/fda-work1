// Turbolinks.scroll = {};

// document.addEventListener("turbolinks:before-visit", () => {
//   window.prevPageYOffset = window.pageYOffset
//   window.prevPageXOffset = window.pageXOffset
// })

// document.addEventListener("turbolinks:load", ()=> {
//   const elements = document.querySelectorAll("[data-turbolinks-scroll]");

//   elements.forEach(function(element){
//     element.addEventListener("click", ()=> {
//       Turbolinks.scroll['top'] = document.scrollingElement.scrollTop;
//     });
//   });

//   if (Turbolinks.scroll['top']) {
//     document.scrollingElement.scrollTo(0, Turbolinks.scroll['top']);
//   }

//   document.scrollingElement.scrollTo(0, window.Turbolinks.scroll['top']);

//   Turbolinks.scroll = {};
// });
