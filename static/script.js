async function run(inpt) {
  var output = model.predict(inpt).dataSync()
  console.log(output);
  let i = output.indexOf(Math.max(...output));
  document.getElementById("prediction").innerHTML = pred_text  +  classes[i] + "</b> with a confidence of " + output[i].toFixed(4);     
}
const pred_text = "The input is : <b> ";
var model = null;

async function loadModel(stat){
  /* Pretrained in python tensorflow */
  model = await tf.loadLayersModel('/static/model.json');
  //console.log("loadedModel");
  stat.innerHTML += " Model Loaded ";
}

var classes = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate","clean"];

var word2index = null;


function getTokenisedWord(seedWord) {
  if(word2index != null){
    var words = seedWord.toLowerCase().split(" ");
    var pad_len = 200;
    var conv_output = new Float32Array(pad_len);  
    var zero_length = pad_len - words.length;


    for(var i = 0; i < zero_length; i++){
      conv_output[i] = 0;
    }
    for(var i = 0; i < words.length; i++){
      var word = words[i];
      if(word2index[word] == undefined){
        conv_output[zero_length + i] = 0;
      }else{
        conv_output[zero_length + i] = word2index[word];
      }
    }
    console.log(conv_output);
    return [tf.tensor2d([conv_output])]  
  }else{
    console.log("error")
  }
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.addEventListener("progress", updateProgress);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function updateProgress (oEvent) {
  if (oEvent.lengthComputable) {
    var percentComplete = oEvent.loaded / oEvent.total * 100;
    $('.progress-bar').css('width', percentComplete+'%').attr('aria-valuenow', percentComplete);
  } else {
    console.log("Error Loading Dictionary");
  }
}



$(document).ready(function(){
    var loadStatus = document.getElementById("loaded");
    loadModel(loadStatus);
    readTextFile("/static/word_dict.json", function(text){
      word2index = JSON.parse(text);
      if(word2index["the"] != undefined){
        loadStatus.innerHTML += " Dictionary : Loaded";   
      }else{
        loadStatus.innerHTML += " Dictionary : Failed to Load, Reload the page";   
      }
    });
});




function predict(){

	var inpt = document.getElementById('usr_input').value;
	console.log(inpt)
  var dat = [302,257];
	//const pred =model.predict(getTokenisedWord(inpt)) 
	run(getTokenisedWord(inpt))
  //getTokenisedWord(inpt)
  //console.log(getTokenisedWord(inpt))
}
