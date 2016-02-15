/*
 Copyright (c) 2012-2014 Open Lab
 Written by Roberto Bicchierai and Silvia Chelazzi http://roberto.open-lab.com
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var task_item={
set_id:function(id){this.id=parseInt(id);},
set_name:function(name){this.name=String(name); },
set_code:function(code){this.code=code;},
set_level:function(level){this.level=parseInt(level);},
set_status:function(status_){this.status=status_;},
set_canWrite:function(canWrite){this.canWrite=canWrite;},
set_start:function(start){this.start=start;},
set_duration:function(duration){this.duration=duration;},
set_end:function(end){this.end=end;},
set_startIsMilestone:function(startIsMilestone){this.startIsMilestone=startIsMilestone;},
set_endIsMilestone:function(endIsMilestone){this.endIsMilestone=endIsMilestone;},
set_collapsed:function(collapsed){this.collapsed=collapsed},
set_assigs:function(assigs){this.assigs=assigs;},
set_hasChild:function(hasChild){this.hasChild=hasChild;},
set_depends:function(depends){this.depends=String(depends);},
set_progress:function(progress){this.progress=parseInt(progress);},
set_gantt_row:function(gantt_row){this.gantt_row=parseInt(gantt_row)-1000*this.id;},
};

function new_item(){}
new_item.prototype = task_item;

function data_sort_gantt_row(a,b) {
if (parseInt(a.gantt_row) > parseInt(b.gantt_row)) {return 1} ;  if (parseInt(a.gantt_row) <= parseInt(b.gantt_row)) {return -1};
};

function data_sort_id(a,b) {
if (parseInt(a.id) > parseInt(b.id)) {return 1} ;  if (parseInt(a.id) <= parseInt(b.id)) {return -1};
};


function loadGanttFromServer(records, callback) {

  //this is a simulation: load data from the local storage if you have already played with the demo or a textarea with starting demo data
  var ret={
  selectedRow:0,
  canWrite:true,
  canWriteOnParent:true,
  tasks:[]
  };
  for(i=0;i<records.length;i++){
    new_task_item = new new_item() ;
    new_task_item.set_id(records[i].$id.value);
    new_task_item.set_name(records[i].To_Do.value);
    var someDate = new Date(records[i].From.value);
    startDate = someDate.getTime();
    new_task_item.set_start(startDate);
    someDate = new Date(records[i].To.value);
    endDate = someDate.getTime();
    new_task_item.set_end(endDate);
    new_task_item.set_duration(recomputeDuration(startDate,endDate));
    new_task_item.set_hasChild(true);
    new_task_item.set_canWrite(true);
    new_task_item.set_collapsed(false);
    new_task_item.set_level(records[i].Level.value);
    new_task_item.set_depends(records[i].Dep.value);
    new_task_item.set_progress(records[i].Progress.value);
    new_task_item.set_gantt_row(records[i].Gantt_row.value);
   switch (records[i].Status.value){

	case "緊急":new_task_item.set_status("STATUS_EMER");break;
	case "ペンディング":new_task_item.set_status("STATUS_SUSPENDED");break;
	case "進行中":new_task_item.set_status("STATUS_ACTIVE");break;
	case "完了":new_task_item.set_status("STATUS_DONE");break;
	case "失敗":new_task_item.set_status("STATUS_FAILED");break;
        default:new_task_item.set_status("STATUS_UNDEFINED");break;

    };
    ret.tasks.push(new_task_item);
  }
  ret.tasks.sort(data_sort_gantt_row);
  if (!ret || !ret.tasks || ret.tasks.length == 0){
    //ret = JSON.parse();
  }
  ge.loadProject(ret);
  ge.checkpoint(); //empty the undo stack
  ge.ori={tasks:ret.tasks,
          task_lookup:{},
          set_task_lookup:function(lookup_table){
            ge.ori.task_lookup=lookup_table},
          update_ori:function(cache){
            if(cache.length == 0 ) return;
            for (j=0;j<cache.length;j++){
              if (cache[j].hasOwnProperty("id")){
                var this_id = parseInt(cache[j].id);
                $.each(cache[j].record,function(key,value){ ge.ori.task_lookup[this_id][key]=value});
              }
             };

          }


  };
     
}






function setKintoneDate(ganttDate){

var someDate = new Date(ganttDate);

return String( someDate.getFullYear() + "-" + String(someDate.getMonth()+1) + "-" + someDate.getDate()  );

}

//-------------------------------------------  Create some demo data ------------------------------------------------------
function setRoles() {
  ge.roles = [
    {
      id:"tmp_1",
      name:"Project Manager"
    },
    {
      id:"tmp_2",
      name:"Worker"
    },
    {
      id:"tmp_3",
      name:"Stakeholder/Customer"
    }
  ];
}

function setResource() {
  var res = [];
  for (var i = 1; i <= 10; i++) {
    res.push({id:"tmp_" + i,name:"Resource " + i});
  }
  ge.resources = res;
}


function editResources(){

}

function clearGantt() {
  ge.reset();
}

function loadI18n() {
  GanttMaster.messages = {
    "CANNOT_WRITE":                  "CANNOT_WRITE",
    "CHANGE_OUT_OF_SCOPE":"NO_RIGHTS_FOR_UPDATE_PARENTS_OUT_OF_EDITOR_SCOPE",
    "START_IS_MILESTONE":"START_IS_MILESTONE",
    "END_IS_MILESTONE":"END_IS_MILESTONE",
    "TASK_HAS_CONSTRAINTS":"TASK_HAS_CONSTRAINTS",
    "GANTT_ERROR_DEPENDS_ON_OPEN_TASK":"GANTT_ERROR_DEPENDS_ON_OPEN_TASK",
    "GANTT_ERROR_DESCENDANT_OF_CLOSED_TASK":"GANTT_ERROR_DESCENDANT_OF_CLOSED_TASK",
    "TASK_HAS_EXTERNAL_DEPS":"TASK_HAS_EXTERNAL_DEPS",
    "GANTT_ERROR_LOADING_DATA_TASK_REMOVED":"GANTT_ERROR_LOADING_DATA_TASK_REMOVED",
    "ERROR_SETTING_DATES":"ERROR_SETTING_DATES",
    "CIRCULAR_REFERENCE":"CIRCULAR_REFERENCE",
    "CANNOT_DEPENDS_ON_ANCESTORS":"CANNOT_DEPENDS_ON_ANCESTORS",
    "CANNOT_DEPENDS_ON_DESCENDANTS":"CANNOT_DEPENDS_ON_DESCENDANTS",
    "INVALID_DATE_FORMAT":"INVALID_DATE_FORMAT",
    "TASK_MOVE_INCONSISTENT_LEVEL":"TASK_MOVE_INCONSISTENT_LEVEL",

    "GANTT_QUARTER_SHORT":"trim.",
    "GANTT_SEMESTER_SHORT":"sem."
  };
}



//-------------------------------------------  Get project file as JSON (used for migrate project from gantt to Teamwork) ------------------------------------------------------
function getFile() {
  $("#gimBaPrj").val(JSON.stringify(ge.saveProject()));
  $("#gimmeBack").submit();
  $("#gimBaPrj").val("");

  /*  var uriContent = "data:text/html;charset=utf-8," + encodeURIComponent(JSON.stringify(prj));
   neww=window.open(uriContent,"dl");*/
}


//-------------------------------------------  LOCAL STORAGE MANAGEMENT (for this demo only) ------------------------------------------------------
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
};


Storage.prototype.getObject = function(key) {
  return this.getItem(key) && JSON.parse(this.getItem(key));
};


function saveInLocalStorage() {
  var prj = ge.saveProject();
  if (localStorage) {
    localStorage.setObject("teamworkGantDemo", prj);
  } else {
    $("#ta").val(JSON.stringify(prj));
  }
}


//-------------------------------------------  Open a black popup for managing resources. This is only an axample of implementation (usually resources come from server) ------------------------------------------------------

function editResources(){

  //make resource editor
  var resourceEditor = $.JST.createFromTemplate({}, "RESOURCE_EDITOR");
  var resTbl=resourceEditor.find("#resourcesTable");

  for (var i=0;i<ge.resources.length;i++){
    var res=ge.resources[i];
    resTbl.append($.JST.createFromTemplate(res, "RESOURCE_ROW"))
  }


  //bind add resource
  resourceEditor.find("#addResource").click(function(){
    resTbl.append($.JST.createFromTemplate({id:"new",name:"resource"}, "RESOURCE_ROW"))
  });

  //bind save event
  resourceEditor.find("#resSaveButton").click(function(){
    var newRes=[];
    //find for deleted res
    for (var i=0;i<ge.resources.length;i++){
      var res=ge.resources[i];
      var row = resourceEditor.find("[resId="+res.id+"]");
      if (row.size()>0){
        //if still there save it
        var name = row.find("input[name]").val();
        if (name && name!="")
          res.name=name;
        newRes.push(res);
      } else {
        //remove assignments
        for (var j=0;j<ge.tasks.length;j++){
          var task=ge.tasks[j];
          var newAss=[];
          for (var k=0;k<task.assigs.length;k++){
            var ass=task.assigs[k];
            if (ass.resourceId!=res.id)
              newAss.push(ass);
          }
          task.assigs=newAss;
        }
      }
    }

    //loop on new rows
    resourceEditor.find("[resId=new]").each(function(){
      var row = $(this);
      var name = row.find("input[name]").val();
      if (name && name!="")
        newRes.push (new Resource("tmp_"+new Date().getTime(),name));
    });

    ge.resources=newRes;

    closeBlackPopup();
    ge.redraw();
  });


  var ndo = createBlackPage(400, 500).append(resourceEditor);
}

function closeModal() {
      $(".modal-box, .modal-overlay").fadeOut(500, function() {
         $(".modal-overlay").remove();
      });
}

//
// Use js to append the below DIV:w
//
//
// we need object here
//
function preload(){

var div_gantbuttons = document.createElement("div");
div_gantbuttons.className = "__template__";
div_gantbuttons.setAttribute("type","GANTBUTTONS");
//<div class="__template__" type="GANTBUTTONS">
div_gantbuttons.innerHTML='<!-- <div class="ganttButtonBar "> <h1 style="float:left">Gantt Chart</h1> <div class="buttons"> <button onclick="$(\'#popup-body\').trigger(\'undo.gantt\');" class="button textual" title="undo"><span class="teamworkIcon">&#8634</span></button> <button onclick="$(\'#popup-body\').trigger(\'redo.gantt\');" class="button textual" title="redo"><span class="teamworkIcon">&#8635</span></button> <span class="ganttButtonSeparator"></span>  <button onclick="$(\'#popup-body\').trigger(\'addAboveCurrentTask.gantt\');" class="button textual" title="insert above"><span class="teamworkIcon">&#8625</span></button> <button onclick="$(\'#popup-body\').trigger(\'addBelowCurrentTask.gantt\');" class="button textual" title="insert below"><span class="teamworkIcon">&#8626</span></button> <span class="ganttButtonSeparator"></span><button onclick="$(\'#popup-body\').trigger(\'indentCurrentTask.gantt\');" class="button textual" title="indent task"><span class="teamworkIcon">&#8614</span></button> <button onclick="$(\'#popup-body\').trigger(\'outdentCurrentTask.gantt\');" class="button textual" title="unindent task"><span class="teamworkIcon">&#8612</span></button> <span class="ganttButtonSeparator"></span> <button onclick="$(\'#popup-body\').trigger(\'moveUpCurrentTask.gantt\');" class="button textual" title="move up"><span class="teamworkIcon">&#8657</span></button> <button onclick="$(\'#popup-body\').trigger(\'moveDownCurrentTask.gantt\');" class="button textual" title="move down"><span class="teamworkIcon">&#8659</span></button> <span class="ganttButtonSeparator"></span> <button onclick="$(\'#popup-body\').trigger(\'zoomMinus.gantt\');" class="button textual" title="zoom out"><span class="teamworkIcon">&#8854</span></button> <button onclick="$(\'#popup-body\').trigger(\'zoomPlus.gantt\');" class="button textual" title="zoom in"><span class="teamworkIcon">&#8853</span></button> <span class="ganttButtonSeparator"></span> <button onclick="ge.gantt.showCriticalPath=!ge.gantt.showCriticalPath; ge.redraw();" class="button textual" title="Critical Path"><span class="teamworkIcon">&#8623</span></button> <span class="ganttButtonSeparator"></span> &nbsp; &nbsp; &nbsp; &nbsp; <input type="number" id="saveToken" style="width:4em"> <button onclick="saveGanttOnServer();" class="button first big" title="save">save</button><button onclick="closeModal();" class="button first big" title="close">close</button> <span id="saveStatus"></span> </div></div> -->';
 
$("#gantEditorTemplates").append(div_gantbuttons);

var div_taskedithead = document.createElement("div");
div_taskedithead.className = "__template__";
div_taskedithead.setAttribute("type","TASKSEDITHEAD");
div_taskedithead.innerHTML='<!-- <table class="gdfTable" cellspacing="0" cellpadding="0"> <thead> <tr style="height:40px"> <th class="gdfColHeader" style="width:35px;"></th> <th class="gdfColHeader" style="width:25px;"></th> <th class="gdfColHeader gdfResizable" style="width:30px;">code/short name</th> <th class="gdfColHeader gdfResizable" style="width:300px;">name</th> <th class="gdfColHeader gdfResizable" style="width:80px;">start</th> <th class="gdfColHeader gdfResizable" style="width:80px;">end</th> <th class="gdfColHeader gdfResizable" style="width:50px;">dur.</th> <th class="gdfColHeader gdfResizable" style="width:50px;">dep.</th> <th class="gdfColHeader gdfResizable" style="width:200px;">assignees</th> </tr> </thead> </table> -->';
$("#gantEditorTemplates").append(div_taskedithead);


//  <div class="__template__" type="TASKROW">
var div_taskrow = document.createElement("div");
div_taskrow.className = "__template__";
div_taskrow.setAttribute("type","TASKROW");
div_taskrow.innerHTML='<!-- <tr taskId="(#=obj.id#)" class="taskEditRow" level="(#=level#)"> <th class="gdfCell edit" align="right" style="cursor:pointer;"><span class="taskRowIndex">(#=obj.getRow()+1#)</span> <span class="teamworkIcon" style="font-size:12px;" >&#10000</span></th> <td class="gdfCell noClip" align="center"><div class="taskStatus cvcColorSquare" status="(#=obj.status#)"></div></td> <td class="gdfCell"><input type="text" name="code" value="(#=obj.code?obj.code:\'\'#)"></td> <td class="gdfCell indentCell" style="padding-left:(#=obj.level*10#)px;"> <div class="(#=obj.isParent()?\'exp-controller expcoll exp\':\'exp-controller\'#)" align="center"></div> <input type="text" name="name" value="(#=obj.name#)"> </td> <td class="gdfCell"><input type="text" name="start"  value="" class="date"></td> <td class="gdfCell"><input type="text" name="end" value="" class="date"></td> <td class="gdfCell"><input type="text" name="duration" value="(#=obj.duration#)"></td> <td class="gdfCell"><input type="text" name="depends" value="(#=obj.depends#)" (#=obj.hasExternalDep?"readonly":""#)></td> <td class="gdfCell taskAssigs">(#=obj.getAssigsString()#)</td> </tr> -->';
$("#gantEditorTemplates").append(div_taskrow);

//<div class="__template__" type="TASKEMPTYROW">
var div_taskemptyrow = document.createElement("div");
div_taskemptyrow.className = "__template__";
div_taskemptyrow.setAttribute("type","TASKEMPTYROW");
div_taskemptyrow.innerHTML= '<!-- <tr class="taskEditRow emptyRow" > <th class="gdfCell" align="right"></th> <td class="gdfCell noClip" align="center"></td> <td class="gdfCell"></td> <td class="gdfCell"></td> <td class="gdfCell"></td> <td class="gdfCell"></td> <td class="gdfCell"></td> <td class="gdfCell"></td> <td class="gdfCell"></td> </tr> -->';
// do not append empty rows now
$("#gantEditorTemplates").append(div_taskemptyrow);


  //<div class="__template__" type="TASKBAR">
var div_taskbar = document.createElement("div");
div_taskbar.className = "__template__";
div_taskbar.setAttribute("type","TASKBAR");
div_taskbar.innerHTML='<!-- <div class="taskBox taskBoxDiv" taskId="(#=obj.id#)" > <div class="layout (#=obj.hasExternalDep?\'extDep\':\'\'#)"> <div class="taskStatus" status="(#=obj.status#)"></div> <div class="taskProgress" style="width:(#=obj.progress>100?100:obj.progress#)%; background-color:(#=obj.progress>100?\'red\':\'rgb(153,255,51);\'#);"></div> <div class="milestone (#=obj.startIsMilestone?\'active\':\'\'#)" ></div> <div class="taskLabel"></div> <div class="milestone end (#=obj.endIsMilestone?\'active\':\'\'#)" ></div> </div> </div> -->';
$("#gantEditorTemplates").append(div_taskbar);



  //<div class="__template__" type="CHANGE_STATUS">
var div_chstatus = document.createElement("div");
div_chstatus.className = "__template__";
div_chstatus.setAttribute("type","CHANGE_STATUS");
div_chstatus.innerHTML=' <!-- <div class="taskStatusBox"> <div class="taskStatus cvcColorSquare" status="STATUS_ACTIVE" title="active"></div> <div class="taskStatus cvcColorSquare" status="STATUS_EMER" title="emergency"></div> <div class="taskStatus cvcColorSquare" status="STATUS_DONE" title="completed"></div> <div class="taskStatus cvcColorSquare" status="STATUS_FAILED" title="failed"></div> <div class="taskStatus cvcColorSquare" status="STATUS_SUSPENDED" title="suspended"></div> <div class="taskStatus cvcColorSquare" status="STATUS_UNDEFINED" title="undefined"></div> </div> --></div>';
$("#gantEditorTemplates").append(div_chstatus);


//  <div class="__template__" type="TASK_EDITOR">
var div_taskeditor = document.createElement("div");
div_taskeditor.className = "__template__";
div_taskeditor.setAttribute("type","TASK_EDITOR");
div_taskeditor.innerHTML= '<!-- <div class="ganttTaskEditor"> <table width="100%"> <tr> <td> <table cellpadding="5"> <tr> <td><label for="code">code/short name</label><br><input type="text" name="code" id="code" value="" class="formElements"></td> </tr><tr> <td><label for="name">name</label><br><input type="text" name="name" id="name" value=""  size="35" class="formElements"></td> </tr> <tr></tr> <td> <label for="description">description</label><br> <textarea rows="5" cols="30" id="description" name="description" class="formElements"></textarea> </td> </tr> </table> </td> <td valign="top"> <table cellpadding="5"> <tr> <td colspan="2"><label for="status">status</label><br><div id="status" class="taskStatus" status=""></div></td> <tr> <td colspan="2"><label for="progress">progress</label><br><input type="text" name="progress" id="progress" value="" size="3" class="formElements"></td> </tr> <tr> <td><label for="start">start</label><br><input type="text" name="start" id="start"  value="" class="date" size="10" class="formElements"><input type="checkbox" id="startIsMilestone"> </td> <td rowspan="2" class="graph" style="padding-left:50px"><label for="duration">dur.</label><br><input type="text" name="duration" id="duration" value=""  size="5" class="formElements"></td> </tr><tr> <td><label for="end">end</label><br><input type="text" name="end" id="end" value="" class="date"  size="10" class="formElements"><input type="checkbox" id="endIsMilestone"></td> </table> </td> </tr> </table> <h2>assignments</h2> <table  cellspacing="1" cellpadding="0" width="100%" id="assigsTable"> <tr> <th style="width:100px;">name</th> <th style="width:70px;">role</th> <th style="width:30px;">est.wklg.</th> <th style="width:30px;" id="addAssig"><span class="teamworkIcon" style="cursor: pointer">+</span></th> </tr> </table> <div style="text-align: right; padding-top: 20px"><button id="saveButton" class="button big">save</button></div> </div> -->';
$("#gantEditorTemplates").append(div_taskeditor);

//  <div class="__template__" type="ASSIGNMENT_ROW">
var div_assignrow = document.createElement("div");
div_assignrow.className = "__template__";
div_assignrow.setAttribute("type","ASSIGNMENT_ROW");
div_assignrow.innerHTML=' <!-- <tr taskId="(#=obj.task.id#)" assigId="(#=obj.assig.id#)" class="assigEditRow" > <td ><select name="resourceId"  class="formElements" (#=obj.assig.id.indexOf("tmp_")==0?"":"disabled"#) ></select></td> <td ><select type="select" name="roleId"  class="formElements"></select></td> <td ><input type="text" name="effort" value="(#=getMillisInHoursMinutes(obj.assig.effort)#)" size="5" class="formElements"></td> <td align="center"><span class="teamworkIcon delAssig" style="cursor: pointer">d</span></td> </tr> -->';
$("#gantEditorTemplates").append(div_assignrow);


//  <div class="__template__" type="RESOURCE_EDITOR">
var div_resourceed = document.createElement("div");
div_resourceed.className = "__template__";
div_resourceed.setAttribute("type","RESOURCE_EDITOR");
div_resourceed.innerHTML=' <!-- <div class="resourceEditor" style="padding: 5px;"> <h2>Project team</h2> <table  cellspacing="1" cellpadding="0" width="100%" id="resourcesTable"> <tr> <th style="width:100px;">name</th> <th style="width:30px;" id="addResource"><span class="teamworkIcon" style="cursor: pointer">+</span></th> </tr> </table> <div style="text-align: right; padding-top: 20px"><button id="resSaveButton" class="button big">save</button></div> </div> -->';
$("#gantEditorTemplates").append(div_resourceed);



  //<div class="__template__" type="RESOURCE_ROW">
var div_resourcerow = document.createElement("div");
div_resourcerow.className = "__template__";
div_resourcerow.setAttribute("type","RESOURCE_ROW");
div_resourcerow.innerHTML=' <!-- <tr resId="(#=obj.id#)" class="resRow" > <td ><input type="text" name="name" value="(#=obj.name#)" style="width:100%;" class="formElements"></td> <td align="center"><span class="teamworkIcon delRes" style="cursor: pointer">d</span></td> </tr> -->';
$("#gantEditorTemplates").append(div_resourcerow);
}


function loadGantt(divID,records) {
  
  ge = new GanttMaster();
  var workSpace = $("#"+ divID);
  //workSpace.css({width:$(window).width() - 20,height:$(window).height() - 100});
  workSpace.css({width:'100%',height:'100%'});
  preload();
  ge.init(workSpace);
  loadI18n();
  loadGanttFromServer(records);
  if (!ge.roles || ge.roles.length == 0) {
   	setRoles();
}
  if (!ge.resources || ge.resources.length == 0) {
 	setResource();
}
$(window).resize(function(){
	workSpace.css({width:'100%',height:'100%'});
    	workSpace.trigger("resize.gantt");
 }).oneTime(150,"resize",function(){$(this).trigger("resize")});
};
