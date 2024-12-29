import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactQuill, { Quill } from "react-quill-with-table";
import "react-quill-with-table/dist/quill.snow.css";
import "../TextEditor/TextEditor.css";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import * as QuillTableUI from "quill-table-ui";
import "quill-table-ui/dist/index.css";
import { useFormContext, Controller } from "react-hook-form"
import { Typography } from '@mui/material';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import underLineIcon from '../../../assets/images/underLine.svg'
import { v4 as uuidv4 } from 'uuid';
import { imageAPI } from "../../../Api";
import { x_tenant_id } from '../../../constants/urls';
import customTableSVG from '../../../assets/images/customTable.svg';
import equation from '../../../assets/images/Equation.svg';
import CustomTablePopover from '../QuillToolbarPopover/CustomTablePopover';
import MathjaxPopover from '../QuillToolbarPopover/MathjaxPopover';
const BlockEmbed = Quill.import('blots/block/embed');


declare global {
    interface Window {
        katex: any;
    }
}
interface ArrayObject {
    id: any;
    index: number;
    labelId: number
}
interface TextProps {
    textEditorSize: string,
    mandatory?: boolean,
    registerName: string,
    fillInTheBlanks?: boolean,
    setUniqueArr: any;
    uniqueArr: any[];
    isEdit: boolean;
    compIndex?: number | undefined;
    addNewToggler?: boolean,
    key?: number,
    setSpinnerStatus?: (e: any) => void
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

const FIBTextEditor: React.FC<TextProps> = ({ setSpinnerStatus, textEditorSize, mandatory, registerName, fillInTheBlanks, setUniqueArr, uniqueArr, isEdit, compIndex, addNewToggler, key }) => {
    const { register, setValue, setError, watch, clearErrors, control, getValues, unregister } = useFormContext();
    const [validation, setValidation] = useState(mandatory ? { required: "This Field is Required" } : {})
    const quillRef = useRef<ReactQuill>(null);
    const [quill, setQuill] = useState<any>(null);
    const [showEditor, setShowEditor] = useState<any>(false);
    const [firstRender, setFirstRender] = useState<boolean>(true);
    const [showTableOptions, setShowTableOptions] = useState(false);
    const [showEqEditor, setShowEqEditor] = useState(false);
    const [anchorEl, setAnchorEl] = useState<any>(null);
    window.katex = katex;
    var Font = Quill.import('formats/font');
    Font.whitelist = ["English", "Hindi", "Marathi"];
    Quill.register(Font, true);
    const [content, setContent] = useState('');
    const editorContent = watch(registerName);
    const modules = {
        table: true,
        tableUI: true,
        toolbar: [
            [{ "font": Font.whitelist }],
            ["bold", "italic", "underline", "strike"],
            [{ align: '' }, { align: 'right' }, { align: 'center' }, { align: 'justify' }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            ["link", "image"],
            ['formula']
        ],
        clipboard: {
            matchVisual: false
        },
        // blank: true,
    }

    const formats: any = [
        'header', 'font', 'background', 'color', 'code',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent', 'script', 'align', 'direction',
        'link', 'image', 'code-block', 'formula'
    ]
    const handleContentChange = (value: any) => {
        setContent(value)
        if (value == "<p><br></p>" && mandatory) {
            setValue(registerName, null)
            register(registerName, validation);
        } else {
            clearErrors(registerName)
            setValue(registerName, value)
        }
    }
    const handleChange = (content: any, delta: any, source: any, editor: any) => {
        setContent(editor.getContents())
    }
    function quillGetHTML(inputDelta: any) {
        var tempCont = document.createElement("div");
        (new Quill(tempCont)).setContents(inputDelta);
    }

    const getIdName = () => {
        if (fillInTheBlanks as Boolean) {
            return "quill_blanks" as string
        } else {
            return "" as string
        }
    };

    const formattedResult = (data: ArrayObject[]) => {
        let indexArray = data.map((ele: ArrayObject) => ele.index)
        indexArray.sort((a: number, b: number) => {
            return a - b;
        });
        const settedArray = indexArray.map((ele: number) => {
            return data.find((element: ArrayObject) => element.index === ele)
        })
        return settedArray
    }

    const sortArrayWithOrder = (list: any) => {
        let indexArray = list.map((ele: any) => ele?.order)
        indexArray.sort((a: number, b: number) => {
            return a - b;
        });
        const settedArray = indexArray.map((ele: number) => {
            return list.find((element: any) => element?.order === ele)
        })
        return settedArray
    }

    const getEditUniqueArr = () => {
        const quillDelta = quill.editor.getContents()
        let innerIndex = 0
        const finalArray: ArrayObject[] = []
        quillDelta.ops.map((ele: any, index: number) => {
            const id = uuidv4();
            if (typeof ele.insert === "string") {
                innerIndex = innerIndex + ele.insert.length
            } else if ("formula" in ele.insert) {
                if (ele.insert.formula !== "_______________") {
                    innerIndex = innerIndex + 1
                } else {
                    finalArray.push({ index: innerIndex, id: id, labelId: finalArray.length ? finalArray[finalArray.length - 1].labelId + 1 : 0 })
                    innerIndex += 1
                }
            }
        })
        setUniqueArr(finalArray)
    }

    const renderComponent = () => {
        setUniqueArr([])
        setShowEditor(false)
        setTimeout(() => {
            setShowEditor(true)
        }, 700)
    }

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
        setSpinnerStatus && setSpinnerStatus(true)
        try {
            if (!file) {
                console.log("No file selected");
                return;
            }
            if (!quill) {
                console.log("Quill reference is null");
                return;
            }

            console.log("File:", file);

            const range = quill.getEditor()?.getSelection();
            console.log("Selection range:", range);

            const insertIndex = range
                ? range.index
                : quill.getEditor()?.getLength();
            console.log("Insert index:", insertIndex);

            if (file) {
                const base64 = await covertBase64(file);
                const profileData = {
                    data: base64,
                    filePath: `erp/assess/questions/images/${x_tenant_id}/`,
                    tenant: process.env.REACT_APP_TENANT_UPLOAD,
                    isOnline: 1,
                };

                const response = await imageAPI.post("files/upload_file", profileData);
                console.log("Image upload response:", response);
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
                    let imageArray = getValues("questionImages") || [];
                    imageArray.push({
                        uploadPath: response.data.uploadedPath,
                    });
                    setValue("questionImages", imageArray);


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
        setSpinnerStatus && setSpinnerStatus(false)
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
        if (quill && isEdit && firstRender && (getValues("blankMetaInfo") || getValues(`blankMetaInfo_${compIndex}`))) {
            setFirstRender(false)
            getEditUniqueArr()
            if (getValues("blankMetaInfo")) {
                console.log("hii")
                setValue("blankMetaInfo", sortArrayWithOrder(getValues("blankMetaInfo")))
            } else {
                setValue(`blankMetaInfo_${compIndex}`, sortArrayWithOrder(getValues(`blankMetaInfo_${compIndex}`)))
            }
        }
    }, [getValues("blankMetaInfo"), getValues(`blankMetaInfo_${compIndex}`), quill])

    useEffect(() => {
        register(compIndex ? `blankMetaInfo_${compIndex}` : 'blankMetaInfo', { required: "Atleast one blank is required" })
    }, [register])

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        renderComponent()
    }, [addNewToggler])

    useEffect(() => {
        if (quill) {
            const toolbar = quill.getEditor()?.getModule("toolbar");
            if (toolbar) {
                toolbar.addHandler("image", handleToolbarImageClick);
            }
        }
    }, [quill]);

    const handleCustomButtonClick = () => {
        setShowTableOptions(true);
    };

    useEffect(() => {
        if (quill) {
            if (!quill.getEditor()?.getModule("toolbar").container.querySelector('.ql-custom-table-icon')) {
                const customIcon = document.createElement("span");
                customIcon.className = "ql-custom-table-icon";
                const imgElement = document.createElement("img");
                imgElement.src = customTableSVG;
                customIcon.addEventListener("click", (event) => {
                    handleCustomButtonClick();
                    setAnchorEl(event.currentTarget)
                });
                customIcon.appendChild(imgElement);
                quill.getEditor()?.getModule("toolbar").container.appendChild(customIcon);
            }
        }
    }, [quill]);

    // For rendering equation editor button
    useEffect(() => {
        if (quill) {
            const customIcon = document.createElement("span");
            customIcon.style.cursor = 'pointer'
            customIcon.style.marginLeft = '15px'
            customIcon.className = "ql-custom-equation-editor";
            const imgElement = document.createElement("img");
            customIcon.className = "ql-custom-equation-editor";
            imgElement.src = equation;
            customIcon.addEventListener("click", (event) => {
                setShowEqEditor((prevState) => !prevState);
                setAnchorEl(event.currentTarget)
            });
            customIcon.appendChild(imgElement);
            quill.getEditor()?.getModule("toolbar").container.appendChild(customIcon);
        }
    }, [quill]);


    const insertTable = (rowCount: number, colCount: number) => {
        if (quill) {
            quill.focus();
            const quillEditor = quill.getEditor();
            const table = quillEditor.getModule('table');
            console.log(table)
            if (table) {
                table.insertTable(rowCount, colCount);
                setShowTableOptions(false);
            }
        }
    };

    return (
        <div className={`text-editor-component ${textEditorSize == "Medium" ? "textHeightMedium" : "textHeightSmall"}`}>
            <Controller
                rules={validation}
                control={control}
                name={registerName}
                render={({ field: { onChange, value, ref }, formState, fieldState }) => {
                    // if (uniqueArr.length && quill) {
                    //     quill?.editor?.on('selection-change', function (range: any, oldRange: any, source: any) {
                    //         const totalIndex = uniqueArr?.map((ele: any) => ele.index)
                    //         if (range && range.length == 0) {
                    //             if (totalIndex.includes(range.index)) {
                    //                 quill?.editor?.setSelection(range.index + 2)
                    //             } else if (totalIndex.includes(range.index - 1)) {
                    //                 quill?.editor?.setSelection(range.index + 1)
                    //             } else {
                    //                 quill?.editor?.setSelection(range.index)
                    //             }
                    //         }
                    //     })
                    // }
                    const handleContentChange = (content: any, del: any, source: any, editor: any) => {

                        const id = uuidv4();
                        let delta = del
                        delta?.ops?.length > 0 && delta?.ops?.forEach((ops: any) => {
                            if (ops?.insert?.formula === '_______________' && ops?.attributes) {
                                delete ops.attributes
                                return true
                            }
                        })
                        const selection: any = quill?.editor?.getSelection()?.index
                        if (content == "<p><br></p>" && mandatory) {
                            setValue(registerName, "", { shouldDirty: true })

                        } else {
                            setValue(registerName, content, { shouldDirty: true })
                        }
                        if (delta?.ops?.length < 4 || (delta?.ops?.length == 4 && Object.keys(delta?.ops[3]).includes("insert" && "attributes"))) {
                            if (delta?.ops?.length > 1) {
                                if ((delta?.ops?.length == 2 && JSON.stringify(delta?.ops[0]) == '{"insert":{"formula":"_______________"}}') || JSON.stringify(delta?.ops[1]) == '{"insert":{"formula":"_______________"}}') {
                                    let label = 0
                                    if (uniqueArr?.length) {
                                        label = Math.max(...uniqueArr.map((ele: any) => ele?.labelId))
                                    }
                                    const indexChanged = uniqueArr.map((element: any) => {
                                        if (element?.index > delta.ops[0].retain || element?.index == delta.ops[0].retain || (JSON.stringify(delta?.ops[0]) == '{"insert":{"formula":"_______________"}}')) {
                                            element.index = element?.index + 2
                                            return element
                                        } else {
                                            return element
                                        }
                                    })
                                    setUniqueArr(formattedResult([...indexChanged, { index: delta.ops[0].retain ? delta.ops[0].retain : 0, id: id, labelId: label + 1 }]))
                                } else if ("delete" in delta.ops[1]) {
                                    const startIndex = delta.ops[0].retain
                                    const endIndex = delta.ops[1].delete !== 1 ? delta.ops[1].delete + delta.ops[0].retain : delta.ops[0].retain
                                    const tempArray = delta.ops[1].delete == 1 ? uniqueArr?.filter((ele: any) => (ele?.index !== startIndex)) : uniqueArr?.filter((ele: any) => (ele?.index < startIndex || ele?.index > endIndex))
                                    const differentObjects = uniqueArr?.filter((obj1: any) => !tempArray?.find((obj2: any) => obj1?.id === obj2?.id))
                                    if (differentObjects?.length) {
                                        differentObjects.map((ele: any) => {
                                            // unregister(compIndex ? `blankMetaInfo_${compIndex}.${ele?.labelId}` : `blankMetaInfo.${ele?.labelId}`)
                                            if (compIndex && getValues(`blankMetaInfo_${compIndex}`) || !compIndex && getValues("blankMetaInfo")) {
                                                const deleteable = [...getValues(compIndex ? `blankMetaInfo_${compIndex}` : `blankMetaInfo`)]
                                                delete deleteable?.[ele.labelId]
                                                setValue(compIndex ? `blankMetaInfo_${compIndex}` : `blankMetaInfo`, deleteable)
                                            }
                                        })
                                    }
                                    const indexChanged = tempArray.map((element: any) => {
                                        if (element?.index > startIndex) {
                                            element.index = element?.index - delta.ops[1].delete
                                            return element
                                        } else {
                                            return element
                                        }
                                    })
                                    setUniqueArr(formattedResult(indexChanged))
                                } else {
                                    const indexChanged = uniqueArr.map((element: any) => {
                                        if (element?.index > delta.ops[0].retain || element?.index == delta.ops[0].retain || (JSON.stringify(delta?.ops[0]) == '{"insert":{"formula":"_______________"}}')) {
                                            element.index = element?.index + 1
                                            return element
                                        } else {
                                            return element
                                        }
                                    })
                                    setUniqueArr(formattedResult(indexChanged))
                                }
                            } else if ("delete" in delta.ops[0]) {
                                const startIndex = 0
                                const endIndex = delta.ops[0].delete !== 1 ? delta.ops[0].delete + 0 : 0
                                const tempArray = delta.ops[0].delete == 1 ? uniqueArr?.filter((ele: any) => (ele?.index !== startIndex)) : uniqueArr?.filter((ele: any) => (ele?.index < startIndex || ele?.index > endIndex))
                                const differentObjects = uniqueArr?.filter((obj1: any) => !tempArray?.find((obj2: any) => obj1?.id === obj2?.id))
                                if (differentObjects?.length) {
                                    differentObjects.map((ele: any) => {
                                        // unregister(compIndex ? `blankMetaInfo_${compIndex}.${ele?.labelId}` : `blankMetaInfo.${ele?.labelId}`)
                                        if (compIndex && getValues(`blankMetaInfo_${compIndex}`) || !compIndex && getValues("blankMetaInfo")) {
                                            const deleteable = [...getValues(compIndex ? `blankMetaInfo_${compIndex}` : `blankMetaInfo`)]
                                            delete deleteable?.[ele.labelId]
                                            setValue(compIndex ? `blankMetaInfo_${compIndex}` : `blankMetaInfo`, deleteable)
                                        }
                                    })
                                }
                                const indexChanged = tempArray.map((element: any) => {
                                    if (element?.index > startIndex) {
                                        element.index = element?.index - delta.ops[0].delete
                                        return element
                                    } else {
                                        return element
                                    }
                                })
                                setUniqueArr(formattedResult(indexChanged))
                            } else {
                                if (JSON.stringify(delta.ops[0]) == '{"insert":{"formula":"_______________"}}') {
                                    setUniqueArr(formattedResult([...uniqueArr, { index: 0, id: id, labelId: uniqueArr.length ? uniqueArr[uniqueArr.length - 1].labelId + 1 : 1 }]))
                                } else if ("delete" in delta.ops[0]) {
                                    setUniqueArr([])
                                }
                                else {
                                    if (uniqueArr?.length > 0) {
                                        const indexChanged = uniqueArr.map((element: any) => {
                                            element.index = element?.index + 1
                                            return element
                                        })
                                        setUniqueArr(formattedResult(indexChanged))
                                    }
                                }
                            }
                        }

                    }

                    const insertBlank = () => {
                        if (quill) {
                            const selection: any = quill.editor.getSelection();
                            if (selection) {
                                quill.getEditor().clipboard.dangerouslyPasteHTML(selection?.index, '<span class="ql-formula color-black" data-value="_______________"><span contenteditable="false" ><span></span><span style="color:#000">_______________</span></span></span>&nbsp;', "api");
                            }
                        }
                    }
                    return (
                        <>
                            {showTableOptions && (
                                <CustomTablePopover anchorTag={anchorEl} setTablePopupOpen={setShowTableOptions} tablePopupOpen={showTableOptions} insertTable={insertTable} />
                            )}
                            {showEditor && <ReactQuill
                                ref={(el: any) => {
                                    setQuill(el);
                                }}
                                theme="snow"
                                modules={modules}
                                placeholder={" Start typing..."}
                                // value={value ? value : editorContent}
                                formats={formats}
                                onChange={handleContentChange}
                                id={getIdName()}
                                defaultValue={editorContent}
                                key={key}
                            />}
                            {
                                fillInTheBlanks &&
                                <div className="allstudents-footer">
                                    <div className="allstudents-label">
                                        <Typography>
                                            Insert
                                        </Typography>
                                    </div>
                                    <span className='dividers'></span>
                                    <div className="allstudentActionBtn">
                                        <ButtonComponent icon={""} image={""} textColor="#385DDF" backgroundColor="#E8EEFD" disabled={uniqueArr.length > 2 ? true : false} buttonSize="small" type="contained" onClick={() => { insertBlank() }} label="___(Blank)____" minWidth="200" hideBorder={true} />
                                    </div>
                                </div>
                            }
                            <MathjaxPopover anchorEl={anchorEl} quill={quill} setShowEqEditor={setShowEqEditor} showEqEditor={showEqEditor} setValue={setValue} getValues={getValues} setAnchorEl={setAnchorEl} />
                        </>
                    )
                }}
            />
        </div>)
}

export default FIBTextEditor