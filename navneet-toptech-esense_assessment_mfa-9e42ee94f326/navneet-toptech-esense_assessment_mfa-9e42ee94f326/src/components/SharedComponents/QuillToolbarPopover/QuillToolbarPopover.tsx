import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import { Popover, Button } from "@mui/material";
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";
import "./QuillToolbarPopover.css"
import "../TextEditor/TextEditor.css";
import TextField from '@mui/material/TextField';
import { htmlTagRegex } from "../../../constants/helper";
import { MessageContext } from "../../QuestionPaperContainer/QuestionPaperPreviewforPrint/QuestionPaperPreviewforPrint";
import { MIFMessageContext } from "../../ManualQuestionPaperContainer/MIFQuestionPaperPreviewforPrint/MIFQuestionPaperPreviewforPrint";

// type QuillSources = "user" | "api" | "silent";

interface quillProps {
  anchorTag: any;
  setQuillPopupOpen:any;
  quillPopupOpen:boolean;
  changedPopoverValue?:any;
  reqBody?:any;
  setTriggerReqBody?:any;
  setmarkerrorQnsIds?:(prev:any)=>void;
  grperrorQnsIds?:any
  isManualFlow?:boolean
  setTotalTime?: any;
}

const QuillClipboard = Quill.import("modules/clipboard");
const Delta = Quill.import("delta");

// class CustomClipboard extends QuillClipboard {
//   onPaste(range: any, { text }: { text: string }) {
//     const format = this.quillRef.getFormat(range.index);
//     const font = format["font"];
//     const delta = new Delta()
//       .retain(range.index)
//       .delete(range.length)
//       .insert(text, { font });
//     this.quillRef.updateContents(delta, "user" as QuillSources);
//     this.quillRef.setSelection(
//       range.index + delta.length(),
//       "silent" as QuillSources
//     );
//   }
// }
// Quill.register("modules/clipboard", CustomClipboard, true);

const QuillToolbarPopover: React.FC<quillProps> = ({ grperrorQnsIds, setmarkerrorQnsIds, anchorTag, setQuillPopupOpen, quillPopupOpen, changedPopoverValue, reqBody, setTriggerReqBody, isManualFlow, setTotalTime }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [htmlValue, setHtmlValue] = useState("");
  const quillRef = useRef<any>(null);
  const getCurrentContext = useContext(MessageContext);
  const getMIFCurrentContext = useContext(MIFMessageContext);

  useEffect(() => {
    if (anchorEl && quillRef.current) {
      quillRef.current.getEditor().root.innerHTML = htmlValue;
    }
  }, [anchorEl]);

  const handleOpenPopover = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const replaceNestedObjectById = (template:any, id: string, replacement: any, type:any)=> {
    if (template?.templateBuilderInfo && template?.templateBuilderInfo?.templateParts) {
      const parts = template.templateBuilderInfo.templateParts;
      replaceNestedObject(parts, id, replacement, type);
    }
  }
  const removeHTMLtags = (value:string,tags?:string) =>{
    if(tags == 'breakTag'){
      return value?.replace("<p><br></p>", "")
    }else{
      return value?.replace(htmlTagRegex, "") != '' ? value.replace(htmlTagRegex, "") : '0'
    }
  }
  const replaceNestedHeaderObj = (template:any, sectionObj:any, replaceString:string)=> {
    if (template?.headerDetails) {
      const headerPart = template;
      headerPart?.headerDetails.map((items:any) => {
        if(sectionObj?.sectionName == items?.sectionTypeKey){
          items?.sectionDetails?.sectionFields.map((sectionItem:any) => {
            if(sectionItem?.fieldKey == sectionObj?.fieldKey){
              if(sectionObj?.sectionName == "subjectSection"){
                if (sectionObj?.fieldKey == "totalTime") {
                  setTotalTime(removeHTMLtags(replaceString));
                }
                sectionObj?.fieldKey == "subject" ? sectionItem.fieldValue = removeHTMLtags(replaceString, 'breakTag') : sectionObj?.key == 'timeLabel' ? sectionItem.fieldName = removeHTMLtags(replaceString, 'breakTag') : sectionObj?.fieldKey == "totalMarks" ? sectionItem.fieldName = removeHTMLtags(replaceString) : sectionItem.fieldValue = removeHTMLtags(replaceString);
              }else if(sectionObj?.sectionName == "studentNameSection"){
                sectionItem.fieldName = replaceString
              }else if(sectionObj?.sectionName == "examNameSection"){
                sectionItem.fieldValue = replaceString
              }
            }
            return;
          })
        }
      })
      setTriggerReqBody(sectionObj)
    }
  }

  const replaceNestedObject = (parts:any, id: string, replacement: any, questionType:any)=> {
    for (let i = 0; i < parts?.length; i++) {
      if (parts[i].id === id && parts[i].type == questionType) {
        parts[i] = replacement;
        return;
      } else if (parts[i]?.children) {
        replaceNestedObject(parts[i].children, id, replacement, questionType);
      }
    }
  }

  const handleClosePopover = () => {
    setQuillPopupOpen(false);
    setTimeout(() => {
      setTriggerReqBody(false)
    },500)

  };

  const handleQuillChange = (content: any, delta: any, source: any, editor: { getHTML: () => any; }) => {
    const html = editor.getHTML();
    // setTextValue(editor.getText());
    // setHtmlValue(html);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if(changedPopoverValue?.fieldKey == "totalTime" && changedPopoverValue?.key == "" ){
      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Shift', 'Enter', 'Tab'];
      if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    }    
  };

  const handleInputBlur = () => {
    console.log("Actual Value to be stored:", textValue);
    console.log("HTML Value to be stored:", htmlValue);
  };

  const handleApplyChanges = async() => {
    isManualFlow ? getMIFCurrentContext?.setStateFunction('actions', JSON.parse(JSON.stringify(reqBody))) :
    getCurrentContext?.setStateFunction('actions', JSON.parse(JSON.stringify(reqBody)))
    let html :any;
    let text :any;
    if(changedPopoverValue?.key!== "marks" && changedPopoverValue?.key!== "time"){
      html=quillRef.current.getEditor().root.innerHTML;
      text = quillRef.current.getEditor().getText();
      setHtmlValue(html);
      setTextValue(text);
    }else{
      html=htmlValue;
      text=htmlValue;
    }
    if(changedPopoverValue?.sectionName){
      replaceNestedHeaderObj(reqBody, changedPopoverValue, html)
    }else{
      changedPopoverValue.currentQuestion[changedPopoverValue?.key] = html
      replaceNestedObjectById(reqBody?.bodyTemplate, changedPopoverValue?.currentQuestion?.id, changedPopoverValue.currentQuestion, changedPopoverValue.questionType)
    }
    isManualFlow ? getMIFCurrentContext?.setStateFunction('undo',false) : getCurrentContext?.setStateFunction('undo',false)
    isManualFlow ? getMIFCurrentContext?.setStateFunction('redo',true) : getCurrentContext?.setStateFunction('redo',true)
    if(setmarkerrorQnsIds && changedPopoverValue?.key=="marks" ){
      const removeQP=grperrorQnsIds?.filter((ele:any)=>ele?.find((e:any)=>[changedPopoverValue?.currentQuestion?.id]?.includes(e)))?.flatMap((x:any)=>x)
      setmarkerrorQnsIds((prev:any)=>prev?.filter((val:any)=>!removeQP?.includes(val)))
    }
    handleClosePopover();
    handleCancelChanges();
  };

  const handleCancelChanges = () => {
    setAnchorEl(null);
    setQuillPopupOpen(false);
  };
  const Quill = ReactQuill.Quill
  var Font = Quill.import('formats/font');
  Font.whitelist = ["English", "Hindi", "Marathi"];

  const modules = useMemo(() => ({
    toolbar: {
        container: [
            [{ "font": Font.whitelist }],
            ["bold", "italic", "underline"],
        ],
        clipboard: {
            matchVisual: false
        }
    }
}), [])
const formats: any = [
    'header', 'font', 'background', 'color', 'code',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'script', 'align', 'direction',
    'link', 'image', 'code-block', 'formula'
]
function truncateDecimal(num:any) {
  if (num.includes('.')) {
    const [integerPart, decimalPart] = num.split('.');
    if (decimalPart === '') {
      return integerPart;
    }
  }
  return num;
}
const textFieldChange=(e:any)=>{
  let num:any=e?.replace(/[^0-9]/g, '');
  setHtmlValue(num)
}
useEffect(()=>{
if(changedPopoverValue){
  setHtmlValue(changedPopoverValue?.value)
}
},[changedPopoverValue])

// const handleFocusChange = (editor: any) => {
//   if (editor.current) {
//     const fontSelect = editor.current
//       .getEditor()
//       .container.parentNode.querySelector(
//         "div.quill .ql-toolbar .ql-formats select.ql-font"
//       );
//     if (fontSelect) {
//       fontSelect.value = "English"; // Set the font to 'English'
//       fontSelect.dispatchEvent(
//         new Event("change", { bubbles: true })
//       );
//     }
//   }
// };

  return (
    <>
      <Popover
        open={quillPopupOpen}
        onClose={handleClosePopover}
        className={`${(changedPopoverValue?.key== "marks" || changedPopoverValue?.key == "time") ? "quillPopupToolNumber":""} quillPopupTool`}
        anchorEl={anchorTag}
      >
        <Button onClick={handleApplyChanges}>Apply</Button>
        <Button onClick={handleCancelChanges}>Cancel</Button>
        {(changedPopoverValue?.key!== "marks" && changedPopoverValue?.key !== "time")?<ReactQuill
          theme="snow"
          modules={modules}
          placeholder={"Start typing..."}
          formats={formats}
          ref={quillRef}
          value={htmlValue}
          onChange={handleQuillChange}
          onKeyDown={handleKeyDown}
          // onFocus={() => handleFocusChange(quillRef)}
        />  :
        <div className="previewNumberTextBox">
        <TextField className="inputFieldStyling mediumSize"  placeholder={"Start typing..."} value={htmlValue}
        onChange={(e:any)=>textFieldChange(e.target.value.replace(/^0/, ''))} 
        onKeyPress={(event) => {
             const allowedKeys = /[0-9\b\.\b]/;
             if (!allowedKeys.test(event.key)) {
                 event.preventDefault();
             }
       }}
       inputProps={{
        maxLength: 3,
      }}
         />
         </div>
        }
      </Popover>
    </>
  );
};

export default QuillToolbarPopover;