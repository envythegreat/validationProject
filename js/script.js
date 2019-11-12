let totalActivityCost = 0;
let totalCostContainer = "<span></span>";
$('.activities').append(totalCostContainer);
document.addEventListener('DOMContentLoaded', () =>{
    $("#name").focus();
    $("#other-title").hide();
    $("#other-title").prop('disabled', true);
    $("#color option").hide();
    $("#color").prepend($('<option>').attr('selected', false).text("Please select a T-shirt theme").val("Default") );
    $("#colors-js-puns").hide();
    $("#paypal").hide()
    $("#bitcoin").hide()
});
// fucntion to filter color option based on design select
const getColorMenu = (desing) => {
    $("#color option").each(function () {
        const $chText = $(this).text();
        $chText.includes(desing) ? $(this).show().attr('selected', true) : $(this).hide().attr('selected', false);
    });
};
// event listener to show the input with [#other-title] id if other option has been selected in #title select
$("#title").on("change", () => {
    if ($("#title").val() === "other") {
        $("#other-title").show();
        $("#other-title").prop('disabled', false);
    } else {
        $("#other-title").hide();
        $("#other-title").prop('disabled', true);
    }
});
// event listener to change payment option
function updatePaymentInfo() {
    const   selectedPaymentMethod = $('#payment').val()
            creditCard = $('#credit-card').hide(),
            paypal = $('#paypal').hide(),
            bitcoin = $('#bitcoin').hide(), 
            creditCard.find('input, select').prop('disabled', true)
    
    switch ( selectedPaymentMethod ) {
        case 'Credit Card':
            creditCard.show()
                .find('input, select')
                .prop('disabled', false)
            break
        case 'PayPal':
            paypal.show()
            break
        case 'Bitcoin':
            bitcoin.show()
            break
    }
}
function updateTShirtColor(evt) {
    const selectedTheme = evt.target.value
    const colorSelection = $('#colors-js-puns')
    $('#ssDefs').hide()
    if (selectedTheme){
        colorSelection.show()
        getColorMenu(selectedTheme)
        console.log(selectedTheme)
    }
    // else  colorSelection.find('select').prop('disabled', true).end().hide()
}

// event listener to show select && filter color option when [#design] option is changed .
$('.activities').on('change', function(e) {
    const clicked = $(e.target);
    let activityCost = clicked.attr('data-cost');
    let removeDollarSign = activityCost.slice(1);
    let convertCost = parseInt(removeDollarSign);
    if ($(clicked).is(':checked')) {
        totalActivityCost += convertCost;
    } else {
        totalActivityCost -= convertCost;
    }
   $('.activities span').text('Total: $' + totalActivityCost);
    const activityChecked = clicked.attr('data-day-and-time');

    $('.activities input').each(function (i, input) {
        const cheCked = $(this);
        if ( activityChecked === cheCked.attr('data-day-and-time') && clicked.attr('name') !== cheCked.attr('name')) {
            if ($(clicked).is(':checked')) {
                $(input).prop("disabled", true);
                $(input).parent().css('text-decoration', 'line-through');
            } else {
                $(input).prop("disabled", false);
                $(input).parent().css('text-decoration', 'none');
            }
        }       
    })
});
const valArray = [ // array contain objects for validation purpose 
    {regex : /^[^@]+@[^@.]+\.[a-z]+$/i ,errorEmpty:"Please Entre an Email",errorNotValid:"Please Enter A Valid Email",id:"#mail"},
    {regex:/^\d{13,16}$/, errorEmpty:"Please Entre a Credit/Debit Card",errorNotValid:"Please Enter A Valid Card",id:"#cc-num"},
    {regex:/^\d{5}$/, errorEmpty:"Please Entre Your Zip Code",errorNotValid:"Invalid Zip Code!",id:"#zip"},
    {regex:/^\d{3}$/, errorEmpty:"Please Entre Your CVV",errorNotValid:"Invalid CVV!",id:"#cvv"},
    {regex:/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g, errorEmpty:"Please Entre Your Name",errorNotValid:'Please Enter A Valid Name',id:"#name"},
]
const newError = (ErrorType, PElement) => { // fucntion for display error when it need to :)
    let ErrorNew = $("<div class='"+$(PElement).attr('name')+"'></div>").text(ErrorType).addClass('error');
    $(PElement).before(ErrorNew);
};
const ErrorAct = $("<div>Please Selecte at least One Activity</div>").addClass('error'); // Error Called when no Activity is selected
const ErrorRole = $("<div>Please Entre Your Job Role</div>").addClass('error'); // Error Called when no role is selected
const testElement = (element,regex,ErrorE,ErrorV) =>{// fucntion to check if input given is not empty and value is valid && display Error if it false
    let removedDiv = "."+$(element).attr('name');
    console.log(removedDiv);
    $(element).on('input change', ()=>{
        if( $(element).val() === "" ) {
            if (!$(removedDiv).length){
                newError(ErrorE, element);
            }
        } else if ( !regex.test($(element).val()) ) {
            if (!$(removedDiv).length){
                newError(ErrorV, element);
            }
        }else if( regex.test($(element).val()) ){
            $("div").remove(removedDiv);
        } else {
            $("div").remove(removedDiv);
        }
    });
};
for(let i = 0 ; i < valArray.length; i++) { // loop & bind all array objects and inputs to check if there is any error 
    testElement(valArray[i].id, valArray[i].regex, valArray[i].errorEmpty, valArray[i].errorNotValid);  
}
const checkedAct = () => { // check if there is any activity selected or no
    if ( $('.activities input:checked').length > 0 ) {
        return true;
    } else {
        return false;
    };
}
console.log(valArray[1].regex)
$('#payment').val('Credit Card').prop('selected',  true)
$('#payment').on('change', updatePaymentInfo)
$('#design').on('change', updateTShirtColor)
$('form').on('submit', (e)=>{
    $('form .error').remove();
    $('form input').each(function(i, input){ // loop throught all inputs in form and see if there is is any error and stop form from submittion 
        for ( let j = 0; j < valArray.length; j++  ){
            let theID = valArray[j].id.slice(1);
            if ($(input).attr('id') === theID){ 
                if ( $(input).val() === '' && !$(input).prop("disabled")){
                    newError(valArray[j].errorEmpty, $(input));
                    e.preventDefault();
                }
            }
            // if (!valArray[j].regex.test($(valArray[j].id).val())){
            //     // console.log('sskid')
            //     e.preventDefault();
            // }
        }
    });
    if (!checkedAct()){
        $('.activities legend').after(ErrorAct);
        e.preventDefault();
    }
    if (!valArray[0].regex.test($('#mail').val()) ||
        !valArray[1].regex.test($('#cc-num').val()) ||
        !valArray[2].regex.test($('#zip').val()) ||
        !valArray[3].regex.test($('#cvv').val()) ||
        !valArray[4].regex.test($('#name').val()) ){
            e.preventDefault();
    }
    if ( !$("#other-title").prop('disabled') && $("#other-title").val() === ""){
        $("#other-title").before(ErrorRole);
        e.preventDefault();
    }
    console.log($('form .error'))
})
