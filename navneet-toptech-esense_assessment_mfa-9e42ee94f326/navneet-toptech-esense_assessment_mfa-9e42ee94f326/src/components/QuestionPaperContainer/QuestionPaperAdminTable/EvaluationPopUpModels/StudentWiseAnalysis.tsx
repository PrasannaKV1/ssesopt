import React, { useState, useEffect } from 'react';
import "./studentReportView.css";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Button,
    Modal,
    Box,
    Typography,
    IconButton,
    Pagination
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { studentWiseReport } from '../../../../Api/QuestionTypePaper';
import AvtarSection from '../TemplateCreation/AvtarSection';
import { useNavigate, useLocation } from 'react-router';
import ButtonComponent from '../../../SharedComponents/ButtonComponent/ButtonComponent';
import ChevronUpIcon from '@mui/icons-material/ExpandLess';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import Avatar from "@mui/material/Avatar";
import Spinner from '../../../SharedComponents/Spinner';
interface Student {
    skippedQuestions?: number;
    correctAnswers?: number |any;
    incorrectAnswers?: number |any;
    totalAttempts?: number;
    onTimeSubmission: number;
    studentProfileLink: any
    studentId: number;
    allocationId: number;
    studentName: string;
    className: string;
    rollNo: string;
    totalMarks: number;
    answerAccuracy: number;
    isOnlineTestReport?:boolean;
}

const StudentWiseAnalysis = (props: any) => {
    const [sortNameAsc, setSortNameAsc] = useState(true);
    const [sortRollNoAsc, setSortRollNoAsc] = useState(true);
    const [sortedStudents, setSortedStudents] = useState<Student[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(0)
    const [viewDetails, setViewDetails] = useState(false)
    const [studentAllocationId, setStudentAllocationId]=useState(null) as any;
    const [stduentId, setStduentId]=useState(null) as any;
    const [view,setView]=useState(false);
    const [isLoading, setLoading] = useState(false);
    // const location = useLocation();
    const navigate= useNavigate()
    const rowsPerPage = 5;
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = sortedStudents?.slice(startIndex, endIndex);

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };
    useEffect(() => {
        studentWiseReportData()
    }, []);
    
    const studentWiseReportData = async () => {
        setLoading(true);
        const response = await studentWiseReport(
            props.questionId,
            props.isOnlineTestReport
        );
        if (response?.baseResponse?.result?.responseDescription.toLowerCase() === 'success') {
            const uniqueClassNames = Array.from(
                new Set(response?.baseResponse?.data?.map((item: any) => item?.className) || [])
            );

            const isSingleClass = uniqueClassNames.length === 1;
            const getClassOrder = (className: string): number => {
                return uniqueClassNames.indexOf(className);
            };
            const sortedData = response?.baseResponse?.data?.sort((a: any, b: any) => {
                const rollNumberA = parseInt(a?.rollNo, 10);
                const rollNumberB = parseInt(b?.rollNo, 10);

                if (isSingleClass) {
                    return rollNumberA - rollNumberB;
                } else {
                    const classOrderA = getClassOrder(a?.className || "");
                    const classOrderB = getClassOrder(b?.className || "");

                    const adjustedOrderA = classOrderA === -1 ? uniqueClassNames.length : classOrderA;
                    const adjustedOrderB = classOrderB === -1 ? uniqueClassNames.length : classOrderB;

                    if (adjustedOrderA !== adjustedOrderB) {
                        return adjustedOrderA - adjustedOrderB;
                    }

                    return rollNumberA - rollNumberB;
                }
            });
            setSortedStudents(sortedData)
            setTotalPages(response?.totalPages)
        }
        setLoading(false);
    }

    const sortByStudentName = () => {
        const sorted = [...sortedStudents].sort((a, b) => {
            if (sortNameAsc) {
                return a.studentName.localeCompare(b.studentName);
            } else {
                return b.studentName.localeCompare(a.studentName);
            }
        });
        setSortNameAsc(!sortNameAsc);
        setSortedStudents(sorted);
    };

    const sortByRollNo = () => {
        const sorted = [...sortedStudents].sort((a: any, b: any) => {
            if (sortRollNoAsc) {
                return a.rollNo - b.rollNo;
            } else {
                return b.rollNo - a.rollNo;
            }
        });
        setSortRollNoAsc(!sortRollNoAsc);
        setSortedStudents(sorted);
    };
 
    const transformGradeToClass = (grade: string): string => {
        const gradeMatch = grade?.match(/Grade (\d+) - ([A-Z])/);
          // TODO : this we are commenting expectation is  https://esense1.atlassian.net/browse/TA-1729
        // return gradeMatch ? `Grade ${gradeMatch[1]} ${gradeMatch[2]}` : grade;
        return grade;
    };

    const handleView=(item:any)=>{
        navigate("/assess/evaluation/schoolReport", {
          state: {
            selectedQp: props?.questionId,
            studentDetails: item,
            isOnlineTestReport: props?.isOnlineTestReport,
          },
        });
        setViewDetails(true);
        setStudentAllocationId(item.allocationId);
        setStduentId(item?.studentId)
    }

    return (
            <Box
                className="student-preview-container qpCustomFontPopup assement-q-modal main_container"
            sx={{ width: '100%', height: '100%', position: "initial" }}
            >
            {isLoading && <Spinner />}
                <div className='student-wrapper-analysis' style={{ padding: '16px', backgroundColor: 'white', margin: '20px', width:'94.5%', border:"1px solid #DEDEDE", borderRadius:"16px" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ fontWeight: 700, fontSize: '18px' }}>
                            Student-wise Analysis
                        </div>
                        <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
                            {/* <ButtonComponent type={"contained"} label={'Download Report'} textColor={'#FFFFFF'} buttonSize={'Medium'} minWidth={'200'}/> */}
                            <Typography sx={{ color: '#01B58A', cursor: 'pointer', fontWeight: '600' }} onClick={()=> setView(!view)}>
                                View Details
                                <IconButton>
                                    { !view ? <ChevronDownIcon fontSize='large' /> : <ChevronUpIcon fontSize='large'/> }
                                </IconButton>
                            </Typography>  
                        </div>
                    </div>
                    {view && <div>
                        <TableContainer component={Paper} sx={{ maxHeight: 440, minHeight: 440, overflow: 'auto' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {/* <TableCell padding="checkbox">
                                            <Checkbox />
                                        </TableCell> */}
                                        <TableCell>
                                            NAME & CLASS
                                            <IconButton onClick={sortByStudentName}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <ArrowDropUpIcon sx={{ color: sortNameAsc ? 'black' : 'grey', marginBottom: '-7px' }} />
                                                    <ArrowDropDownIcon sx={{ color: !sortNameAsc ? 'black' : 'grey', marginTop: '-7px' }} />
                                                </Box>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            ROLL NO
                                            <IconButton onClick={sortByRollNo}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <ArrowDropUpIcon sx={{ color: sortRollNoAsc ? 'black' : 'grey', marginBottom: '-7px' }} />
                                                    <ArrowDropDownIcon sx={{ color: !sortRollNoAsc ? 'black' : 'grey', marginTop: '-7px' }} />
                                                </Box>
                                            </IconButton>
                                        </TableCell>
                                      { props.isOnlineTestReport? 
                                      <>
                                          <TableCell>TOTAL MARKS</TableCell>
                                          <TableCell>CORRECT ANSWERS</TableCell>
                                          <TableCell>INCORRECT ANSWERS </TableCell>
                                          <TableCell>SKIPPED QUESTIONS</TableCell>
                                          <TableCell>ACTIONS</TableCell>
                                      </>: 
                                      <>
                                          <TableCell>TOTAL MARKS</TableCell>
                                          {/* <TableCell>Answer Accuracy</TableCell> */}
                                          <TableCell>ACTIONS</TableCell>
                                      </>
                                    
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {!props.isOnlineTestReport&&currentData && currentData?.length > 0 && currentData.map((student) => (
                                        <TableRow key={student.studentId}>
                                            {/* <TableCell padding="checkbox">
                                                <Checkbox />
                                            </TableCell> */}
                                            <TableCell style={{}}>
                                            <div className="table-name-avatars" style={{ display: 'flex', gap: '10px' }}>
                                                    <Avatar src={student?.studentProfileLink} />
                                                    {/* <AvtarSection
                                                        firstName={student?.studentName}
                                                        profile={student?.studentProfileLink}
                                                    /> */}
                                                <div className="table-name-avatars-title" >
                                                    <div style={{ fontWeight: "initial" }}>{`${student?.studentName}`}</div>
                                                        <div>{transformGradeToClass(student?.className)}</div>
                                                    </div>
                                                </div>
                                            </TableCell> 
                                            <TableCell>{student.rollNo}</TableCell>
                                        <TableCell style={{ fontWeight: "initial" }}>{student?.totalMarks ?? "0"}</TableCell>
                                        {/* <TableCell>{student.answerAccuracy ?? "NA"}</TableCell> */}
                                        <TableCell sx={{ opacity: student?.answerAccuracy != (null || undefined) ? 1 : 0.4 }}>
                                            {student?.answerAccuracy != null ? (
                                                <Typography sx={{ color: '#01B58A', cursor: 'pointer', fontWeight: '600' }} onClick={() => handleView(student)}>
                                                    View Details
                                                    <IconButton>
                                                        <ChevronRightIcon fontSize="small" />
                                                    </IconButton>
                                                </Typography>
                                            ) : (
                                                <Typography sx={{ color: '#01B58A', fontWeight: '600' }}>
                                                    View Details
                                                </Typography>
                                            )}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                {props.isOnlineTestReport &&currentData?.map((student,index)=>{
                                return (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <div
                                        className="table-name-avatars"
                                        style={{ display: "flex", gap: "10px" }}
                                      >
                                        <AvtarSection
                                          firstName={student?.studentName}
                                          profile={student?.studentProfileLink}
                                        />
                                        <div className="table-name-avatars-title">
                                          <div
                                            style={{ fontWeight: "initial" }}
                                          >{`${student?.studentName}`}</div>
                                          <div>
                                            {transformGradeToClass(
                                              student?.className
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>{student?.rollNo} </TableCell>
                                    <TableCell>
                                      {student?.totalMarks || 0}
                                    </TableCell>
                                    <TableCell>
                                      {student?.correctAnswers}{" "}
                                    </TableCell>
                                    <TableCell>
                                      {student?.incorrectAnswers}{" "}
                                    </TableCell>
                                    <TableCell>
                                      {student?.skippedQuestions}{" "}
                                    </TableCell>
                                    <TableCell>
                                      <Typography
                                        sx={{
                                          color: "#01B58A",
                                          cursor: "pointer",
                                          fontWeight: "600",
                                        }}
                                        onClick={() => handleView(student)}
                                      >
                                        View Details
                                        <IconButton>
                                          <ChevronRightIcon fontSize="small" />
                                        </IconButton>
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                );
                                }) }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div className='assessPagenation' style={{ display: 'flex', justifyContent: 'start', paddingTop: view ? '1rem' : '' }}>
                        <Pagination
                            count={Math.ceil(sortedStudents?.length / rowsPerPage)}
                            page={page}
                            onChange={handleChangePage}
                            shape="rounded"
                        />
                        </div>
                    </div>}
                </div>
            </Box>
    )
}

export default StudentWiseAnalysis