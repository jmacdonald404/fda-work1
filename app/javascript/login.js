// $('body').on('click','#resetBack',function(event){
//   event.preventDefault();
//   $('#resetPassConfirmModal').modal('hide');
//   // $('#loginModal').show();
// })
// $('#resetPasswordModal').on('shown.bs.modal', function(e){
//   $('body').off('click', '#resetSubmit');
//   $('body').on('click','#resetSubmit', function(event) {
//     $('#resetPassEmail').html($('#resetInputPassword').val());
//     $('#resetPasswordModal').modal('hide');
//     $('#loaderModal').modal('show');
//     event.preventDefault();
//     let email = $('#resetInputPassword').val();
//
//     $.ajax({
//       method: "post",
//       url: '/dashboard/reset_password',
//       data: {email: email}
//     }).then(function(){
//       $('#resetPasswordModal').modal('hide');
//       $('#loaderModal').modal('hide');
//       $('#resetPassConfirmModal').modal('show');
//     })
//   });
// })
// $('#loginModal').on('hidden.bs.modal', function(e) {
//   $('body').off('click','#loginSubmit');
//   $('#loginInputPassword').removeClass('is-invalid');
//   $('#loginInputEmail').removeClass('is-invalid');
//   $('.loginform').get(0).classList.remove('was-validated');
//   $('.loginform').get(0).reset();
//   $('#loginSubmit').off('click');
//   $('body').off('keyup');
//   $('.invalid-user').hide();
//   $('.invalid-password').hide();
//   $('.invalid-credentials').hide();
// })
//
//
//
// $('.signup-button').click(function(){
//   $('#loginModal').modal('hide');
//   $('#signUpModal').modal('show');
// })
//
// $('.modallogin-section_forgot').click(function(){
//   $('#loginModal').modal('hide');
//   $('#resetPasswordModal').modal('show');
// })
//
// $('#resetPassBack').click(function(){
//   $('#loginModal').modal('show');
//   $('#resetPasswordModal').modal('hide');
// })
//
//
//

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