import { Box, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Modal from '@mui/material/Modal';
import { Button, Table } from "react-bootstrap";
import closeIcon from '../../../assets/images/closeIcon.svg';
import React, { useEffect, useRef, useState } from 'react';
import ButtonComponent from "../../SharedComponents/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { getStudentDetailsForReports } from "../../../Api/AssessmentReports";
import './StudentListing.css';
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "763px",
    bgcolor: "#FFFFFF",
    borderRadius: "10px",
    padding: "10px",
};
interface Props{
    open: boolean;
    onClose : () => void;
    allocationGroupId : number
}
const StudentListingModalPopUp:React.FC<Props> = ( {open , onClose , allocationGroupId}) => {
    console.log("Inside StudentLising MOdal Popup");
    const[studentList,setStudentList] = useState<any>([]);
    const navigate = useNavigate();
    // useEffect(()=>{
    //     let response = getStudentListCall();
    //     setStudentList(response);
    // })
    const getStudentDetailsApiCall = async () =>{
        let requestParams = {
            allocationGroupId : allocationGroupId
        }
        const resp = await getStudentDetailsForReports(requestParams);
        if(resp){
            console.log("REsponse",resp);
            let response = resp;
            console.log("Inside Student Listing Component",response);
            setStudentList(response || []);
        }
    }
    const handleShowReportsButtonClick = (statusId:number,studentId:number) =>{
        if(statusId === 3){
            console.log(statusId);
            console.log(studentId);
            let data = {
                allocationGroupId : allocationGroupId,
                studentId : studentId
            }
            navigate("/assess/assessmentReports/showReports/studentCentric",{state:data})
        }
    }
    const getButtonColor = (statusId:number) =>{
        if(statusId === 3){
            return "#1d7bb5";
        }else{
            return "#989ea3";
        }
    }
    useEffect(()=>{
        getStudentDetailsApiCall();
    },[]);
    return(
        <>
                <Modal
                    open={open}
                    onClose={onClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="studentListModalBlk"
                    >
                    <>
                    <Box sx={style}>
                        <div className="closeDeleteIcon" onClick={onClose}>
                            <img src={closeIcon} style={{ width: "16px" }} />
                        </div>
                        
                        <div className="studentListModalBlkScroll">
                            <Table className="student-listing-table m-0">
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell>
                                        <CheckBoxCompleted
                                            checkLabel='Label'
                                            disable={false}
                                            checkStatus={false}
                                            onChangeHandler={()=>{}}
                                        />
                                    </TableCell> */}
                                    <TableCell>
                                        StudentName
                                    </TableCell>
                                    <TableCell>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {studentList?.length > 0 ? (
                                    studentList?.map((data:any,index:any) =>{
                                        return(
                                            <TableRow>
                                                {/* <TableCell style={{ width: '70px', textAlign: 'center' }}>
                                                    <CheckBoxCompleted
                                                        checkLabel='Label'
                                                        disable={data?.statusID == 5 ? true : false}
                                                        checkStatus={tableRowSelected.includes(index)}
                                                        onChangeHandler={(e: any) => handleCheck(e, index)}
                                                    />
                                                </TableCell> */}
                                                <TableCell>
                                                    {data.studentName}
                                                </TableCell>
                                                <TableCell>
                                                <ButtonComponent
                                                    image={''}
                                                    textColor=''
                                                    // backgroundColor='#1d7bb5'
                                                    backgroundColor={getButtonColor(data.statusID)}
                                                    buttonSize='Medium'
                                                    type='contained'
                                                    label='Show Reports'
                                                    hideBorder={true}
                                                    onClick={() => {handleShowReportsButtonClick(data.statusID,data.studentID)}}
                                                    minWidth='100'/>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ):(
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <div className='' style={{ textAlign: 'center' }}>
                                            {'No Match Found'}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    </Box>
                    </>
                </Modal>
        </>
    )
}

export default StudentListingModalPopUp;