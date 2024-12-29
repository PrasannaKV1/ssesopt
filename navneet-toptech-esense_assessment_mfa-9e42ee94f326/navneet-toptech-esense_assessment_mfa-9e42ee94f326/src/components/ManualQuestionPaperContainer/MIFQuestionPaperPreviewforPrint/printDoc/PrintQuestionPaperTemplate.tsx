import React, { useEffect, useState } from 'react';
import QuestionPaperTemplate from '../../../QuestionPaperContainer/QuestionPaperOPTScreen/TemplatePreview/QuestionPaperTemplate'
import "./PrintQuestionPaperTemplate.css"
import VersionHistory from '../../../SharedComponents/VersionHistory/VersionHistory';
import img1 from "../../../../assets/images/defaultLogo.png"
type Props = {
    templateFontDetails: any;
    ReqBody: any;
    replace: any;
    replaceQp: any;
    templatePrintEdit: any;
    previewMode: any;
    setAnchorEl: any;
    templateJson: any;
    changedPopoverValue: any;
    setChangedPopoverValue: any;
    triggerReqBody: any;
    dragPositionHeader: any;
    setStateFunction?: any;
    printForPreviewEdit: any;
    previewDate: any;
    markerrorQnsIds?:any;
    versionHistoryData?:any;
    printWithAnswer?:boolean;
    printConfig?:any
    workbookStyle?:boolean;
};

  

const PrintQuestionPaperTemplate = React.forwardRef<HTMLDivElement, Props>(
    ({ templateFontDetails,markerrorQnsIds, ReqBody, replace, replaceQp, templatePrintEdit, setAnchorEl, previewMode, templateJson, changedPopoverValue, setChangedPopoverValue, triggerReqBody, dragPositionHeader, setStateFunction, printForPreviewEdit, previewDate, versionHistoryData, printWithAnswer,printConfig, workbookStyle }, ref) => {
        const [dynamicBgLogo,setDynamicBgLogo] = useState("");
        useEffect(() => {
            if(ReqBody != undefined && Object.keys(ReqBody).length > 0){
                var results:any = ReqBody?.headerDetails?.find((x: any) => x?.sectionTypeKey == "logoSection")?.sectionDetails?.sectionFields[0]?.fieldValue
                if(results != null)setDynamicBgLogo(results.slice(results.indexOf("src") + 4, results.indexOf("/>")).trim())
            }            
        },[ReqBody])
        
        return (
            <div ref={ref} className='quePapPreviewforPrintContent'>

                <div className='quePapPreviewforPrintContent' ref={ref} >
                <img className='d-none' src={dynamicBgLogo} />
                {/* {versionHistoryData && versionHistoryData.length > 0 && 
                    <VersionHistory data={versionHistoryData}/>
                } */}                       
                    {printConfig?.showWaterMark && <p className='bgcontainer' style={{backgroundImage: `url(${dynamicBgLogo})`}}></p>}
                    <div className={`quePapPreviewforPrintPreview ${printForPreviewEdit ? "printForPreviewEditEnable" : ""}`}>
                        <QuestionPaperTemplate markerrorQnsIds={markerrorQnsIds} templateFontDetails={templateFontDetails} ReqBody={ReqBody} replace={replace} replaceQp={replaceQp} templatePrintEdit={templatePrintEdit} previewMode={previewMode} setAnchorEl={setAnchorEl} templateJson={templateJson} changedPopoverValue={changedPopoverValue} setChangedPopoverValue={setChangedPopoverValue} triggerReqBody={triggerReqBody} dragPositionHeader={dragPositionHeader} setStateFunction={setStateFunction} previewDate={previewDate} printWithAnswer={printWithAnswer} printConfig={printConfig} isPrint={true} workbookStyle={workbookStyle} />
                    </div>
                </div>
            </div>
        );

    })

export default PrintQuestionPaperTemplate;