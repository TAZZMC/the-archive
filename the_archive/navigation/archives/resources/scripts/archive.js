const fs=parent.require("fs");
function deleteChildren(element)
{
  while (element.lastElementChild)
  {
    element.removeChild(element.lastElementChild);
  }
}

function init_ui()
{

  setTimeout(() =>
  {
    loadArchive();
  },100);
}

//Loads archive content from current directory
function loadArchive()
{
  let title=document.getElementById("arch_title"); //Loads archive title element to variable
  let container=document.getElementById("item_container"); //Loads container element(Contains record and directory items)
  if(container.children!=[]){deleteChildren(container);} //If container is not empty it gets cleaned to load new items
  let archive_controls="not_found"; //Stores basic archive controls "back,previously visited and bookmarks"

  let descriptor="not_found"; //Stores descriptor of current directory, used for label and icon assigment
  let path_list=[]; //Stores list of directories contained withing currently loaded directory
  let construct_ids; //Stores list of ids loaded from directory descriptor if it exists
  let construct_paths; //Stores list of paths loaded from directory descriptor if it exists
  let construct_labels; //Stores list of paths loaded from directory descriptor if it exists

  //Checks for existence of core archive controls file and loads them
  if(fs.existsSync("./the_archive/navigation/archives/resources/languages/"+parent.lang_file.toString())==true)
  {
    //Loads basic control items
    let controls=parent.findInXml(parent.load_xml("./the_archive/navigation/archives/resources/languages/"+parent.lang_file),"nav_item","#none","#none");
    for(let i=0; i<controls.length; i++)
    {
      let item_txt = document.createElement("div"); //Creates text part of item
      item_txt.setAttribute("class", "item_txt"); //Sets item class "item_txt"
      item_txt.innerHTML = controls[i].innerHTML; //Sets item "item_txt"from "construct_labels"
      let item = document.createElement("div"); //Creates main item
      item.setAttribute("class", "item folder_it disable-select"); //Sets main item classes "item"(Essential class makes item display as grid),"folder_it"(Sets default folder icon unless overriden by item.style), "disable-select"(Does what it implies prevents default html highlight)
      item.id=controls[i].getAttribute("id"); //Sets item id from construct_ids
      item.setAttribute("onClick", controls[i].getAttribute("script")); //Sets item navigation script Do not mess with it!!!
      item.style.backgroundImage="url('resources/images/"+controls[i].getAttribute("icon")+"')"; //Sets item background image also do not mess if you want to change background use "arch_folder/root_src/language.xml"
      item.appendChild(item_txt); //Embeds item_txt into item
      container.appendChild(item); //Adds item to document
    }

  }
  else
  {
    alert("Error archive core corrupted.");
  }

  if(fs.existsSync(parent.current_dir)==true)
  {
    if(fs.existsSync(parent.current_dir+"root_src/languages/"+parent.lang_file)){descriptor=parent.load_xml(parent.current_dir+"root_src/languages/"+parent.lang_file);}

    path_list=get_dirlist(parent.current_dir); //Loads list of directories from current path
    record_list=get_filelist(parent.current_dir,"html");  //Loads list of records from current path
    //Checks whether current folder contains resource folder "root_src" a. k. a. descriptor path expected to be like arch_folder/root_src/languages/language.xml language is determined from parent.lang_file
    if(descriptor!=="not_found")
    {
      //Items respect data order assignment similarly to .csv data where columns are new records and rows are properties

      title.innerHTML=findInXml(descriptor,"title","lang",parent.language_code).innerHTML; //Sets current folder title
      construct_ids=findInXml(descriptor,"constructor-ids","#none","#none").innerHTML.split(";"); //Loads ids of items in descriptor
      construct_paths=findInXml(descriptor,"constructor-paths","#none","#none").innerHTML.split(";"); //Loads paths to items from descriptor
      construct_labels=findInXml(descriptor,"labels","#none","#none").innerHTML.split(";"); //Loads labels from descriptor
      construct_icons=findInXml(descriptor,"icons","#none","#none").innerHTML.split(";");  //Loads icons for items
      let item_found=false;
      //Checks whether or not is item in path_list(actual list of directories in directory) present in descriptor
      //If present item will be added and assigned properties from descriptor if not the secondary loop will take care of it and add default properties
      for(let o=0; o<construct_paths.length; o++)
      {
        let item_found=false;
        for(let i=0;i<path_list.length;i++)
        {
          if(path_list[i]===construct_paths[o])
          {
            item_found=true;
          }
        }
        if(item_found==true)
        {
          let item_txt = document.createElement("div"); //Creates text part of item
          item_txt.setAttribute("class", "item_txt"); //Sets item class "item_txt"
          item_txt.innerHTML = construct_labels[o]; //Sets item "item_txt"from "construct_labels"
          let item = document.createElement("div"); //Creates main item
          item.setAttribute("class", "item folder_it disable-select"); //Sets main item classes "item"(Essential class makes item display as grid),"folder_it"(Sets default folder icon unless overriden by item.style), "disable-select"(Does what it implies prevents default html highlight)
          item.id=construct_ids[o]; //Sets item id from construct_ids
          item.setAttribute("onClick","parent.current_dir=parent.current_dir+'"+construct_paths[o]+"/'; loadArchive();") //Sets item navigation script Do not mess with it!!!
          item.style.backgroundImage="url(../../resources/archives"+path_manipulator(parent.current_dir+"root_src/","get_archive_root")+construct_icons[o]+")"; //Sets item background image also do not mess if you want to change background use "arch_folder/root_src/language.xml"
          item.appendChild(item_txt); //Embeds item_txt into item
          container.appendChild(item); //Adds item to document
        }
      }

      //Loads all folders which aren't written in descriptor
      //If folder is not in descriptor it's name and path is governed purely by folder name and icon defaults "/navigation/archives/resources/images/folder.svg"
      for(let o=0; o<path_list.length; o++)
      {
        let item_found=false;
        for(let i=0;i<construct_paths.length;i++)
        {
          if(path_list[o]===construct_paths[i]|path_list[o]==="root_src")
          {
            item_found=true;
          }
        }
        if(item_found==false)
        {
          let item_txt = document.createElement("div"); //Creates text part of item
          item_txt.setAttribute("class", "item_txt"); //Sets item class "item_txt"
          item_txt.innerHTML = path_list[o]; //Sets item "item_txt" from "path_list"
          let item = document.createElement("div"); //Creates main item
          item.setAttribute("class", "item folder_it disable-select"); //Sets main item classes "item"(Essential class makes item display as grid),"folder_it"(Sets default folder icon unless overriden by item.style), "disable-select"(Does what it implies prevents default html highlight)
          item.id=path_list[o]+"_it"; //Sets item id from construct_ids
          item.setAttribute("onClick","parent.current_dir=parent.current_dir+'"+path_list[o]+"/'; loadArchive();"); //Sets item navigation script Do not mess with it!!!
          item.style.backgroundImage="url('resources/images/folder.svg')"; //Sets item background image also do not mess if you want to change background use "arch_folder/root_src/language.xml"
          item.appendChild(item_txt); //Embeds item_txt into item
          container.appendChild(item); //Adds item to document
        }
      }


    }
    //Triggers when folder doesn't have any descriptor
    else
    {
      title.innerHTML=path_manipulator(parent.current_dir,"get_local");

      for(let f=0;f<path_list.length;f++)
      {
        let item_txt = document.createElement("div"); //Creates text part of item
        item_txt.setAttribute("class", "item_txt"); //Sets item class "item_txt"
        item_txt.innerHTML = path_list[f]; //Sets item "item_txt"from "construct_labels"
        let item = document.createElement("div"); //Creates main item
        item.setAttribute("class", "item folder_it disable-select"); //Sets main item classes "item"(Essential class makes item display as grid),"folder_it"(Sets default folder icon unless overriden by item.style), "disable-select"(Does what it implies prevents default html highlight)
        item.id=path_list[f]; //Sets item id from construct_ids
        item.setAttribute("onClick","parent.current_dir=parent.current_dir+'"+path_list[f]+"/'; loadArchive();") //Sets item navigation script Do not mess with it!!!
        item.style.backgroundImage="url('resources/images/folder.svg')"//Sets item background image also do not mess if you want to change background use "arch_folder/root_src/language.xml"
        item.appendChild(item_txt); //Embeds item_txt into item
        container.appendChild(item); //Adds item to document
      }
    }
    //Loads records from folder
    if(record_list!=[] && record_list.length>0)
    {
      for(let r=0; r<record_list.length; r++)
      {
        let item_txt = document.createElement("div"); //Creates text part of item
        item_txt.setAttribute("class", "item_txt"); //Sets item class "item_txt"
        item_txt.innerHTML = record_list[r].replace(".html",""); //Sets item "item_txt" from "record_list"
        let item = document.createElement("div"); //Creates main item
        item.setAttribute("class", "item record_it disable-select"); //Sets main item classes "item"(Essential class makes item display as grid),"record_it"(Sets default folder icon unless overriden by item.style), "disable-select"(Does what it implies prevents default html highlight)
        item.id=record_list[r]+"_it"; //Sets item id from record_name+"_it"
        item.setAttribute("onClick","parent.readRecord();") //Sets item action script Do not mess with it!!!
        item.appendChild(item_txt); //Embeds item_txt into item
        container.appendChild(item); //Adds item to document
      }
    }
    if(path_manipulator(parent.current_dir, "get_archive_root")==="/"){document.getElementById("back_it").style.display="none";}
  }
  else
  {
    parent.alert("Folder in path: "+parent.current_dir+" Descriptor or Archive corrupted")
    parent.current_dir= path_manipulator(parent.current_dir);　//Returns to parent directory if directory is failed to be found
  }


}
