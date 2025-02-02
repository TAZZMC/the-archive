var editor_mode="";

//Retrieves xml innerHTML by tag, attribute and attribute_value
//If the tag,attrbute and attribute_value matches the object is retrieved
//For finding xml objects just by tag make other values "#none"


function get_filelist(dir)
{
  let filesInDirectory=[];
  directoriesInDirectory = fs.readdirSync(dir, { withFileTypes: true })
  .filter((item) => item.isFile())
  .map((item) => item.name);
  return filesInDirectory;
}


function open_dialog(mode)
{
  editor_mode=mode;
  config_popup=window.open('resources/dialogs/editor_dialog.html', '_blank', 'width=480,height=240,autoHideMenuBar=true,contextIsolation=false,nodeIntegration=yes,resizable=false');
}

function get_folderlist(dir)
{
  let filesInDirectory=[];
  directoriesInDirectory = fs.readdirSync(dir, { withFileTypes: true })
  .filter((item) => item.isFile())
  .map((item) => item.name);
  return filesInDirectory;
}

 function load_tools()
 {
   let tool_box=document.getElementById("tool_box");
   let core_tools=get_filelist("the_archive/resources/editor_tools/core/core_tools.xml");
   let plugin_tools=get_filelist("the_archive/resources/editor_tools/plugins/core_tools.xml");
 }
