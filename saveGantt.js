var kintoneCommit={

this.app_id="",
this.records=[], // for uploading the diff to kintone
this.task_lookup={};

set_app_id function(app_id){
 this.app_id = app_id;
 },

function compare(ori_task,task){
    var record={};
    // Gantt Row
    if (ori_task.gantt_row != task.gantt_row ) { 
      record.Gantt_row = { value : 1000*task.id + task.gantt_row};
    }
    // Dep 
    if (ori_task.depends != task.depends) {
      record.Dep = { value : task.depends};
    }

    // Level 
    if (ori_task.level != task.level) {
      record.Level = {value : task.level};
    }

    // Name 
    if (ori_task.name != task.name) {
      record.To_Do = {value : task.name};
    }

    // Date start
    if (setKintoneDate(ori_task.start) != setKintoneDate(task.start)) 
       { 
         record.From = {value : setKintoneDate(task.start)};
       }

    // Date end 
    if (setKintoneDate(ori_task.end) != setKintoneDate(task.end)) 
       { 
         record.To = {value : setKintoneDate(task.end)};
       }
    if (Object.keys(record).length > 0) {
      this.records.push({id:ori_task.id,record:record});

      if (this.records.length==99) {
        this.upload();
       }
    } 
},

    /*
     We can upload only 100 records within one http request
     if records.length > 100 we have to sepeate it.
    */
function upload(){
 var records_99 = $.extend(true,[],this.records);
 kintone.api('/k/v1/records','PUT',{app:this.app_id,records:records_99}, 
      function(resp){console.log(resp);this.update_tasks(records_99);}, 
      function(resp){console.error(resp)});
 },

function update_tasks(records){
// id's loop and key's loop 
// to update ge.ori_task
 if(records.length == 0 ) return;
 
 $.each(records,function(){
   
   if (this.hasOwnproperty("id")){
     
    $.each(this.record,function(key,value){}
    
   }
 
  });
 }
};

function saveGanttOnServer(){





}
