import * as xmljs from "xml-js";
import * as saxes from "saxes";
import * as fastxmlparser from "fast-xml-parser";

let xml = `<foo>`;
for (let i = 0; i < 50000; i++) {
  xml += `<bar${i}>2</bar${i}>`;
}
xml += `</foo>`;

///////////////////////// xml-js

{
  const start = Date.now();
  for (let i = 0; i < 10; i++) {
    try {
      xmljs.xml2js(xml, {compact: true});
    } catch (error) {
      console.log("xmljs, xml not valid");
      break;
    }
  }
  const end = Date.now();
  console.log("xml-js: " + (end - start) + "ms");
}

///////////////////////// saxes

{
  const start = Date.now();
  const parser = new saxes.SaxesParser();
  let brea = false;
  parser.on("error", function (e) {
    if (brea === false) {
      console.log("saxes, xml not valid");
    }
    brea = true;
  });
  for (let i = 0; i < 10; i++) {
    parser.write(xml).close();
    // @ts-ignore
    if (brea === true) {
      break;
    }
  }
  const end = Date.now();
  console.log("saxes: " + (end - start) + "ms");
}

///////////////////////// fast-xml-parser

{
  const start = Date.now();
  for (let i = 0; i < 10; i++) {
//    const res = fastxmlparser.parse(xml, {});
    const res = fastxmlparser.validate(xml);
    if (res !== true) {
      console.log("fastxmlparser, xml not valid");
      break;
    }
  }
  const end = Date.now();
  console.log("fast-xml-parser: " + (end - start) + "ms");
}