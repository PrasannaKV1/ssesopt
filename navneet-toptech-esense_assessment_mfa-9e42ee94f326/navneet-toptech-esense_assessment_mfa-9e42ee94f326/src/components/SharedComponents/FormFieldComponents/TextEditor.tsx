import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill-with-table";
import "react-quill-with-table/dist/quill.snow.css";
import "../TextEditor/TextEditor.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import * as QuillTableUI from "quill-table-ui";
import "quill-table-ui/dist/index.css";
import { useFormContext, Controller } from "react-hook-form";
import { imageAPI } from "../../../Api";
import { x_tenant_id } from "../../../constants/urls";
import customTableSVG from "../../../assets/images/customTable.svg";
import equation from "../../../assets/images/Equation.svg";
import {
  getLocalStorageDataBasedOnKey,
  noUploadsRegisterNames,
} from "../../../constants/helper";
import { State } from "../../../types/assessment";
import CustomTablePopover from "../QuillToolbarPopover/CustomTablePopover";
import MathjaxPopover from "../QuillToolbarPopover/MathjaxPopover";
const BlockEmbed = Quill.import('blots/block/embed');
type QuillSources = "user" | "api" | "silent";

declare global {
  interface Window {
    katex: any;
  }
}

Quill.register(
  {
    "modules/tableUI": QuillTableUI.default,
  },
  true
);

class codeCogsEditor extends BlockEmbed {
  static create(node: any) {
    return node;
  }
  static value(node: any) {
    return node;
  }
};

codeCogsEditor.blotName = 'codeCogsEditor';
codeCogsEditor.className = 'codeCogsEditor';
codeCogsEditor.tagName = 'div';

Quill.register(codeCogsEditor);

const QuillClipboard = Quill.import("modules/clipboard");
const Delta = Quill.import("delta");

const BaseImageFormat = Quill.import('formats/image');
const ImageFormatAttributesList = [
    'alt',
    'height',
    'width',
    'style'
];

class ImageFormat extends BaseImageFormat {
  static formats(domNode: any) {
    return ImageFormatAttributesList.reduce(function(formats: any, attribute: any) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }
  format(name: any, value: any) {
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

Quill.register(ImageFormat, true);
                
class CustomClipboard extends QuillClipboard {
  onPaste(range: any, { text }: { text: string }) {
    const format = this.quill.getFormat(range.index);
    const font = format["font"];

    const paragraphs = text
      .split("\n")
      .filter((paragraph) => paragraph.trim() !== "");

    const delta = new Delta();

    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim() === "") {
        delta.insert("\n");
      } else {
        delta.retain(range.index).insert(paragraph, {font})
        if (index < paragraphs.length - 1) {
          delta.insert("\n");
        }
      }
    });

    this.quill.updateContents(delta, "user" as QuillSources);

    this.quill.setSelection(
      range.index + delta.length(),
      "silent" as QuillSources
    );
  }
}

Quill.register("modules/clipboard", CustomClipboard, true);

interface TextProps {
  textEditorSize: string;
  mandatory?: boolean;
  registerName: string;
  fillInTheBlanks?: boolean;
  fieldsRequired?: any;
  placeholder?: any;
  isEdit?: boolean | null | undefined;
  addNewToggler?: boolean;
  restrictImage?: boolean;
  setTextAreaOnchange?: any;
  characterLimit?: any;
  Handlers?: any;
  key?: number;
  setSpinnerStatus?: (e: any) => void;
  eqEditor?: boolean;
  maxLength?:number;
}
const TextEditorForForm: React.FC<TextProps> = ({
  setSpinnerStatus,
  textEditorSize,
  mandatory,
  registerName,
  fillInTheBlanks,
  fieldsRequired,
  placeholder,
  isEdit,
  addNewToggler,
  restrictImage,
  setTextAreaOnchange,
  characterLimit,
  Handlers,
  key,
  eqEditor = true,
  maxLength
}) => {
  const {
    register,
    setValue,
    setError,
    watch,
    clearErrors,
    control,
    getValues,
  } = useFormContext();
  const stateDetails = JSON.parse(
    getLocalStorageDataBasedOnKey("state") as string
  ) as State;
  const [validation, setValidation] = useState(
    mandatory ? { required: "This Field is Required" } : {}
  );
  const quillRef = useRef<ReactQuill>(null);
  const [quill, setQuill] = useState<any>(null);
  const [showEditor, setShowEditor] = useState<any>(false);
  window.katex = katex;
  var Font = Quill.import("formats/font");
  Font.whitelist = ["English", "Hindi", "Marathi"];
  Quill.register(Font, true);
  const [content, setContent] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [exceedsLimit, setExceedsLimit] = useState(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [showEqEditor, setShowEqEditor] = useState(false);
  const CustomButton = () => {
    let clonedShow = !isShow;
    setIsShow(clonedShow);
    console.log("clicked", isShow);
  };
  const editorContent = watch(registerName);

  useEffect(() => {
    setCharacterCount(editorContent?.replace(/<[^>]+>/g, "").length);
  }, []);

  let fieldsReq: any[] = fieldsRequired
    ? fieldsRequired
    : ["language", , "common", "attachment", "formula", "image"];
  const containerHandler = () => {
    const cont: any[] = [];
    fieldsReq.includes("language") && cont.push([{ font: Font.whitelist }]);
    // fieldsReq.includes("header") && cont.push([{ 'header': [1, 2, 3, 4, 5, 6, false] }])
    fieldsReq.includes("biu") && cont.push(["bold", "italic", "underline"]);
    fieldsReq.includes("common") &&
      cont.push(
        ["bold", "italic", "underline", "strike"],
        [
          { align: "" },
          { align: "right" },
          { align: "center" },
          { align: "justify" },
        ],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ color: [] }, { background: [] }]
      );
    fieldsReq.includes("attachment") && cont.push(["link"]);
    fieldsReq.includes("formula") && cont.push(["formula"]);
    fieldsReq.includes("image") && cont.push([{ image: "image" }]);
    return cont;
  };

  const [showTableOptions, setShowTableOptions] = useState(false);

  const handleCustomButtonClick = () => {
    setShowTableOptions(true);
  };

  const modules = {
    table: true,
    tableUI: true,
    toolbar: containerHandler(),
          clipboard: {
      matchVisual: false,
    },
  };
  const formats: any = [
    "header",
    "font",
    "background",
    "color",
    "code",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "script",
    "align",
    "direction",
    "link",
    "image",
    "code-block",
    "formula",
  ];
  const handleContentChange = (value: any) => {
    setContent(value);
    if (value == "<p><br></p>" && mandatory) {
      setValue(registerName, null);
      register(registerName, validation);
      // setError(registerName, { type: 'required', message: 'This field is required' });
    } else {
      clearErrors(registerName);
      setValue(registerName, value);
    }
  };
  const handleChange = (content: any, delta: any, source: any, editor: any) => {
    setContent(editor.getContents());
  };
  function quillGetHTML(inputDelta: any) {
    var tempCont = document.createElement("div");
    new Quill(tempCont).setContents(inputDelta);
  }

  const removeUnwantedElement = () => {
    let quillDOM: any = document.getElementsByClassName("quill");
    if (quillDOM?.length > 0) {
      for (let dom of quillDOM) {
        if (dom?.children?.length == 3) {
          dom.children[0].remove();
        }
      }
    }
    let quillEditorDOM: any = document.getElementsByClassName("ql-editor");
    if (quillEditorDOM?.length > 0) {
      for (let dom of quillEditorDOM) {
        let checkBR: any = [];
        if (dom?.children?.length == 3) {
          for (let child of dom?.children) {
            checkBR.push(child.innerHTML);
          }
          if (
            checkBR?.length == 3 &&
            !checkBR?.filter((br: any) => br !== "<br>")?.length
          ) {
            dom?.children[2]?.remove();
            dom?.children[1]?.remove();
          }
        }
      }
    }
  };

  const renderComponent = () => {
    if (quill) {
      setShowEditor(false);
      setTimeout(() => {
        setShowEditor(true);
      }, 1000);
      setTimeout(() => {
        removeUnwantedElement();
      }, 1500);
    }
  };

  const handleConvertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const covertBase64 = async (filePath: any) => {
    return await handleConvertBase64(filePath);
  };

  const handleImageUpload = async (file: File | null) => {
    setSpinnerStatus && setSpinnerStatus(true);
    try {
      if (!file) {
        console.log("No file selected");
        return;
      }
      if (!quill) {
        console.log("Quill reference is null");
        return;
      }

      /* console.log("File:", file); */

      const range = quill.getEditor()?.getSelection();
      /* console.log("Selection range:", range); */

      const insertIndex = range ? range.index : quill.getEditor()?.getLength();
      /* console.log("Insert index:", insertIndex); */

      if (file) {
        const base64 = await covertBase64(file);
        const profileData = {
          data: base64,
          filePath: `erp/assess/questions/images/${x_tenant_id}/${stateDetails?.login?.userData?.userRefId}/`,
          tenant: process.env.REACT_APP_TENANT_UPLOAD,
          isOnline: 1,
        };

        const response = await imageAPI.post("files/upload_file", profileData);
        /* console.log("Image upload response:", response); */
        /* const signedURl = {
            fileUrl: response.data.uploadedPath,
            tenant: process.env.REACT_APP_TENANT_UPLOAD,
            isOnline: 1,
          };
          const profileSigned = await imageAPI.post(
            "files/get_signed_url",
            signedURl
          );
          console.log("Image upload profileSigned:", profileSigned); */

        // Get the URL of the uploaded image from the API response
        /* const imageUrl: string = profileSigned.data;
          console.log("Image URL:", imageUrl); */

        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const imageHtml = `<img src="${dataUrl}" alt="${response.data.uploadedPath}" />`;
          // const imageHtml = `<span>{{${response.data.uploadedPath}}}</span>`;
          if (!noUploadsRegisterNames.includes(registerName)) {
            let imageArray = getValues("questionImages") || [];
            imageArray.push({
              uploadPath: response.data.uploadedPath,
            });
            setValue("questionImages", imageArray);
          }

          const quillEditor = quill?.getEditor();
          if (quillEditor) {
            const clipboard = quillEditor.getModule("clipboard");
            if (clipboard) {
              clipboard.dangerouslyPasteHTML(insertIndex, imageHtml);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setSpinnerStatus && setSpinnerStatus(false);
  };

  const handleToolbarImageClick = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.onchange = (event: any) => {
      const file: File | null = event.target.files?.[0] || null;
      handleImageUpload(file);
    };
    input.click();
  };

  useEffect(() => {
    removeUnwantedElement();
    if (!showEditor) {
      setShowEditor(true);
    }
  }, [registerName]);

  useEffect(() => {
    setTimeout(() => {
      removeUnwantedElement();
    }, 500);
  }, [editorContent]);

  useEffect(() => {
    renderComponent();
  }, [addNewToggler]);

  useEffect(() => {
    if (quill) {
      const toolbar = quill.getEditor()?.getModule("toolbar");
      if (toolbar) {
        toolbar.addHandler("image", handleToolbarImageClick);
      }
      const clipboard = quill.getEditor()?.getModule("clipboard");
      if (restrictImage) {
        clipboard.addMatcher("IMG", () => {});
        clipboard.dangerouslyPasteHTML = () => {};
      }
    }
  }, [quill]);

  useEffect(() => {
    if (quill && fieldsReq && fieldsReq.includes("formula")) {
      if (
        !quill
          .getEditor()
          ?.getModule("toolbar")
          .container.querySelector(".ql-custom-table-icon")
      ) {
        const customIcon = document.createElement("span");
        customIcon.className = "ql-custom-table-icon";
        const imgElement = document.createElement("img");
        imgElement.src = customTableSVG;
        customIcon.addEventListener("click", (event) => {
          handleCustomButtonClick();
          setAnchorEl(event.currentTarget);
        });
        customIcon.appendChild(imgElement);
        quill
          .getEditor()
          ?.getModule("toolbar")
          .container.appendChild(customIcon);
      }
    }
  }, [quill, fieldsReq]);

  // For rendering equation editor button
  useEffect(() => {
    if (eqEditor) {
      if (quill) {
        const customIcon = document.createElement("span");
        customIcon.style.cursor = "pointer";
        customIcon.style.marginLeft = "15px";
        customIcon.className = "ql-custom-equation-editor";
        const imgElement = document.createElement("img");
        imgElement.src = equation;
        customIcon.addEventListener("click", (event) => {
          setShowEqEditor((prevState) => !prevState);
          setAnchorEl(event.currentTarget);
        });
        customIcon.appendChild(imgElement);
        quill
          .getEditor()
          ?.getModule("toolbar")
          .container.appendChild(customIcon);
      }
    }
  }, [quill]);

  const insertTable = (rowCount: number, colCount: number) => {
    if (quill) {
      quill.focus();
      const quillEditor = quill.getEditor();
      const table = quillEditor.getModule("table");
      if (table) {
        table.insertTable(rowCount, colCount);
        setShowTableOptions(false);
      }
    }
  };

  return (
    <div
      className={`text-editor-component ${
        textEditorSize == "Medium"
          ? "textHeightMedium"
          : textEditorSize == "MatchSmall"
          ? "MatchSmall"
          : "textHeightSmall"
      } ${exceedsLimit ? "textLimitError" : ""}`}
    >
      <Controller
        rules={validation}
        control={control}
        name={registerName}
        render={({
          field: { onChange, value, ref },
          formState,
          fieldState,
        }) => {
          const handleContentChange = (value: any) => {
            setTextAreaOnchange && setTextAreaOnchange(value);
            setContent(value);
            const currentLength = value.replace(/<[^>]+>/g, "").length;
            if (characterLimit) {
              if (currentLength > characterLimit) {
                const truncatedValue = value.slice(0, characterLimit);
                setExceedsLimit(true);
                Handlers && Handlers("done", true);
                setContent(truncatedValue);
                onChange(truncatedValue);
              } else {
                onChange(value);
                setExceedsLimit(false);
                Handlers && Handlers("done", false);
              }
            } else if (value == "<p><br></p>" && mandatory) {
              onChange("");
            } else {
              clearErrors(registerName);
              setExceedsLimit(false);
              Handlers && Handlers("done", false);
              // setValue(registerName, value);
              setContent(value);
              onChange(value);
            }
            setCharacterCount(currentLength);
          };
          let quillFocusStatus = false;
          const handleFocusChange = (editor: any) => {
            if (editor && !quillFocusStatus) {
              const fontSelect = editor
                .getEditor()
                .container.parentNode.querySelector(
                  "div.quill .ql-toolbar .ql-formats select.ql-font"
                );
              if (fontSelect) {
                fontSelect.value = "English"; // Set the font to 'English'
                fontSelect.dispatchEvent(
                  new Event("change", { bubbles: true })
                );
              }
              quillFocusStatus = true;
            }
          };
          const checkCharacterCount = (event: any, limit: number) => {
            let html = event?.target?.innerHTML;
            html = html.replace(/<\/?[^>]+(>|$)/g, "");
            if (html.length >= limit && event.key !== 'Backspace')
              event.preventDefault();
          };
          return (
            <>
              {showTableOptions && (
                <CustomTablePopover
                  anchorTag={anchorEl}
                  setTablePopupOpen={setShowTableOptions}
                  tablePopupOpen={showTableOptions}
                  insertTable={insertTable}
                />
              )}
              {isEdit
                ? showEditor && (
                    <>
                      <ReactQuill
                        ref={(el: any) => {
                          setQuill(el);
                        }}
                        theme="snow"
                        modules={modules}
                        key={key}
                        placeholder={
                          placeholder ? placeholder : "Start typing..."
                        }
                        defaultValue={editorContent}
                        formats={formats}
                        onChange={handleContentChange}
                        onFocus={() => handleFocusChange(quill)}
                      />
                      {characterLimit && (
                        <div
                          className={`character-count ${
                            exceedsLimit ? "error" : ""
                          }`}
                        >
                          <span className="textCount">{characterCount}</span>/
                          {characterLimit} characters
                          <br />
                          {exceedsLimit && (
                            <span className="error-message">
                              Exceeded character limit
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )
                : showEditor && (
                    <>
                      <ReactQuill
                        ref={(el: any) => {
                          setQuill(el);
                        }}
                        theme="snow"
                        modules={modules}
                        key={key}
                        placeholder={
                          placeholder ? placeholder : "Start typing..."
                        }
                        defaultValue={editorContent}
                        formats={formats}
                        onChange={handleContentChange}
                        onFocus={() => handleFocusChange(quill)}
                        onKeyPress={(e: any) => { maxLength && checkCharacterCount(e, maxLength)  }}
                      />
                      {characterLimit && (
                        <div
                          className={`character-count ${
                            exceedsLimit ? "error" : ""
                          }`}
                        >
                          <span className="textCount">{characterCount}</span>/
                          {characterLimit} characters
                          <br />
                          {exceedsLimit && (
                            <span className="error-message">
                              Exceeded character limit
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
              {/* <div className="allstudents-footer">
                     <div className="allstudentActionBtn">
                                        <ButtonComponent icon={""} image={""} textColor="#385DDF" backgroundColor="#E8EEFD" disabled={false} buttonSize="small" type="contained" onClick={() => { handleCustomButtonClick() }} label="user input on table" minWidth="200" hideBorder={true} />
                      </div>
                  </div> */}
              <MathjaxPopover
                anchorEl={anchorEl}
                quill={quill}
                setShowEqEditor={setShowEqEditor}
                showEqEditor={showEqEditor}
                setValue={setValue}
                getValues={getValues}
                setAnchorEl={setAnchorEl}
              />
            </>
          );
        }}
      />
    </div>
  );
};

export default TextEditorForForm;
