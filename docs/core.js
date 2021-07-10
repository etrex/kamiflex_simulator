let editor = monaco.editor.create(document.getElementById("editor"), {
  value: `json = Kamiflex.json(self) do
  alt_text "hello world!"
  bubble do
    body do
      text "hello world!"
    end
  end
end

puts json`,
  language: "ruby"
});

let jsonViewer = monaco.editor.create(document.getElementById("json_viewer"), {
  value: `{}`,
  readOnly: true,
  language: "ruby"
})

function updateJsonViewer(){
  const json = JSON.stringify(flexMessage, null, 2)
  jsonViewer.setValue(json);
}

async function getFlexMessage(code){
  window.json = await callRuby(code);
  return JSON.parse(json);
}

async function callRuby(code){
  const rubyWasmResult = await window.ruby(code);
  const outputs = rubyWasmResult.output;
  const jsons = [];
  let startCollectJson = false;
  outputs.forEach(function(output){
    console.log(output.output);
    if(output.output[0] == "{"){
      startCollectJson = true;
    }
    if(startCollectJson){
      jsons.push(output.output)
    }
  })
  return jsons.join("");
}

function updateFlexMessageViewer(){
  $("#line_flex_message").html("")
  flex2html("line_flex_message", flexMessage)
}

let code = editor.getValue()
let timeout;
let flexMessage = "{}";

async function update(){
  console.log("update");
  flexMessage = await getFlexMessage(code)
  updateFlexMessageViewer()
  updateJsonViewer()
}

document.addEventListener("keyup", function(e){
  let currentCode = editor.getValue()
  if(currentCode == code){
    return;
  }else{
    code = currentCode;
    if(timeout){
      clearTimeout(timeout);
    }
    timeout = setTimeout(update, 500);
  }
});
update();
