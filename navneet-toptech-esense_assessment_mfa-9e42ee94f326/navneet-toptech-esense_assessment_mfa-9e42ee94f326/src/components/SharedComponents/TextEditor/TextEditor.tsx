import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactQuill, { Quill } from 'react-quill-with-table';
import "react-quill-with-table/dist/quill.snow.css";
import "./TextEditor.css";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import * as QuillTableUI from "quill-table-ui";
import "quill-table-ui/dist/index.css";

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
interface TextProps {
    textEditorSize: string,
    mandatory?: boolean,
    setData?: (e: any) => void
}
const TextEditor: React.FC<TextProps> = ({ textEditorSize, mandatory,setData }) => {
    const quillRef = useRef<ReactQuill>(null);
    window.katex = katex;
    var Font = Quill.import('formats/font');
    Font.whitelist = ["English", "Hindi", "Marathi"];
    Quill.register(Font, true);
    const [content, setContent] = useState('');
    const [isShow, setIsShow] = useState<boolean>(false)
    const CustomButton = () => {
        let clonedShow = !isShow
        setIsShow(clonedShow)
    }

    const formats: any = [
        'header', 'font', 'background', 'color', 'code',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent', 'script', 'align', 'direction',
        'link', 'image', 'code-block', 'formula'
    ]
    const handleProcedureContentChange = (value: any) => {
        console.log(value)
        setData && setData(value)
        setContent(value)
    }
    const handleChange = (content: any, delta: any, source: any, editor: any) => {
        setContent(editor.getContents())
        setData && setData(editor.getContents())
    }
    function quillGetHTML(inputDelta: any) {
        var tempCont = document.createElement("div");
        (new Quill(tempCont)).setContents(inputDelta);
        return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
    }
    
    return (
        <div className={`text-editor-component ${textEditorSize == "Medium" ? "textHeightMedium" : "textHeightSmall"}`}>
            {/* <div className='text-label h4 fontW600'>{`${label} ${mandatory ? " *" : ""}`}</div> */}
            <ReactQuill
                ref={quillRef}
                theme="snow"
                modules={{
                    table: true,
                    tableUI: true,
                    toolbar: [
                      [{ font: Font.whitelist }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ script: "sub" }, { script: "super" }],
                      [{ indent: "-1" }, { indent: "+1" }],
                      [{ color: [] }, { background: [] }],
                      [{ table: true }],
                      ["link", "image"],
                      ["formula"],
                    ],
                    clipboard: {
                      matchVisual: false,
                    },
                  }}
                placeholder={"Start typing..."}
                value={content}
                formats={formats}
                onChange={handleProcedureContentChange}                                  
            />
            {/* <EditableMathExample /> */}
            {/* <div dangerouslySetInnerHTML={{ __html: quillGetHTML(content) }}></div> */}
        </div>)
}

export default TextEditor