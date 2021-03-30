$(function(){

    const database = firebase.database();
    const beforeQuery = database.ref('orders/');

/*****************
  ORDERS FROM DB
******************/

beforeQuery.on('value',function success(data){
    if(data){
        let orders = '';
        $.each(data.val(),function(key,value){
            let order_number = key,
                 order_total = value.total,
              total_products = value.products,
                       table = value.table;

                orders += `<div class="order-id"> ${order_number}
                            <span class="order-total" style="padding-left:100px">${order_total} Baht</span>
                            <span class="order-total">${table}</span>
                            </div>
                            <div class="order-details">`;

                            $.each(total_products,function(key,value){
                                orders += `<div>${value.item} | ${value.price}</div>`
                            });

                            orders += `</div>`;
            }); //closing each
            $('.append-orders').html(orders);
    }//closing if(data)
}); //closong beforeQuery

$(document).on('click','.order-id',function(){

    $(this).next('.order-details').slideToggle();
});

});