import * as React from "react";
import MediumEditor from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";
import './Editor.css'
const Article = ({editor,setEditor}) => {
  // const [editor, setEditor] = React.useState();

  const onRefChange = React.useCallback((node) => {
    if (node === null) {
        setEditor(null)
    } else {
      if (editor == null) {
        const et = new MediumEditor(node);
        setEditor(et);
      }
    }
  }, []); 

  return (
    <>
      <div
        ref={onRefChange}
      ></div>
      </>
  );
};
export default Article;