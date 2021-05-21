import React from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import atomDark from "react-syntax-highlighter/dist/esm/styles/prism/atom-dark";

SyntaxHighlighter.registerLanguage("json", json);

function Highlight({children}){
  console.log(children[1]);
 return (
  <SyntaxHighlighter language="json" style={atomDark}>
  {children[1]}
  </SyntaxHighlighter>
  );
 };

export default Highlight;
