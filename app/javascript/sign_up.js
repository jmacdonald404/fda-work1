// $('#signUpModal').on('hidden.bs.modal', function(e) {
//   $('.needs-validation').get(0).classList.remove('was-validated');
//   $('.needs-validation').get(0).reset();
//   $('body').off('click', '#signUpSubmit');
//   $('body').off('keyup');
// })
//
// $('#signUpModal').on('shown.bs.modal', function(e) {
//   var forms = document.getElementsByClassName('needs-validation');
//   // Loop over them and prevent submission
//   $('body').on('click','#signUpSubmit', function(event) {
//     var validation = Array.prototype.filter.call(forms, function(form) {
//       $('.needs-validation').get(0).classList.remove('was-validated')
//       let errors = false;
//       let password = $('#inputPassword').val()
//       let passwordConfirm = $('#inputPasswordConfirm').val()
//       let catering_order = $('#catering_order_id').val()
//       let addressInput = $('#autocomplete2').val()
//
//       if (!addressInput.length) {
//         form.classList.remove('was-validated');
//         errors = true;
//         event.preventDefault();
//         event.stopPropagation();
//         $('#autocomplete2')[0].classList.add('is-invalid');
//         $('#addressError').text('Cannot be blank');
//       }
//
//       if (password.length < 8) {
//         form.classList.remove('was-validated');
//         errors = true;
//         event.preventDefault();
//         event.stopPropagation();
//         $('#inputPassword')[0].classList.add('is-invalid');
//         $('#passwordError').text('Must be at least 8 characters.')
//       }
//
//       if (passwordConfirm.length < 8) {
//         form.classList.remove('was-validated');
//         errors = true;
//         event.preventDefault();
//         event.stopPropagation();
//         $('#inputPasswordConfirm')[0].classList.add('is-invalid');
//         $('#passwordConfirmError').text('Must be at least 8 characters.')
//       }
//
//       if (!errors) {
//         if (password !== passwordConfirm) {
//           form.classList.remove('was-validated');
//           errors = true;
//           event.preventDefault();
//           event.stopPropagation();
//           $('#inputPassword')[0].classList.add('is-invalid');
//           $('#passwordError').text('Password does not match')
//           $('#passwordConfirmError').text('Password does not match')
//           $('#inputPasswordConfirm')[0].classList.add('is-invalid');
//         }
//       }
//
//       if (!errors) {
//         $('#inputPasswordConfirm')[0].classList.remove('is-invalid');
//         $('#inputPassword')[0].classList.remove('is-invalid');
//         // form.classList.add('was-validated');
//       }
//
//       let officeName = $('#inputOfficeName').val();
//       let officeAddress = $('#inputOfficeAddress').val();
//       let firstName = $('#inputFirstName').val();
//       let lastName = $('#inputLastName').val();
//       let email = $('#inputEmail').val();
//
//       let userParams = {
//         office_name: officeName,
//         office_address: officeAddress,
//         name: firstName,
//         last_name: lastName,
//         email: email,
//         password: password,
//         password_confirmation: passwordConfirm
//       }
//
//       if (form.checkValidity() === false) {
//         event.preventDefault();
//         event.stopPropagation();
//       } else if (form.checkValidity() && !errors) {
//         $.ajax({
//           method: "post",
//           headers: {
//             'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
//           },
//           url: '/dashboard/sign_up',
//           data: {user: userParams, catering_order_id: catering_order}
//         }).then(function() {
//           $('#signUpModal').modal('hide');
//           // Turbolinks.visit(window.location, { action: "replace" })
//           setTimeout(function(){
//             //Turbolinks.visit(window.location, {action: "replace"})
//           },300)
//         })
//       }
//
//       setTimeout(function(){
//         // console.log('hhhhhh')
//         if ($('.modal:visible').length) { // check whether parent modal is opend after child modal close
//           $('body').addClass('modal-open'); // if open mean length is 1 then add a bootstrap css class to body of the page
//         }
//       },500)
//
//     })
//   });
//   $('body').on('keyup', function (e) {
//     if (e.which == 13) {
//       var validation = Array.prototype.filter.call(forms, function(form) {
//         $('.needs-validation').get(0).classList.remove('was-validated')
//         let errors = false;
//         let password = $('#inputPassword').val()
//         let passwordConfirm = $('#inputPasswordConfirm').val()
//
//         if (password.length < 8) {
//           form.classList.remove('was-validated');
//           errors = true;
//           event.preventDefault();
//           event.stopPropagation();
//           $('#inputPassword')[0].classList.add('is-invalid');
//           $('#passwordError').text('Must be at least 8 characters.')
//         }
//
//         if (passwordConfirm.length < 8) {
//           form.classList.remove('was-validated');
//           errors = true;
//           event.preventDefault();
//           event.stopPropagation();
//           $('#inputPasswordConfirm')[0].classList.add('is-invalid');
//           $('#passwordConfirmError').text('Must be at least 8 characters.')
//         }
//
//         if (!errors) {
//           if (password !== passwordConfirm) {
//             form.classList.remove('was-validated');
//             errors = true;
//             event.preventDefault();
//             event.stopPropagation();
//             $('#inputPassword')[0].classList.add('is-invalid');
//             $('#passwordError').text('Password does not match')
//             $('#passwordConfirmError').text('Password does not match')
//             $('#inputPasswordConfirm')[0].classList.add('is-invalid');
//           }
//         }
//
//         if (!errors) {
//           $('#inputPasswordConfirm')[0].classList.remove('is-invalid');
//           $('#inputPassword')[0].classList.remove('is-invalid');
//           // form.classList.add('was-validated');
//         }
//
//         let officeName = $('#inputOfficeName').val();
//         let officeAddress = $('#inputOfficeAddress').val();
//         let firstName = $('#inputFirstName').val();
//         let lastName = $('#inputLastName').val();
//         let email = $('#inputEmail').val();
//
//         let userParams = {
//           office_name: officeName,
//           office_address: officeAddress,
//           name: firstName,
//           last_name: lastName,
//           email: email,
//           password: password,
//           password_confirmation: passwordConfirm
//         }
//
//         if (form.checkValidity() === false) {
//           event.preventDefault();
//           event.stopPropagation();
//         } else if (form.checkValidity() && !errors) {
//           $.ajax({
//             method: "post",
//             url: '/dashboard/sign_up',
//             data: {user: userParams}
//           }).then(function () {
//             $('#signUpModal').modal('hide');
//             setTimeout(function(){
//               //Turbolinks.visit(window.location, {action: "replace"})
//             },300);
//
//           })
//         }
//       })
//     }
//   });
// });



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