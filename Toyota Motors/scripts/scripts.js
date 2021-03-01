var intrate = 0;
var period = 12;
var price = 0;
var monthly = 0;
$(document).ready(function() {
    
    $('input[type=radio][name="intrate"]').change(function() {
        intrate = parseInt($(this).val());
    });

    $('input[type=radio][name="period"]').change(function() {
        period = parseInt($(this).val());
    });
  })

function calculate() {
    price = document.getElementById("price").innerHTML;
    monthly = ((price - (price*0.1))*(intrate/100))+(price - (price*0.1))/period;
    payment.innerHTML = monthly.toFixed(2);
}