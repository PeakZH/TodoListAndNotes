$(document).ready(function () {
  $("#popAddList").click(function () {
    MessageBoxExt.popup("addListForm", {
      title : "todolist添加",
      //zIndex : 20000,
      width: 500,
      buttons : [{
          text : '提交',
          click : function() {
            	addToDoList();
          }
        }, {
          text : '取消',
          click : function() {
            $(this).dialog("close");
          }
        }]
    });
  });//todo
  //
  $(".btn").filter(".btn-outline").filter(".btn-warning").filter(".btn-xs").click(function () {
	var namespace = 'yeepay.com';
	if(document.URL.indexOf('Person')>-1)
		namespace = 'person';
		
	 if($(this).attr('action')==='edit')
		 updateContent(namespace,$(this).attr('porpertyId'),$(this).attr('content'));
		  
	 if($(this).attr('action')==='done')
		 updateStatus(namespace,$(this).attr('porpertyId'));  
  });
});
function addToDoList () {
	if(!$("#content").val()){
	    MessageBoxExt.alert("请输入todolist内容！");
	    return;
	}
	var namespace = 'yeepay.com';
	if(document.URL.indexOf('Person')>-1)
		namespace = 'person';
	
	MessageBoxExt.confirm("确认添加todolist？", function() {
	  MessageBoxExt.ajax({
	    url : "/todolist/addToDoList",
	    type : "post",
	    style : "redirect",
	    data : {
	    	namespace:namespace,
	    	content : $("#content").val()
	    },
	    success : function (result) {
	      $(this).dialog("close");
	    }
	  });
	});
}
function updateStatus(namespace,id) {
	MessageBoxExt.confirm("确认修改todolist状态？", function() {
	  MessageBoxExt.ajax({
	    url : "/todolist/updateStatus",
	    type : "post",
	    style : "redirect",
	    data : {
	    	id : id,
	    	namespace:namespace
	    },
	    success : function (result) {
	      $(this).dialog("close");
	    }
	  });
	});
}
function updateContent(namespace,id,content) {
	$("input[name=id]").val(id);
	$("#content").val(content);
    MessageBoxExt.popup("addListForm", {
        title : "todolist修改",
        //zIndex : 20000,
        width: 500,
        buttons : [{
            text : '提交',
            click : function() {
              MessageBoxExt.confirm("确认修改todolist？", function() {
            	  MessageBoxExt.ajax({
            		    url : "/todolist/updateContent",
            		    type : "post",
            		    style : "redirect",
            		    data : {
            		    	id : id,
            		    	content:$("#content").val(),
            		    	namespace:namespace
            		    },
            		    success : function (result) {
            		      $(this).dialog("close");
            		    }
            		  });
              });
            }
          }, {
            text : '取消',
            click : function() {
              $(this).dialog("close");
            }
          }]
      });
}