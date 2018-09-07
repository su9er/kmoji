var path = require('path');
var fs = require('fs');

// rename.js 文件全路径
var rootPath = __filename;

// 参数为 rename.js 所在目录路径
renameFilesInDir(path.dirname(rootPath));

// 这里是经常变化的部分
var getNewName = (function () {
  // 新文件名从 1 开始
  var _nameIndex = 1;

  // 获取指定长度整数
  // 作为新的文件名前缀
  function _prefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
  }

  // 获取文件名后缀
  function _getSuffix(filename) {
    var pos = filename.lastIndexOf(".");
    // 只修改后缀为以下范围内的文件
    var suffixArr = ['.jpg', '.jpeg', '.gif', '.png'];
    return (pos !== -1 && suffixArr.indexOf(filename.substring(pos, filename.length)) !== -1) ? filename.substring(pos, filename.length) : '';
  }

  return function _getNewName(filename) {
    // 获取后缀
    var suffix = _getSuffix(filename);
    return suffix === '' ? '' : '2' + _prefixInteger(_nameIndex++, 5) + suffix;
  };

})();

// 传入的参数是全路径
function changeFileName(filepath) {
  fs.stat(filepath, function (err, stats) {
    if (stats.isFile()) {
      // 不带有目录的文件名
      var filename = path.basename(filepath);
      // 所在目录路径
      var parentDir = path.dirname(filepath);
      // rename.js
      var thisFilename = path.basename(__filename);
      // 不修改 rename.js 文件本身
      if (filename != thisFilename) {
        var newName = getNewName(filename);
        if (newName === '') {
          return console.log(filepath + ' will not be renamed');
        }
        var newPath = path.join(parentDir, newName);
        console.log('rename ' + filepath + ' ==> ' + newPath);
        try {
          fs.rename(filepath, newPath);
        } catch (e) {
          console.log('rename error: ' + error);
        }
      }
    } else if (stats.isDirectory()) {
      // 如果目录则递归调用 renameFilesInDir
      console.log('============[' + filepath + '] isDir===========');
      renameFilesInDir(filepath);
    } else {
      console.log('unknow type of file');
    }
  });
}

function renameFilesInDir(dir) {
  fs.readdir(dir, function (error, files) {
    var len = files.length;
    var file = null;
    for (var i = 0; i < len; i++) {
      file = files[i];
      // 传入全路径
      changeFileName(path.join(dir, file));
    }
  });
}
