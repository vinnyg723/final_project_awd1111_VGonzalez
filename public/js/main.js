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
  $('#clearForm').click(function(){				
      $('#order-form,#register-form input[type="text"]').val('');
      $('#order-form,#register-form input[type="email"]').val('');
      $('#order-form,#register-form input[type="phone"]').val('');		
      $('#register-form input[type="password"]').val('');		
  });
});


