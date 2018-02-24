//date script

var dateInScriptsFile = function() {
  
  var d = new Date();
  var formattedDate = "";
  formattedDate += (d.getMonth() + 1) + "_";
  formattedDate += d.getDate() + "_";
  formattedDate += d.getFullYear();
  
  return formattedDate;
};

// Export datescript
module.exports = dateInScriptsFile;
