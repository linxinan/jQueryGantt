/*
 * Licensed under the MIT License
 */

function row2id(tasks,dep){
 dep=parseInt(dep);
 if (isNaN(dep) || dep+1 > tasks.length ) return null;
 
 console.log(dep,tasks[dep+1]);
 
 if (tasks[dep+1].hasOwnProperty(id)){
  return tasks[dep+1].id;}
} 

var kintoneCommit={
cache:[],
app_id:"",
records:[], // for uploading the diff to kintone

cache_reset:function(){this.cache=[]},
records_reset:function(){this.records=[]},
set_app_id: function(app_id){
 this.app_id = app_id;
 },

compare: function(ori_task,task){
    record={};
    temp={};
    // Gantt Row
    if (ori_task.gantt_row != task.gantt_row ) { 
      record.Gantt_row = { value : task.gantt_row};
      temp.gantt_row = task.gantt_row;
    }
    
    console.log(row2id(ge.ori.tasks,ori_task.depends),row2id(ge.tasks,task.depends));
    // Dep 
     // need another function here to transfer row # to record id 
    if (ori_task.depends != task.depends) {
      record.Dep = { value : task.depends};
      temp.depends= task.depends;
    }

    // Level 
    if (ori_task.level != task.level) {
      record.Level = {value : task.level};
      temp.level = task.level;
    }

    // Name 
    if (ori_task.name != task.name) {
      record.To_Do = {value : task.name};
      temp.name = task.name;
    }

    // Date start
    if (setKintoneDate(ori_task.start) != setKintoneDate(task.start)) 
       { 
         record.From = {value : setKintoneDate(task.start)};
         temp.start = task.start;
       }

    // Date end 
    if (setKintoneDate(ori_task.end) != setKintoneDate(task.end)) 
       { 
         record.To = {value : setKintoneDate(task.end)};
         temp.end = task.end;
       }
 
     // Status 
    if (ori_task.status != task.status) 
       { 
         record.Status = {value : status_k2g(false, task.status)};
         temp.status = task.status;
       }
 
    if (Object.keys(record).length > 0) {
      this.records.push({id:ori_task.id,record:record});
      this.cache.push({id:ori_task.id,record:temp});
//
// not only 99 but also consider if larger than 99
// divide it into some blocks
//
      if (this.records.length==99) {
        records_99 = $.extend(true,[],this.records);
   	commit.records_reset();
        cache_99 = $.extend(true,[],this.cache);
        this.cache_reset();
        this.upload(records_99,cache_99);
       }
    } 
},

    /*
     We can upload only 100 records within one http request
     if records.length > 100 we have to sepeate it.
    */
upload: function(records,cache){
 if(records.length == 0 ) return;
 document.getElementById("saveStatus").innerHTML = "Saving";
 saveStatus.push("saving");
 kintone.api('/k/v1/records','PUT',{app:this.app_id,records:records},   
      function(resp){ 
         console.log(resp);
         ge.ori.update_ori(cache);
         saveStatus.push("saved");
         savedCount=0;savingCount=0;
         for(var j=0;j<saveStatus.length;j++){
             if (saveStatus[j] == "saved") savedCount=savedCount+1;
             if (saveStatus[j] == "saving") savingCount=savingCount+1;
         }
         if (savedCount == savingCount ){
           time_str = new Date();  
           document.getElementById("saveStatus").innerHTML = "Saved at " + time_str.toLocaleString();
         }
      }, 

      function(resp){
          console.error(resp);
          delete cache;
          delete records;
          time_str = new Date();
          document.getElementById("saveStatus").innerHTML = "Failed at " + time_str.toLocaleString();
      });
 },


};
var saveToken = String(Math.floor( Math.random() * 1000 ));
var saveStatus=[];
function saveGanttOnServer(){
  saveStatus = [];
  if (!(saveToken === document.getElementById("saveToken").value) ){ 
   // reset the var saveToken
   saveToken = String(Math.floor( Math.random() * 10 ));
   saveToken = saveToken + String(Math.floor( Math.random() * 10 ));
   saveToken = saveToken + String(Math.floor( Math.random() * 10 ));
   saveMsg = "保存操作は管理者専用端末以外は禁止されます。管理端末であれば、次の３桁の乱数[" 
   saveMsg = saveMsg + saveToken + "]を入力し、Saveボタンを再度押してください。";
   alert(saveMsg);
   return;
 }

   commit = kintoneCommit;
   commit.set_app_id(kintone.app.getId());
   // just in case some data remained in the array
   commit.records_reset();
   commit.cache_reset();
   task_lookup = {};
   ori_task_lookup = {};
   for (var j=0;j<ge.tasks.length;j++){
       if (ge.tasks[j].gantt_row != j + 1)  { ge.tasks[j].gantt_row = j+1 ; }
       task_lookup[ge.tasks[j].id] = ge.tasks[j];
       ori_task_lookup[ge.ori.tasks[j].id] = ge.ori.tasks[j];
     }
   ge.ori.set_task_lookup(ori_task_lookup); // for update ge.ori after commit the records.
   
   for (var j=0;j<ge.ori.tasks.length;j++){
     if ( !task_lookup.hasOwnProperty(parseInt(ge.ori.tasks[j].id)) ) 
          {console.error("Can not save data from different APP"); } 
       task = task_lookup[parseInt(ge.ori.tasks[j].id)];
       commit.compare(ge.ori.tasks[j],task);
    }
   // commit the rest records 
  commit.upload(commit.records,commit.cache);
  commit.records_reset();
  commit.cache_reset();
  saveToken = String(Math.floor( Math.random() * 1000 ));
}
