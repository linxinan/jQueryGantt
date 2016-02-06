/*
 * Gantt chart display of sample program
 * Copyright (c) 2015 Cybozu
 *
 * Licensed under the MIT License
 */
 
(function() {
 
    "use strict";
 
    // Record list of events.
 kintone.events.on('app.record.index.show', function(event) {
        //var records = event.records;
   var app_id = kintone.app.getId();
   kintone.api('/k/v1/records','GET',{"app": app_id, 
    "fields":["To_Do","From","To","Level","Dep","Progress","Gantt_row","Status","$id"],
    "query" : "limit 200",
    "totalCount":true},
    function(resp){ // build gantt object after we got the record data through ajax
        var records = resp.records;
        var data = [];
        // Don't display when there is no record.
        if (records.length === 0) {
            return;
        }
        var elSpace = kintone.app.getHeaderSpaceElement();
 
        // I will adjust the style depending on the version of the design
 
        // create an element of Gantt chart.
        var elGantt = document.getElementById("gantt");
        if (elGantt === null) {
            elGantt = document.createElement("div");
            elGantt.id = "gantt";
	    elGantt.innerHTML="<a class='js-open-modal button first big' href='#' data-modal-id='popup1'> Gantt Chart </a>";
            elSpace.appendChild(elGantt);
        }
        var modal01 = document.getElementById("popup1");
        if (modal01 === null) {
            modal01 = document.createElement("div");
	    modal01.id = 'popup1';
	    modal01.className = 'modal-box';
	}
 	
        var modal_body = document.getElementById("popup-body");
        if (modal_body === null) {
            modal_body = document.createElement("div");
	    modal_body.id = 'popup-body';
 	    modal01.appendChild(modal_body);
	}
        var modal_template = document.getElementById("gantEditorTemplates");
        if (modal_template === null) {
            modal_template = document.createElement("div");
	    modal_template.id = 'gantEditorTemplates';
	    $("#gantEditorTemplates").css("display","none");	
 	    elSpace.appendChild(modal_template);
	}
	
 
	$('a[data-modal-id]').click(function(e) {
		e.preventDefault();
        elSpace.appendChild(modal01);
	// should we append the modal in the click event callback?
    	$(".modal-overlay").fadeTo(500, 0.7);  // fadeTo function by jQuery
		var modalBox = $(this).attr('data-modal-id'); 
		// set modalBox the same attribution of 'data-modal-id', thus modalBox = popup1, the ID of modal dive.       
                //$("#popup1").append(records[0].From.value); // a sample of loading the kintone data
		if (document.getElementsByClassName("ganttButtonBar").length == 0){
    			loadGantt("popup-body",records);
   		}
		$('#'+modalBox).fadeIn($(this).data());

	   $(window).resize(function() {
      		$(".modal-box").css({
        		top: ($(window).height() - $(".modal-box").outerHeight()) / 2,
        		left: ($(window).width() - $(".modal-box").outerWidth()) / 2
      		});
   	   });
 
  	   $(window).resize();

	});

      },
      function(){alert("Failed to get Data");}
     ) 

    });
 
})();
