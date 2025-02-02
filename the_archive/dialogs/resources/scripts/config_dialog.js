const fs=require('fs')
var dialog_xml; //Stores dialog language labels etc...
var prompt_id=0;  //Stores current page 0="Language options" 1="Unit system options"
var current_lang="en"; //Current user selected language
var current_units="Metric" //Stores current user selected unit system

//Clears out select box options
function removeOptions(selectElement)
{
   let i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--)
   {
     selectElement.remove(i);
   }
}

//Loads prompt title,text and optionbox items
function load_opt()
{
  let langs; //Holds language list
  let units; //Holds units list

  //Checks whether units list exists
  if(fs.existsSync("./the_archive/resources/languages/"+opener.lang_file)==true)
  {
    units=opener.findInXml(load_xml("./the_archive/resources/units/"+opener.lang_file),"units","#none","#none"); //Loads units list
  }
  langs=opener.findInXml(opener.lang_list,"language","#none","#none"); //Loads language list

  let op_box=document.getElementById("select_box"); //Preloads option box to variable
  document.title=findInXml(dialog_xml, "title", "#none","#none").innerHTML; //Loads dialog title by language
  let text_prompt=findInXml(dialog_xml, "prompt_text", "type",["language","units"][prompt_id])[0].innerHTML; //Loads text prompt by prompt_id
  let btn_label=findInXml(dialog_xml, "cont-btn", "cont", ["true","false"][prompt_id])[0].innerHTML; //Loads button label by prompt_id

  document.getElementById("text_prompt").innerHTML=text_prompt; //Sets text prompt from preloaded variable
  document.getElementById("btn_done").innerHTML=btn_label; //Sets continue button text from variable

  //Loads prompt language
  if(prompt_id==0)
  {
    //Checks whether option box does not contain any items
    if(op_box.options.length==0)
    {
      //Populates option box with languages from language.xml
      for(let i=0; i<langs.length; i++)
      {
        //Creates item element
        opt=document.createElement("option");

        //Sets item text e.g. English, Czech, ...
        opt.innerHTML=langs[i].innerHTML;

        //Sets item value e.g. "en","cz", ...
        opt.value=langs[i].getAttribute("lang");

        //Adds item to option box
        op_box.add(opt);
      }
    }
  }

  if(prompt_id==1)
  {
    //Checks whether option box does not contain any items
    if(op_box.options.length==0)
    {
      //Populates option box with languages from language.xml
      for(let i=0; i<units.length; i++)
      {
        //Creates item element
        opt=document.createElement("option");

        //Sets item text e.g. Metric, Imperial, ...
        opt.innerHTML=units[i].getAttribute("name");

        //Sets item value e.g. metric, imperial, ...
        opt.value=units[i].getAttribute("name");

        //Adds item to option box
        op_box.add(opt);
      }
    }
  }
}

//Handles close events
function notify_cantclose()
{
  console.log("tried close!"); //Debug print
  if(fs.existsSync("./settings.xml")==false)
  {
    return "Cannot close window without finishing config...";
  }
  else
  {
    //Triggers load language settings for main_window
    window.opener.init_config();

    //Reloads UI of main_window to update language
    window.opener.location.reload();
  }
}

//Prevents premature closing of dialog
window.onbeforeunload = notify_cantclose;


//Calls on dialog load or reload when triggered manually
function init()
{
  //Concancates location of dialog language file from language selection
  var dialog_xml_path="./the_archive/dialogs/resources/languages/"+opener.findInXml(opener.lang_list,"language","lang",current_lang)[0].getAttribute("file");

  //Checks whether file exists or not notifies user if file is not found
  if(fs.existsSync(dialog_xml_path)==true)
  {
    dialog_xml=load_xml(dialog_xml_path); //Loads language xml into "dialog_xml"
    //console.log(dialog_xml);
    load_opt(current_lang); //Loads prompt
  }
}

//Triggers on button continue
function cont()
{
  removeOptions(document.getElementById("select_box")); //Clears out option box
  if(prompt_id==1) //Checks current prompt and triggers on units prompt
  {
    basic_config_write() //Calls config save
    window.close(); //Closes dialog
  }
  if(prompt_id==0) //Checks current prompt and triggers on language prompt
  {
    prompt_id=prompt_id+1; //Switches current prompt
    init(); //Reloads dialog prompts
  }

}


//Triggers on option_box select and writes variables
function selected(id)
{
  //Sets current_lang from id.value if current prompt is language
  if(prompt_id==0)
  {
    current_lang=id.value;
  }

  //Sets current_units from id.value if current prompt is units
  if(prompt_id==1)
  {
    current_units=id.value;
  }

  //Calls reload ==> content required to update languages and change pages
  init();
}

//Writes down configuration into settings.xml in app_root
function basic_config_write()
{
  //Unites and formats parts of settings
  let config="<?xml version='1.0' encoding='UTF-8'?>\n<settings>\n<language>"+current_lang+"</language>\n"+"<units>"+current_units+"</units>\n<settings>";

  //Writes settings into file
  fs.writeFile("./settings.xml",config,(err) =>{if (err) throw err;});
}
