const apiUrl= "http://localhost:5002/lead";
const findInUrl = (window.location.href).match('leads');
let leads = {data: [], currentAction: ''};
let ModalInstance = '';

$(document).ready(function() {
    $("#lead_generator").submit(function (e) { 
        e.preventDefault();
        inputs = {};
        input_serialized =  $(this).serializeArray();
        input_serialized.forEach(field => {
            inputs[field.name] = field.value;
        })
        requestServer(inputs, '/new', 'POST')
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
                icon: 'error'
            })
        }
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
                                '<span class="badge bg-warning text-dark fw-bolder ms-1">'+
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
    if(leads.currentAction === 'delete') {
        $("#leadActionModal .modal-header").empty().append('<h5><b>Delete Action</b></h5>')
        $("#leadActionModal .modal-body").empty().append(document.createTextNode("Are you sure to remove this lead?"));
        $("#leadActionModal .modal-footer").append(
            '<button type="button" onclick="deleteLead(JSON.parse(\''+ JSON.stringify(item).replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '\'))"'+
            'class="btn btn-danger action-btn">Delete</button>'
        )
    }
    else {
        $("#leadActionModal .modal-header").empty().append('<h5><b>Edit Action</b></h5>')
        $("#leadActionModal .modal-footer").append(
            '<button type="button" class="btn btn-primary action-btn">Update</button>'
        )
    }
}

/**
 * Delete lead
 */
function deleteLead (item) {
    requestServer(item, '/remove?uid='+item.uid, 'DELETE')
}

/**
 * Request to Server (POST / DELETE) (AJAX)
 * @param {*} input
 * @param {*} slug 
 * @param {*} methodType 
 */
function requestServer(input, slug, methodType) {
    if(methodType === 'POST') {
        $(".btnText").text("Submitting..");
        $(".loader").show();
        $(".saveBtn").prop("disabled", true);
    }
    $.ajax({
        url: apiUrl + slug,
        type: methodType,
        data: methodType === 'POST' ? input : {},
        success: function(response) {
            if(response.status === methodType === 'POST' ? 201 : 200) {
                $.toast({
                    heading: 'Success',
                    text: methodType === 'POST' ? 'Form submited' : 'Lead deleted' + ' successfully',
                    position: 'top-center',
                    stack: false,
                    icon: 'success'
                })
                if(methodType === 'POST') {
                    setTimeout(() => {
                        $(".loader").hide();
                        $(".btnText").text("Send Request");
                        $('form#lead_generator').trigger("reset");
                        $(".saveBtn").prop("disabled", false);
                    }, 2000);
                }
                if(methodType === 'DELETE') {
                    leads.data.splice(leads.data.findIndex(key => key.uid === input.uid), 1);
                    renderList(leads.data)
                    ModalInstance.hide();
                }
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
}
