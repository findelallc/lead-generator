
const apiUrl= "http://localhost:5002/lead";
$(document).ready(function() {
    $("#lead_generator").submit(function (e) { 
        e.preventDefault();
        inputs = {};
        input_serialized =  $(this).serializeArray();
        console.log(input_serialized)
        input_serialized.forEach(field => {
          inputs[field.name] = field.value;
        })
        
        $.ajax({
            url: apiUrl + "/new",
            type: 'POST',
            data: inputs,
            success: function(data) {
                if(data.status === 201) {
                    $.toast({
                        heading: 'Success',
                        text: 'Your form submited successfully',
                        position: 'top-center',
                        stack: false,
                        icon: 'success'
                    })
                    $('form#lead_generator').trigger("reset");
                }
            },
            fail: function(xhr, textStatus, errorThrown){
                $.toast({
                    heading: 'Error',
                    text: 'An unexpected error occured while trying to submit data.',
                    icon: 'error'
                })
             }
        });  
    });
});