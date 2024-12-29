import { Popover } from "@mui/material"
import MathJaxComponent from "./Mathjax";
import axios from "axios";
import { _arrayBufferToBase64 } from '../../../constants/helperFunctions';
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { x_tenant_id } from "../../../constants/urls";
import { imageAPI } from "../../../Api";
import { useEffect, useState } from "react";
import SelectBoxComponent from "../SelectBoxComponent/SelectBoxComponent";
import Quill from 'quill';
const Parchment = Quill.import('parchment');
interface IMathjaxProps {
    showEqEditor: boolean;
    setShowEqEditor: (showEqEditor: boolean) => void;
    anchorEl: any;
    quill: any;
    getValues: any;
    setValue: any;
    setAnchorEl?: (anchorEl: any) => void;
}

const MathjaxPopover = ({ showEqEditor, setShowEqEditor, anchorEl, quill, getValues, setValue, setAnchorEl }: IMathjaxProps) => {
    const [eqSvg, setEqSvg] = useState<any>(null);
    const [editorFontSize, setEditorFontSize] = useState('');
    const [editorFontFamily, setEditorFontFamily] = useState('');
    const [currentLatex, setCurrentLatex] = useState('')
    const [selectedEquationImg, setSelectedEquationImg] = useState<React.RefObject<HTMLElement> | null>(null)
    
    const renderEquation = async (latex?: string) => {
        const apiEndPoint = 'https://latex.codecogs.com/svg.image';
        const output = document.getElementById('output');
        const getLatex = output?.innerText.substring(47, output?.innerText.indexOf('title') - 2)
        const svgContainer = document.getElementById("svg-container");
        if(latex !== "null" && getLatex !== "null"){
            const svg = await axios.get(`${apiEndPoint}?${latex || getLatex}`, { responseType: "arraybuffer" })
            const base64 = _arrayBufferToBase64(svg.data)
            if (svgContainer) {
                svgContainer.innerHTML = ''
                const imgEl = document.createElement('img');
                imgEl.src = `data:image/svg+xml;base64,${base64}`
                svgContainer.appendChild(imgEl);
                setEqSvg(`data:image/svg+xml;base64,${base64}`)
                setCurrentLatex(latex || getLatex || '')
            }
        } else {
            if (svgContainer) {
                svgContainer.innerHTML = ''
            }
        }
    }

    const insertEq = async () => {
        if (quill) {
            setShowEqEditor(false)
            setCurrentLatex("");
            quill.focus();
            const selection: any = quill.editor.getSelection();
            if (selection) {
                const profileData = {
                    data: eqSvg,
                    filePath: `erp/assess/questions/images/${x_tenant_id}/`,
                    tenant: process.env.REACT_APP_TENANT_UPLOAD,
                    isOnline: 1,
                };
                const response = await imageAPI.post("files/upload_file", profileData);
                const imageHtml = `<img src="${eqSvg}" style="width: auto;" alt="${currentLatex}|${response.data.uploadedPath}" />`;
                let imageArray = getValues("questionImages") || [];
                imageArray.push({
                    uploadPath: response.data.uploadedPath,
                });
                setValue("questionImages", imageArray);
                quill.getEditor().clipboard.dangerouslyPasteHTML(selection?.index, imageHtml, 'api', true, eqSvg);
                selectedEquationImg?.current?.remove()
            }
        }
    }

    const fontSizes = [
        {value: 'tiny', label: '5pt'},
        {value: 'small', label: '9pt'},
        {value: '', label: '10pt'},
        {value: 'large', label: '12pt'},
        {value: 'LARGE', label: '18pt'},
        {value: 'huge', label: '20pt'},
    ]
    const fontFamily = [
        {value: 'jvn', label: 'Verdana'},
        {value: 'cmb', label: 'Computer Modern'},
        {value: '', label: 'Latin Modern'},
        {value: 'phv', label: 'Helvetica'},
        {value: 'phn', label: 'Helvetica Neue'},
        {value: 'tx', label: 'tx Sans Serif'},
        {value: 'px', label: 'px Sans Serif'},
        {value: 'cs', label: 'Comic Sans'},
    ]

    useEffect(() => {
        if(quill){
            quill.getEditor().root.ondblclick = ((e: any) => {
                if(e.target.style.width === "auto"){ // Codecogs Image
                    const equationEditorIcon = document.getElementsByClassName('ql-custom-equation-editor')
                    setSelectedEquationImg({ current: e.target })
                    setAnchorEl?.(equationEditorIcon[0])
                    setShowEqEditor(true)
                    const latex = e.target.alt.split("|")
                    latex.pop()
                    setCurrentLatex(latex.join(""))
                }
            });
        }
    }, [quill])

    return (
        <Popover
            open={showEqEditor}
            onClose={() => {setShowEqEditor(false); setCurrentLatex(""); setSelectedEquationImg(null)}}
            className={`quillPopupToolNumber quillPopupTool quillPopTableFullWidth`}
            anchorEl={anchorEl}
        >
            <div id='mathjax-container'>
                <div id='toolbar'></div>
                <div id='latexInput'></div>
                <div id="output" style={{ display: "none" }} />
                <div id='svg-container' style={{ marginBottom: "10px" }}></div>
                <MathJaxComponent  renderEquation={renderEquation} editorFontSize={editorFontSize} editorFontFamily={editorFontFamily} currentLatex={currentLatex} />
                <div className="mathpix-searchAndBtn">
                    <div className='mathjax-font-style'>
                        <SelectBoxComponent variant={'fill'} selectedValue={''} clickHandler={(e: any) => setEditorFontSize(fontSizes[e].value)} selectLabel={'Font Size'} selectList={fontSizes.map((el => el.label))} mandatory={false} />
                        <SelectBoxComponent variant={'fill'} selectedValue={''} clickHandler={(e: any) => setEditorFontFamily(fontFamily[e].value)} selectLabel={'Font Family'} selectList={fontFamily.map((el => el.label))} mandatory={false} />
                    </div>
                    <ButtonComponent icon={''} image={""} textColor="#01B58A" backgroundColor="#01B58A" buttonSize="Medium" type="transparent" onClick={insertEq} label="Use" minWidth="10" hideBorder={true} />
                </div>
            </div>
        </Popover>
    )
}

export default MathjaxPopover