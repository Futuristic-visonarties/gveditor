import logo from "./logo.svg";
import * as React from "react";
import "./App.css";
import axiosConfig from "./network/network";
import Editor from "./components/Editor";
import { RingLoader } from "react-spinners";
import axios from "axios";

function App() {
  const [editor, setEditor] = React.useState();
  const [loader, setLoader] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const picker = React.useRef();
  const AddImage = React.useCallback(() => {
    console.log("adding images");
    // editor.setContent(`<img src='https://images.unsplash.com/photo-1659085095693-fcdc650d246c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'/>`)
    let content = editor.getContent();
    editor.setContent(
      `${content}` +
        `<img src='https://images.unsplash.com/photo-1659085095693-fcdc650d246c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'/>`
    );
  });
  const getUrl = () => {
    return axiosConfig
      .get(`contribution/get-presigned-url/${count}/image`)
      .then((res) => {
        console.log("res from api", res);
        return res.data;
      })
      .catch((err) => {
        console.log("error ", err);
        return err;
      });
  };
  const onImageChange = React.useCallback(async (event) => {
    setLoader(true);
    var data = new FormData();
    data.append("image", event.target.files[0]);
    let uRes = await getUrl();
    console.log("usres ures ures", uRes);
    if (uRes.data.signedURL) {
      console.log("upload image");
      axios
        .put(uRes.data.signedURL, data)
        .then((url) => {
          // use the response from url to add as image
          setLoader(false);
          let content = editor.getContent();
          editor.setContent(`${content}` + `<img src=${uRes.data.s3URL}/>`);
        })
        .catch((err) => {
          console.log("error from upload s3", err);
          setLoader(false);
        });
    }
  });
  React.useEffect(() => {
    if (editor) {
      if (window.initial_data) {
        editor.setContent(window.initial_data?.htmlStr);
      }
      editor.subscribe("editableInput", function (event, editable) {
        // your custom save code
        try {
          window.webkit.messageHandlers.doneEditing.postMessage({
            htmlString: editor.getContent(),
          });
        } catch (err) {
          console.log("error");
        }
      });
    }
  }, [editor]);

  return (
    <div className="App">
      <input
        ref={picker}
        accept="image"
        style={{ display: "none" }}
        type="file"
        onChange={onImageChange}
      />

      <Editor editor={editor} setEditor={setEditor} />
      <img
        alt=""
        className="close-icon"
        src="https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/000000/external-arrows-arrows-jumpicon-glyph-jumpicon-glyph-ayub-irawan-3.png"
        onClick={() => {
          window.webkit.messageHandlers.closeeditor.postMessage({
            htmlString: editor.getContent(),
          });
        }}
      />

      <img
        alt=""
        className="imgupload"
        src="https://img.icons8.com/ios-glyphs/30/000000/image.png"
        onClick={(e) => {
          e.preventDefault();
          picker.current.click();
        }}
      />

      {loader && <RingLoader className="loader" color={"#ADD8E6"} size={50} />}
    </div>
  );
}

export default App;
