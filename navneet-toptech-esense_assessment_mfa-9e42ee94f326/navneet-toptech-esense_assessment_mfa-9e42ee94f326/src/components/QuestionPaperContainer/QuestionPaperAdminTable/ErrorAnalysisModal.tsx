import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, Tooltip, TableRow, Paper, Button, Box, Typography, IconButton, Pagination } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ChevronUpIcon from '@mui/icons-material/ExpandLess';
import ChevronDownIcon from '@mui/icons-material/ExpandMore'; import { errorForReports } from '../../../Api/AssessmentReports';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import Spinner from '../../SharedComponents/Spinner';

interface ErrorDetail {
    name: string;
    group: string;
    noOfQuestions: string;
    noOfStudents: string
}

interface ErrorAnalysisModalPropsInterface {
    questionId?: any
    studentId?: any
    setIsErrorDisplay?: any
}

const ErrorAnalysisModal = (props: ErrorAnalysisModalPropsInterface) => {
    const { questionId, studentId, setIsErrorDisplay } = props;
    const userData = JSON.parse(`${localStorage?.getItem('state')}`);

    const [errorDetails, setErrorDetails] = useState<ErrorDetail[]>([]);
    const [selectedErrors, setSelectedErrors] = useState<{ [key: string]: boolean }>({});
    const [sortNameAsc, setSortNameAsc] = useState(true); // State for sorting by error name
    const [page, setPage] = useState(1);
    const [view, setView] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const rowsPerPage = 5;
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = errorDetails.slice(startIndex, endIndex);
    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const sortByErrorName = () => {
        const sortedErrorDetails = [...errorDetails].sort((a, b) => {
            if (sortNameAsc) {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        setErrorDetails(sortedErrorDetails);
        setSortNameAsc(!sortNameAsc);
    };

    /**
     * @useEffect 
     *  @description this is effect for the teacher side api error listing
     */
    useEffect(() => {
        const fetchErrorDetails = async () => {
            setLoading(true);
            try {
                const apiPayload = {
                    qpId: questionId,
                }
                const response = await errorForReports(apiPayload || {});

                if (response?.errorDetails) {
                    setLoading(false);
                    setErrorDetails(response.errorDetails);
                } else {
                    setLoading(false);
                    console.log("No error details found in response");
                }
            } catch (error) {
                setLoading(false);
                console.error('Error fetching error details:', error);
            }
        };


        if (questionId && !studentId) {
            fetchErrorDetails();
        }
    }, []);

    /**
     * @useEffect 
     *  @description this is effect for the student side api error listing
     */
    useEffect(() => {
        const fetchErrorDetails = async () => {
            setLoading(true);
            try {
                const apiPayload = {
                    qpId: questionId,
                    studentId: studentId
                }
                const response = await errorForReports(apiPayload || {});
                if (response?.errorDetails && response?.errorDetails.length > 0) {
                    setLoading(false);
                    setErrorDetails(response.errorDetails);
                } else if (response?.errorDetails.length === 0) {
                    setIsErrorDisplay(false);
                    setLoading(false);
                }
                else {
                    console.log("No error details found in response");
                }
            } catch (error) {
                setLoading(false);
                console.error('Error fetching error details:', error);
            }
        };

        if (questionId && studentId) {
            fetchErrorDetails();
        }
    }, []);

    return (
        <>
            {isLoading && <Spinner />}
            {currentData?.length > 0 && <div style={{margin: studentId ? "1rem 0rem 1rem 5rem" : '', width: studentId ?"90%" : '', borderRadius: "16px", border:"1px solid #DEDEDE"}} className='error-evaluation-asses1-container'>
                {userData?.login?.userRole === "Teacher" && <div style={{ backgroundColor: 'white', margin: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ fontWeight: "700", fontSize: "18px" }}>
                            Error Analysis
                        </div>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            {/* <ButtonComponent type={"contained"} label={'Download Report'} textColor={'#FFFFFF'} buttonSize={'Medium'} minWidth={'200'} backgroundColor={'#01B58A'} /> */}
                            <Typography sx={{ color: '#01B58A', cursor: 'pointer', fontWeight: '600' }} onClick={() => setView(!view)}>
                                View Details
                                <IconButton>
                                    {!view ? <ChevronDownIcon fontSize='large' /> : <ChevronUpIcon fontSize='large' />}
                                </IconButton>
                            </Typography>
                        </div>
                    </div>
                    {view && <div>
                        <TableContainer component={Paper} style={{ minHeight: "350px", maxHeight: "350px" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            ERROR NAME
                                            <IconButton onClick={sortByErrorName}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <ArrowDropUpIcon sx={{ color: sortNameAsc ? 'black' : 'grey', marginBottom: '-7px' }} />
                                                    <ArrowDropDownIcon sx={{ color: !sortNameAsc ? 'black' : 'grey', marginTop: '-7px' }} />
                                                </Box>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>GROUP</TableCell>
                                        <TableCell>NO OF QUESTIONS</TableCell>
                                        {!studentId && <TableCell>NO OF STUDENTS</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentData && currentData?.length > 0 && currentData.map((error, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{error.name}</TableCell>
                                            <TableCell>{error.group}</TableCell>
                                            <TableCell>{error.noOfQuestions}</TableCell>
                                            {!studentId && <TableCell>{error.noOfStudents}</TableCell>}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {<div className='assessPagenation' style={{ display: 'flex', justifyContent: 'start', paddingTop: view ? '1rem' : '' }}>
                            <Pagination
                                count={Math.ceil(errorDetails.length / rowsPerPage)}
                                page={page}
                                onChange={handleChangePage}
                                shape="rounded"
                            />
                        </div>}
                    </div>}
                </div>}
            </div>}
        </>
    );
};

export default ErrorAnalysisModal;