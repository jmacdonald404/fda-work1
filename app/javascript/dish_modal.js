
// $('.quick-add-target').off('click');
// $('.quick-add-target').on('click',function(){
console.log('dish modal js loaded');
var totals = 0;
setTimeout(function(){
  $('#loaderModal').modal('hide');
}, 200); // make this a promise
$('body').on('click','.quick-add-target',function(){
  const restaurant_open = $(this).data('restaurantOpen');
  //console.log(restaurant_open);
  var qawst = $(window).scrollTop();
  if(parseInt($('#resadded').html()) >= 2 && !$('#resids').html().includes($(this).data('restaurantId'))){ //if the number of restaurants that have dishes added is >= 2, and the current restaurant id is not in that list (if we're at max restaurant selections we still want to be able to add dishes from that restaurant), warn the user that they can't have more than 2 restaurants
    console.log('uh oh too many restaurants');
    $('#tooManyRestos').modal('show');
    $('#dishModal').hide();
  }
  else if(restaurant_open) {
    const dish_id = $(this).data('dishId');
    const restaurant_id = $(this).data('restaurantId');
    const catering_order_id = $('#catering_order_id').val();
    const dish_quantity = 1;
    let subselections = {};
    console.log("dish_id: "+dish_id);
    if($('.summary-card_body').find('[data-dish-id='+$(this).parent().parent().parent().find('.dishcard_body').find('.subselection-container').find('.subselection-card').first().find('#sub-id').html()+']').length > 0){ //check if the dish is already in the cart so we can += 1
      let temp = $('.summary-card_body').find('[data-dish-id='+$(this).parent().parent().parent().find('.dishcard_body').find('.subselection-container').find('.subselection-card').first().find('#sub-id').html()+']').find('.input-number');
      temp.val(parseInt(temp.val())+1);
      temp.data('quant-adjusted',parseInt(temp.data('quant-adjusted'))+1);
      subselections[$(this).parent().parent().parent().find('.dishcard_body').find('.subselection-container').find('.subselection-card').first().find('#sub-id').html()] = temp.val();
      console.log(temp.val());
    } else {
      subselections[$(this).parent().parent().parent().find('.dishcard_body').find('.subselection-container').find('.subselection-card').first().find('#sub-id').html()] = 1;
    }
    //console.log(subselections);
    const delivery_date = $('#cateringDate').data('dateSelected');
    // const delivery_time = $('#time-content').data('timeSelected');
    const delivery_time = $('#time-content').text().split('-', 1)[0].trim();

    $.ajax({
      method: "POST",
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      url: '/dashboard/edit_catering_item',
      data: {
        catering_order_id: catering_order_id,
        restaurant_id: restaurant_id,
        dish_id: dish_id,
        subselections: subselections,
        dish_quantity: dish_quantity,
        delivery_date: delivery_date,
        delivery_time: delivery_time
      }
    }).then(function () {
      Turbolinks.visit(window.location, {action: "replace"});
    })
  } else {
    console.log('resto closed')
    $('#restaurantClosedModal').modal('show');
    $('#dishModal').modal('hide');
  }
})
// $('.dishcard').off('click');
// $('.dishcard').on('click', function(e) {
$('body').on('click','.dishcard', function(e) {
  var that = "";
  if (e.target.id == "quickAdd"){
    qawst = $(window).scrollTop();
  } else if (e.target.id == "viewDish"){
    $('#dishModal').modal('show');
    that = $(this);
  } else {
    $('#dishModal').modal('show');
    that = $(this);
  }
  // console.log($(this).parent().parent().parent().html())
  console.log($(this));
  const title = $(that).find('.dishcard_title').text();
  const text  = $(that).find('.dishcard_text').text();
  const price = $(that).find('.dishcard_price').text();
  const img = $(this).find('.dishcard_image').attr('src');
  const img2 = $(this).find('.dishcard_image').attr('src2');
  const quantity = $(that).data('dishQuantity')
  const dishCardBadgeClass = $(this).find('.dishcard_badge').attr('class').split(' ').pop()
  const dish_id = $(this).find('#viewDish').data('dishId');
  const restaurant_open = $(this).find('#viewDish').data('restaurantOpen');
  const restaurant_id = $(this).find('#viewDish').data('restaurantId');
  var modalDishCardBadgeClass = "";
  var modalDishBadgeText = "";
  switch (dishCardBadgeClass) {
    case 'dishcard_badge_veg':
      modalDishCardBadgeClass = 'dishcardmodal_badge_veg';
      modalDishBadgeText = 'VEG';
      break;
    case 'dishcard_badge_meat':
      modalDishCardBadgeClass = 'dishcardmodal_badge_meat';
      modalDishBadgeText = 'MEAT';
      break;
  }

  // Set hidden fields with data attributes
  const hiddenField = $('#hiddenField');
  hiddenField.data('restaurantId', restaurant_id);
  hiddenField.data('dishId', dish_id);
  hiddenField.data('restaurantOpen', restaurant_open);

  const modal = $('#dishModal');
  modal.find('.dishcardmodal_title').text(title);
  modal.find('.dishcardmodal_text').text(text);
  modal.find('.dishcardmodal_price').text(price);
  modal.find('.dishcardmodal_image').attr('src',img2);
  modal.find('.modaldishpicker-quantity_count').val(quantity);
  modal.find('.dishcardmodal_badge').removeClass('dishcardmodal_badge_meat').addClass(modalDishCardBadgeClass);
  modal.find('.dishcardmodal_badge').text(modalDishBadgeText);

  $('.dishcardmodal_subselection').html('');

  $(that).find($('.subselection-card')).each(function(e){
    var subid = $(this).find('#sub-id').html();
    var subname = $(this).find('#sub-name').html();
    var subdesc = $(this).find('#sub-desc').html();
    var subprice = $(this).find('#sub-price').html();
    var subgf = $(this).find('#sub-gf').html();
    var subdf = $(this).find('#sub-df').html();
    var subvg = $(this).find('#sub-vg').html();
    var subgfo = $(this).find('#sub-gfo').html();
    var subdfo = $(this).find('#sub-dfo').html();
    var subvgo = $(this).find('#sub-vgo').html();
    var subtype = $(this).find('#sub-type').html();
    var gftext = "";
    var dftext = "";
    var vgtext = "";
    var gfotext = "";
    var dfotext = "";
    var vgotext = "";
    if(subgf == "true"){
      gftext = `<div class="subcard-gf dishcardmodal_dietarycircle"><img src="/assets/dietary_advanced_gf.svg" title="Gluten Free" alt="Gluten Free"></div>`
    }
    if(subdf == "true"){
      dftext = `<div class="subcard-df dishcardmodal_dietarycircle"><img src="/assets/dietary_advanced_df.svg" title="Dairy Free" alt="Dairy Free"></div>`
    }
    if(subvg == "true"){
      vgtext = `<div class="subcard-vg dishcardmodal_dietarycircle"><img src="/assets/dietary_advanced_vg.svg" title="Vegan" alt="Vegan"></div>`
    }
    if(subgfo == "true"){
      gfotext = `<div class="subcard-gfo dishcardmodal_dietaryoption"><img src="/assets/dietary_advanced_gf_option.svg" title="Gluten Free Option" alt="Gluten Free Option"></div>`
    }
    if(subdfo == "true"){
      dfotext = `<div class="subcard-dfo dishcardmodal_dietaryoption"><img src="/assets/dietary_advanced_df_option.svg" title="Dairy Free Option" alt="Dairy Free Option"></div>`
    }
    if(subvgo == "true"){
      vgotext = `<div class="subcard-vgo dishcardmodal_dietaryoption"><img src="/assets/dietary_advanced_vg_option.svg" title="Vegan Option" alt="Vegan Option"></div>`
    }
    $('.dishcardmodal_subselection').append(`
      <div class="card row subcardrow">
        <div id="sub-id">${subid}</div> 
        <div class="row" style="margin:0">
          <div class="subcard-name">${subname}</div>
          <div class="subcard-price">$${subprice}</div>
        </div>
        
        <div class="subcard-desc">${subdesc}</div>
        <div class="row subcard-footer" style="margin:0">
<!--            <span class="badge badge-primary dishcardmodal_badge dishcardmodal_badge_meat">MEAT</span>-->
          <div class="subcard-type"><span class="badge badge-primary dishcardmodal_badge dishcardmodal_badge_${subtype.toLowerCase()}">${subtype}</span></div>
          ${gftext}
          ${dftext}
          ${vgtext}
          ${gfotext}
          ${dfotext}
          ${vgotext}
          <div class="modal-section modaldishpicker-quantity">
            <form class="form-inline modaldishpicker-form" id="dishCounter-${e}" data-dish-counter="">
              <span class="modaldishpicker-quantity_minus noselect">-</span>
              <input type="number" class="form-control modaldishpicker-quantity_count" id="dishQuantity-${e}" name="qty" value="0">
              <span class="modaldishpicker-quantity_plus noselect">+</span>
            </form>
          </div>
        </div>
      </div>
    `);
  });
  $('body').on('click','#dishnoneSubmit',function(e){
    e.preventDefault();
    $('#dishModal').show();
    $('#dishNone').modal('hide');
  });
  $('body').on('click','#dishNoneClose',function(e){
    e.preventDefault();
    $('#dishModal').show();
    $('#dishNone').modal('hide');
  });
  $('body').on('click','#toomanySubmit',function (e) {
    e.preventDefault();
    $('#dishModal').modal('hide');
    $('#tooManyRestos').modal('hide');
  });
  $('body').on('click','#tooManyClose',function (e) {
    e.preventDefault();
    $('#dishModal').modal('hide');
    $('#tooManyRestos').modal('hide');
  });
  $('body').on('click','#addToOrder', function(e) {
    e.preventDefault();
    const restaurant_open = $('#hiddenField').data('restaurantOpen');
    console.log(restaurant_open);
    if(parseInt($('#resadded').html()) >= 2 && !$('#resids').html().includes($('#hiddenField').data('restaurantId'))){ //if the number of restaurants that have dishes added is >= 2, and the current restaurant id is not in that list (if we're at max restaurant selections we still want to be able to add dishes from that restaurant), warn the user that they can't have more than 2 restaurants
      console.log('uh oh too many restaurants');
      $('#tooManyRestos').modal('show');
      $('#dishModal').hide();
    }
    else if(restaurant_open) {
      if(typeof totals == 'undefined'){
        //add some dishes popup
        console.log('err:totals undefined');
        $('#dishNone').modal('show');
        $('#dishModal').hide();
      } else if(totals == 0) {
        console.log('err:totals = 0');
        $('#dishNone').modal('show');
        $('#dishModal').hide();
      } else {
        const dish_id = $('#hiddenField').data('dishId');
        const restaurant_id = $('#hiddenField').data('restaurantId');
        const catering_order_id = $('#catering_order_id').val();
        const dish_quantity = $('#dishQuantity').val();
        const dish_notes = $('.dishcardmodal-notes').val();

        let subselections = {};
        $('.subcardrow').each(function(){
          subselections[$(this).find('#sub-id').html()] = $(this).find('.modaldishpicker-quantity_count').val();
          // console.log($(this).find('#sub-id').html())
          // console.log($(this).find('.modaldishpicker-quantity_count').val())
        })
        console.log('subs ' + Object.keys(subselections));

        const delivery_date = $('#cateringDate').data('dateSelected');
        // const delivery_time = $('#time-content').data('timeSelected');
        const delivery_time = $('#time-content').text().split('-', 1)[0].trim()
        console.log(`${dish_id} ${restaurant_id} ${catering_order_id} ${dish_quantity} ${delivery_date} ${delivery_time}`)

        $.ajax({
          method: "POST",
          headers: {
            'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
          },
          url: '/dashboard/edit_catering_item',
          data: {
            catering_order_id: catering_order_id,
            restaurant_id: restaurant_id,
            dish_id: dish_id,
            subselections: subselections,
            dish_quantity: dish_quantity,
            delivery_date: delivery_date,
            delivery_time: delivery_time,
            dish_notes: dish_notes
          }
        }).then(function() {
          $('#dishModal').modal('hide');
          // Turbolinks.visit(window.location, { action: "replace" })
        })
      }

    } else {
      console.log('resto closed')
      $('#restaurantClosedModal').modal('show');
      $('#dishModal').modal('hide');
    }

  })
})

// On show Modal
$('body').on('shown.bs.modal','#dishModal', function(e) {
  // Set hidden fields with data attributes
  $('.modal-backdrop.show').attr('style', 'opacity: 1 !important; background-color: rgba(45, 57, 88, 0.85) !important;');
  $('.modaldishpicker').scrollTop(0)
  let dish_id = $('#hiddenField').data('dishId');
  let dataDishCounter = $("#dishCounter");
  dataDishCounter.data('dishCounter', dish_id);

  let count = $('#dishCounter .modaldishpicker-quantity_count');
  count.prop('disabled', true);

  function updateTotals(){
    totals = 0;
    $('.subcardrow').each(function(){
      var quant = $(this).find('.modaldishpicker-quantity_count').val(); //returns value of each input
      var price = $(this).find('.subcard-price').html(); //returns price of each subselection
      var number = Number(price.replace(/[^0-9.-]+/g,"")); //strip dollar symbols from price
      var total = parseInt(quant)*parseInt(number); //total price of row
      if (total > 0) {
        totals += total; // add all totals together
        $('#addToOrder').html(`Add to Order - $${totals}`);
      }
      if (totals == 0) {
        $('#addToOrder').html(`Add to Order`);
      }
      console.log(`this row has ${quant} dishes at ${price} per dish for a total of ${total}. gt = ${totals}`)
    });
  }
  $('body').on('keyup','#dishModal',function(e1){
    updateTotals();
  });
  $('body').on('keydown','input',function(event){
    if(event.key == "Enter"){
      event.preventDefault();
      const restaurant_open = $('#hiddenField').data('restaurantOpen');
      console.log(restaurant_open);
      //$('#resadded').html() >= 2 show popup
      if(parseInt($('#resadded').html()) >= 2 && !$('#resids').html().includes($('#hiddenField').data('restaurantId'))){ //if the number of restaurants that have dishes added is >= 2, and the current restaurant id is not in that list (if we're at max restaurant selections we still want to be able to add dishes from that restaurant), warn the user that they can't have more than 2 restaurants
        console.log('uh oh too many restaurants');
        $('#tooManyRestos').modal('show');
        $('#dishModal').hide();
      }
      else if(restaurant_open) {
        if(typeof totals == 'undefined'){
          //add some dishes popup
          console.log('err:totals undefined');
          $('#dishNone').modal('show');
          $('#dishModal').hide();
        } else if(totals == 0) {
          console.log('err:totals = 0');
          $('#dishNone').modal('show');
          $('#dishModal').hide();
        } else {
          const dish_id = $('#hiddenField').data('dishId');
          const restaurant_id = $('#hiddenField').data('restaurantId');
          const catering_order_id = $('#catering_order_id').val();
          const dish_quantity = $('#dishQuantity').val();
          const dish_notes = $('.dishcardmodal-notes').val();

          let subselections = {};
          $('.subcardrow').each(function () {
            subselections[$(this).find('#sub-id').html()] = $(this).find('.modaldishpicker-quantity_count').val();
            // console.log($(this).find('#sub-id').html())
            // console.log($(this).find('.modaldishpicker-quantity_count').val())
          })
          console.log(subselections);

          const delivery_date = $('#cateringDate').data('dateSelected');
          // const delivery_time = $('#time-content').data('timeSelected');
          const delivery_time = $('#time-content').text().split('-', 1)[0].trim()
          console.log(`${dish_id} ${restaurant_id} ${catering_order_id} ${dish_quantity} ${delivery_date} ${delivery_time}`)

          $.ajax({
            method: "POST",
            headers: {
              'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
            url: '/dashboard/edit_catering_item',
            data: {
              catering_order_id: catering_order_id,
              restaurant_id: restaurant_id,
              dish_id: dish_id,
              subselections: subselections,
              dish_quantity: dish_quantity,
              delivery_date: delivery_date,
              delivery_time: delivery_time,
              dish_notes: dish_notes
            }
          }).then(function () {
            $('#dishModal').modal('hide');
            //Turbolinks.visit(window.location, {action: "replace"})
          })
        }
      } else {
        console.log('resto closed')
        $('#restaurantClosedModal').modal('show');
        $('#dishModal').modal('hide');
      }
    }
  });
  //gets cart data (subselection ids and quantities, and replaces advanced view quantities with those)
  var subs = {};
  if($('.dish-container').length > 0) {
    $('.dish-container').each(function(){
      var subid = $(this).find('.dish-quantity').data('dishId');
      var cquantity = $(this).find('.input-number').val();
      subs[subid] = cquantity;
    });
  }

  setTimeout(function(){
    if ($(e.target).find('.subcardrow').length > 0){
      $(e.target).find('.subcardrow').each(function(){
        var that = $(this);
        var subid = $(this).find('#sub-id').html();
        Object.keys(subs).forEach(function(key){
          var cartsubid = key;
          var cartsubq = subs[key];
          if(cartsubid == subid){
            console.log(
              $(that).find('.modaldishpicker-quantity_count').val(cartsubq)
            )
          }
        })
      });
    }
  },200);
  // $('body').on('keyup', '.modaldishpicker-quantity_count', function(e){
  //   console.log('key')
  //   updateTotals();
  // })

  $('body').on('click','.modaldishpicker-quantity_plus', function() {
  // $('.modaldishpicker-quantity_plus').on('click', function() {
    console.log('test')
    $(this).parent().find($('input')).val(parseInt($(this).parent().find($('input')).val()) + 1 );
    updateTotals();
  })

  $('body').on('click','.modaldishpicker-quantity_minus', function() {
    $(this).parent().find($('input')).val(parseInt($(this).parent().find($('input')).val()) - 1 );
    if ($(this).parent().find($('input')).val() <= 0) {
      $(this).parent().find($('input')).val(0);
    }
    updateTotals();
  })
  $('[aria-label=Close]').on('click',function(){
    $('[class~=show]').modal('hide');
  });
})

// On hide Modal
$('body').on('hide.bs.modal','#dishModal', function() {
  $('.modal-backdrop.show').attr('style', 'opacity: 0.99 !important');
  $('.modaldishpicker-quantity_minus').off('click');
  $('body').off('click','.modaldishpicker-quantity_plus');
  $('body').off('click','.modaldishpicker-quantity_minus');
  $('body').off('click','.modaldishpicker-quantity_count');
  $('.modaldishpicker-quantity_plus').off('click');
  const modal = $('#dishModal');
  const defaultClass = 'badge badge-primary dishcardmodal_badge dishcardmodal_badge_meat'
  modal.find('.dishcardmodal_badge').attr('class', defaultClass);
})

$('[aria-label=Close]').on('click',function(){
  $('[class~=show]').modal('hide');
});