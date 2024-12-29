import React, { FC } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import "./WarningModal.css"
import warningIcon from "../../../../../assets/images/warning.svg";
import closeIcon from "../../../../../assets/images/closeIcon.svg";
import ButtonComponent from '../../../../SharedComponents/ButtonComponent/ButtonComponent';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "745px",
    background: "#FFFFFF",
    borderRadius: "12px",
    padding: "22px 16px"
};

type Props = {
    open: boolean,
    handleClose: any,
    warnContent?: any,
    handleUploadFile?: any,
    warnMsg?: any,
    FromStudentEditMark?: any
}

const WarningModal: FC<Props> = ({ open, handleClose, warnContent, handleUploadFile, warnMsg, FromStudentEditMark }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box className="errModalContainer">
                    <Box style={{ display: "flex", justifyContent: "space-evenly", gap: "20px" }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">{FromStudentEditMark ? `Error while Uploading Marks for this Student ` : `Error while Uploading Student Marks In Bulk`} </Typography>
                        <img src={closeIcon} alt="closeIcon" style={{ cursor: "pointer" }} onClick={handleClose} />
                    </Box>
                    <Box>
                        <Typography className='textclrChng mt-3' style={{ fontSize: "18px" }}>There seems to be a problem.</Typography>
                        <hr className='hordividerStyling' />
                        <Box sx={{ display: "flex", gap: "20px" }}>
                            <Box><img src={warningIcon} alt="warning_icon" /></Box>
                                    <Box sx={{ width: "auto", marginBottom: "20px", marginTop: "5px" }}>
                                <h3 className='textclrChng'>
                                    {!FromStudentEditMark ?
                                        "You can re-upload the file after resolving the following errors :" :
                                        "Please resolve the following errors :"
                                    }
                                </h3>
                            </Box>
                        </Box>
                        {
                            !warnMsg && !FromStudentEditMark && (
                                <>
                                    {<p className='textclrChng mt-3'>Error:</p>}
                                    <div className='warningListScroll'>
                                        <ul className='warningList'>
                                            {warnContent?.errorMessages?.map((errMsg: any) => (
                                                <>
                                                    {errMsg?.errorMessage && <li>SheetNo: {errMsg.sheetNo} RowNo. {errMsg.rowNo} : {errMsg.errorMessage}</li>}
                                                    {errMsg?.errorsList && <li>SheetNo: {errMsg.sheetNo}  &nbsp;
                                                        <ul className='warningList'>
                                                            {errMsg.errorsList.map((error: any, index: any) => (
                                                                <li key={index}>
                                                                    {error}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>}
                                                </>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        {
                            FromStudentEditMark && (
                                <>
                                    {<p className='textclrChng mt-3'>Error:</p>}
                                    <div className='warningListScroll'>
                                        <ul className='warningList'>
                                            {warnContent?.map((errMsg: any, index: any) => (
                                                <>
                                                    <li>{index + 1}. &nbsp;{errMsg}</li>
                                                </>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )
                        }
                    </Box>
                    {!FromStudentEditMark &&
                    <div className='buttonStylfn'>
                        <ButtonComponent type={"outlined"} label={'Re-upload'} textColor={'black'} buttonSize={"Large"} minWidth="270" backgroundColor='#01B58A' onClick={handleUploadFile} />
                        <ButtonComponent type={"contained"} label={'Cancel'} textColor={'white'} buttonSize={"Large"} minWidth="270" backgroundColor='#01B58A' onClick={handleClose} />
                        </div>}
                    {
                        FromStudentEditMark &&
                        <div>
                            <ButtonComponent type={"outlined"} label={'Cancel'} textColor={'#1B1C1E'} buttonSize={"Large"} minWidth="270" backgroundColor='#01B58A' onClick={handleClose} />
                            </div>
                    }

                </Box>
            </Box>
        </Modal>
    );
}

export default WarningModal;