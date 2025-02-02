const xml_parser = new DOMParser();
//Retrieves data from xml file of path
function load_xml(path)
{
  let xml_file_content;
  let xml_object;
  if(fs.existsSync(path)==true)
  {
    xml_file_content=fs.readFileSync(path); //Reads the file and returns result
    xml_object=xml_parser.parseFromString(xml_file_content,"text/xml"); //Parses content to object
  }
  return xml_object;
}

//Retrieves content of xml object by arguments
//"xml"=xml object
//"tag" = tag we are looking for
//"attribute" is property of "tag" we compare to "attribute_value" if so the element is added to returned array
//To not compare/search for attribute at all set value to "#none" to both "tag" and "attribute_value"
function findInXml(xml,tag,attribute,attribute_value)
{
  let tag_elements=xml.getElementsByTagName(tag);
  let return_value=[];

  if(tag_elements.length>1)
  {
    for(let i=0; i<tag_elements.length; i++)
    {
      //Handles search for tag only
      if(attribute==="#none"|attribute_value==="#none"){ return_value.push(tag_elements[i]); }

      //Handles search for tag and attribute.value == attribute_value
      if(attribute!=="#none" & attribute!=="#none" & attribute_value!=="#none")
      {
        if(tag_elements[i].getAttribute(attribute)===attribute_value)
        {
          return_value.push(tag_elements[i]); //Returns object
        }
      }
    }
  }
  else{ return_value=tag_elements[0]; }

  return return_value;
}
