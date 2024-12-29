import styles from "./fileUploadPopup.module.css";
import React, { useRef, useState } from "react";
import { IconButton, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, LinearProgress, Typography, Box, Alert } from "@mui/material";
import { Close } from "@mui/icons-material";
import { read, utils } from "xlsx";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import { SnackbarEventActions } from "../../../../redux/actions/snackbarEvent";
import { fileToBase64 } from "../../../../constants/fileToBase64";
import { DOWNLOAD_EXCEL, LIBRARY_ICON, ATTACHMENT_ICON, CROSS_ICON, SHEET_PDF_ICON, JPEG_ICON, PNG_ICON, F_PDF_ICON, F_JPEG_ICON, F_PNG_ICON, F_XSL_ICON, F_ERROR_ICONS } from "../Utils/EvaluationAssets";
import DELETE_ICON from "../../../../assets/images/deleteIcon.svg"
import { uploadSheetByAllocationId, downloadSheetByAllocationId, uploadStudentMarks, deleteAnsSheetApi, studentAssessmentByAllocationId, getAllStudentListApi1 } from "../../../../Api/QuestionTypePaper";
import { RootStore } from "../../../../redux/store";
import { qPaperStudentEventActions, qStudentListEventActions, updateAnswerSheetDetails, updateQpDetails } from "../../../../redux/actions/assesmentQListEvent";
import WarningModal from "./WarningModal/WarningModal";
import { removeStudentOverViewEventActions } from "../../../../redux/actions/studentOverview";
import Spinner from "../../../SharedComponents/Spinner";

export interface OptionsInterface {
    title?: string;
    subtitle?: string;
    description?: string;
    data?: any;
    excelName?: any
    allocationID?: any
}
interface FileUploadPopupProps {
    options?: OptionsInterface;
    handleClose: () => void;
    handleUpload?: () => void;
    isDownload?: boolean;
    isBulkMarks?: boolean;
    isSheetUpload?: boolean;
    setStudentData?: any
    isUploadSheet?: any
    setSelected?: any
    setSelectAll?: any
}

/**
 * @function convertToJson
 * @description this function converts the data from CSV to JSON format
 * @param csv CSV string
 * @returns JSON string
 */
function convertToJson(csv: string): string {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");
    const result = lines.slice(1).map((line) => {
        const obj: any = {};
        const currentline = line.split(",");
        headers.forEach((header, index) => {
            obj[header] = currentline[index];
        });
        return obj;
    });
    return JSON.stringify(result);
}

const FileUploadPopup = (props: FileUploadPopupProps) => {
    const { options, handleClose, isDownload, isBulkMarks, isSheetUpload, setStudentData, isUploadSheet, setSelected, setSelectAll } = props;

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const dispatch = useDispatch();
    const uploadingProgress = useSelector((state: RootStore) => state?.upload?.uploading);
    const uploadProgress = useSelector((state: RootStore) => state?.upload?.progress);
    const initialStudentList = useSelector((state: RootStore) => state?.qMenuEvent?.qStudentList) || [];

    const [loading, setIsLoading] = useState<boolean>(false);
    const [uploadedFileName, setUploadedFileName] = useState<string>("");
    const [open, setOpen] = useState<boolean>(true);
    const [isUploaded, setIsUploaded] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [fileData, setFileData] = useState<any>();
    const [headers, setHeaders] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<any | null>(options?.data || null);
    const [error, setError] = useState("");
    const [fileList, setFileList] = useState<any[]>([]);
    const [preExistingAnswerSheets, setPreExistingAnswerSheets] = useState<any[]>(options?.data?.studentDetails?.answerSheets || []);
    const [fileWarnModalOpen, setfileWarnModalOpen] = useState<boolean>(false)
    const [fileWarnContent, setfileWarnContent] = useState<any>({})
    const [filewarnMess, setfilewarnMess] = useState('');

    const removeImage = (index: number) => {
        const updatedFiles = [...fileList];
        updatedFiles.splice(index, 1);
        setFileList(updatedFiles);
        // TODO : this is taken for Specificaly file Upload
        setSelectedFiles(updatedFiles);
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploading(true);
        e.preventDefault();

        const files = e.target.files;
        if (!files || files.length === 0) {
            setUploading(false);
            return;
        }

        const file = files[0];
        const fname = file.name;
        const extension = fname.split(".").pop();

        if (!["xlsx", "csv", "xls"].includes(extension || "")) {
            setUploading(false);
            dispatch(
                SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: "Invalid file: Use only xlsx, xls, csv file for upload",
                })
            );
            return;
        }

        setUploadedFileName(fname);
        setSelectedFiles(files);

        const reader = new FileReader();
        reader.onload = (evt: ProgressEvent<FileReader>) => {
            const bstr = evt.target?.result;
            const wb = read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data: string = utils.sheet_to_csv(ws);
            const excelRows: any = utils.sheet_to_json(ws);
            const jsonResult = convertToJson(data);

            const sheetNames: string[] = wb.SheetNames;
            const filteredSheetNames = sheetNames.filter(name => name.toLowerCase() !== 'master');

            // Calculate the sheet count excluding "master" or "Master"
            const sheetCount: number = filteredSheetNames.length;

            setHeaders(filteredSheetNames);
            fileToBase64(file, (err: any, result: any) => {
                if (result) {
                    // console.log("Base64 Result:", result);
                }
            });

            setUploading(false);
            setIsUploaded(true);
        };
        reader.readAsBinaryString(file);
    };

    /**
     * @function removeUploadedItem
     * @description Resets the upload state by clearing the uploaded file data and name, and setting the upload flags to false.
     */
    const removeUploadedItem = () => {
        setIsUploaded(false);      // Reset the flag indicating an uploaded file
        setUploading(false);       // Reset the flag indicating an ongoing upload
        setFileData(null);         // Clear the file data
        setUploadedFileName("");   // Clear the uploaded file name
        setHeaders([]);            // Clear the headers
        setSelectedFiles(null);    // Clear the selected files
    };

    /**
     *  @function uploadAnsSheet
     *  @description Uploads the answer sheet files to the server
     */
    const uploadAnsSheet = async () => {
        let response;
        console.log("options?.data?.studentDetails",options?.data?.studentDetails)
        const firstName = options?.data?.studentDetails?.firstName ||  options?.data?.studentDetails?.studentName || "";
        const lastName = options?.data?.studentDetails?.lastName;
        const studentName = `${firstName ? firstName : ''} ${lastName ? lastName : ''}`.trim();
        const snackbarMessage = studentName ? `Sheet's for ${studentName} uploaded successfully` : "Sheet uploaded successfully";
        try {
            let FileLength: any = fileList?.length + preExistingAnswerSheets?.length;
            if (!FileLength || FileLength?.length === 0) {
                setError("No files selected for upload");
                return;
            }

            // Check if more than 5 files are selected
            if (FileLength?.length > 5) {
                setError("You cannot upload more than 5 files. Please remove the extra files.");
                return;
            }

            // Check if both fileList and preExistingAnswerSheets are empty
            if (fileList?.length === 0 && preExistingAnswerSheets?.length !== 0) {
                // Close the popup with successful SnackbarEventActions
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "success",
                    snackbarMessage: snackbarMessage,
                }));
                handleClose(); // Assuming this function closes the popup
                setOpen(false);
                return;
            }

            const formData = new FormData();
            for (let i = 0; i < fileList.length; i++) {
                formData.append('files', fileList[i]);
            }

            formData.append('allocationID', options?.allocationID); // Hardcoded allocationID, replace if needed
            response = await uploadSheetByAllocationId(formData);
            if (isUploadSheet) {
                const response2 = await studentAssessmentByAllocationId(options?.allocationID)
                setStudentData(response2?.data)
            }
            if (response?.result?.responseDescription && response.result.responseDescription.toLowerCase() === "success") {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "success",
                    snackbarMessage: snackbarMessage,
                }));
                // After Success 
                dispatch(updateAnswerSheetDetails({ ...options?.data, data: response?.data || [] }))
                removeUploadedItem();
                handleClose();
                setOpen(false);
            } else {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: response?.response?.data?.responseDescription ? response?.response?.data?.responseDescription : "Error while uploading sheet",
                }));
            }
        } catch (error: any) {
            console.error("Error While Upload Sheet", error);
            dispatch(SnackbarEventActions({
                snackbarOpen: true,
                snackbarType: "error",
                snackbarMessage: response?.response?.data?.responseDescription ? response?.response?.data?.responseDescription : "Error while uploading sheet",
            }));
        }
    };

    const uploadMark = async () => {
        let response;
        try {
            if (!selectedFiles || selectedFiles.length === 0) {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: "No files selected for upload",
                }));
                return;
            }

            const formData = new FormData();
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append('file', selectedFiles[i]);
            }
            formData.append('allocationIds', options?.data?.allocationIds);
            setIsLoading(true)
            response = await uploadStudentMarks(formData);
            if (response.data && response.data.length > 0) {
                setfileWarnModalOpen(true);
                setfileWarnContent({ errorMessages: response?.data });
                setfilewarnMess(response?.message);
                return;
            }
            if (!response.data && response?.result?.responseDescription && response.result.responseDescription.toLowerCase() === "success") {
                setfileWarnModalOpen(false)
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "success",
                    snackbarMessage: "Score successfully added to student",
                }));
            
                // TODO : once we call the bulk upload api we are removing the studentOverviewdetails against the allocationId from the store 
                dispatch(removeStudentOverViewEventActions({allocationIds:options?.data?.allocationIds || []}))
                
                // After Success calling api to refresh the student marks 
                const response = await getAllStudentListApi1({qpId: options?.data.questionPaperId , setId: ''})
                const sortedData = response?.data?.sort((a: any, b: any) => {
                    const rollNumberA = parseInt(a?.rollNumber, 10);
                    const rollNumberB = parseInt(b?.rollNumber, 10);
                    return rollNumberA - rollNumberB;
                });
                dispatch(qStudentListEventActions(sortedData));
                dispatch(qPaperStudentEventActions({ qId: options?.data.questionPaperId, data: sortedData }));
                dispatch(updateQpDetails({ qpParer: `${options?.data.questionPaperId}`, key: "isMarksUploaded", updatePayload: true }));
                removeUploadedItem();
                handleClose();
                setOpen(false);
                setSelected && setSelected([]);
                setSelectAll && setSelectAll(false);
            } else {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: response?.response?.data?.responseDescription ? response?.response?.data?.responseDescription : "Error while uploading marks",
                }));
            }
        } catch (error) {
            console.error("Error While Upload Sheet", error);
            dispatch(SnackbarEventActions({
                snackbarOpen: true,
                snackbarType: "error",
                snackbarMessage: response?.response?.data?.responseDescription ? response?.response?.data?.responseDescription : "Error while uploading marks",
            }));
        }
        setIsLoading(false)
    };

    const handleFileCLick = () => {
        fileInputRef?.current?.click();
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = event.target.files;
        if (files && files.length > 0) {
            const maxSizeInBytes = 25 * 1024 * 1024; // 25 MB
            const maxFileSizeInBytes = 5 * 1024 * 1024; // 5 MB per file
            const validTypes = ["image/jpeg", "image/png", "application/pdf"];
            let isValid = true;
            let totalSize = 0;

            // Calculate total number of files including existing files in fileList and preExistingAnswerSheets
            const totalFilesCount = fileList.length + files.length + preExistingAnswerSheets.length;

            // Check if totalFilesCount exceeds 5 for sheet upload
            if (isSheetUpload && totalFilesCount > 5) {
                setError("You cannot upload more than 5 files. Please remove the extra files.");
                return;
            }

            // Check if totalFilesCount exceeds 5 for sheet upload
            if (isSheetUpload && totalFilesCount > 5) {
                setError("You cannot upload more than 5 files. Please remove the extra files.");
                return;
            }

            const newFiles = Array.from(files).filter((file: File) => {
                if (fileList.find(existingFile => existingFile.name === file.name)) {
                    setError(`File '${file.name}' is already added.`);
                    return false;
                }
                if (preExistingAnswerSheets.find(existingSheet => existingSheet.sheetName === file.name)) {
                    setError(`File '${file.name}' already exists in the pre-existing sheets.`);
                    return false;
                }
                return true;
            });

            for (let i = 0; i < newFiles.length; i++) {
                const file = newFiles[i];
                if (file.size > maxFileSizeInBytes) {
                    setError("File size cannot exceed 5MB");
                    isValid = false;
                    break;
                }
                totalSize += file.size;
                if (totalSize > maxSizeInBytes) {
                    setError("Total file size exceeds 25 MB");
                    isValid = false;
                    break;
                }
                if (!validTypes.includes(file.type)) {
                    setError("Only JPG, PNG, PDF, and Excel files are allowed");
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                setError("");
                // Append newFiles to fileList
                setFileList(prevFiles => [...prevFiles, ...newFiles]);
            }

            // Reset the input value to allow re-uploading the same file
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    /**
     *  @function downloadSampleSheet
     *  @description this function call's the api and download the sample sheet
     */
    const downloadSampleSheet = async () => {
        try {
            const reqObj = options?.data;
            const response: any = await downloadSheetByAllocationId(reqObj);
            const blob = new Blob([response.data], { type: response.headers['content-type'] })
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            // Format current date in DD_MM_YYYY format
            const currentDateTime = moment().format('DD_MM_YYYY');
            link.setAttribute('download', `${options?.excelName?.questionName}__${options?.excelName.name}__${options?.excelName.className}__${currentDateTime}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link?.parentNode?.removeChild(link);
            // Call the necessary functions
            removeUploadedItem();
            //handleClose();
           // setOpen(false);
        } catch (error) {
            console.error("Error While Downloading Sheet", error);
            dispatch(SnackbarEventActions({
                snackbarOpen: true,
                snackbarType: "error",
                snackbarMessage: "Error While Downloading Sheet",
            }));
        }
    };

    const renderFileIcon = (fileExtension: string) => {
        switch (fileExtension) {
            case 'pdf':
                return <img src={F_PDF_ICON} alt="PDF Icon" className={styles.pdfIcon} style={{ marginRight: "8px", height: "24px", width: "24px" }} />;
            case 'jpeg':
            case 'jpg':
                return <img src={F_JPEG_ICON} alt="JPEG Icon" className={styles.jpegIcon} style={{ marginRight: "8px", height: "24px", width: "24px" }} />;
            case 'png':
                return <img src={F_PNG_ICON} alt="PNG Icon" className={styles.pngIcon} style={{ marginRight: "8px", height: "24px", width: "24px" }} />;
            case 'xls':
            case 'xlsx':
                return <img src={F_XSL_ICON} alt="Excel Icon" className={styles.excelIcon} style={{ marginRight: "8px", height: "24px", width: "24px" }} />;
            default:
                return <img src={""} alt="File Icon" className={styles.fileIcon} style={{ marginRight: "8px", height: "24px", width: "24px" }} />;
        }
    };

    const handleRemovePreSheet = async (preAnswerSheets: any) => {
        const { id } = preAnswerSheets;
        try {
            if (id) {
                const response = await deleteAnsSheetApi(id);
                if (response?.result?.responseDescription === "Success") {
                    const updatedSheets = preExistingAnswerSheets?.filter(sheet => sheet?.id != id);
                    setPreExistingAnswerSheets(updatedSheets);
                    dispatch(updateAnswerSheetDetails({ ...options?.data, data: updatedSheets || [], isDelete: true }))
                }
            }
        } catch (error) {
            console.error("Error While Deleting the Answer sheet", error);
            dispatch(SnackbarEventActions({
                snackbarOpen: true,
                snackbarType: "error",
                snackbarMessage: "Error While Deleting the Answer sheet",
            }));
        }
    }

    return (
        <React.Fragment>
            {/*  This input box is for uploading the multiple file Upload */}
            {loading && <Spinner />}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".jpg,.jpeg,.png,.pdf"
                multiple
                onChange={handleFileChange}
            />
            <Dialog open={open} className={styles.uploadContainer}>
                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <DialogTitle className={styles.editDepartTitle}>
                        {options?.title}
                    </DialogTitle>
                    <IconButton
                        className={styles.closeModal}
                        onClick={() => {
                            handleClose();
                            setOpen(false);
                        }}
                    >
                        <Close />
                    </IconButton>
                </Grid>

                {/* This is for Upload */}
                {isBulkMarks && <DialogContent className="pt-0">
                    <Typography className={styles.subtitle} variant="body2" >
                        {options?.subtitle}
                    </Typography>
                    <hr />
                    <Divider sx={{ margin: "10px 0px" }} />
                    <Typography className={styles.guideTxt} >{options?.description}</Typography>
                    <Box className={styles.downloadSampleContainer} style={{ marginBottom: "16px" }}>
                        <img src={DOWNLOAD_EXCEL} alt="Download Excel" />
                        <Button className={styles.downloadSampleTxt} onClick={() => downloadSampleSheet()} sx={{ padding: "10px" }}>
                            Download Sample File
                        </Button>
                    </Box>
                    {!isUploaded &&
                        <Box>

                            <label htmlFor="file-input" className={styles.bulkUploadLabel}>
                                Select File from Computer
                            </label>
                            <input
                                type="file"
                                id="file-input"
                                data-testid="fileInput"
                                className={styles.bulkFileUploader}
                                onChange={onFileChange}
                                accept=".xlsx,.csv,.xls"
                                disabled={isUploaded}
                            />
                        </Box>}
                    {isUploaded && (
                        <React.Fragment>
                            <div className={styles.resourceListItem} style={{ marginBottom: "16px" }}>
                                <Grid item xs={10} className={styles.ResourceFileMeta}>
                                    <img src={LIBRARY_ICON} alt="" height={20} width={20} />
                                    <p className={styles.filename}>{uploadedFileName}</p>
                                </Grid>
                                <Grid item xs={2} className={styles.resourceActionContainer}>
                                    <span className={styles.deleteIcon} onClick={removeUploadedItem}>
                                        <img src={DELETE_ICON} alt="delete icons" height={20} width={20} />
                                    </span>
                                </Grid>
                            </div>
                            <Button
                                className={styles.bulkImport}
                                style={{ opacity: uploading ? 0.5 : 1, width: "100%" }}
                                onClick={() => { uploadMark(); }}
                                disabled={uploading}
                                sx={{ marginTop: "12px" }}
                            >
                                Import {headers?.length} Student marks
                            </Button>
                        </React.Fragment>
                    )}
                </DialogContent>}

                {/* This is for Upload Sheet */}
                {isSheetUpload && <DialogContent className="pt-0">
                    <Typography className={styles.guideTxt} variant="body2">
                        {options?.subtitle}
                    </Typography>
                    <Box sx={{ marginTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className={styles.attachmentContainer}>
                            <div className={styles.attachmentDiv}>
                                <img src={ATTACHMENT_ICON} alt="" style={{ height: "27px", width: "27px" }} />
                                Add Attachment
                            </div>
                            <span className={styles.formatDiv}>
                                Format: jpeg/jpg/png/pdf &nbsp;&nbsp;&nbsp;Size: Max 25MB
                            </span>
                        </div>
                        <Button className={styles.attachFile} onClick={() => handleFileCLick()}>
                            + Attach File
                        </Button>
                    </Box>
                    {error && <><img src={F_ERROR_ICONS} alt="ERROR Icon" style={{ marginRight: "8px", height: "24px", width: "24px" }} /> <span style={{ color: "red", fontSize: "12px" }}>{error}</span></>}
                    <Divider sx={{ margin: "10px 0px" }} />
                    <Typography className={styles.guideTxt}>{options?.description}</Typography>
                    <Box className={styles.downloadSampleContainer}>
                        <div className={styles.previewContainer}>
                            {preExistingAnswerSheets && preExistingAnswerSheets.map((item, index) => {
                                return <div key={index} style={{ display: "flex", width: "500px", justifyContent: "space-between" }}>
                                    <div>
                                        {renderFileIcon(item?.type)}
                                        {item?.sheetName}
                                    </div>
                                    <div>
                                        <img
                                            src={DELETE_ICON}
                                            alt="Remove Icon"
                                            onClick={() => handleRemovePreSheet(item)}
                                            style={{ cursor: "pointer", marginLeft: "80px" }}
                                        />
                                    </div>
                                </div>
                            })}
                            {fileList && fileList.map((file: any, index: any) => (
                                <div key={index} style={{ display: "flex", width: "500px", justifyContent: "space-between", fontSize: "15px" }}>
                                    <div>
                                        {file.type === "image/jpeg" && (
                                            <img src={F_JPEG_ICON} alt="JPEG Icon" style={{ marginRight: "8px", height: "24px", width: "24px" }} />
                                        )}
                                        {file.type === "image/png" && (
                                            <img src={F_PNG_ICON} alt="PNG Icon" style={{ marginRight: "8px", height: "24px", width: "24px" }} />
                                        )}
                                        {file.type === "application/pdf" && (
                                            <img src={F_PDF_ICON} alt="PDF Icon" style={{ marginRight: "8px", height: "24px", width: "24px" }} />
                                        )}
                                        {!["image/jpeg", "image/png", "application/pdf"].includes(file.type) && (
                                            <img src={""} alt="Default Icon" style={{ marginRight: "8px", height: "24px", width: "24px" }} />
                                        )}
                                        {file.name}
                                    </div>
                                    <div>
                                        <img
                                            src={DELETE_ICON}
                                            height={13}
                                            width={12}
                                            alt="Remove Icon"
                                            onClick={() => removeImage(index)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <hr />
                        </div>
                        <div className="d-flex">
                            <Button
                                className={fileList?.length > 5 ? styles.sheetUploadDisable :
                                    styles.bulkImport}
                                style={{ opacity: uploading ? 0.5 : 1, width: "208px" }}
                                onClick={() => { uploadAnsSheet() }}
                                disabled={fileList?.length > 5 ? true : false}
                            >
                                Upload
                            </Button>
                            <Button
                                className={styles.cancelBtn}
                                onClick={() => {
                                    handleClose();
                                    setOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Box>
                </DialogContent>}
                {fileList?.length > 5 &&
                    <div className={styles.extraFileDiv}>
                        <Alert severity="error">You cannot upload more than 5 files. Please remove the extra files.</Alert>
                    </div>
                }
                {/* Progress Bar */}
                {uploadingProgress && (
                    <Box className={styles.progressContainer}>
                        <div>{uploadProgress ? `${uploadProgress}%  Uploaded` : ''}</div>
                        <LinearProgress
                            variant="determinate"
                            value={uploadProgress}
                            className={styles.customProgress}
                            color="inherit"
                        />
                    </Box>
                )}
            </Dialog>
            {fileWarnModalOpen && <WarningModal open={fileWarnModalOpen} handleClose={handleClose} warnContent={fileWarnContent} warnMsg={filewarnMess} handleUploadFile={() => { setfileWarnModalOpen(false); removeUploadedItem() }} />}
        </React.Fragment>
    );
};

export default FileUploadPopup;