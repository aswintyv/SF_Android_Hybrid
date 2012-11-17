//Sample code for Hybrid REST Explorer

function regLinkClickHandlers() {
    var $j = jQuery.noConflict();
    var logToConsole = cordova.require("salesforce/util/logger").logToConsole;
    
    $j('#link_get_first_account').click(function() {
    	//logToConsole("link_fetch_sfdc_contacts clicked");
    	//forcetkClient.query("SELECT Name FROM Contact", onSuccessSfdcContacts, onErrorSfdc); 
    	getFirstRecord('Account');
    });
	$j('#link_create_contact').click(function() {
	                                     //logToConsole("link_fetch_sfdc_contacts clicked");
	                                     //forcetkClient.query("SELECT Name FROM Contact", onSuccessSfdcContacts, onErrorSfdc); 
		$j("#div_output").html("");
		var formstring = '<form action="form.php" method="post"> \
			<label for="firstName">First Name</label>\
			<input type="text" name="firstName" id="firstName" data-mini="true" />\
			<label for="lastName">Last Name</label>\
			<input type="text" name="lastName" id="lastName" data-mini="true" />\
			<label for="email">Email</label>\
			<input type="text" name="email" id="email" data-mini="true" />\
            <p><a href="#" id="createContact" data-role="button" data-inline="true">Create Contact !</a></p>	\
			\
						</form>';
		$j("#div_output").html(formstring);
		
	});
	$j('#saveChange').click(function(){
		//function(objtype, id, fields, callback, error) 
		var valObj = {};
		//{""+$j('#fieldId').val()+"" : $j('#fieldValue').val()}
		valObj[$j('#fieldId').val()] = $j('#fieldValue').val();
		forcetkClient.update(
				$j('#objectType').val(),
				$j('#objectId').val(),  
				valObj, 
				getFirstRecord($j('#objectType').val()), 
				function(){} 
		);
	});
    $j('#createContact').live('click',function(){
    	//function(objtype, id, fields, callback, error) 
    	var valObj = {};
    	//{""+$j('#fieldId').val()+"" : $j('#fieldValue').val()}
    	valObj['firstName'] = $j('#firstName').val();
    	valObj['lastName'] = $j('#lastName').val();
    	valObj['email'] = $j('#email').val();
    	
    	forcetkClient.create(
    			'Contact',
    			valObj, 
    			function(data){
    				$j("#div_output").html('Contact Created with Id: '+data['id']);	
    			}, 
    			function(){} 
    			);
    });
    $j('.editField').live('click', function(){
    	$j('#fieldId').val($j(this).attr('id'));
    	
    });
                           
    $j('#link_logout').click(function() {
             logToConsole("link_logout clicked");
             var sfOAuthPlugin = cordova.require("salesforce/plugin/oauth");
             sfOAuthPlugin.logout();
             });
}

function getFirstRecord(sObject){
	forcetkClient.describe(sObject, 
		function(data){
			cordova.require("salesforce/util/logger").logToConsole(data);
			var fields = data["fields"];
			var querystring = "";
			cordova.require("salesforce/util/logger").logToConsole(fields.length);
			for(var i = 0; i< fields.length; i++){
				querystring += fields[i]["name"]+ ' ,';
				if(i == 0){
					for(var key in fields[i]){
						logToConsole(key);
					}
				}
			}
			
			querystring = querystring.substring(0,querystring.length - 1);
			logToConsole(querystring);
			forcetkClient.query("SELECT "+querystring+" FROM Account limit 1", function(data){
				$j("#div_output").html("").append("<table>").append("<tr><th>Key</th><th>Value</th></tr>");
			    var op = data['records'][0];
			    curr_record = op;
			    $j('#objectId').val(op['Id']);
		    	$j('#objectType').val(sObject);
					for(var key in op){
						if(key == 'Phone'){
					    	op[key] = '<a href="tel:'+op[key]+'">'+op[key]+'</a> ';
					    }
						if(key == 'Email__c'){
					    	op[key] = ' <a href="mailto:'+op[key]+'">'+op[key]+'</a> ';
					    }
						var edit = ' (<a href ="#editPopup" data-rel="popup" class="editField" id="'+key+'">edit</a>) ';
						$j("#div_output").append("<tr><td>"+key+"</td><td>"+op[key]+edit+"</td></tr>");
					}
				}, function(data){
					logToConsole("bonke !");
				}
			); 
            
		}, 
		function(data){cordova.require("salesforce/util/logger").logToConsole(data)});
}


function onErrorDevice(error) {
    cordova.require("salesforce/util/logger").logToConsole("onErrorDevice: " + JSON.stringify(error) );
    alert('Error getting device contacts!');
}
