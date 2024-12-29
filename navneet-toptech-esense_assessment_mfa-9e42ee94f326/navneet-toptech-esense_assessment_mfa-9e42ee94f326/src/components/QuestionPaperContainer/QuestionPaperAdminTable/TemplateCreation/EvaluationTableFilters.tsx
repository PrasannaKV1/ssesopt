import "./EvaluationTable.css";
import React, { memo, useEffect, useState } from "react";
import { Button, Grid, Box, TextField } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useDispatch } from "react-redux";

import { UPLOAD_ICON } from "../Utils/EvaluationAssets";
import { StudentListInterface } from "../../../../interface/assesment-interface";
import { sectionFilterEventActions } from "../../../../redux/actions/searchFilterEventAction";
import FileUploadPopup, { OptionsInterface } from "../EvaluationPopUpModels/FileUploadPopUp";
import { ClassNames } from "@emotion/react";

interface EvaluationTableFiltersPropsInterface {
    handleStudentNameSearch: (items: any) => void
    studentList: StudentListInterface[]
    handleSectionFilter: (data: any) => void
    selectedQuestion: any
    sectionFilter?: any
    bulkUploadMainBtn?: any
}

interface SectionTypeInterface {
    sectionID?: number,
    sectionName?: string
}

const EvaluationTableFilters = (props: EvaluationTableFiltersPropsInterface) => {
    const dispatch = useDispatch();
    const { handleStudentNameSearch, handleSectionFilter, selectedQuestion, bulkUploadMainBtn } = props;
    const [sectionType, setSectionType] = useState<SectionTypeInterface[]>([]);
    const [sectionFilters, setSectionFilters] = useState<any>({
        section: 'All',
        sectionId: "0"
    });
    const [fileUploadDialog, setFileUploadDialog] = useState<boolean>(false);
    const [options, setOptions] = useState<OptionsInterface | any>({});

    const handleStudentSearch = (event: any) => {
        handleStudentNameSearch(event?.target?.value);
    };

    const draftAllocationIds = props?.studentList
        .filter((item: any) => !item.status || item.status !== "Publish")
        .map((item: any) => item.allocationId);

    const handleSectionFilterChange = (event: any) => {
        try {
            const sectionsSelected = event.target.value;

            if (sectionsSelected) {
                const filteredData = sectionType.filter(section => String(section.sectionID) === sectionsSelected);
                if (filteredData.length > 0) {
                    setSectionFilters({ ...sectionFilters, section: sectionsSelected, sectionId: sectionsSelected });
                    dispatch(sectionFilterEventActions({ ...sectionFilters, section: sectionsSelected, sectionId: sectionsSelected }))
                    handleSectionFilter(sectionsSelected);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (selectedQuestion && selectedQuestion?.questionPaperClassDetails) {
            const classDetails = selectedQuestion?.questionPaperClassDetails?.map((el: any) => {
                return {
                    sectionID: el?.classId,
                    sectionName: el?.className
                }
            });
            const sectionDetails = classDetails?.length > 0 ? classDetails : [];
            // Add default section at the beginning
            const defaultSection = {
                sectionID: 0,
                sectionName: "All"
            };
            setSectionType([defaultSection, ...sectionDetails]);
        } else {
            // If no selectedQuestion or no section details, still set the default section
            setSectionType([{
                sectionID: 0,
                sectionName: "All"
            }]);
        }
    }, [selectedQuestion]);

    useEffect(() => {
        if (sectionType.length > 0) {
            setSectionFilters({ ...sectionFilters, section: String(sectionType[0].sectionID), sectionId: sectionType[0].sectionID });
            dispatch(sectionFilterEventActions({ ...sectionFilters, section: String(sectionType[0].sectionID), sectionId: sectionType[0].sectionID }))
            handleSectionFilter(String(sectionType[0].sectionID));
        }
    }, [sectionType]);

    return (
        <React.Fragment>
            <Grid container xs={12} spacing={2} pt={2} pb={2} pr={2} ml={0} mr={0} width="100%" className="bg-color-white">
                <Grid item xs={4} className="evaluate_searchField">
                    <TextField id="search-for-student"
                        name="SearchForStudent"
                        variant="outlined"
                        sx={{ width: "100%" }}
                        onChange={handleStudentSearch}
                        placeholder="Search for Student"
                        InputProps={{
                            startAdornment: (
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={4} style={{ paddingTop: '8px' }} className="evaluate_searchField">
                    <FormControl sx={{ m: 1 }} fullWidth>
                        <InputLabel id="demo-simple-select-autowidth-label">Section</InputLabel>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="sectionID"
                            value={sectionFilters.section}
                            onChange={handleSectionFilterChange}
                            label="Section"
                            disabled={sectionType.length === 0}
                            fullWidth
                            // MenuProps={{ClassNames:"hello"}}
                            MenuProps={{className:"SectionMenuItem"}}
                        >
                            {sectionType && sectionType.map((section) => (
                                <MenuItem className="hello" key={section.sectionID} value={String(section.sectionID)}>
                                    {String(section?.sectionID) === '0' ? section?.sectionName : `${section?.sectionName}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </Grid>
                <Grid item xs={4}>
                    <Box className={`${bulkUploadMainBtn || props?.studentList.length === 0 ? "btn-container-disabled" : "btn-container"}`} display="flex" alignItems="center" gap={2} pl={2} pr={2}>
                        <Box>
                            <img src={UPLOAD_ICON} alt="Upload Icon" style={{ opacity: bulkUploadMainBtn || props?.studentList.length === 0 ? 0.4 : 1 }} />
                        </Box>
                        <Button className={`${bulkUploadMainBtn || props?.studentList.length === 0 ? "disabled-bulk-upload-btn" : "bulk-upload-btn"}`} disabled={bulkUploadMainBtn || props?.studentList.length === 0} onClick={() => {
                            setFileUploadDialog(true);
                            setOptions({
                                data: { allocationIds: draftAllocationIds, questionPaperId: selectedQuestion.id, downloadForAll: true },
                                title: "Upload Student Marks In Bulk",
                                subtitle: props.studentList?.length ? `You are uploading ${props.studentList?.length} students marks` : "",
                                description: "Check out our sample file and follow the format to upload bulk actions.",
                                excelName: { questionName: selectedQuestion?.name, name: 'All Student',  className: props?.studentList[0]?.className }
                            })
                        }}>Bulk Upload Marks</Button>
                    </Box>
                </Grid>
            </Grid>
            {fileUploadDialog && <FileUploadPopup options={options} isBulkMarks={fileUploadDialog} handleClose={()=> setFileUploadDialog(false)} /> }     
        </React.Fragment>
    );
}

export default memo(EvaluationTableFilters);