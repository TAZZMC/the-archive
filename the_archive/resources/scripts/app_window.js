const fs=parent.require("fs");
var config_dialog;
var lang_file;
var lang_list;
var units_file;
var current_dir="./the_archive/resources/archives/";
var settings;
var language_code="en";
var nav_selected="archives"; //Current default possible values [editor, archives, settings, github]
//nav_selected "editor"=It's purpose is to provide ui editing environment to create new records for Archive, using "search bar" here will result in results of documentation of editor according to context of inputted substring
//clicking on search result opens new dedicated window with documentation content which itself is content of Archives under category Archive editor which is hidden from "categories" in category display unless enabled in "settings"
//All user created documentation have "user_created_tag" which can be filtered out by writing #user-created#

//nav_selected "categories"=Provides browsing view for searching in Archive by category, using "search bar" here will show all records of context to inputted string and selected category
//Currently available categories are categories=[Physics,Math,Chemistry,Biology,Engineering,Software,Computers,language]

//nav_selected "settings" Is quite self explanatory, here you can change app settings

//nav_selected "github" In this section you can post request to add your user created record to an official Archive which will be then reviewed and if accepted will be added to official repo
//Keep in mind that you need to login into your github account send your request

//Prepares user interface elements
function init_ui()
{
  let sidebar=document.getElementById("sidebar");
  let searchbox=document.getElementById("search_box");
  lang_list; //Stores list of languages found in languages.xml
  let ui_xml; //Stores current language.xml content for main_window.html
  let title; //Stores window title name in current language
  let srch_hint; //Stores searchbar placeholder text in current language
  let sbar_it_lbls; //Stores labels for navigation menu in current language
  let sbar_it_navs; //Stores labels for navigation menu paths from current_lang file
  //Checks if language list xml file exists to prevent errors and notify user in case of file structure corruption
  if(fs.existsSync("./the_archive/resources/languages/languages.xml")==true)
  {
    lang_list=load_xml("./the_archive/resources/languages/languages.xml"); //Loads list of languages
    try
    {
      lang_file=findInXml(lang_list,"language","lang",language_code)[0].getAttribute("file"); //Retrieves a name of UI file of language according to "language_code"
    }
    catch(error)
    {
      lang_file="undefined";
    }

    //Checks if file xml file of language exists
    if (lang_file!=="undefined" && fs.existsSync("./the_archive/resources/languages/"+lang_file))
    {

      ui_xml = load_xml("./the_archive/resources/languages/"+lang_file); //Retrieves languaged version of appwindow_xml file from path with matching language_code from languages.xml
      title = findInXml(ui_xml, "title", "#none","#none").innerHTML; //Retrieves "title" content from languaged version of appwindow_xml
      srch_hint = findInXml(ui_xml, "searchbox", "#none","#none").innerHTML; //Retrieves "search_box" placeholder text from languaged version of appwindow_xml
      sbar_it_lbls = findInXml(ui_xml, "sidebar", "#none","#none").getElementsByTagName("labels")[0].innerHTML.split(";"); //Loads labels for sidebar from xml
      sbar_it_navs = findInXml(ui_xml, "sidebar", "#none","#none").getElementsByTagName("nav")[0].innerHTML.split(";"); //Loads navigation locations for sidebar from xml
    }
    else
    {
      alert("Language file was not found, path or language code is invalid");
    }


  }
  else
  {
    alert("Error couldn't find languages.xml in designated path the_archive/resources/languages/languages.xml");
  }
  document.title=title; //Updates main window title from "title" variable
  searchbox.placeholder=srch_hint; //Updates searchbox placeholder from variable "placeholder"


  //Checks sidebar integrity
  if(sbar_it_lbls.length!==sbar_it_navs.length)
  {
    alert("Corrupted language xml file detected label count doesn't match the navigation paths count"); //Notifies user of possible xml corruption
  }
  else
  {
    //Populates the sidebar with navigation items
    for(let i=0; i<sbar_it_navs.length; i++)
    {
      let item=document.createElement("div"); //Creates new item div
      if (i==0){item.id="item1";} //Assings "item1" id for the first item
      if (i==sbar_it_navs.length){item.id="item_last";} //Assings "item_last" for the last item
      item.setAttribute("class","disable-select sidebar_item"); //Assigns classes "disable-select"=>Does what it's name implies and "sidebar_item"
      item.innerHTML=sbar_it_lbls[i] //Sets text content of item from "sbar_it_lbls"
      item.setAttribute("onClick","nav_selected='"+sbar_it_navs[i]+"'; load_tab();") //Sets on_click action of "sidebar_item"
      sidebar.appendChild(item); //appends item to sidebar
    }
  }

}

function load_tab()
{
  document.getElementById("iframe_navigation").src="navigation/"+nav_selected+"/"+nav_selected+".html";
}

//Loads or initiates first configuration
function init_config()
{
  if(fs.existsSync("settings.xml")==false)
  {
    config_dialog=window.open('dialogs/config_dialog.html', '_blank', 'width=480,height=240,autoHideMenuBar=true,contextIsolation=false,nodeIntegration=yes,resizable=true');
  }
  else
  {
    //Loads settings xml object to variable
    settings=load_xml("./settings.xml");
    //Extracts current language's code of form english="en", japanese="jp", ...
    language_code=findInXml(settings,"language","#none","#none").innerHTML;
  }
    init_ui(); //Initializes UI includes title, sidebar and searchbar placeholder
}

function init()
{
  init_config(); //Calls config load/create function
  setTimeout(() =>
  {
    load_tab();
  },500);
}
