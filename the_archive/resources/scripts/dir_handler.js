
function path_manipulator(dir, action)
{
    let path_fragmented=dir.split("/");
    let result="";

    if(action==="get_local")
    {
      result=path_fragmented[path_fragmented.length-2];
    }

    if(action==="get_archive_root")
    {
      result=dir.replace("./the_archive/resources/archives/","/");
    }

    if(action==="get_higher")
    {
      for(let i=0; i<path_fragmented.length-2; i++)
      {
        result=result+path_fragmented[i]+"/";
      }
    }

  return result;
}

function get_filelist(dir,extension)
{
    let filesInDirectory=[];
    filesInDirectory = fs.readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isFile() && item.name.split(".")[1]===extension)
    .map((item) => item.name);
    return filesInDirectory;
}

function get_dirlist(dir)
{
    let directoriesInDirectory;
    directoriesInDirectory = fs.readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);
    return directoriesInDirectory;
}
