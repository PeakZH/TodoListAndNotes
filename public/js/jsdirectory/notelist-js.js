$(document).ready(function () {
    DatePickerExt.date("date",{"maxDate":0});
    DatePickerExt.date("dateStart",{"maxDate":0});
    DatePickerExt.date("dateEnd",{"maxDate":0});
  $("#popAddList").click(function () {
	$("#spanDate").show();
	//$("#id").val("");
	$("#content").val("");
	$("#title").val("");
	
	$("#date").val("");
	$("#namespace").val("");
	 
	$("#category").val("");
	$("#topflag").val(0);
	
    MessageBoxExt.popup("addListForm", {
      title : "note添加",
      //zIndex : 20000,
      width: 1000,
      height: "auto",
      buttons : [{
          text : '提交',
          click : function() {
            addNoteList();
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
	 if($(this).attr('action')==='edit')
		 updateContent($(this).attr('porpertyId'),
				 $(this).attr('content'),
				 $(this).attr('title'),
				 $(this).attr('namespace'),
				 $(this).attr('category'),
				 $(this).attr('topflag')
		 );
		  
	 if($(this).attr('action')==='view')
		 viewContent($(this).attr('porpertyId'));  
  });
});
function addNoteList () {
	if(!$("#content").val()){
	    MessageBoxExt.alert("请输入NoteList内容！");
	    return;
	}
	if(!$("#date").val()){
	    MessageBoxExt.alert("请输入note日期！");
	    return;
	}
	if(!$("#title").val()){
	    MessageBoxExt.alert("请输入note标题！");
	    return;
	}
	
	MessageBoxExt.confirm("确认添加NoteList？", function() {
	  MessageBoxExt.ajax({
	    url : "/notes/addNoteList",
	    type : "post",
	    style : "redirect",
	    data : {
	    	date:$("#date").val(),
	    	namespace:$("#namespace").val(),//如果为空，就使用默认值
	    	category:$("#category").val(),//如果为空，就使用默认值
	    	title:$("#title").val(),
	    	content : $("#content").val(),
	    	topflag:$("#topflag").val()//如果为空，就使用默认值
	    },
	    success : function (result) {
	      $(this).dialog("close");
	    }
	  });
	});
}
function viewContent(id) {
	location.href = "/notes/showNoteList?id="+id;//location.href实现客户端页面的跳转
}
//namespace(yeepay.com) category(daily note) rank(0) 可以有默认值
function updateContent(id,content,title,namespace,category,topflag) {
	$("#id").val(id);
	$("#content").val(content);
	$("#title").val(title);
	
	//$("#date").val("05/05/2014");
	$("#spanDate").hide();
	$("#namespace").val(namespace);
	 
	$("#category").val(category);
	$("#topflag").val(topflag);
    MessageBoxExt.popup("addListForm", {
        title : "note添加",
        //zIndex : 20000,
        width: 1000,
        height: "auto",
        buttons : [{
            text : '提交',
            click : function() {
            	if(!$("#namespace").val()){
            	    MessageBoxExt.alert("请输入namespace！");
            	    return;
            	}
            	if(!$("#category").val()){
            	    MessageBoxExt.alert("请输入category！");
            	    return;
            	}
            	if(!$("#topflag").val()){
            	    MessageBoxExt.alert("请输入topflag！");
            	    return;
            	}
                MessageBoxExt.confirm("确认修改notelist？", function() {
              	  MessageBoxExt.ajax({
              		    url : "/notes/updateContent",
              		    type : "post",
              		    style : "redirect",
              		    data : {
              		    	id : id,
              		    	namespace:$("#namespace").val(),
              		    	category:$("#category").val(),
              		    	title:$("#title").val(),
              		    	content:$("#content").val(),
              		    	topflag:$("#topflag").val()
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
