import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { Grid, TextField, IconButton, FormControl, InputLabel, Select, MenuItem, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { onlineSectionFilterEventActions } from '../../../redux/actions/onlineSearchFilters';
import { useDispatch } from 'react-redux';
import './OnlineStudentListTableFilter.css'
interface OnlineStudentListTablefilterPropsInterface {
    handleStudentNameSearch: (items: any) => void;
    isFromTeacherWeb?: boolean;
    selectedQuestion?: any
    handleSectionFilter: (data: any) => void
    createOnlineTestBtn: boolean
    selectedOption?: string | null;
}

interface SectionTypeInterface {
    sectionID?: number,
    sectionName?: string
}

function OnlineStudentListTablefilter(props :OnlineStudentListTablefilterPropsInterface ) {
    const history = useNavigate();
    const dispatch = useDispatch()
    const { handleStudentNameSearch, isFromTeacherWeb, selectedQuestion, handleSectionFilter, createOnlineTestBtn, selectedOption } = props;

    const [sectionType, setSectionType] = useState<SectionTypeInterface[]>([]);
    const [sectionFilters, setSectionFilters] = useState<any>({
        section: 'All',
        sectionId: "0"
    });

    const handleStudentSearch = (event: any) => {
        handleStudentNameSearch(event?.target?.value);
    };

    const createNewTest=()=>{
        const lmsAssessData: any = isFromTeacherWeb && JSON.parse(localStorage.getItem("topAssessData") as string);
        const data = {
            isFromTeacherWeb: isFromTeacherWeb ? isFromTeacherWeb : false,
            lmsData: lmsAssessData
        };
        history('/assess/evaluation/onlineTest', { state: data });
    };

    const handleSectionFilterChange = (event: any) => {
        try {
            const sectionsSelected = event.target.value;

            if (sectionsSelected) {
                const filteredData = sectionType.filter(section => String(section.sectionID) === sectionsSelected);
                if (filteredData.length > 0) {
                    setSectionFilters({ ...sectionFilters, section: sectionsSelected, sectionId: sectionsSelected });
                    dispatch(onlineSectionFilterEventActions({ ...sectionFilters, section: sectionsSelected, sectionId: sectionsSelected }))
                    handleSectionFilter(sectionsSelected);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (selectedQuestion && selectedQuestion?.questionPaperSectionDetails) {
            const sectionDetails = selectedQuestion?.questionPaperSectionDetails || [];
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
            dispatch(onlineSectionFilterEventActions({ ...sectionFilters, section: String(sectionType[0].sectionID), sectionId: sectionType[0].sectionID }))
            handleSectionFilter(String(sectionType[0].sectionID));
        }
    }, [sectionType]);

    return <React.Fragment>
        <Grid container xs={12} spacing={2} pt={2} pb={2} pr={2} ml={0} mr={0} width="100%" className="bg-color-white" style={{ display: "flex", 
            justifyContent: selectedOption == "1" ? "" : "space-around"
        }}>
            <Grid item xs={isFromTeacherWeb ? 8 : 4} className={`evaluate_searchField ${selectedOption == "1" ? "onlineStudentSearchField" : ""}`}>
                <TextField id="search-for-student"
                    name="SearchForStudent"
                    variant="outlined"
                    sx={{ width: "100%" }}
                    onChange={handleStudentSearch}
                    placeholder={selectedOption == "1" ? "Search" : "Search for Student"}
                    InputProps={{
                        startAdornment: (
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        ),
                    }}
                />
            </Grid>
            {!isFromTeacherWeb && selectedOption == "0" && <Grid item xs={4} style={{ paddingTop: '8px' }} className="evaluate_searchField">
                <FormControl sx={{ m: 1 }} fullWidth>
                    <InputLabel id="demo-simple-select-autowidth-label">Section</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="sectionID"
                        value={sectionFilters.section}
                        onChange={handleSectionFilterChange}
                        label="Section"
                        disabled={false}
                        fullWidth
                        MenuProps={{className:"section-menu"}}
                    >
                        {sectionType && sectionType.map((section) => (
                            <MenuItem className="hello" key={section.sectionID} value={String(section.sectionID)}>
                                {String(section?.sectionID) === '0' ? section?.sectionName : `${section?.sectionName}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>}
            {selectedOption == "0" && <Grid item xs={4}>
                <Box className="online-create-new-test-btn-container">
                    <Button className={createOnlineTestBtn ? "online-create-new-test-btn-disabled" : "online-create-new-test-btn"} onClick={() => createNewTest()} disabled={createOnlineTestBtn}> +  Create New Online Test</Button>
                </Box>
            </Grid>}
        </Grid>
    </React.Fragment>
}

export default OnlineStudentListTablefilter