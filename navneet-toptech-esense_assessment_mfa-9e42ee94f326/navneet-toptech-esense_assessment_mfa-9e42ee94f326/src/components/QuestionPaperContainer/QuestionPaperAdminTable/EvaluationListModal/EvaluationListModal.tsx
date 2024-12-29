import Modal from "@mui/material/Modal";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import styles from "./EvaluationListModal.module.css";
import chevronright from "../../../../assets/images/chevronright.svg";
import headFilter from "../../../../assets/images/headFilter.svg";
import bulkUpload from "../../../../assets/images/bulkUpload.svg";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { StudentListInterface, StudnetListInterfaceData } from "../../../../interface/assesment-interface";
import EvaluationTable from "../TemplateCreation/EvaluationTable";
import Spinner from "../../../SharedComponents/Spinner";
import FormControl from '@mui/material/FormControl';
import { sectionFilterEventActions } from "../../../../redux/actions/searchFilterEventAction";
import { useDispatch } from "react-redux";
import EvaluationQuestionSets from "../TemplateCreation/EvaluationQuestionSets";

interface SectionTypeInterface {
  sectionID?: number,
  sectionName?: string
}

type Props = {
  studentModalOpen: boolean;
  handleStudentModal: () => void;
  closeStudentModal: () => void;
  data: StudnetListInterfaceData[];
  selectedQuestion: any;
  setBulkUploadMainBtn: any;
  bulkUploadMainBtn: any;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  handleStudentNameSearch: (items: any) => void;
  tableLoading: boolean;
  setTableLoading: (tableLoading: boolean) => void;
  handleSectionFilter: (data: any) => void;
  studentList: StudentListInterface[];
};

const EvaluationListModal: FC<Props> = ({
  studentModalOpen,
  closeStudentModal,
  handleStudentModal,
  data,
  selectedQuestion,
  setBulkUploadMainBtn,
  bulkUploadMainBtn,
  setPage,
  page,
  handleStudentNameSearch,
  tableLoading,
  setTableLoading,
  handleSectionFilter,
  studentList
}) => {
  const dispatch = useDispatch();
  const [sectionFilters, setSectionFilters] = useState<any>({
    section: 'All',
    sectionId: "0"
  });
  const [sectionType, setSectionType] = useState<SectionTypeInterface[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setTableLoading(false);
    }, 1000);
  }, [studentModalOpen])

  const transformGradeToClass = (grade: any) => {
    const mainClassName = grade.map((item: any) => item?.className).join(",");
    return mainClassName;
  };

  const classNames = transformGradeToClass(
    selectedQuestion?.questionPaperClassDetails || []
  );
  const classNamesArray = classNames
    .split(",")
    .map((className: any) => className.trim());

  const displaySectionCount =
    classNamesArray.length > 1 ? `+${classNamesArray.length - 1}` : "";
  const firstSectionDetail = classNamesArray[0];
  const remainingSectionDetails = classNamesArray.slice(1).join(", ");

  const courseDetails = (selectedQuestion?.questionPaperCourseDetails || [])
    .map((course: any) => course.courseName)
    .join(",");
  const coursesCount = courseDetails
    .split(",")
    .map((course: any) => course.trim());
  const displayCount =
    coursesCount.length > 1 ? `+${coursesCount.length - 1}` : "";

  const firstCourseDetail = coursesCount[0];
  const remainingCourseDetails = coursesCount.slice(1).join(", ");

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
      dispatch(sectionFilterEventActions({ ...sectionFilters, section: String(sectionType[0].sectionID), sectionId: sectionType[0].sectionID }))
      handleSectionFilter(String(sectionType[0].sectionID));
    }
  }, [sectionType]);

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

  return (
    <div>
      <Modal
        open={studentModalOpen}
        onClose={handleStudentModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <React.Fragment>
          {tableLoading && <Spinner />}
          <Box className={styles.modalContainer}>
            <div className={styles.modalHead}>
              <img
                src={chevronright}
                alt="arrow-icon"
                className={styles.headArrow}
                onClick={closeStudentModal}
              />
              <div className={styles.headSection}>
                <Typography className={styles.modalHeading}>
                  {selectedQuestion?.name}
                </Typography>
                <Typography className={styles.modalSubHead}>
                  {firstSectionDetail}- {firstCourseDetail}
                </Typography>
              </div>
              <img
                src={headFilter}
                alt="filter"
                className={styles.modalHeadFilter}
              />
            </div>
           <Box> <EvaluationQuestionSets selectedQuestion={selectedQuestion} /></Box>
            {/* <Box className={styles.bulkBtn}>
              <img
                src={bulkUpload}
                alt="bulkUpload"
                className={styles.bulkBtnText}
              />
            </Box> */}
            <TextField
              name="SearchForStudent"
              className={styles.modalSearch}
              size="small"
              variant="outlined"
              sx={{ width: "100%", pt: 4, pb: 1 }}
              placeholder="Search a Student..."
              onChange={(event: any) =>
                handleStudentNameSearch(event.target.value)
              }
              InputProps={{
                startAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
            <FormControl sx={{ width: '100%', marginInline: '20px', marginTop: '10px' }}>
              <InputLabel id="demo-simple-select-autowidth-label">Section</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="sectionID"
                value={sectionFilters.section}
                onChange={handleSectionFilterChange}
                label="Section"
                disabled={sectionType.length === 0}
                sx={{ width: "89%" }}
                size="small"
                placeholder="section"
                MenuProps={{ className: "SectionMenuItem" }}
              >
                {sectionType && sectionType.map((section) => (
                  <MenuItem className="hello" key={section.sectionID} value={String(section.sectionID)}>
                    {String(section?.sectionID) === '0' ? section?.sectionName : `${section?.sectionName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box className={styles.tableContainer}>
              <EvaluationTable
                data={data}
                selectedQuestion={selectedQuestion}
                setBulkUploadMainBtn={setBulkUploadMainBtn}
                bulkUploadMainBtn={bulkUploadMainBtn}
                page={page}
                setPage={setPage}
              />
            </Box>
          </Box>
        </React.Fragment>
      </Modal>
    </div>
  );
};

export default EvaluationListModal;
