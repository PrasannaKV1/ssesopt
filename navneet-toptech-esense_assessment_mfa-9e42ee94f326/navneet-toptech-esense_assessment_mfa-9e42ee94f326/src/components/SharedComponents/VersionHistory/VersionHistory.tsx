import React, { useState, useEffect } from 'react'
import { Button, Grid, Tooltip, AlertColor } from '@mui/material';
import { last } from 'lodash';
import classDetailDownload from "../../../assets/images/file-types/classDetailDownload.png";
import classDetailEye from "../../../assets/images/file-types/classDetailEye.png";
import DocIcon from "../../../assets/images/file-types/DocIcon.svg";
import JpgImg from "../../../assets/images/file-types/JpgImg.svg";
import TextIcon from "../../../assets/images/file-types/TextIcon.svg";
import PdfIcon from "../../../assets/images/file-types/PdfIcon.svg";
import DocRedIcon from "../../../assets/images/file-types/DocRedIcon.svg";
import './QPVersionHistory.css'
import { getVersionHistory } from '../../../Api/AssessmentTypes';
import { handleFileDownload } from '../../../constants/helper';
import Toaster from '../Toaster/Toaster';
import ViewDocument from '../ViewDocument/ViewDocument';
// import FileViewer from '../../../shared/FileViewer/FileViewer';


interface Props {
    questionPaperId?: any,
    showFeedback?: boolean,
    historyData?:any
}

const VersionHistory: React.FC<Props> = ({ questionPaperId,historyData }) => {
    const [versionHistoryData, setVersionHistoryData] = React.useState<any>([])
    const [versionSelected, setSelectedVersion] = useState<any>();
    const [snackBar, setSnackBar] = useState<boolean>(false);
    const [snackBarText, setSnackBarText] = useState<string>("");
    const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("success");

    const getVersions = async () => {
        let res = await getVersionHistory(Number(questionPaperId))
        setVersionHistoryData(res?.data);
        if(res?.data?.length) setSelectedVersion(res?.data[0])
    }

    React.useEffect(() => {
        if (questionPaperId) getVersions()
    }, [questionPaperId,historyData])

    const handleVersionChange = (item: any) => {
        setSelectedVersion(item)
    }

    const [viewFile, setViewFile] = useState<boolean>(false);
    const [filePathUrl, setFilePathUrl] = useState<string>("");
    const [fileTypeDoc, setfileTypeDoc] = useState<string>("");


    function fileType(type: string) {
        switch (type) {
            case "pdf":
                return "PdfIcon";
            case "txt":
                return "TextIcon";
            case "doc":
                return "DocIcon";
            case "docx":
                return "DocIcon";
            case "jpg":
                return "JpgImg";
            case "jpeg":
                return "JpgImg";
            default:
                return "DocRedIcon";
        }
    };

    function getExtension(fileName: string) {
        const fileNameSplit = fileName?.split(".");
        const fileExtension = last(fileNameSplit);
        return fileExtension as string;
    };

    const viewFileHandler = (url: any, attachmentName: string) => {
        const ext = attachmentName?.split(".");
        if (ext?.length) {
            let obj: any = fileTypesExtensions.find((ele: any) =>
                ele.fileType.includes(ext[ext.length - 1].toLowerCase())
            );
            if (obj) {
                let type = obj ? obj.name : null;
                setfileTypeDoc(type);
                setFilePathUrl(url);
                setViewFile(true);
            } else {
                setSnackBar(true);
                setSnackBarSeverity('error');
                setSnackBarText(`Error opening the file`)
            }
        }
    };

    const fileTypesExtensions = [
        {
            fileType: ["pdf"],
            name: `pdf`,
        },
        {
            fileType: ["doc", "docx"],
            name: `document`,
        },
        {
            fileType: ["ppt", "pptx"],
            name: `presentation`,
        },
        {
            fileType: ["jpg", "jpeg", "png"],
            name: `image`,
        },
        {
            fileType: ["mp4"],
            name: `video`,
        }
    ];

    const findImage = (attachmentName: string) => {
        return fileType( getExtension(attachmentName) )   
    }

    return (<>
    <div className='quePapPreviewforPrintContent'>
        <div className='quePapPreviewforPrintVersionSect'>
            <div className={`quePapPreviewforPrintVersion pb-0 ${(versionSelected?.feedback||versionSelected?.feedBackAttachments) ? "feedbackVisible":""}`}>
                <h2>Version History</h2>
                <p>Click on the version to check the details</p>
                <ul>
                    {versionHistoryData && versionHistoryData?.length > 0 && versionHistoryData.map((item: any, index: any) => (
                        <li key={'version_' + index} className={ (versionSelected && versionSelected?.id) == item?.id ? 'activeDot' : ''}  >
                            <h4 onClick={() => { handleVersionChange(item) }} style={{ cursor: 'pointer' }} >{item?.dateAndTime}</h4>
                            <div>
                                <p className={(index>0 && (versionSelected && versionSelected?.id) == item?.id) ? 'subtext' : ''} >{item?.status}</p>
                                {index == 0 && <span>Latest Version</span>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {versionSelected && (versionSelected?.feedback||versionSelected?.feedBackAttachments) && <div className="quePapPreviewforPrintVersion vh-feedback">
                <h3 className={"versionHistory-tittle"}>Feedback</h3>
                <p className="subtext_date">{versionSelected?.dateAndTime}</p>
                <div className='versionHistFeedBackScroll'>
                    <p className="feedback-title">Reason</p>
                    <p className="feedback-reason" dangerouslySetInnerHTML={{__html: versionSelected?.feedback.replace(/(?:\r\n|\r|\n)/g, '<br>')}} />
                    <p className="feedback-title">Attachment</p>
                    <div className={"attachmentRow"}>
                        {versionSelected?.feedBackAttachments?.map((file: any) => {
                            return (
                                <div key={"file_" + file.attachmentPath} className={"attachmentItem"}>
                                    <div
                                        title={file?.attachmentName}
                                        className={"attachmentMeta"}>
                                        <img
                                            src={
                                                findImage(file?.attachmentName)=='DocIcon' ? DocIcon : 
                                                findImage(file?.attachmentName)=='PdfIcon' ? PdfIcon : 
                                                findImage(file?.attachmentName)=='TextIcon' ? TextIcon : 
                                                findImage(file?.attachmentName)=='JpgImg' ? JpgImg : 
                                                DocRedIcon
                                            }
                                            alt={"file icon"}
                                        />
                                        {file?.attachmentName}
                                    </div>
                                    <div className={"attachmentAction"}>
                                        <Tooltip arrow placement="bottom" title={"Download"}>
                                            <img
                                                data-testid="fileDownload"
                                                onClick={() => handleFileDownload(file?.attachmentURL, file?.attachmentName)}
                                                src={classDetailDownload} alt="" />
                                        </Tooltip>
                                        <Tooltip arrow placement="bottom" title={"View"}>
                                        {/* <a href={file?.attachmentURL} target="_blank"> */}
                                            <img
                                                data-testid="fileView"
                                                onClick={() => viewFileHandler(file?.attachmentURL, file?.attachmentName)}
                                                src={classDetailEye} alt="" />
                                                {/* </a> */}
                                        </Tooltip>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>}
        </div>

        <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />

        {viewFile &&
            <ViewDocument
                open={viewFile}
                handleClose={() => setViewFile(false)}
                viewFileURL={filePathUrl}
                viewFileExtension={fileTypeDoc}
            />
        }
    </div>
    </>
    )
}

export default VersionHistory
