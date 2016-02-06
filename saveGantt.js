var kintoneCommit={

this.app_id="",
this.records=[], // for uploading the diff to kintone

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
    /*
     We can upload only 100 records within one http request
     if records.length > 100 we have to sepeate it.
    */



},

function upload(){


 },

function update_tasks(records){


 }
};

function saveGanttOnServer(){





}
