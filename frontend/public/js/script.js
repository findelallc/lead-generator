const apiUrl= "http://localhost:5002/lead";
const findInUrl = (window.location.href).match('leads');
let leads = {data: [], currentAction: 'new'};
let ModalInstance = {};

$(document).ready(function() {
    $("form.lead_generator").submit(function (e) { 
        e.preventDefault();
        inputs = {};
        input_serialized =  $(this).serializeArray();
        input_serialized.forEach(field => {
            inputs[field.name] = field.value;
        })
        requestServer(
            inputs, 
            leads.currentAction === 'new' ? '/new' : '/update', 
            leads.currentAction === 'new' ? 'POST' : 'PATCH'
        )
    });
    
    if(findInUrl) {
        ModalInstance = new bootstrap.Modal(document.getElementById('leadActionModal'), {
            keyboard: false
        });
        getLeadsList()
    }
    else {
        $(".loader").hide();
    }
});


/**
 * Fetch leads list
 */
function getLeadsList() {
    $.ajax({
        url: apiUrl + "/list",
        type: 'GET',
        success: function(response) {
            if(response.status === 200) {
                leads.data = response.data
                renderList(leads.data);
            }
        },
        fail: function(xhr, textStatus, errorThrown){
            $.toast({
                heading: 'Error',
                text: 'An unexpected error occured while trying to submit data.',
                icon: 'error',
                position: 'top-center'
            })
            
        }
    }).catch(error => {
        $.toast({
            heading: 'Connection Error',
            text: 'An unexpected error occured while connecting to the server.',
            icon: 'error',
            position: 'top-center'
        })
        renderList(leads.data);
    }); 
}

/**
 * Render data list
 * @param dataList 
 */
function renderList(dataList) {
    $("#lead_list").children().detach();
    if(dataList.length) {
        dataList.forEach((item, index) => {
            $("#lead_list").append(
                '<div class="card my-2">'+
                    '<div class="card-body">'+
                        '<ul class="list-group list-group-flush">'+
                            '<li class="list-group-item py-0">'+
                                '<b class="d-block">'+item.name+'</b>'+
                                '<small class="text-sm d-block">'+item.email+
                                '</small>'+
                                item.contactNo+
                                '<span class="badge bg-warning text-dark fw-bolder ms-2">'+
                                item.country+'</span>'+
                                '<br/>'+
                                item.description+
                            '</li>'+
                        '</ul>'+
                        '<div class="position-absolute d-inline-flex" style="top: 40px; right: 30px">'+
                            '<h4 class="uil-edit-alt my-auto text-dark"'+ 
                            'onclick="leadAction(JSON.parse(\''+ JSON.stringify(item).replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '\'),\''+ "edit" + '\')" role="button"></h4>'+
                            '<h4 class="uil-trash-alt text-danger my-auto mx-3"'+ 
                            'onclick="leadAction(JSON.parse(\''+ JSON.stringify(item).replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '\'),\''+ "delete" + '\')" role="button"></h4>'+
                        '</div>'+
                    '</div>'+
                '</div>'
            )
        });
    }
    else {
        $("#lead_list").empty().append(
            '<h6 class="text-center p-5 bg-light border text-danger"><b>No list to show</b></h6>'
        )
    }
}

/**
 * Select action type with data item
 * @param {*} data 
 * @param {*} type 
 */
function leadAction(item, type) {
    leads.currentAction = type;
    ModalInstance.show();
    $("#leadActionModal .modal-footer .action-btn").remove();
    $("#leadActionModal .modal-body .form.first").hide();
    $("#leadActionModal .modal-body .caption-text").hide();
    if(leads.currentAction === 'delete') {
        $("#leadActionModal .modal-body .caption-text").show();
        $("#leadActionModal .modal-header").empty().append('<h5><b>Delete Action</b></h5>')
        $("#leadActionModal .modal-body .caption-text").empty()
        .append(document.createTextNode("Are you sure to remove this lead?"));
        $("#leadActionModal .modal-footer").append(
            '<button type="button" onclick="deleteLead(JSON.parse(\''+ JSON.stringify(item).replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '\'))"'+
            'class="btn btn-danger action-btn">Delete</button>'
        )
    }
    else {
        $("#leadActionModal .modal-body .form.first").show();
        $("#leadActionModal .modal-header").empty().append('<h5 class="mb-0"><b>Edit Action</b></h5>')
        $("#leadActionModal .modal-footer").append(
            '<button class="saveBtn action-btn btn btn-dark" type="submit">'+
                '<span class="btnText"><b>Update</b></span>'+
                '<img src="./public/images/loading-gif.gif" class="loader ms-1" width="15" alt="loader"/>'+
            '</button>'
        );
        $(".loader").hide();
        for(let [key, value] of Object.entries(item)) {
            if($("form.lead_generator input[name='"+key+"']").length) {
                $("form.lead_generator input[name='"+key+"']").val(value);
            }
            else if($("form.lead_generator select[name='"+key+"']").length) {
                $("form.lead_generator select[name='"+key+"']").val(value);
            }
            else if($("form.lead_generator textarea[name='"+key+"']").length) {
                $("form.lead_generator textarea[name='"+key+"']").val(value);
            }
        }
    }
}

/**
 * Delete lead
 */
function deleteLead (item) {
    requestServer(item, '/remove?uid='+item.uid, 'DELETE')
}

/**
 * Request to Server (POST / PATCH / DELETE) (AJAX)
 * @param {*} input
 * @param {*} slug 
 * @param {*} methodType 
 */
function requestServer(input, slug, methodType) {
    if(['POST','PATCH'].includes(methodType)) {
        $(".btnText").text("Submitting..");
        $(".loader").show();
        $(".saveBtn").prop("disabled", true);
    }
    $.ajax({
        url: apiUrl + slug,
        type: methodType,
        data: ['POST','PATCH'].includes(methodType) ? input : {},
        success: function(response) {
            if(response.status === methodType === 'POST' ? 201 : 200) {
                $.toast({
                    heading: 'Success',
                    text: 
                    (
                        ['POST','PATCH'].includes(methodType) ? 
                        'Form ' + (methodType === 'POST' ? 'submited' : 'updated') : 
                        'Lead deleted'
                    ) + ' successfully',
                    position: 'top-center',
                    stack: false,
                    icon: 'success'
                })
                if(['POST','PATCH'].includes(methodType)) {
                    setTimeout(() => {
                        $(".loader").hide();
                        $(".btnText").text("Send Request");
                        $('form.lead_generator').trigger("reset");
                        $(".saveBtn").prop("disabled", false);
                    }, 1200);

                    if(methodType === 'PATCH') {
                        ModalInstance.hide();
                        leads.data.forEach((key,index) => {
                            if(key.uid === input.uid) {
                                leads.data[index] = input
                            }
                        });
                        renderList(leads.data);
                    }
                }
                else if(methodType === 'DELETE') {
                    leads.data.splice(leads.data.findIndex(key => key.uid === input.uid), 1);
                    renderList(leads.data)
                    ModalInstance.hide();
                }

                leads.currentAction = 'new';
            }
        },
        fail: function(xhr, textStatus, errorThrown){
            $.toast({
                heading: 'Error',
                text: 'An unexpected error occured while trying to submit data.',
                icon: 'error'
            })
        }
    }).catch(error => {
        $.toast({
            heading: 'Connection Error',
            text: 'An unexpected error occured while connecting to the server.',
            icon: 'error',
            position: 'top-center'
        });
    }); 
}
