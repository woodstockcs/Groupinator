var ruleList_final = [];
var ruleList_raw = [];
var baseurl = 'http://rms.tomtomgroup.com/';
var skiplist = [];
var teacherList=[];
var allClasses = [];
var url = window.location.href;
    var captured = /teacher=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
    var result = captured ? captured :'my Default Value' ;
    var Teachers= ["Poublon", "Bremel", "Vonada", "Smith", "Gulian"];
    var inList= false ;
    for (var i = 0; i < Teachers.length; i++){
      // console.log("Teacher: "+captured);
      // console.log(Teachers[i]);
      if (Teachers[i]==captured){
        console.log("Teacher: "+captured);
        inList =true;
        break;
      }
}
if (!inList){
        console.log("Teacher is not in List");

}




$.get('Classdata.txt', function(data) {
   processData(data);
}, 'text');

function findTeacher(classList,teacherName){
 var teacherList=[];
 for(var i=0; i<classList.length; i++){
   if(classList[i][0]==teacherName){
     teacherList[teacherList.length]=classList[i];
   }
 }
 return teacherList;

}

function findBlock(sortedClassList,block){

  for(var i=0; i<sortedClassList.length; i++){
    if(sortedClassList[i][1]==block){
      return sortedClassList[i];
    }
  }
}



function processData(textFile){

  var allTextLines = textFile.split(/\r\n|\n/);



 for (var i = 0; i <allTextLines.length-1 ; i++) {
   var entries = allTextLines[i].split(', ');

      allClasses[allClasses.length]=[entries[0],entries[1],entries.slice(2,entries.length)];


}

teacherList=(findTeacher(allClasses, captured));


}


var theGroupSize = 1;
var workingClass=[];
$(document).ready(function() {
         $("#titleText").text(captured+ " Randomizer");
      $('#blockSelector').on('change', function() {

        // populate textarea with premade student lists
        switch (this.value) {

            case "a":
                var workingClass= findBlock(teacherList,"A");
                break;
            case "b":
                var workingClass= findBlock(teacherList,"B");
                break;
            case "c":
                 var workingClass= findBlock(teacherList,"C");
                break;
            case "d":
                 var workingClass= findBlock(teacherList,"D");
              break;
            case "e":
                 var workingClass= findBlock(teacherList,"E");
              break;
            case "f":
                   var workingClass= findBlock(teacherList,"F");
              break;
            case "g":
               var workingClass= findBlock(teacherList,"G");
              break;
            case "h":
                var workingClass= findBlock(teacherList,"H");
                break;
        }

        console.log(workingClass);


       var workingClass2= workingClass.slice(2,(workingClass.length));
       console.log(workingClass2);
       $("#allStudents").text(workingClass2.toString());
       })
      $('#sizeSelector').on('change', function() {


        // grab group size
        switch (this.value) {
            case "2":
              theGroupSize = 2;
              break;
            case "3":
              theGroupSize = 3;
              break;
            case "4":
              theGroupSize = 4;
              break;
            case "5":
              theGroupSize = 5;
              break;
        }

      })


        createGroups();
        //  printRules();
        $("#csv_filename").val('degradation_export.csv');
        $("search").val('');
        $(window).resize(function() {
            repositionBody()
        });
        $(window).load(function() {
            repositionBody()
        });
    }
);




function createGroups() {

    // get student list from textarea
    var rClass = $('#allStudents').val().split(',');

    // create random number array
    var rNums = [];
    for (var i = 0; i < rClass.length; i++) {
        rNums[i] = Math.random();
    }
    console.log(rNums);

    // sort the student list with numbers array
    var temp1, temp2;
    for (var i = 0; i < rClass.length; i++) {
        for (var j = 0; j < rClass.length; j++) {
            if (rNums[i] > rNums[j]) {
                temp1 = rNums[j];
                rNums[j] = rNums[i];
                rNums[i] = temp1;
                temp2 = rClass[j];
                rClass[j] = rClass[i];
                rClass[i] = temp2;
            }
        }
    }

    // figure out the vital stats
    var theStudentCount = rClass.length;
    var theGroupCount = Math.floor(theStudentCount / theGroupSize) + 1;
    var maxGroupSize = theGroupSize + 1;
    console.log("students: " + theStudentCount);
    console.log("desired group size: " + theGroupSize);
    console.log("max group size: " + maxGroupSize);
    console.log("group count: " + theGroupCount);

    // create empty groups of max size
    var theGroups = new Array(theGroupCount);
    for (var i = 0; i < theGroupCount; i++) {
        theGroups[i] = new Array(maxGroupSize);
    }
    console.log(theGroups);
    // the students can be distributed evenly
    if (theStudentCount % theGroupSize == 0) {
        console.log("***easy mode***")
        for (var j = 0; j < theGroupCount; j++) {
            for (var k = 0; k < theGroupSize; k++) {
                theGroups[j][k] = rClass[j * theGroupSize + k];
            }
        }
    }
    // not sure what's going on
    else if (theStudentCount % theGroupSize > theStudentCount / theGroupSize) {
        alert("OH NO - Select a smaller group size - RIP");
    }
    // uneven distribution
    else {
      console.log("***spillover mode***")
      for (var i = 0; i < theStudentCount; i++) {
              theGroups[i % theGroupCount][Math.floor(i / theGroupCount)] = rClass[i];

      }
      console.log(theGroups);
      // for (var k = 0; k < theGroupSize; k++) {
      //     for (var j = 0; j < theGroupCount; j++) {
      //         theGroups[j][k] = rClass[j * theGroupSize + k];
      //     }
      //
      // }
              // console.log("***spillover mode***")
        // for (var j = 0; j < (theStudentCount / theGroupSize); j++) {
        //     for (var k = 0; k < theGroupSize; k++) {
        //         theGroups[j][k] = rClass[j * theGroupSize + k];
        //     }
        //
        // }
    }
    console.log(theGroups);



  var t = $('#ruleTable').DataTable({
    paging: false,
    ordering: false,
    autoWidth: false,
    retrieve: true,
    language: {
        "info": "Showing _TOTAL_ rules",
        "infoFiltered": "(filtered from full set of _MAX_ rules)",
        "emptyTable": " "
    },
    order: [
        [0, "asc"]
    ],
    dom: 'lrtp'
});

t.clear();
$.each(theGroups, function(index, item) {
    console.log('rule:', item);
    if (item[0])
    {
    t.row.add([
        index + 1,
        stringify(item)
    ]);
  }
})
t.draw();
}


function stringify(lst) {
    var cleaned = new Array();
    for (var i = 0; i < lst.length; i++) {
        if (lst[i]) {
            cleaned.push(lst[i]);
        }
    }

    var s = "";
    for (var i = 0; i < cleaned.length - 1; i++) {
        var name = cleaned[i];
        s += cleaned[i].trim() + ", ";
    }
    s += cleaned[cleaned.length - 1];
    return s;
}


function repositionBody() {
    $('body').css('padding-top', parseInt($('#main-navbar').css("height")) + 10);
}


function displayFailure() {
    alert("There's a problem. Please send an email to andrewsmith@wcsu.net");
}
