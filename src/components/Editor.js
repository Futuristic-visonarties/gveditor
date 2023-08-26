import * as React from "react";
import MediumEditor from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";
import "./Editor.css";
const Article = ({ editor, setEditor }) => {
  const onRefChange = React.useCallback((node) => {
    if (node === null) {
      setEditor(null);
    } else {
      if (editor == null) {
        const et = new MediumEditor(node, {
          placeholder: {
            text: "\n Enter your content",
            hideOnClick: false,
          },
        });
        node.scrollTop = 0;
        setEditor(et);
      }
    }
  }, []);

  return (
    <>
      <div className="editor-container" ref={onRefChange}></div>
    </>
  );
};
export default Article;
