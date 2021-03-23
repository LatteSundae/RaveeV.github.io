$(document).ready(function(){

    const database = firebase.database();
    const beforeQuery = database.ref('menu/');

/*****************
  NOTIFICATIONS
******************/

    const notifications = (message) =>
    {
        if(message == 'Fill all the require detail!')
        {
            $('.fillrequire').fadeIn(1000);
            
            setTimeout(function(){
            $('.fillrequire').fadeOut(1000);
            },3500);
        }

        if(message == 'Added Successfully!')
        {
            $('.added').fadeIn(1000);
            
            setTimeout(function(){
            $('.added').fadeOut(1000);
            },3500);
        }

        if(message == 'updated')
        {
            $('.updated').fadeIn(1000);
            
            setTimeout(function(){
            $('.updated').fadeOut(1000);
            },3500);
        }
    }


/*****************
  CREATE NEW MENU
******************/

    $('[name=submit]').click(function(e){
        e.preventDefault();

        const category = $('[name=category]').val(),
                title = $('[name=title]').val(),
                price = $('[name=price]').val(),
                image = $('[name=image]').val().slice(12),
                newid = beforeQuery.push();

                if(!title || !price || !image)
                {
                    notifications('Fill all the require detail!')
                }
                else
                {
                    newid.set({
                        category : category,
                        title : title,
                        price : price,
                        image : "food/"+image
                    },
                    function(error){
                        if(!error)
                        {
                            notifications("Added Successfully!");
                            $('[name=title]').val("");
                            $('[name=price]').val("");
                            $('[name=image]').val("");
                        }
                        else
                        {
                            console.log('Failed Adding')
                        }
                    });
                }
            });

/*****************
 READ MENU FROM DB
******************/

    beforeQuery.on('value',function success(data)
    {
        if(data)
        {
            let primary = '',
                secondary = '',
                side = '',
                dessert = '';

        $.each(data.val(),function(key,value){
            let id = key,
            category = value['category'],
                title = value['title'],
                price = value['price'],
                image = value['image'];

            if(category == 'primary')
            {
                primary += `<div class="product-box">
                            <div id= ${key}>
                            <img class="image" src=${image}>
                            <div class="title">${title}</div><hr>
                            <div class="price">${parseFloat(price).toFixed(2)} Baht</div><hr>
                            <div data-id=${key} class="delete"></div>   
                            <div data-id=${key} class="update"></div>   
                            </div>
                            </div>`;
            }
            else if(category == 'secondary')
            {
                secondary += `<div class="product-box">
                            <div id= ${key}>
                            <img class="image" src=${image}>
                            <div class="title">${title}</div><hr>
                            <div class="price">${parseFloat(price).toFixed(2)} Baht</div><hr>
                            <div data-id=${key} class="delete"></div>   
                            <div data-id=${key} class="update"></div>   
                            </div>
                            </div>`;
                        }
            else if(category == 'side')
            {
                side += `<div class="product-box">
                            <div id= ${key}>
                            <img class="image" src=${image}>
                            <div class="title">${title}</div><hr>
                            <div class="price">${parseFloat(price).toFixed(2)} Baht</div><hr>
                            <div data-id=${key} class="delete"></div>   
                            <div data-id=${key} class="update"></div>   
                            </div>
                            </div>`;
            }
            else if(category == 'dessert')
            {
                dessert += `<div class="product-box">
                            <div id= ${key}>
                            <img class="image" src=${image}>
                            <div class="title">${title}</div><hr>
                            <div class="price">${parseFloat(price).toFixed(2)} Baht</div><hr>
                            <div data-id=${key} class="delete"></div>   
                            <div data-id=${key} class="update"></div>   
                            </div>
                            </div>`;
            }
            else{}
        })

        $('.primary').html(primary);
        $('.secondary').html(secondary);
        $('.side').html(side);
        $('.dessert').html(dessert);

/*****************
DELETE EXIST MENU
******************/

    $('.delete').click(function(){
        let thekey = $(this).data('id');
        beforeQuery.child(thekey).remove();
    });

/*****************
UPDATE EXIST MENU
******************/

$('#close-update').click(function(){
    $('#for-update').slideUp();
});

$('.update').click(function(){
    let theekey = $(this).data('id');
    $('#for-update').slideDown();

    let oldtitle = $(`#${theekey} > .title`).text(),
        oldprice = $(`#${theekey} > .price`).text(),    
            slice = oldprice.indexOf('.');
        oldprice = oldprice.slice(0,slice);

    $('[name=newtitle]').val(oldtitle);
    $('[name=newprice]').val(parseFloat(oldprice).toFixed(2));
    $('[name=id]').val(theekey);

    $('[name=update]').click(function(e){
        e.preventDefault();
        let theid = $('[name=id]').val();
         newtitle = $('[name=newtitle]').val();
         newprice = $('[name=newprice]').val();

            beforeQuery.child(theid).update({
                title : newtitle,
                price : newprice,
            },function(error)
            {
                if(!error)
                {
                    notifications('updated');
                    $('#for-update').slideUp();
                }
                else{}
            });
    });
});

    }
    else
    {
        console.log('No Data Found...')
    }

});





});