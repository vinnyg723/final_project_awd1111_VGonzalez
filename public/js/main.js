$(() => {
  $('form.needs-validation').on('submit', (evt) => {
    if (!evt.target.checkValidity()) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    $(evt.target).addClass('was-validated');
  });
});

$(document).ready(function(){
  $('#clearOrderForm').click(function(){				
      $('#order-form input[type="text"]').val('');
      $('#order-form input[type="email"]').val('');
      $('#order-form input[type="phone"]').val('');		
  });
});

$(document).ready(function(){
  $('#clearRegisterForm').click(function(){				
      $('#register-form input[type="text"]').val('');
      $('#register-form input[type="email"]').val('');
      $('#register-form input[type="phone"]').val('');
      
$('#register-form input[type="password"]').val('');
  });
});
