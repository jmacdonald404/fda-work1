$('body').on('click','#resetBack',function(event){
  event.preventDefault();
  $('#resetPassConfirmModal').modal('hide');
  // $('#loginModal').show();
})
$('#resetPasswordModal').on('shown.bs.modal', function(e){
  $('body').off('click', '#resetSubmit');
  $('body').on('click','#resetSubmit', function(event) {
    $('#resetPassEmail').html($('#resetInputPassword').val());
    $('#resetPasswordModal').modal('hide');
    $('#loaderModal').modal('show');
    event.preventDefault();
    let email = $('#resetInputPassword').val();

    $.ajax({
      method: "post",
      url: '/dashboard/reset_password',
      data: {email: email}
    }).then(function(){
      $('#resetPasswordModal').modal('hide');
      $('#loaderModal').modal('hide');
      $('#resetPassConfirmModal').modal('show');
    })
  });
})
$('#loginModal').on('hidden.bs.modal', function(e) {
  $('body').off('click','#loginSubmit');
  $('#loginInputPassword').removeClass('is-invalid');
  $('#loginInputEmail').removeClass('is-invalid');
  $('.loginform').get(0).classList.remove('was-validated');
  $('.loginform').get(0).reset();
  $('#loginSubmit').off('click');
  $('body').off('keyup');
  $('.invalid-user').hide();
  $('.invalid-password').hide();
  $('.invalid-credentials').hide();
})



$('.signup-button').click(function(){
  $('#loginModal').modal('hide');
  $('#signUpModal').modal('show');
})

$('.modallogin-section_forgot').click(function(){
  $('#loginModal').modal('hide');
  $('#resetPasswordModal').modal('show');
})

$('#resetPassBack').click(function(){
  $('#loginModal').modal('show');
  $('#resetPasswordModal').modal('hide');
})



