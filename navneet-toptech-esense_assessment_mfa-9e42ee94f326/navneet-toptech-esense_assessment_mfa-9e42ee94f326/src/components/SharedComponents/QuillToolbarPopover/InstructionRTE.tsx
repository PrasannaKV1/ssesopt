import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactQuill from 'react-quill';
import Quill from 'quill';
import "react-quill/dist/quill.snow.css";
import "../TextEditor/TextEditor.css";
import { Controller, useFormContext } from "react-hook-form";


interface quillProps {
    registerName: string,
    setTextAreaOnchange: any,
    characterLimit: number,
    handlers: any;
    placeHolder?: string,
    fieldsRequired?: any,
    key: any
}

const InstructionRTE: React.FC<quillProps> = ({ registerName, setTextAreaOnchange, characterLimit, handlers, placeHolder, fieldsRequired, key }) => {
    const quillRef = useRef<any>(null);
    const { register, setValue, setError, watch, clearErrors, control, getValues } = useFormContext();
    const [validation, setValidation] = useState({})
    const [characterCount, setCharacterCount] = useState<number>(0);
    const [exceedsLimit, setExceedsLimit] = useState<boolean>(false);
    var Font = Quill.import('formats/font');
    Font.whitelist = ["English", "Hindi", "Marathi"];
    const editorContent = watch(registerName);

    useEffect(() => {
        setCharacterCount(editorContent?.replace(/<[^>]+>/g, "")?.length)
      }, [])

    const containerHandler = () => {
        const cont: any[] = []
        let fieldsReq: any[] = fieldsRequired ? fieldsRequired : ["language", , "common", "attachment", "formula", "image"]
        fieldsReq.includes("language") && cont.push([{ "font": Font.whitelist }])
        // fieldsReq.includes("header") && cont.push([{ 'header': [1, 2, 3, 4, 5, 6, false] }])
        fieldsReq.includes("biu") && cont.push(["bold", "italic", "underline"])
        fieldsReq.includes("common") && cont.push(["bold", "italic", "underline", "strike"],[{ align: '' }, {align: 'right'}, {align: 'center'}, {align: 'justify'}], [{ list: "ordered" }, { list: "bullet" }], [{ 'script': 'sub' }, { 'script': 'super' }], [{ 'indent': '-1' }, { 'indent': '+1' }], [{ 'color': [] }, { 'background': [] }])
        fieldsReq.includes("attachment") && cont.push(["link"])
        fieldsReq.includes("formula") && cont.push(['formula'], [{ table: true }])
        fieldsReq.includes("image") && cont.push([{ image: "image" }])
        return cont
    }

    const modules = useMemo(() => ({
        toolbar: {
            container: containerHandler(),
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


    useEffect(() => {
        const quill = quillRef.current?.getEditor();
        if (quill) {
            const preventImagePaste = (e: any) => {
                const clipboardData = e.clipboardData || (window as any).clipboardData;
                const pastedData = clipboardData.getData('text/plain');
                const isImagePasted = clipboardData.types.includes('Files');
                if (isImagePasted) {
                    e.preventDefault();
                } else {
                    const selection = quill.getSelection();
                    quill.clipboard.dangerouslyPasteHTML(selection.index, pastedData);
                }
            };
            quill.root.addEventListener('paste', preventImagePaste);
            return () => {
                quill.root.removeEventListener('paste', preventImagePaste);
            };
        }
    }, []);

    useEffect(()=>{
        if (characterCount > characterLimit) handlers && handlers('done', true)
        else handlers && handlers('done', false)
    }, [characterCount])


    return (
        <>
            <div className={`text-editor-component textHeightMedium  ${exceedsLimit ? "textLimitError" : ""}`}>
                <Controller
                    rules={validation}
                    control={control}
                    name={registerName}
                    render={() => {
                        const handleContentChange = (value: any) => {
                            setTextAreaOnchange && setTextAreaOnchange(value)
                            const currentLength = value.replace(/<[^>]+>/g, "").length;
                            if (characterLimit) {
                                if (currentLength > characterLimit) {
                                    const truncatedValue = value.slice(0, characterLimit);
                                    setExceedsLimit(true);
                                    handlers && handlers('done', true)
                                    // onChange(truncatedValue);
                                } else {
                                    // onChange(value)
                                    setExceedsLimit(false);
                                    handlers && handlers('done', false)
                                }
                            } else if (value == "<p><br></p>") {
                                // onChange("")
                            } else {
                                clearErrors(registerName);
                                setExceedsLimit(false);
                                handlers && handlers('done', false)
                                // onChange(value);
                            }
                            setCharacterCount(currentLength);
                        }
                        return (
                            <>
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    modules={modules}
                                    key={key}
                                    placeholder={
                                        placeHolder ? placeHolder : "Start typing..."
                                    }
                                    defaultValue={editorContent}
                                    formats={formats}
                                    onChange={handleContentChange}
                                />
                                {characterLimit && <div
                                    className={`character-count ${exceedsLimit ? "error" : ""
                                        }`}
                                >
                                    <span className='textCount'>{characterCount}</span>/{characterLimit} characters
                                    <br />
                                    {exceedsLimit && (
                                        <span className="error-message">
                                            Exceeded character limit
                                        </span>
                                    )}
                                </div>}
                            </>
                        )
                    }}
                />
            </div>
        </>
    );
};

export default React.memo(InstructionRTE);
