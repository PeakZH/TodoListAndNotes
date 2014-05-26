$(document).ready(function () {
  $("#popAddList").click(function () {
    MessageBoxExt.popup("addListForm", {
      title : "OA记录添加",
      //zIndex : 20000,
      width: 500,
      buttons : [{
          text : '提交',
          click : function() {
            	addOAList();
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
		 updateContent($(this).attr('porpertyId'),$(this).attr('content'));
		  
	 if($(this).attr('action')==='done')
		 updateStatus($(this).attr('porpertyId'));  
  });
});
function addOAList () {
	if(!$("#content").val()){
	    MessageBoxExt.alert("请输入OAList内容！");
	    return;
	}
	MessageBoxExt.confirm("确认添加OAList？", function() {
	  MessageBoxExt.ajax({
	    url : "/oa-work/addOAWorkList",
	    type : "post",
	    style : "redirect",
	    data : {
	    	content : $("#content").val()
	    },
	    success : function (result) {
	      $(this).dialog("close");
	    }
	  });
	});
}
function updateStatus(id) {
	MessageBoxExt.confirm("确认修改OAlist状态？", function() {
	  MessageBoxExt.ajax({
	    url : "/oa-work/updateStatus",
	    type : "post",
	    style : "redirect",
	    data : {
	    	id : id
	    },
	    success : function (result) {
	      $(this).dialog("close");
	    }
	  });
	});
}
function updateContent(id,content) {
	$("input[name=id]").val(id);
	$("#content").val(content);
    MessageBoxExt.popup("addListForm", {
        title : "OAlist修改",
        //zIndex : 20000,
        width: 500,
        buttons : [{
            text : '提交',
            click : function() {
              MessageBoxExt.confirm("确认修改OAlist？", function() {
            	  MessageBoxExt.ajax({
            		    url : "/oa-work/updateContent",
            		    type : "post",
            		    style : "redirect",
            		    data : {
            		    	id : id,
            		    	content:$("#content").val()
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