import './QuestionPaperTable.css';
import "./EvaluationTab.css";

// TODO import external dependancy
import React, { useEffect, useRef, useState } from 'react';
import { Box, Collapse, IconButton, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import debounce from "lodash/debounce";

// TODO : imports file dependancy
import styles from './QuestionPaperTable.module.css';
import MultiSelectComponentforFilters from '../../SharedComponents/MultiSelectComponent/MultiSelectComponentNew';

// TODO temp data
import database from "../../../db/db.json";
import { EvaluationTablePayloadInterface } from '../../../interface/assesment-interface';
import InputFieldComponent from '../../SharedComponents/InputFieldComponent/InputFieldComponent';
import AvtarSection from './TemplateCreation/AvtarSection';

const Evaluation = () => {
    const [error, setError] = useState();
    const [loading, setLoading] = useState<boolean>(false);
    const [tablePayload, setTablePayload] = useState<EvaluationTablePayloadInterface[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<number | null | any>(null);

    /**################################## Function Section ##########################################*/
    // Filter the data based on the search query
    const filteredData = tablePayload.filter(data =>
        data.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (value:any) => {
        clearTimeout(searchTimeout); // Clear the previous timeout
        const timeout = setTimeout(() => {
            setSearchQuery(value); // Update search query after the delay
        }, 300); // 300 milliseconds delay
        setSearchTimeout(timeout); // Save the new timeout
    };


    /**################################## UseEffect Section ##########################################*/
    useEffect(() => {
        // Simulated data from database
        const payload = database;
        if (payload && payload.length) {
            setTablePayload(payload);
        }
    }, []);

    return (
        <React.Fragment>
            {/* ********************** Filters ************************** */}
            <Box className={`${styles.assessmentTabPadd} assessmentTabStyling mt-2`} sx={{ width: '100%' }}>
                <TabContext value={""}>
                    <TabPanel value='1' className='px-0'>
                        <div className='d-flex filter-file' style={{ justifyContent: 'space-between' }}>
                            <div className='selectTransBtnSect createNewTemplateSelectLeft' style={{ display: 'flex', gap: '10px' }}>
                                <MultiSelectComponentforFilters
                                    lsName={'grade'}
                                    multiType={'Multi1'}
                                    addableFiled='All Grades'
                                    showableField='grade'
                                    selectableField='es_gradeid'
                                    options={[]}
                                    onChange={undefined}
                                    disable={undefined}
                                    values={''}
                                />
                                <MultiSelectComponentforFilters
                                    lsName={'subject'}
                                    multiType={'Multi1'}
                                    addableFiled='All Subject'
                                    showableField='courseDisplayName'
                                    selectableField='courseId' options={[]}
                                    onChange={undefined}
                                    disable={false}
                                    values={''}
                                />
                            </div>
                            <div className='d-flex gap-2'>
                                <div className='selQuesPaperFilter'>
                                    <MultiSelectComponentforFilters
                                        lsName={'qpType'}
                                        multiType={'Multi1'}
                                        addableFiled='All Question Paper Types'
                                        showableField='name'
                                        selectableField='id'
                                        options={[]}
                                        onChange={undefined}
                                        disable={false}
                                        values={''}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </TabContext>
            </Box>
            {/* ************************ Tables ***************************** */}

            <div className='info-container evaluation-table'>
                <div className='left-side'>
                    {/* Question List */}
                    <InputFieldComponent
                        label={'Search Student Papers...'}
                        required={false}
                        inputType={'text'}
                        defaultval={null}
                        inputSize={'Medium'}
                        variant={'searchIcon'}
                        onChange={(event: any) => handleSearch(event.target.value)} // Pass input value to handleSearch
                    />

                </div>
                <div className='right-side'>
                    <div className='evaluation-table-scroll'>
                        <TableData jsonData={filteredData} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Evaluation;

// TODO : Table component 

const TableData = (props: { jsonData: EvaluationTablePayloadInterface[] }) => {
    const { jsonData } = props;
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);

    const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
        setPage(newPage);
    };

    const startIndex: number = (page - 1) * rowsPerPage;
    const endIndex: number = startIndex + rowsPerPage;

    const currentData: EvaluationTablePayloadInterface[] = jsonData.slice(startIndex, endIndex); // Slice the data based on the current page

    return (
        <React.Fragment>
            <TableContainer className='assessmentTableSect ps-3'>
                <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '70px', textAlign: 'center' }}>Avatar</TableCell>
                            <TableCell style={{ width: '25%', cursor: 'pointer' }}>Name</TableCell>
                            <TableCell style={{ width: '10%' }}>Grade</TableCell>
                            <TableCell style={{ width: '10%' }}>Division</TableCell>
                            <TableCell style={{ width: '10%', cursor: 'pointer' }}>Roll Number</TableCell>
                            <TableCell style={{ width: '25%' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentData.map((data: EvaluationTablePayloadInterface, index: number) => (
                            <TableRow key={index}>
                                <TableCell style={{ width: '70px', textAlign: 'center' }}>
                                    {/* Use AvtarSection component here */}
                                    <AvtarSection firstName={data.firstName} lastName={data.lastName} profile={data.profile} />
                                </TableCell>
                                <TableCell>{`${data.firstName} ${data.lastName}`}</TableCell>
                                <TableCell>{data.grade}</TableCell>
                                <TableCell>{data.division}</TableCell>
                                <TableCell>{data.rollNumber}</TableCell>
                                <TableCell>{data.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className='assessPagenation' style={{ display: 'flex', justifyContent: 'start', paddingTop: '1rem' }}>
                <Pagination
                    count={Math.ceil(jsonData.length / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    shape="rounded"
                />
            </div>
        </React.Fragment>
    );
};