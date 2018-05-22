function formatTime(date, format) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var milliSecond = date.getMilliseconds()
  if (format == 'YmdHis') {
    return year + '' + formatNumber2(month) + '' + formatNumber2(day) + '' + formatNumber2(hour) + '' + formatNumber2(minute) + '' + formatNumber2(second)
  }
  if (format == 'YYYYmmddHHMMSSmis') {
    return year + '' + formatNumber2(month) + '' + formatNumber2(day) + '' + formatNumber2(hour) + '' + formatNumber2(minute) + '' + formatNumber2(second) + '' + formatNumber3(milliSecond)
  }
  if (format == 'yyyy-MM-dd hh:mm:ss') {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber2(n) {
  n = n.toString()
  return n.length == 1 ? '0' + n : n
}
function formatNumber3(n) {
  n = n.toString()
  return n.length == 1 ? '00' + n : (n.length == 2 ? '0' + n : n)
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}
function Get(url, cb) {
  wx.request({
    url: url,
    method: 'GET',
    header: { 'Content-Type': 'application/json' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}
function Post(url, data, cb) {
  wx.request({
    url: url,
    data: data,
    method: 'POST',
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}
function PostFiles(url, filePath, formData, cb) {
  wx.uploadFile({
    url: url, //仅为示例，非真实的接口地址
    filePath: filePath,
    name: 'file',
    formData: formData,
    header: { 'Content-Type': 'multipart/form-data' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

module.exports = {
  formatTime: formatTime,
  json2Form: json2Form,
  Get: Get,
  Post: Post,
  PostFiles: PostFiles
}
