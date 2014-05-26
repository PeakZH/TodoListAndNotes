// --------------------------数据校验扩展-----------------------
var GV = GV || {};
GV.ctxPath = GV.ctxPath || "/";
/**
 * 数据校验出错后显示提示信息
 *
 * @author wang.bao
 * @param obj
 * @param errorMsg
 * @returns
 */

var ValidateExt = {
  forms : {},
  /**
   * 自动生成checkbox, radio, select校验规则，支持属性：req
   */
  _genCheckedRules : function (form, rules) {
    rules = rules || {};
    form.find("checkbox, radio, select").each(function () {
      var name = $(this).attr("name");
      var req = $(this).attr("req");
      if (!rules[name] && req) {
        var rule = {};
        rule.req = req;
        rule.label = $(this).attr("label");
        if (!rule.label) {
          rule.label = $(this).parent().find("label:first").text() || "";
          rule.label.replace(":", "");
          rule.label.replace("：", "");
        }
        rules[name] = rule;
      }
    });
    return rules;
  },
  /**
   * 关联校验出错处理
   */
  relatedError : function (obj, errorMsg, errFun) {
    if (errorMsg) {
      obj.attr("relatedError", true);
    } else {
      obj.removeAttr("relatedError");
    }
    errFun = errFun || this.tipError;
    errFun(obj, errorMsg, true);
  },

  /**
   * 错误处理：输入框后提示
   */
  inlineError : function (obj, errorMsg, isRelated, nextLine) {
    if (!obj || obj.length == 0) {
      return;
    }
    var value = obj.val();
    if (errorMsg) {
      if (value == '不限') {
        errorMsg = null;
      }
    }
    var name = obj.attr("name").replace("\.", "_");
    var errorId = "error_" + name;
    var errorP = $("#" + errorId);
    if (errorMsg) {
      if (errorP.length > 0) {
        errorP.html(errorMsg);
        errorP.show();
      } else {
        var html = '<div class="tip_error" id="' + errorId + '">' + errorMsg
            + '</div>';
        if (nextLine) {
          html = '<div class="tip_error ml_l" id="' + errorId + '">' + errorMsg
              + '</div>';
        }
        if (obj.attr('tagName') == "SELECT") {
          var p = obj.parents("div.select_border");
          if (p.length > 0) {
            p.after(html);
          } else {
            obj.after(html);
          }
        } else {
          obj.after(html);
        }
      }
    } else {
      if (!isRelated && obj.attr("relatedError")) {
        return;
      }
      obj.removeAttr("relatedError");
      if (errorP.length > 0) {
        errorP.html("");
        errorP.hide();
      }
    }
  },
  /**
   * 换行显示错误信息
   */
  nextlineError : function (obj, errorMsg, isRelated) {
    this.inlineError(obj, errorMsg, isRelated, true);
  },
  _tip : {
    appendTo : function (obj, errorMsg) {
      var top = obj.offset().top + obj.height() + 5;
      var left = obj.offset().left;
      var tip = $(document.createElement("div"));
      tip.attr("opname", "errorTip");
      tip.attr("class", "inputTipError");
      tip.css({
        "position" : "absolute",
        "border" : "1px solid #C0C0C0",
        "background-color" : "#FFFFCC",
        "padding" : "3px",
        "max-width" : "300px",
        "top" : top + "px",
        "left" : left + "px"
      });
      tip.text(errorMsg);
      obj.after(tip);
      tip.show("fast");
    },
    removeFrom : function (obj) {
      if (obj.next().attr("opname") == "errorTip") {
        obj.next().remove();
      }
    }
  },

  /**
   * 错误处理：输入框上浮动型提示
   */
  tipError : function (obj, errorMsg, isRelated) {
    if (!obj || obj.length == 0) {
      return;
    }
    var value = obj.val();
    if (errorMsg) {
      if (value == '不限') {
        errorMsg = null;
      }
    }
    if (errorMsg) {
      obj.addClass("fault");
      ValidateExt._tip.removeFrom(obj);
      ValidateExt._tip.appendTo(obj, errorMsg);
    } else {
      if (!isRelated && obj.attr("relatedError")) {
        return;
      }
      obj.removeAttr("relatedError");
      ValidateExt._tip.removeFrom(obj);
      obj.removeClass("fault");
    }
  },

  /**
   * form监听
   *
   * @param id:formId,
   * @param rules:校验规则
   */
  listen : function (formId, rules, errFun) {
    if (!formId) {
      return false
    }
    var valForm = $("#" + formId);
    valForm.rules = ValidateExt._genCheckedRules(valForm, rules);
    errFun = errFun || ValidateExt.inlineError;
    valForm.listenerValue('blur', valForm.rules, errFun);
    valForm.listenerChecked('blur', valForm.rules, errFun);
    valForm.listenerChecked('change', valForm.rules, errFun);
    this.forms[formId] = valForm;
  },

  /**
   * 数据校验
   *
   * @param id:formId,
   * @param rules:校验规则
   */
  val : function (formId, rules, errFun) {
    if (!formId) {
      return false
    }
    var form = this.forms[formId];
    errFun = errFun || ValidateExt.inlineError;
    if (form) {
      rules = jQuery.extend(form.rules || {}, rules || {});
    } else {
      rules = rules || {};
      form = $("#" + formId);
    }
    var result = form.validateSubmit(rules, errFun);
    if (result) {
      return form.find("input[relatedError=true]").length == 0;
    }
  },

  /**
   * 取消绑定blur,change事件监听
   *
   * @param id:formId
   */
  unbind : function (formId) {
    if (!formId) {
      return false
    }
    var form = this.forms[formId];
    if (form) {
      form.find("input[type=text],input[type=password],textarea").each(
          function () {
            $(this).unbind("blur");
          });
      form.find("checkbox, radio, select").each(function () {
        $(this).unbind("blur");
        $(this).unbind("change");
      });
    }
  },
  /**
   * 检查单个值是否满足数据格式
   *
   * @see Validate.regexs
   */
  checkValue : function (value, dataType) {
    if (!value || !dataType) {
      return false;
    }
    var regex = Validate.regexs[dataType];
    if (!regex) {
      return false;
    }
    return regex.test(value);
  }
};

// --------------------------弹窗扩展--------------------------
/**
 * 通用消息处理：等待，错误信息提示
 *
 * @author wang.bao
 *
 * @returns
 */
var MessageBoxExt = {
  SUCCESS : "操作成功",
  /**
   * ajax效果说明： <br>
   * 1.NONE: 无效果，主要为使用通用错误处理<br>
   * 2.BASIC: 只提示请稍候，成功后自动关闭<br>
   * 3.NORMAL:ajax调用成功后点击“确定”只关闭成功提示框<br>
   * 4.CLOSEWINDOW:ajax调用成功后点击“确定”关闭窗口<br>
   * 5.UNPOPALL:ajax调用成功后点击“确定”关闭所有弹出层<br>
   * 6.REDIRECT:ajax调用成功后点击“确定”跳转到指定页面<br>
   * 7.CALLBACK:ajax调用成功后点击“确定”回调指定处理
   */
  styles : {
    NONE : "NONE",
    BASIC : "BASIC",
    NORMAL : "NORMAL",
    CLOSEWINDOW : "CLOSEWINDOW",
    UNPOPALL : "UNPOPALL",
    REDIRECT : "REDIRECT",
    CALLBACK : "CALLBACK"
  },
  popups : {},
  index : 0,
  /**
   * 弹出提示框，可控制右上角的“X”
   */
  _alert : function (msg, options) {
    options = jQuery.extend({
      title : MessageBox.title,
      modal : true,
      draggable : false,
      resizable : false,
      width : 392
    }, options || {});
    MessageBox._addOptionsEvent(options);
    var p = $(MessageBox.div).addClass('alert').text(msg);
    p.dialog(options);
    // 不显示右上角“X”
    if (options.closeable == false) {
      $(p[0].previousSibling.lastElementChild).hide();
    }
    this.popups[this.index++] = p;
    return p;
  },
  /**
   * 关闭弹出提示框
   */
  _removeAlert : function () {
    var i = this.index - 1;
    if (this.popups[i]) {
      this.popups[i].dialog("close");
      this.popups[i] = null;
      this.index = i;
    }
  },
  /**
   * 检查ajax效果，默认NORMAL
   */
  _checkStyle : function (style) {
    if (!style) {
      return this.styles.NORMAL;
    }
    style = style.toUpperCase();
    for ( var i in this.styles) {
      if (style == this.styles[i]) {
        return this.styles[i];
      }
    }
    return this.styles.NORMAL;
  },

  /**
   * 提示处理中
   */
  wait : function (msg) {
    msg = msg || "正在处理，请稍候...";
    var options = {
      closeable : false
    };
    this._alert(msg, options);
  },

  /**
   * 关闭“处理中”提示
   */
  unwait : function () {
    this._removeAlert();
  },

  /**
   * 提示操作成功
   */
  success : function (msg) {
    msg = msg || this.SUCCESS;
    MessageBox.alert(msg);
  },

  /**
   * 根据返回数据检查是否真正成功
   */
  _checkSuccess : function (result, request) {
    if (!result) {
      return false;
    }
    if (result.success == true || result.success == "true" || !result.errMsg) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 取得错误信息
   */
  _getErrMsg : function (result, request) {
    var type = "json";
    if (request) {
      var contentType = request.getResponseHeader('Content-Type') || "";
      contentType = contentType.toLowerCase();
      if (contentType.indexOf("html") != -1) {
        type = "html";
      } else if (contentType.indexOf("stream") != -1) {
        type = "stream";
      }
    }
    var msg = null;
    // json返回的数据
    if (type == "json") {
      msg = result.errMsg || this.SUCCESS;
    } else if (type == "stream") {
      return "download";
    } else if (type == "html") {
      if (result.indexOf("错误") == -1) {
        msg = this.SUCCESS;
      } else {
        msg = result.responseText;
      }
    } else if (typeof (result) == "undefined") {
      msg = this.SUCCESS;
    } else {
      msg = result || this.SUCCESS;
    }
    return msg;
  },

  /**
   * 提示操作成功，点击确定按钮只关闭提示框
   */
  _styleNormal : function (msg) {
    MessageBox.alert(msg || this.SUCCESS);
  },

  /**
   * 提示操作成功，点击确定按钮回调相应处理
   */
  _styleCallback : function (msg, callback, result, txtStatus) {
    var btn = [{
      "text" : MessageBox.buttons['ok'],
      "click" : function () {
        $(this).dialog("close");
        if (callback) {
          callback(result, txtStatus);
        } else {
          MessageBox.alert("没有提供回调函数");
        }
      }
    }];
    MessageBox.alert(msg || this.SUCCESS, {
      buttons : btn
    });
  },

  /**
   * 提示操作成功，点击确定按钮关闭窗口
   */
  _styleCloseWindow : function (msg) {
    var btn = [{
      "text" : MessageBox.buttons['ok'],
      "click" : function () {
        window.open('', '_self', '');
        window.close();
      }
    }];
    MessageBox.alert(msg || this.SUCCESS, {
      buttons : btn
    });
  },

  /**
   * 提示操作成功，点击确定按钮关闭所以弹出层
   */
  _styleUnpopAll : function (msg) {
    var btn = [{
      "text" : MessageBox.buttons['ok'],
      "click" : function () {
        $(this).dialog("close");
        MessageBoxExt.closeAll();
      }
    }];
    MessageBox.alert(msg || this.SUCCESS, {
      buttons : btn
    });
  },

  /**
   * 提示操作成功，点击确定按钮跳转到指定url
   */
  _styleRedirect : function (msg, toUrl) {
    var btn = [{
      "text" : MessageBox.buttons['ok'],
      "click" : function () {
        $(this).dialog("close");
        MessageBoxExt.closeAll();
        if (toUrl) {
          self.location.href = toUrl;
        } else {
          self.location.reload();
        }
      }
    }];
    MessageBox.alert(msg || this.SUCCESS, {
      buttons : btn
    });
  },

  /**
   * 自动矫正url
   */
  _correctUrl : function (url) {
    if (typeof (url) != "string") {
      MessageBox.alert("URL不正确");
      return "";
    }
    if (url.indexOf("/") != 0) {
      url = "/" + url;
    }
    if (url.indexOf(GV.ctxPath) < 0) {
      url = GV.ctxPath + url;
    }
    return url;
  },

  /**
   * 关闭所有弹出层
   */
  closeAll : function () {
    while (this.index > 0) {
      this._removeAlert();
    }
    jQuery.each(MessageBox.popups, function (obj) {
      MessageBox.unpopup(obj);
    });
  },

  /**
   * 弹出提示信息
   */
  info : function (msg) {
    MessageBox.alert(msg);
  },

  /**
   * 弹出错误信息
   */
  error : function (msg, afterBizError) {
    msg = msg || "网络异常，请稍后重试！";
    var options = {
      title : "出错啦！",
      modal : true,
      buttons : [{
        "text" : MessageBox.buttons['ok'],
        "click" : function () {
          $(this).dialog("close");
          if (afterBizError) {
            afterBizError();
          }
        }
      }],
      draggable : false,
      resizable : false,
      width : 392
    };
    MessageBox._addOptionsEvent(options);
    $(MessageBox.div).addClass('alert error').html(msg).dialog(options);
  },

  /**
   * ajax调用
   */
  ajax : function (H) {
    var style = MessageBoxExt._checkStyle(H.style);
    if (style != MessageBoxExt.styles.NONE) {
      MessageBoxExt.wait();
    }
    // 自动矫正url
    $.ajax({
          url : this._correctUrl(H.url),
          type : H.type || "POST",
          data : H.data || {},
          cache : H.cache,
          dataType : H.dataType,
          success : function (result, textStatus, request) {
            if (style != MessageBoxExt.styles.NONE) {
              MessageBoxExt.unwait();
            }
            var msg = MessageBoxExt._getErrMsg(result, request);
            if (H.getMessage) {
              msg = H.getMessage(result, textStatus);
            }
            var realSuccess = MessageBoxExt._checkSuccess(result, request);
            if (H.checkSuccess) {
              realSuccess = H.checkSuccess(result, textStatus, request);
            } else if (style == MessageBoxExt.styles.NONE) {
              realSuccess = true;
            } else if (msg == "download") {
              realSuccess = true;
            } else if (!realSuccess) {
              realSuccess = msg == MessageBoxExt.SUCCESS;
            }
            if (realSuccess && H.success) {
              H.success(result, textStatus, request);
            }
            if (realSuccess) {
              if (msg == "download") {
                // 文件下载
                result.execCommand('SaveAs');
              } else if (style == MessageBoxExt.styles.NORMAL) {
                MessageBoxExt._styleNormal(msg);
              } else if (style == MessageBoxExt.styles.CLOSEWINDOW) {
                MessageBoxExt._styleCloseWindow(msg);
              } else if (style == MessageBoxExt.styles.UNPOPALL) {
                MessageBoxExt._styleUnpopAll(msg);
              } else if (style == MessageBoxExt.styles.REDIRECT) {
                MessageBoxExt._styleRedirect(msg, H.toUrl);
              } else if (style == MessageBoxExt.styles.CALLBACK) {
                if (H.callback) {
                  MessageBoxExt._styleCallback(msg, H.callback, result,
                      textStatus);
                } else {
                  MessageBoxExt._styleNormal(msg);
                }
              }
            } else {
              MessageBoxExt.error(msg, H.afterBizError);
            }
            return true;
          },
          error : function (result, textStatus) {
            if (style != MessageBoxExt.styles.NONE) {
              MessageBoxExt.unwait();
            }
            if (H.error) {
              H.error(result, textStatus);
            }
          }
        });
  },

  /**
   * MessageBox基本函数
   */
  alert : function (msg, options) {
    MessageBox.alert(msg, options);
  },

  /**
   * 确认提示框，默认消息为“是否确认此操作？”
   */
  confirm : function (msg, callback, options) {
    msg = msg || "是否确认此操作？";
    MessageBox.confirm(msg, callback, options);
  },

  /**
   * 关闭弹出层
   *
   * @param id 弹出层ID或弹出层对象
   */
  close : function (id) {
    if (typeof (id) == "string") {
      MessageBox.unpopup(id);
    } else {
      MessageBox.close(id);
    }
  },

  /**
   * 弹出一个层
   */
  popup : function (id, options) {
    MessageBox.popup(id, options);
  },

  /**
   * 关闭一个层
   */
  unpopup : function (id) {
    MessageBox.unpopup(id);
  },

  /**
   * ajax加载一个页面（区块）然后弹出
   *
   * @param id 弹出层ID
   * @param url 请求url
   * @param options 其他选项，按钮、宽高等
   * @param callback 弹出后回调处理
   */
  load : function (id, url, options, callback) {
    options = options || {};
    MessageBoxExt.wait();
    $.ajax({
      url : this._correctUrl(url),
      type : "GET",
      cache : false,
      success : function (result, textStatus) {
        MessageBoxExt.unwait();
        var target = $("#" + id);
        if (target.length < 1) {
          target = $(document.createElement("div"));
          target.attr("id", id);
          target.hide();
          target.html(result);
          $("body").append(target);
        } else {
          target.html(result);
        }
        MessageBox.popup(id, options);
        if (callback) {
          callback(result, textStatus);
        }
      },
      error : function () {
        MessageBoxExt.unwait();
      }
    });
  },

  /**
   * 弹出内容体
   */
  popupContent : function (id, data, options) {
    MessageBox.popupContent(id, data, options);
  }
};

// --------------------------省市选择--------------------------
var AreaOptExt = {
  /**
   * 省市二级下拉列表级联
   */
  reg : function (pid, cid) {
    $province = $("#" + pid);
    for ( var p = 1; p <= AreaOptExt._getLength(areaoptProvince); p++) {
      if (p < 10) {
        pcode = "0" + p;
      } else {
        pcode = p;
      }
      var option = document.createElement("option"); // ie6必须先获得dom
      $province.append(option);
      option.text = areaoptProvince[pcode];
      option.value = pcode;
      // $province.append(new Option(areaoptProvince[pcode], pcode));
    }
    $province.change(function () {
      AreaOptExt._changeProvince(cid, $(this).val());
    });
  },

  /**
   * 省份改变时市区联动
   */
  _changeProvince : function (cid, pcode) {
    if (!cid || !pcode) {
      return;
    }
    $city = $("#" + cid);
    var citys = areaoptCity[pcode];
    $city.html("");
    $city.append(new Option("--请选择--", ""));
    for ( var c = 1; c <= AreaOptExt._getLength(citys); c++) {
      if (c < 10) {
        ccode = "0" + c;
      } else {
        ccode = c;
      }
      var option = document.createElement("option"); // ie6必须先获得dom
      $city.append(option);
      option.text = citys[ccode];
      option.value = ccode;
      if (c == 1) {
        option.selected = true;
        option.defaultSelected = true;
      } else {
        option.selected = false;
        option.defaultSelected = false;
      }
    }
  },
  /**
   * 取得json对象长度
   */
  _getLength : function (json) {
    var len = 0;
    for ( var j in json) {
      len++;
    }
    return len;
  },

  onLoadCity : function (cid, city) {
    $city = $("#" + cid);
    var code = city;
    var citys = areaoptCity[code];
    $city.html("");
    $city.append(new Option("--请选择--", ""));
    for ( var c = 1; c <= AreaOptExt._getLength(citys); c++) {
      if (c < 10) {
        ccode = "0" + c;
      } else {
        ccode = c;
      }
      var option = document.createElement("option"); // ie6必须先获得dom
      $city.append(option);
      option.text = citys[ccode];
      option.value = ccode;
      if (c == 1) {
        option.selected = true;
        option.defaultSelected = true;
      } else {
        option.selected = false;
        option.defaultSelected = false;
      }
      // $city.append(new Option(citys[ccode], ccode, c == 1, c == 1));
    }
  }
}

// --------------------------日期时间工具类--------------------------
var DateUtils = {
  MILLIS_PER_DAY : 86400000,
  /**
   * 移除时分秒
   */
  truncateTime : function (date) {
    date = date || new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  },
  /**
   * 字符串转日期对象
   */
  parseDate : function (dateStr) {
    dateStr = dateStr || "";
    if (/[\d]{4}-[\d]{2}-[\d]{2}/.test(dateStr)) {
      var dates = dateStr.split("-");
      var date = new Date();
      date.setFullYear(parseInt(dates[0]));
      date.setMonth(parseInt(dates[1]) - 1);
      date.setDate(parseInt(dates[2]));
      return this.truncateTime(date);
    } else {
      return null;
    }
  },
  /**
   * 增减天数
   */
  plusDay : function (date, plus) {
    date = date || new Date();
    var time = date.getTime() + plus * this.MILLIS_PER_DAY;
    var d = new Date();
    d.setTime(time);
    return d;
  },
  /**
   * 日期对象转日期字符串
   */
  toString : function (date) {
    date = date || new Date();
    var dateStr = date.getFullYear() + "-";
    if (date.getMonth() < 10) {
      dateStr += "0";
    }
    dateStr += (date.getMonth() + 1) + "-";
    if (date.getDate() < 10) {
      dateStr += "0";
    }
    dateStr += date.getDate();
    return dateStr;
  },
  /**
   * 跟当前时间比较 小于当前时间：-1 等于当前时间：0 大于当前时间：1
   */
  compare : function (date1, date2) {
    if (date1 && date2) {
      var time = date1.getTime() - date2.getTime();
      if (time > 0) {
        return 1;
      } else if (time < 0) {
        return -1;
      } else {
        return 0;
      }
    }
    return 0;
  },
  /**
   * 日期比较 小于：-1 同一天：0 大于：1
   */
  compareByDay : function (date1, date2) {
    if (date1 && date2) {
      var d1 = this.truncateTime(date1);
      var d2 = this.truncateTime(date2);
      return this.compare(d1, d2);
    }
    return 0;
  },
  /**
   * 跟当天比较 小于当天：-1 等于当天：0 大于当天：1
   */
  compareWithToday : function (date) {
    return this.compareByDay(date, new Date());
  },
  /**
   * 跟当前时间比较 小于当前时间：-1 等于当前时间：0 大于当前时间：1
   */
  compareWithNow : function (date) {
    return this.compare(date, new Date());
  },
  /**
   * 差分天数
   */
  diffDays : function (date1, date2) {
    if (date1) {
      date2 = date2 || new Date();
      var d1 = this.truncateTime(date1);
      var d2 = this.truncateTime(date2);
      return (d1.getTime() - d2.getTime()) / this.MILLIS_PER_DAY;
    }
    return 0;
  }
};

// --------------------------日期时间选择--------------------------
var DatePickerExt = {
  _defaultDateOption : function (options) {
    options = options || {};
    options.defaultDate = options.defaultDate || "+1d";
    options.numberOfMonths = options.numberOfMonths || 1;
    return options;
  },
  _defaultTimeOption : function (options) {
    options = options || {};
    if (typeof (options.showSecond) == "undefined") {
      options.showSecond = true;
    }
    options.defaultDate = options.defaultDate || "+0d";
    options.timeFormat = options.timeFormat || "hh:mm:ss";
    return options;
  },
  /**
   * 日期选择
   */
  date : function (start, options) {
    options = this._defaultDateOption(options);
    $("#" + start).datepicker(options);
  },
  /**
   * 时间选择
   */
  time : function (start, options) {
    options = this._defaultTimeOption(options);
    $("#" + start).datetimepicker(options);
  },
  /**
   * 日期区间选择
   */
  between : function (start, end, options) {
    options = this._defaultDateOption(options);
    var dates = $("#" + start + ", #" + end).datepicker(
        jQuery.extend({
          defaultDate : options.defaultDate,
          numberOfMonths : options.numberOfMonths,
          onSelect : function (selectedDate) {
            var option = this.id == start ? "minDate" : "maxDate";
            var instance = $(this).data("datepicker");
            var date = $.datepicker.parseDate(instance.settings.dateFormat
                || $.datepicker._defaults.dateFormat, selectedDate,
                instance.settings);
            dates.not(this).datepicker("option", option, date);
            $(this).blur();
          }
        }, options));
    return dates;
  },
  /**
   * 快捷查询
   *
   * @param options:{selector:"selector",formId:"formId"}
   */
  latest : function (start, end, options) {
    options = options || {};
    options.selector = options.selector || ".search_tit > ul > li > a";
    var $start = $("#" + start);
    var $end = $("#" + end);
    var $form = $("#" + options.formId);
    var inputs = inputSelector
        || "input[type='text'],input[type='password'],input[type='checkbox'],input[type='radio'],select,textarea"
    $(options.selector).click(function () {
      if ($form.length > 0) {
        $form.find(inputs).each(function () {
          $(this).val("");
        });
      }
      var text = $.trim($(this).text());
      if (text == "1年前") {
        $start.datepicker('setDate', "");
        $end.datepicker('setDate', "-1y");
      } else if (text == "3个月") {
        $start.datepicker('setDate', "-3m");
        $end.datepicker('setDate', "0d");
      } else if (text == "1个月") {
        $start.datepicker('setDate', "-1m");
        $end.datepicker('setDate', "0d");
      } else if (text == "最近7天") {
        $start.datepicker('setDate', "-7d");
        $end.datepicker('setDate', "0d");
      }
      if ($form.length > 0) {
        $form.submit();
      }
    });
  }
};
/**
 * 点击收起、展开效果
 *
 * @param handleId 点击按钮ID
 * @param contentId 收起、展开区域ID
 */
function openClose (handleId, contentId) {
  $("#" + handleId).click(function () {
    var text = $.trim($(this).text());
    if (text.indexOf("点击收起") >= 0) {
      $(this).removeClass("open");
      $(this).addClass("up");
      $(this).html("点击展开");
      $("#" + contentId).hide(500);
    } else {
      $(this).removeClass("up");
      $(this).addClass("open");
      $(this).html("点击收起");
      $("#" + contentId).show(500);
    }
  });
}
