import * as React from "react";
import "./App.css";
import axiosConfig from "./network/network";
import Editor from "./components/Editor";
import { RingLoader } from "react-spinners";
import ProgressBar from "@ramonak/react-progress-bar";
import axios from "axios";
import { Helmet } from "react-helmet";
import { getLengthOfContentExcludingTags } from "./util";

function App() {
  const [editor, _setEditor] = React.useState();
  const [loader, setLoader] = React.useState(false);
  const [percentage, setPercentage] = React.useState(0);

  // const [debug, setDebug] = React.useState("initla state");
  const myEditor = React.useRef(editor);
  const { hideUpload, type } = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );

  // if (type !== "android") {
  //   var JSBridge;
  // }

  const setMyEditor = (data) => {
    myEditor.current = data;
    _setEditor(data);
    data.elements[0].focus();
  };

  const picker = React.useRef();

  const getUrl = (imageType) => {
    let uniqueId =
      Date.now().toString(36) + Math.random().toString(36).substring(2);

    let url = `contribution/get-presigned-url/${uniqueId}.${imageType}/image`;

    return axiosConfig
      .get(url)
      .then((res) => {
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
    if (event.target.files.length == 0) return;
    setLoader(true);
    let url = URL.createObjectURL(event.target.files[0]);
    let image = await getBlobFromUrl(url);
    uploadImage(image);
  };
  const uploadImage = async (image, imageType) => {
    let uRes = await getUrl(imageType);

    if (uRes.data.signedURL) {
      axios({
        method: "put",
        url: uRes.data.signedURL,
        data: image,
        onUploadProgress: (progressEvent) => {
          let percentComplete = progressEvent.loaded / progressEvent.total;
          setPercentage(parseInt(percentComplete * 100));
        },
      })
        .then(() => {
          setLoader(false);
          setPercentage(0);
          myEditor.current.pasteHTML(
            `<img name=${uRes.data.media_temp_id} src=${uRes.data.s3URL}> </img>`
          );
        })
        .catch((err) => {
          setLoader(false);
        });
    } else {
      setLoader(false);
    }
  };
  const changeContentHandler = (data) => {
    if (myEditor) {
      myEditor.current.setContent(`${data.detail}`);
    } else {
      setTimeout(() => {
        const event = new CustomEvent("changeContent", {
          data: data,
        });
        window.dispatchEvent(event);
      }, 1000);
    }
  };
  const changeUploadImageHandler = (data) => {
    let type = data.detail.substring(
      "data:image/".length,
      data.detail.indexOf(";base64")
    );
    fetch(data.detail)
      .then((res) => res.blob())
      .then((image) => uploadImage(image, type))
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    window.addEventListener("changeContent", changeContentHandler);
    window.addEventListener("uploadImageData", changeUploadImageHandler);

    return () => {
      window.removeEventListener("uploadImageData", changeUploadImageHandler);
      window.removeEventListener("changeContent", changeContentHandler);
    };
  }, []);
  React.useEffect(() => {
    if (editor) {
      editor.subscribe("editableInput", function (event, editable) {
        try {
          let content = editor.getContent();
          let contentLength = getLengthOfContentExcludingTags(content);

          if (type == "ios") {
            window.webkit.messageHandlers.doneEditing.postMessage({
              htmlString: content,
            });

            window.webkit.messageHandlers.contentLength.postMessage({
              count: contentLength,
            });
          }

          if (type == "android") {
            /* eslint-disable */
            JSBridge?.doneEditing(content);
            JSBridge?.contentLength(contentLength);
          }

          if (!type) {
            if (window && window.parent) {
              window.parent.postMessage(
                {
                  message: content,
                },
                "*"
              );
              window.parent.postMessage(
                {
                  contentLength: contentLength,
                },
                "*"
              );
            }
          }
        } catch (err) {}
      });
      editor.subscribe("focus", function (event, editable) {
        if (type == "ios") {
          // window.webkit.messageHandlers.onfocus.postMessage({
          //   focus: true,
          // });
        }
      });
    }
  }, [editor]);

  return (
    <div
      style={
        loader ? { pointerEvents: "none", backgroundColor: "#cccccc45" } : {}
      }
      className="App"
    >
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Helmet>
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
            if (type == "android") {
              try {
                /* eslint-disable */
                JSBridge?.choosePhoto();
              } catch (e) {}
            } else {
              e.preventDefault();
              picker.current.click();
            }
          }}
        />
      ) : null}

      {loader && <ProgressBar className="loader" completed={percentage} />}
    </div>
  );
}

export default App;
