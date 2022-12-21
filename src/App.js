import * as React from "react";
import "./App.css";
import axiosConfig from "./network/network";
import Editor from "./components/Editor";
import { RingLoader } from "react-spinners";
import axios from "axios";

function App() {
  const [editor, _setEditor] = React.useState();
  const [loader, setLoader] = React.useState(false);
  const [debug, setDebug] = React.useState();
  const myEditor = React.useRef(editor);
  const { hideUpload } = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );

  const setMyEditor = (data) => {
    console.log("seeting editor", data);
    myEditor.current = data;
    _setEditor(data);
  };

  const picker = React.useRef();

  const getUrl = () => {
    return axiosConfig
      .get(`contribution/get-presigned-url/name.png/image`)
      .then((res) => {
        console.log("res from api", res);
        return res.data;
      })
      .catch((err) => {
        setLoader(false);
        return err;
      });
  };
  const getBlobFromUrl = (myImageUrl) => {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open("GET", myImageUrl, true);
      request.responseType = "blob";
      request.onload = () => {
        resolve(request.response);
      };
      request.onerror = reject;
      request.send();
    });
  };

  const onImageChange = async (event) => {
    setLoader(true);
    let url = URL.createObjectURL(event.target.files[0]);
    let image = await getBlobFromUrl(url);
    let uRes = await getUrl();
    if (uRes.data.signedURL) {
      axios({
        method: "put",
        url: uRes.data.signedURL,
        data: image,
      })
        .then((url) => {
          setLoader(false);
          editor.pasteHTML(`<img src=${uRes.data.s3URL}  > </img>`);
        })
        .catch((err) => {
          setLoader(false);
        });
    } else {
      setLoader(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("changeContent", (data) => {
      if (myEditor) {
        myEditor.current.setContent(`${data.detail}`);
      } else {
        console.log("no editor ");
        setTimeout(() => {
          const event = new CustomEvent("changeContent", {
            data: data,
          });
          window.dispatchEvent(event);
        }, 1000);
      }
    });
  });
  React.useEffect(() => {
    if (editor) {
      editor.subscribe("editableInput", function (event, editable) {
        try {
          window.webkit.messageHandlers.doneEditing.postMessage({
            htmlString: editor.getContent(),
          });
          JSBridge.doneEditing(valueReceived);
        } catch (err) {
          console.log("error sending data", err);
        }
      });
      editor.subscribe("focus", function (event, editable) {
        window.webkit.messageHandlers.onfocus.postMessage({
          focus: true,
        });
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
      <Editor editor={editor} setEditor={setMyEditor} />
      {/* <img
        alt=""
        className="close-icon"
        src="https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/000000/external-arrows-arrows-jumpicon-glyph-jumpicon-glyph-ayub-irawan-3.png"
        onClick={() => {
          window.webkit.messageHandlers.closeeditor.postMessage({
            htmlString: editor.getContent(),
          });
        }}
      /> */}
      {hideUpload === undefined ? (
        <img
          alt=""
          className="imgupload"
          src="https://img.icons8.com/ios-glyphs/30/000000/image.png"
          onClick={(e) => {
            e.preventDefault();
            picker.current.click();
          }}
        />
      ) : null}

      {loader && <RingLoader className="loader" color={"#ADD8E6"} size={50} />}
    </div>
  );
}

export default App;
