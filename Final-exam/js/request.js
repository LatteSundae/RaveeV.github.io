$(document).ready(function(){

    const database = firebase.database();
    const beforeQuery = database.ref('request/');

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

        if(message == 'Submitted')
        {
            $('.added').fadeIn(1000);
            
            setTimeout(function(){
            $('.added').fadeOut(1000);
            },3500);
        }
    }


/*****************
  submit request
******************/

    $('[name=submit]').click(function(e){
        e.preventDefault();

        const name = $('[name=name]').val(),
                phone = $('[name=phone]').val(),
                arrive = $('[name=arrive]').val(),
                depart = $('[name=depart]').val(),
                reason = $('[name=reason]').val(),
                newid = beforeQuery.push();

                if(!name || !phone || !arrive || !depart || !reason)
                {
                    notifications('Fill all the require detail!')
                }
                else
                {
                    newid.set({
                        name : name,
                        phone : phone,
                        arrive : arrive,
                        depart : depart,
                        reason : reason
                    },
                    function(error){
                        if(!error)
                        {
                            notifications("Submitted");
                            $('[name=name]').val("");
                            $('[name=phone]').val("");
                            $('[name=arrive]').val("");
                            $('[name=depart]').val("");
                            $('[name=reason]').val("");
                        }
                        else
                        {
                            console.log('Failed Adding')
                        }
                    });
                }
            });
});