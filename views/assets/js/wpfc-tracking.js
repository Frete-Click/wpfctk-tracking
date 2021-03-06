// Get and Show result track back
function showTrackBack(){

    var form = {
        'action':    'wpfcTracking',
        'orderId':   jQuery('#orderId').val(),
        'document':  jQuery('#document').val()    
    }

    jQuery.ajax({
        type: 'POST',
        url: ajax_object.url,
        data: form,
        success: function(response){

            response = JSON.parse(response);

            var id1 = document.getElementById('oderId-set');
            var id2 = document.getElementById('effectiveDateTime');
            var id3 = document.getElementById('orderStatus');
            var id4 = document.getElementById('deliveryDueDate');

            if(form.orderId === ""){
                jQuery('#orderId').addClass('input-error');
                jQuery('#addLoader').removeClass('loader');
            }
         
            if(form.document === ""){
                jQuery('#document').addClass('input-error');
                jQuery('#addLoader').removeClass('loader');
            }

            if(form.orderId.length >= 1 && form.document.length >= 1 ){

                Object.values(response).forEach(val => {

                    console.log(response)

                    switch(val.data.order.status.status){
                        case 'quote': val.data.order.status.status = "Cotação";
                        break;
                        case 'waiting client invoice tax': val.data.order.status.status = "Aguardando nota fiscal";
                        break;
                        case 'automatic analysis': val.data.order.status.status = "Análise automática";
                        break;
                        case 'analysis': val.data.order.status.status = "Em análise";
                        break;
                        case 'waiting payment': val.data.order.status.status = "Aguardando pagamento";
                        break;
                        case 'waiting retrieve': val.data.order.status.status = "Aguardando coleta";
                        break;
                        case 'on the way': val.data.order.status.status = "Em viagem";
                        break;
                        case 'waiting invoice tax': val.data.order.status.status = "Aguardando fatura";
                        break;
                        case 'delivered': val.data.order.status.status = "Entregue";
                        break;
                        case 'waiting billing': val.data.order.status.status = "Gerando NF";
                        break;
                        case 'canceled': val.data.order.status.status = "Cancelado";
                        break;
                        case 'waiting commission': val.data.order.status.status = "Aguardando comissão";
                        break;
                        case 'ship to carrier': val.data.order.status.status = "Entregar na transportadora";
                        break;
                        case 'retrieved': val.data.order.status.status = "Coletado";
                        break;
                        case 'expired': val.data.order.status.status = "Expirado";
                        break;
                    }
    
                    /**
                     * Alter Date
                     */
                    var alterDate = val.data.order.alterDate.date;
    
                    alterDate = new Date(alterDate);
                    alterDate = alterDate.toLocaleDateString('pt-BR', {timeZone: 'UTC'});                    
          
                    /**
                     * Delivery Due Date Extra
                     */
                    var deliveryDueDateExtra = val.data.order.deliveryDueDate;

                    /**
                     * Convert Short Date to Long Date
                     */
                    var parts = deliveryDueDateExtra.split("/"),
                    date = new Date(+parts[2], parts[1]-1, +parts[0]);
                    
                    deliveryDueDateExtra = new Date(date.toString());
                 
                    /**
                     * Add Extra days
                     */
                    Date.prototype.addDays = function(days) {
                        var date = new Date(this.valueOf());
                        date.setDate(date.getDate() + days);
                        return date;
                    }
                    
                    var deliveryDueDateExtra =  deliveryDueDateExtra.addDays(3);
                    var deliveryDueDateExtra =  deliveryDueDateExtra.toLocaleDateString('pt-BR', {timeZone: 'UTC'});

                    /**
                     * Show HTML
                     */                                        
                    id1.innerHTML = "#" + val.data.order.id;
                    id2.innerHTML = alterDate;
                    id3.innerHTML = val.data.order.status.status;
                    id4.innerHTML = val.data.order.deliveryDueDate + " a " + deliveryDueDateExtra;

                });

                jQuery('.track-wraper').css('display', 'block');
                jQuery('#addLoader').removeClass('loader'); 

            }
          
        }
    });
    
}

//Submit
jQuery('form').on('submit', function(e){
    e.preventDefault();

    showTrackBack();
    jQuery('.track-wraper').css('display', 'none');
    jQuery('#orderId').removeClass('input-error');
    jQuery('#document').removeClass('input-error');
    jQuery('#addLoader').addClass('loader'); 

});
