const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatData = timestamp => {
  var date = new Date(timestamp)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  var d = date.getDate()
  var h = date.getHours()
  var i = date.getMinutes()
  var s = date.getSeconds()
  return y + '年' + m + '月' + d + '日' + ' ' + h + ':' + i + ':' + s
}

// 上传图片命名
const formatData1 = timestamp => {
  var date = new Date(timestamp)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  var d = date.getDate()
  var h = date.getHours()
  var i = date.getMinutes()
  var s = date.getSeconds()
  return y + '' + m + '' + d + '_' + h + '' + i + '' + s
}

// 留言
const formatData2 = timestamp => {
  var date = new Date(timestamp)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  var d = date.getDate()
  var h = date.getHours()
  var i = date.getMinutes()
  var s = date.getSeconds()
  return y + '年' + m + '月' + d + '日' + '_' + h + ':' + i + ':' + s
}

module.exports = {
  formatTime: formatTime,
  formatData: formatData, // 后面的是本文件中的命名
  formatData1: formatData1, // 后面的是本文件中的命名
  formatData2: formatData2 // 后面的是本文件中的命名
}