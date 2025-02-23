// This sample uses the Autocomplete widget to help the user select a
// place, then it retrieves the address components associated with that
// place, and then it populates the form fields with those details.
// This sample requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var placeSearch, autocomplete, autocomplete2, autocomplete3;

function initAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(49.211689, -123.198937),
    new google.maps.LatLng(49.287179, -122.964759)
  );

  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('autocomplete'), {
      types: ['establishment', 'geocode'],
      bounds: defaultBounds,
      componentRestrictions: {country: "ca"},
      strictBounds: true
    });

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.

  autocomplete.setFields(['formatted_address', 'address_component']);
  // autocomplete.setFields(['formatted_address', 'address_component']);

  // When the user selects an address from the drop-down, populate the
  // address fields in the form.

  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    let reviewAddress = $('#reviewAddress');
    let place = autocomplete.getPlace();
    var components = place.address_components;
    var number, street, city, prov;
    for (var i = 0; i < components.length; i++) {
      if (components[i].types[0] == "street_number") {
        number = components[i].long_name;
      }
      if (components[i].types[0] == "route") {
        street = components[i].long_name;
      }
      if (components[i].types[0] == "locality") {
        city = components[i].short_name;
      }
      if (components[i].types[0] == "administrative_area_level_1") {
        prov = components[i].short_name;
      }
    }
    var formatted2 = `${number} ${street}, ${city} ${prov}`;
    reviewAddress.text(formatted2);
  });

  ////////////////////////////////////////////////////////

  console.log($('#inputOfficeAddress'))
  autocomplete2 = new google.maps.places.Autocomplete(
    document.getElementById('autocomplete2'), {
      types: ['establishment', 'geocode'],
      bounds: defaultBounds,
      componentRestrictions: {country: "ca"},
      strictBounds: true
    }
  );

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.

  autocomplete2.setFields(['formatted_address', 'address_component']);

  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  google.maps.event.addListener(autocomplete2, 'place_changed', function () {
    // console.log('hello')
    // let inputOfficeAddress = $('#inputOfficeAddress');
    // let place = autocomplete.getPlace();
    // inputOfficeAddress.text(place.formatted_address);
  });

  autocomplete3 = new google.maps.places.Autocomplete(
    document.getElementById('autocomplete3'), {
      types: ['establishment', 'geocode'],
      bounds: defaultBounds,
      componentRestrictions: {country: "ca"},
      strictBounds: true
    }
  );

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.

  autocomplete3.setFields(['formatted_address', 'address_component']);

  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  google.maps.event.addListener(autocomplete3, 'place_changed', function () {
    // console.log('hello')
    // let inputOfficeAddress = $('#inputOfficeAddress');
    // let place = autocomplete.getPlace();
    // inputOfficeAddress.text(place.formatted_address);
  });
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.

var currentAddress = {
  line_1: "",
  line_2: "",
  zipcode: "",
  city: "",
  country: "",
  lat: "",
  lng: "",
  one_liner: ""
};
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle(
        {center: geolocation, radius: position.coords.accuracy}
      );
      autocomplete.setBounds(circle.getBounds());
      console.log('autocomplete', autocomplete)
      autocomplete2.setBounds(circle.getBounds());
      console.log('auto2', autocomplete2)
    });
  }
}

function fillInAddress() {
    var place = this.autocomplete.getPlace();
    // reset the address
    currentAddress = {
        line_1: "",
        line_2: "",
        zipcode: "",
        city: "",
        country: "",
        lat: "",
        lng: "",
        one_liner: place.formatted_address
    };
    // store relevant info in currentAddress
    var results = place.address_components.reduce(function(prev, current) {
        prev[current.types[0]] = current['long_name'];
        return prev;
    }, {})
    if (results.hasOwnProperty('route')) {
        currentAddress.line_1 = results.route;
    }
    if (results.hasOwnProperty('street_number')) {
        currentAddress.line_1 = results.street_number + " " + currentAddress.line_1;
    }
    if (results.hasOwnProperty('postal_code')) {
        currentAddress.zipcode = results.postal_code;
    }
    if (results.hasOwnProperty('locality')) {
        currentAddress.city = results.locality;
    }
    if (results.hasOwnProperty('country')) {
        currentAddress.country = results.country;
    }
    currentAddress.lat = Number(place.geometry.location.lat()).toFixed(6);
    currentAddress.lng = Number(place.geometry.location.lng()).toFixed(6);
}

$('#autocomplete').on('blur',function() {
  // console.log($(this).val());
  // setTimeout(function(){console.log(autocomplete.getPlace())},500);

  var address = $('#autocomplete').val().split(", ")[0];

    // we set a timeout to prevent conflicts between blur and place_changed events
    var timeout = setTimeout(function() {
        var place = autocomplete.getPlace();
        var presplit = place.formatted_address;
        var formatted = presplit.split(", ")[0];
        var components = place.address_components;
        var number, street, city, prov;
        for (var i = 0; i < components.length; i++) {
          if (components[i].types[0] == "street_number") {
            number = components[i].long_name;
          }
          if (components[i].types[0] == "route") {
            street = components[i].long_name;
          }
          if (components[i].types[0] == "locality") {
            city = components[i].short_name;
          }
          if (components[i].types[0] == "administrative_area_level_1") {
            prov = components[i].short_name;
          }
        }
        // var number = components[0].long_name;
        // var street = components[1].long_name;
        // var city =   components[3].short_name;
        // var prov =   components[5].short_name;
        var formatted2 = `${number} ${street}, ${city} ${prov}`
      console.log(presplit)
        // release timeout
        clearTimeout(timeout);
        if (address !== `${number} ${street}`) {
          // $('#autocomplete').val(presplit);
          $('#autocomplete').val(formatted2);
        } else {
          $('#autocomplete').val(formatted2);
        }
    }, 150);
});

$('#inputOfficeAddress').blur(function() {
  var address = $('#inputOfficeAddress').val().split(", ")[0];

  // we set a timeout to prevent conflicts between blur and place_changed events
  var timeout = setTimeout(function() {
    var place = autocomplete2.getPlace();
    var presplit = place.vicinity;
    var formatted = presplit.split(", ")[0];
    var components = place.address_components;
    var number, street, city, prov;
    for (var i = 0; i < components.length; i++) {
      if (components[i].types[0] == "street_number") {
        number = components[i].long_name;
      }
      if (components[i].types[0] == "route") {
        street = components[i].long_name;
      }
      if (components[i].types[0] == "locality") {
        city = components[i].short_name;
      }
      if (components[i].types[0] == "administrative_area_level_1") {
        prov = components[i].short_name;
      }
    }
    // var number = components[0].long_name;
    // var street = components[1].long_name;
    // var city =   components[3].short_name;
    // var prov =   components[5].short_name;
    var formatted2 = `${number} ${street}, ${city} ${prov}`
    // release timeout
    clearTimeout(timeout);
    if (address !== `${number} ${street}`) {
      // $('#inputOfficeAddress').val(presplit);
      $('#inputOfficeAddress').val(formatted2);
    } else {
      $('#inputOfficeAddress').val(formatted2);
    }
  }, 150);
});
$('#autocomplete3').on('blur',function() {
  // console.log($(this).val());
  // setTimeout(function(){console.log(autocomplete.getPlace())},500);

  var address = $('#autocomplete3').val().split(", ")[0];

  // we set a timeout to prevent conflicts between blur and place_changed events
  var timeout = setTimeout(function() {
    var place = autocomplete3.getPlace();
    var presplit = place.formatted_address;
    var formatted = presplit.split(", ")[0];
    var components = place.address_components;
    var number, street, city, prov;
    for (var i = 0; i < components.length; i++) {
      if (components[i].types[0] == "street_number") {
        number = components[i].long_name;
      }
      if (components[i].types[0] == "route") {
        street = components[i].long_name;
      }
      if (components[i].types[0] == "locality") {
        city = components[i].short_name;
      }
      if (components[i].types[0] == "administrative_area_level_1") {
        prov = components[i].short_name;
      }
    }
    // var number = components[0].long_name;
    // var street = components[1].long_name;
    // var city =   components[3].short_name;
    // var prov =   components[5].short_name;
    var formatted2 = `${number} ${street}, ${city} ${prov}`
    console.log(presplit)
    // release timeout
    clearTimeout(timeout);
    if (address !== `${number} ${street}`) {
      // $('#autocomplete').val(presplit);
      $('#autocomplete3').val(formatted2);
    } else {
      $('#autocomplete3').val(formatted2);
    }
  }, 150);
});

//geolocate(); //this'll trigger the share your location popup