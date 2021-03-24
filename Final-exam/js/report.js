$(document).ready(function(){

    const database = firebase.database();
    const beforeQuery = database.ref('request/');

/*****************
 REQUEST FROM DB
******************/

    beforeQuery.on('value',function success(data)
    {
        if(data)
        {
            let request = '';



        $.each(data.val(),function(key,value){
            let id = key,
            name = value.name,
            phone = value.phone,
            arrive = value.arrive,
            depart = value.depart,
            reason = value.reason;
            

            request += `<div class="requestname">${name}
                        <span class="data phone">${phone}</span> 
                        <span class="data arrive">${arrive}</span> 
                        <span class="data depart">${depart}</span> 
                        <span class="data reason">${reason}</span> 
                        <span data-id=${key} class="delete"></span>   
                        </div>`;

        $('.report-detail').html(request);

/*****************
DELETE EXIST MENU
******************/

    $('.delete').click(function(){
        let thekey = $(this).data('id');
        beforeQuery.child(thekey).remove();
        window.location.reload(true);
    });

    });
}
    else
    {
        console.log('No Data Found...')
    }
        });



});