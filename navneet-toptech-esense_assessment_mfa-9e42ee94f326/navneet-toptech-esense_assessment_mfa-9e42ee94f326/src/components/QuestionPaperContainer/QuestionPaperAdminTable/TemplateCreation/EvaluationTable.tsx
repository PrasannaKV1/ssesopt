import "./EvaluationTable.css";
import styles from "./EvaluationTable.module.css";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Checkbox,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import {
  EvaluationTablePayloadInterface,
  StudnetListInterfaceData,
} from "../../../../interface/assesment-interface";
import AvtarSection from "./AvtarSection";
import ButtonColorComponent from "../../../SharedComponents/ButtonColorComponent/ButtonColorComponent";
import {
  BULKUPLOAD,
  DOWNPOLYGON,
  UPPOLYGON,
  ADD_MORE,
  CROSS_ICON2,
  DISABLE_SETS,
} from "../Utils/EvaluationAssets";
import PUBLISH_FOR_STUDENT from "../../../../assets/images/publishforstudent.svg";
import ButtonComponent from "../../../SharedComponents/ButtonComponent/ButtonComponent";
import FileUploadPopup, {
  OptionsInterface,
} from "../EvaluationPopUpModels/FileUploadPopUp";
import StudentViewModal from "../EvaluationStudentModal/EvaluationStudentModal";
import {
  qustionAndStudentDetailsUpdate,
  studentSeletectListToUpload,
  updatePublishMarksDetails,
  updateUnPublishMarksDetails,
} from "../../../../redux/actions/assesmentQListEvent";
import { RootStore } from "../../../../redux/store";
import {
  publishMark,
  studentAssessmentByAllocationId,
} from "../../../../Api/QuestionTypePaper";
import StudentSetListModal from "../EvaluationPopUpModels/StudentSetModal";
import UnPublishModal from "../EvaluationPopUpModels/UnPublishModal";
import { SnackbarEventActions } from "../../../../redux/actions/snackbarEvent";
import QListEventModal from "../EvaluationPopUpModels/QListEventModal";
import Avatar from "@mui/material/Avatar";
import Spinner from "../../../SharedComponents/Spinner";
import { ReduxStates } from "../../../../redux/reducers";
interface EvaluationTablePropsInterface {
  data: StudnetListInterfaceData[];
  selectedQuestion: any;
  setBulkUploadMainBtn: any;
  bulkUploadMainBtn: any;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

interface ButtonTypesInterface {
  label: string;
  items: StudnetListInterfaceData;
  handleButtonClickEvent: (
    label: string,
    payload: StudnetListInterfaceData
  ) => void;
  disabled: boolean;
}

interface SortDetails {
  sortColName: keyof StudnetListInterfaceData;
  sortColOrder: "Asc" | "Desc";
}

const ButtonTypes: React.FC<ButtonTypesInterface> = ({
  label,
  items,
  handleButtonClickEvent,
  disabled,
}) => {
  const buttonStyle =
    // Grey color when disabled
    { textColor: "#385DDF", borderColor: "#385DDF" }; // Original color when not disabled

  // Determine the button label based on whether marks or sheet is uploaded
  const buttonLabel = items?.isAnswerSheetUploaded
    ? "Re-Upload Sheet"
    : "Upload Sheet";

  // Determine if marks are published, defaulting to false if items is undefined
  const isMarksPublish = items ? !!items.isMarksPublish : false;

  return (
    <ButtonColorComponent
      buttonVariant="outlined"
      textColor={buttonStyle.textColor + " !important"}
      borderColor={buttonStyle.borderColor + " !important"}
      label={label}
      width="154px"
      height="25px"
      onClick={() => handleButtonClickEvent(label, items)}
      backgroundColor=""
      disabled={disabled || isMarksPublish} // Disable if isMarksPublish is true or items is undefined
    />
  );
};

const EvaluationTable: React.FC<EvaluationTablePropsInterface> = ({
  data,
  selectedQuestion,
  setBulkUploadMainBtn,
  bulkUploadMainBtn,
  setPage,
  page,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const prevSelectedQuestion = useRef(selectedQuestion);
  const isMobileView = useSelector(
    (state: ReduxStates) => state?.mobileMenuStatus?.isMobileView
  );
  const dispatch = useDispatch();
  const multiSelectedStudentList = useSelector(
    (state: RootStore) => state?.studentListEvents?.selectedStudentList
  );
  const sectionFilter = useSelector(
    (state: RootStore) => state?.searchFilterEvents?.sectionFilter
  );
  const initialStudentList: any =
    useSelector((state: RootStore) => state?.qMenuEvent?.qStudentList) || [];
  const qPaperSet =
    useSelector((state: RootStore) => state?.qMenuEvent?.qPaperSet) || [];

  const rowsPerPage = 10;
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState<any[]>([]);
  const [sortDetails, setSortDetails] = useState<SortDetails>({
    sortColName: "firstName",
    sortColOrder: "Asc",
  });
  const [students, setStudents] = useState<StudnetListInterfaceData[]>(
    data || []
  );
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [uploadMarks, setUploadMarks] = useState<boolean>(false);
  const [uploadSheet, setUploadSheet] = useState<boolean>(false);
  const [options, setOptions] = useState<OptionsInterface | any>({});
  const [studentModalOpen, setStudentModalOpen] = useState<any>(false);
  const [studentData, setStudentData] = useState<any>();
  const [allocationID, setAllocationID] = useState() as any;
  const [studentOfSet, setStudentOfSet] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [unPublishModal, setUnPublishModal] = useState<boolean>(false);
  const [unPublishData, setUnPublishData] = useState<any>([]);
  const [marksUploaded, setMarksUploaded] = useState<boolean>(false);
  const [bulkUploadBtn, setBulkUploadBtn] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [addScoreBtn, setAddScoreBtn] = useState<boolean>(false);
  const [gradeBookModal, setGradeBookModal] = useState<boolean>(false);
  const [gradeBookStudentId, setGradeBookStudentId] = useState<
    any[] | undefined
  >([]);
  const [gradeBookSectionId, setGradeBookSectionId] = useState<any>();
  const [individualData, setIndividualData] = useState<any>();

  //TODO enable publish
  const [enablePublishBtn, setEnablePublishBtn] = useState(false);
  const [enableUnPublishBtn, setEnableUnPublishBtn] = useState(false);

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = students.slice(startIndex, endIndex);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setSelectAll(checked);
    const newSelected = checked ? data.map((item) => item.studentId) : [];
    setSelected(newSelected);
    const hasUnuploadedMarks = newSelected.some((roll) => {
      const selectedItem = data.find((item) => item.studentId === roll);
      return selectedItem?.isMarksUploaded === false;
    });
    setMarksUploaded(hasUnuploadedMarks);
  };

  const handleIndividualCheckboxChange = (studentId: any, items: any) => {
    const newSelected = selected.includes(studentId)
      ? selected.filter((item) => item !== studentId)
      : [...selected, studentId];
    setSelected(newSelected);
    setSelectAll(newSelected.length === initialStudentList.length);
    dispatch(studentSeletectListToUpload(items));
    const hasUnuploadedMarks = newSelected.some((roll) => {
      const selectedItem = data.find((item) => item.studentId === roll);
      return (
        selectedItem?.isMarksUploaded === false ||
        selectedItem?.status === "Draft"
      );
    });
    setMarksUploaded(hasUnuploadedMarks);
    if (newSelected && !items?.status) {
      // setEnablePublishBtn(false)
      // setEnableUnPublishBtn(false)
    }
  };
  const handleButtonClickEvent = (
    label: string,
    payload: StudnetListInterfaceData
  ) => {
    if (label === "Upload Sheet" || label === "Re-Upload Sheet") {
      // if we are Clicking individual button then we need to clear
      setUploadSheet(true);
      setSelected([]);
      setOptions({
        data: {
          qId: selectedQuestion?.id,
          sId: payload?.studentId, //sId - StudentId
          studentDetails: payload,
        },
        title: "Upload Sheet",
        subtitle: "Upload answer sheets of the student",
        description: "",
        allocationID: payload?.allocationId,
      });

      // TODO - Uploading the data for Update the status Of Upload and Re-Upload sheet
      dispatch(
        qustionAndStudentDetailsUpdate({
          [selectedQuestion?.id]: payload,
        })
      );
    } else {
      setUploadMarks(true);
      setSelected([]);
      setOptions({
        data: {
          allocationIds: [payload?.allocationId],
          questionPaperId: selectedQuestion?.id,
          downloadForAll: false,
          studentDetails: payload,
        },
        title: "Upload Student Marks In Bulk",
        subtitle: `You are uploading students marks`,
        description:
          "Check out our sample file and follow the format to upload bulk actions.",
        excelName: {
          questionName: selectedQuestion?.name,
          name: payload?.firstName,
          className: payload?.className,
        },
      });

      // TODO - Clearing the Details for Upload Sheet
      dispatch(qustionAndStudentDetailsUpdate({}));
    }
  };

  const sortToggle = (colName: keyof StudnetListInterfaceData) => {
    const sortColOrder = sortDetails.sortColOrder === "Asc" ? "Desc" : "Asc";
    const sortedStudents = [...students].sort((a, b) => {
      if (colName === "rollNumber") {
        const rollNumberA = parseInt(a[colName], 10);
        const rollNumberB = parseInt(b[colName], 10);
        return sortColOrder === "Asc"
          ? rollNumberA - rollNumberB
          : rollNumberB - rollNumberA;
      } else if (colName === "firstName") {
        return sortColOrder === "Asc"
          ? a[colName].localeCompare(b[colName])
          : b[colName].localeCompare(a[colName]);
      } else {
        if (a[colName] < b[colName]) return sortColOrder === "Asc" ? -1 : 1;
        if (a[colName] > b[colName]) return sortColOrder === "Asc" ? 1 : -1;
        return 0;
      }
    });
    setSortDetails({ sortColName: colName, sortColOrder });
    setStudents(sortedStudents);
  };

  const getClassName = (key: keyof StudnetListInterfaceData) => {
    return key === sortDetails.sortColName
      ? sortDetails.sortColOrder === "Asc"
        ? "activeUpArrow"
        : "activeDownArrow"
      : "";
  };

  const transformGradeToClass = (grade: string): string => {
    const gradeMatch = grade.match(/Grade (\d+) - ([A-Z])/);
    // TODO : this we are commenting expectation is  https://esense1.atlassian.net/browse/TA-1729
    // return gradeMatch ? `Grade ${gradeMatch[1]} ${gradeMatch[2]}` : grade;
    return grade;
  };

  const handleClose = () => {
    //  Closing the Upload modal
    if (uploadMarks) {
      setUploadMarks(false);
    }

    // Closing the answer sheet modal
    if (uploadSheet) {
      setUploadSheet(false);
      dispatch(qustionAndStudentDetailsUpdate({}));
    }
    setOptions({});
  };

  const seeStudentDetails = async (data: any) => {
    const allocationId = data?.allocationId;
    setLoading(true);
    setIndividualData(data);
    const response = await studentAssessmentByAllocationId(allocationId);
    if (response.data) {
      setStudentData(response?.data);
      setAllocationID(allocationId);
      setStudentModalOpen(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handelClosePopUp = () => {
    setStudentModalOpen(false);
    setStudentOfSet(false);
    setGradeBookModal(false);
  };

  const handleEditSetModal = () => {
    setStudentOfSet(true);
    setIsEditable(true);
  };

  const scoreGradeBookModal = () => {
    setGradeBookModal(true);
  };

  /**
   *  @function handlePublishMarks
   *  @description this function is for publishing the marks for the student
   */

  const handlePublishMarks = async (data: any) => {
    const allocationIds = initialStudentList
      ?.filter((student: any) => selected?.includes(student?.studentId))
      ?.map((i: any) => i?.allocationId);
    const obtainedMarks = initialStudentList
      ?.filter((student: any) => selected?.includes(student?.studentId))
      ?.map((i: any) => i?.obtainedMarks);
    try {
      if (isPublish) {
        // TODO : Call the Upload api
        const payload = {
          allocationIDs: allocationIds,
          statusID: 11,
        };
        const response = await publishMark(payload);
        if (
          response?.result?.responseDescription &&
          response.result.responseDescription.toLowerCase() === "success"
        ) {
          dispatch(
            updatePublishMarksDetails({
              qpId: selectedQuestion?.id,
              studentId: selected,
              obtainedMarks: obtainedMarks,
            })
          );
          dispatch(
            SnackbarEventActions({
              snackbarOpen: true,
              snackbarType: "success",
              snackbarMessage: `${selected.length} students marks published successfully`,
            })
          );
          setSelected([]);
          setSelectAll(false);
          // setEnablePublishBtn(false);
          // setEnableUnPublishBtn(true);
        } else {
          dispatch(
            SnackbarEventActions({
              snackbarOpen: true,
              snackbarType: "error",
              snackbarMessage: "Error while Publishing the Marks",
            })
          );
        }
      }
    } catch (error) {
      console.error("Error while publishing the marks");
      dispatch(
        SnackbarEventActions({
          snackbarOpen: true,
          snackbarType: "error",
          snackbarMessage: "Error while Publishing the Marks",
        })
      );
    }
  };

  const handleUnPublishMarkModal = (data: any, qpId: any) => {
    const SelectedStudent = initialStudentList
      ?.filter((student: any) => selected?.includes(student?.studentId))
      ?.map((i: any) => i?.allocationId);
    const questionPaperId = qpId;
    setUnPublishModal(true);
    setUnPublishData(SelectedStudent);
  };

  const handleUnPublishMark = async () => {
    setLoading(true);
    try {
      setUnPublishModal(false);
      const payload = {
        allocationIDs: unPublishData,
        statusID: 10,
      };
      const response = await publishMark(payload);
      if (
        response?.result?.responseDescription &&
        response.result.responseDescription.toLowerCase() === "success"
      ) {
        setLoading(false);
        dispatch(
          updateUnPublishMarksDetails({
            qpId1: selectedQuestion?.id,
            studentId1: selected,
          })
        );
        dispatch(
          SnackbarEventActions({
            snackbarOpen: true,
            snackbarType: "success",
            snackbarMessage: `${unPublishData?.length} ${
              unPublishData?.length === 1 ? "student" : "students"
            } Marks unpublished successfully`,
          })
        );
        setSelected([]);
        setSelectAll(false);
        // setEnablePublishBtn(true);
        // setEnableUnPublishBtn(false);
      } else {
        setLoading(false);
        dispatch(
          SnackbarEventActions({
            snackbarOpen: true,
            snackbarType: "error",
            snackbarMessage:
              response?.response?.data?.responseDescription ||
              "Error while Un-Publishing the mark",
          })
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Error while Un-Publishing the marks", error);
    }
  };

  useEffect(() => {
    setStudents(data);
  }, [data]);

  useEffect(() => {
    if (selectedQuestion?.id !== prevSelectedQuestion.current?.id) {
      setSelected([]);
      setSelectAll(false);
    }
    prevSelectedQuestion.current = selectedQuestion;
  }, [selectedQuestion]);

  useEffect(() => {
    if (qPaperSet && selected.length !== initialStudentList.length) {
      setSelectAll(false);
    }
    const areAllSelected =
      data.length > 0 &&
      data.every((item) => selected.includes(item.studentId));
    if (areAllSelected) {
      setSelectAll(true);
    }
  }, [qPaperSet, initialStudentList, data, selected]);

  //TODO : this is check with popUp
  useEffect(() => {
    if (students && currentData) {
      const allSelectedUploaded = selected.every((studentId) => {
        const selectedItem = initialStudentList.find(
          (item: any) => item.studentId === studentId
        );
        return (
          selectedItem &&
          selectedItem.isMarksUploaded &&
          selectedItem.status == "Draft"
        );
      });
      setIsPublish(allSelectedUploaded);
      const allSelectedPublished = selected.every((studentId) => {
        const selectedItem = initialStudentList.find(
          (item: any) => item.studentId === studentId
        );
        return (
          selectedItem &&
          selectedItem.isMarksUploaded &&
          selectedItem.status == "Publish"
        );
      });
      setMarksUploaded(!allSelectedPublished);
      const hasUnuploadedMarks = selected.every((studentId) => {
        const selectedItem = initialStudentList.find(
          (item: any) => item.studentId === studentId
        );
        return selectedItem && selectedItem.status === "Publish";
      });
      const PublishedForNonSelected = initialStudentList.every(
        (item: any) => item.status === "Publish"
      );
      if (hasUnuploadedMarks === true) {
        setBulkUploadBtn(true);
      } else {
        setBulkUploadBtn(false);
      }
      // setBulkUploadBtn(hasUnuploadedMarks);
      setBulkUploadMainBtn(PublishedForNonSelected);
    }
  }, [selected, currentData, students, initialStudentList]);

  useEffect(() => {
    if (selected.length > 0 && students && currentData) {
      const getStudentIds = selected
        .map((studentId) => {
          const selectedItem = initialStudentList.find(
            (item: any) => item.studentId === studentId
          );
          return selectedItem ? selectedItem.studentId : null;
        })
        .filter((studentId) => studentId !== null);
      const getStudentSections = selected.map((studentId) => {
        const selectedItem = initialStudentList.find(
          (item: any) => item.studentId === studentId
        );
        return selectedItem ? selectedItem.sectionId : null;
      });
      const firstSection = getStudentSections[0];
      setGradeBookStudentId(getStudentIds);
      setGradeBookSectionId(firstSection);
      const addScoreGradeBook = selected.every((studentId) => {
        const selectedItem = initialStudentList.find(
          (item: any) => item.studentId === studentId
        );
        return selectedItem && selectedItem.isMarksUploaded;
      });
      const firstStudent = initialStudentList.find(
        (item: any) => item.studentId === selected[0]
      );
      const allSameSectionId = selected.every((studentId) => {
        const student = initialStudentList.find(
          (item: any) => item.studentId === studentId
        );
        return student && student.sectionId === firstStudent?.sectionId;
      });
      setAddScoreBtn(addScoreGradeBook && allSameSectionId);
    }
  }, [selected, students]);

  useEffect(() => {
    const publishBtn = selected.map((studentId) => {
      const selectedItem = students.find(
        (item) => item.studentId === studentId
      );
      return (
        selectedItem?.status == "Draft" &&
        selectedItem?.isMarksUploaded === true
      );
    });
    const hasPublishTrueValue = publishBtn.some((value) => value === true);
    setEnablePublishBtn(hasPublishTrueValue);

    const unPublishBtn = selected.map((studentId) => {
      const selectedItem = students.find(
        (item) => item.studentId === studentId
      );
      return (
        selectedItem?.status == "Publish" &&
        selectedItem?.isMarksUploaded === true
      );
    });
    const hasUnPublishTrueValue = unPublishBtn.some((value) => value === true);
    setEnableUnPublishBtn(hasUnPublishTrueValue);
  }, [selected, currentData]);

  /**
   *  TODO : this useEffect for disable the edit set button, if all the student marks has been published
   *  @developer shivrajkhetri@navneettoptech.com
   */

  useEffect(() => {
    if (initialStudentList && initialStudentList?.length > 0) {
      const isPublish = initialStudentList.every(
        (item: any) => item.status === "Publish"
      );
      setIsDisable(isPublish);
    }
  }, [...initialStudentList, currentData]);

  useEffect(() => {
    if (selected.length || selectAll) {
      setSelected([]);
      setSelectAll(false);
    }
  }, [sectionFilter]);

  return (
    <React.Fragment>
      {isLoading && <Spinner />}
      <div
        className={
          qPaperSet?.name === null && selected.length === 0
            ? "evaluation-table-section-without-set"
            : selected.length > 0 && qPaperSet?.name !== null
            ? "evaluation-table-section"
            : "evaluation-select-table-section"
        }
      >
        <TableContainer>
          <Table
            stickyHeader
            aria-label="sticky table"
            className={isMobileView ? styles.assesment : "assesment"}
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ padding: isMobileView ? "0px" : "" }}>
                  <Checkbox
                    checked={selectAll}
                    onChange={handleCheckBoxChange}
                  />
                </TableCell>
                <TableCell
                  style={{
                    cursor: "pointer",
                    padding: isMobileView ? "0px" : "default",
                  }}
                  className={isMobileView ? styles.tableCells : ""}
                >
                  {isMobileView ? (
                    <Typography
                      className={styles.tableHeads}
                      onClick={() => sortToggle("firstName")}
                    >
                      STUDENTS
                      {/* <div>
                            <img width="10px" alt="" src={UPPOLYGON} />
                            <img width="10px" alt="" src={DOWNPOLYGON} />
                          </div> */}
                    </Typography>
                  ) : (
                    <div className="tableHeadArrowSect">
                      <span
                        className={`resrTableSortArrow questionPaperArrow ${getClassName(
                          "firstName"
                        )}`}
                        onClick={() => sortToggle("firstName")}
                      >
                        STUDENTS
                        <div>
                          <img width="10px" alt="" src={UPPOLYGON} />
                          <img width="10px" alt="" src={DOWNPOLYGON} />
                        </div>
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell
                  style={{
                    cursor: "pointer",
                    padding: isMobileView ? "0px" : "default",
                  }}
                >
                  {isMobileView ? (
                    <Typography
                      className={styles.tableHeads}
                      onClick={() => sortToggle("rollNumber")}
                    >
                      ROLL NO
                      {/* <div>
                          <img width="10px" alt="" src={UPPOLYGON} />
                            <img width="10px" alt="" src={DOWNPOLYGON} />
                        </div> */}
                    </Typography>
                  ) : (
                    <div className="tableHeadArrowSect">
                      <span
                        className={`resrTableSortArrow questionPaperArrow ${getClassName(
                          "rollNumber"
                        )}`}
                        onClick={() => sortToggle("rollNumber")}
                      >
                        ROLL NUMBER
                        <div>
                          <img width="10px" alt="" src={UPPOLYGON} />
                          <img width="10px" alt="" src={DOWNPOLYGON} />
                        </div>
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell
                  style={{
                    cursor: "pointer",
                    padding: isMobileView ? "0px" : "default",
                    paddingLeft: isMobileView ? "2px" : "default",
                  }}
                >
                  {isMobileView ? (
                    <Typography
                      className={styles.tableHeads}
                      // onClick={() => sortToggle("obtainedMarks")}
                    >
                      MARKS
                      <div>
                        {/* <img width="10px" alt="" src={UPPOLYGON} />
                            <img width="10px" alt="" src={DOWNPOLYGON} /> */}
                      </div>
                    </Typography>
                  ) : (
                    <div className="tableHeadArrowSect">
                      <span
                        className={`resrTableSortArrow questionPaperArrow ${getClassName(
                          "obtainedMarks"
                        )}`}
                        onClick={() => sortToggle("obtainedMarks")}
                      >
                        MARKS
                        <div>
                          <img width="10px" alt="" src={UPPOLYGON} />
                          <img width="10px" alt="" src={DOWNPOLYGON} />
                        </div>
                      </span>
                    </div>
                  )}
                </TableCell>
                {!isMobileView && (
                  <TableCell
                    style={{
                      cursor: "pointer",
                      textAlign: "center",
                      width: "20%",
                    }}
                  >
                    <div className="tableHeadArrowSect">
                      <span>STATUS</span>
                    </div>
                  </TableCell>
                )}
                <TableCell
                  style={{
                    padding: isMobileView ? "0px" : "default",
                  }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ background: "#fff" }}>
              {currentData.length > 0 &&
                currentData.map((items, index) => (
                  <TableRow key={index}>
                    <TableCell
                      className={isMobileView ? styles.tableCells : ""}
                    >
                      <Checkbox
                        checked={selected.includes(items.studentId)}
                        onChange={() =>
                          handleIndividualCheckboxChange(
                            items?.studentId,
                            items
                          )
                        }
                      />
                    </TableCell>
                    <TableCell
                      style={{}}
                      className={isMobileView ? styles.tableCells : ""}
                    >
                      <div className="table-name-avatars">
                        <Avatar
                          src={items?.studentProfileImg}
                          className={isMobileView ? styles.tableAvatar : ""}
                        />
                        {/* <AvtarSection
                                                firstName={items?.firstName}
                                                lastName={items?.lastName}
                                                profile={items?.studentProfileImg}
                                            /> */}
                        <div
                          className={
                            isMobileView
                              ? styles.avatarText
                              : "table-name-avatars-title"
                          }
                        >
                          <div className="avatar-name-text">{`${
                            items?.firstName
                          } ${items?.lastName || ""}`}</div>
                          <div
                            className={isMobileView ? styles.avatarSubText : ""}
                          >
                            {transformGradeToClass(items?.className)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      style={{ lineHeight: "initial" }}
                      className={isMobileView ? styles.tableCells : ""}
                    >
                      <Typography
                        className={isMobileView ? styles.cellsText : ""}
                      >
                        {" "}
                        {items?.rollNumber}
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ lineHeight: "initial" }}
                      className={isMobileView ? styles.tableCells : ""}
                    >
                      <Typography
                        className={isMobileView ? styles.cellsText : ""}
                      >
                        {items?.obtainedMarks == 0
                          ? 0
                          : items?.obtainedMarks.toString().length > 2
                          ? items?.obtainedMarks.toFixed(1)
                          : items?.obtainedMarks}
                        /{items?.totalMarks}
                      </Typography>
                    </TableCell>
                    {!isMobileView && (
                      <TableCell style={{ height: "70px" }}>
                        <div
                          className="d-flex align-item-center justify-content-center"
                          style={{ gap: "5px" }}
                        >
                          <ButtonTypes
                            label={
                              items.isMarksUploaded
                                ? "Re-Upload Marks"
                                : "Upload Marks"
                            }
                            items={items}
                            handleButtonClickEvent={handleButtonClickEvent}
                            disabled={
                              selected.includes(items.studentId) ||
                              items?.status === "Publish"
                            }
                          />
                          <ButtonTypes
                            label={
                              items.isAnswerSheetUploaded
                                ? "Re-Upload Sheet"
                                : "Upload Sheet"
                            }
                            items={items}
                            handleButtonClickEvent={handleButtonClickEvent}
                            disabled={
                              selected.includes(items.studentId) ||
                              items?.status === "Publish"
                            }
                          />
                        </div>
                      </TableCell>
                    )}
                    <TableCell
                      className={isMobileView ? styles.tableCells : ""}
                      style={{ cursor: "pointer" }}
                      onClick={() => seeStudentDetails(items)}
                    >
                      {" "}
                      <KeyboardArrowRightIcon />
                    </TableCell>
                  </TableRow>
                ))}
              {currentData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: "center" }}>
                    No match found!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {selectedQuestion?.isSetsAllocated &&
          selectedQuestion?.isSetsPresent &&
          !isMobileView && (
            <div className="add-more-div">
              <img
                src={isDisable ? DISABLE_SETS : ADD_MORE}
                alt=""
                onClick={() => (isDisable ? "" : handleEditSetModal())}
              />
            </div>
          )}
      </div>
      {students?.length > 0 && isMobileView && (
        <div
          className="assessPagenation"
          style={{
            display: "flex",
            justifyContent: "start",
            paddingTop: "0.5rem",
            paddingInline:isMobileView?"10px":''
          }}
        >
          <Pagination
            count={Math.ceil(students.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            shape="rounded"
          />
        </div>
      )}
      {selected.length > 0 && (
        <div
          className={
            isMobileView ? styles.footerBtnSection : "table-footer-modal"
          }
        >
          {!isMobileView && (
            <h4 className="fontW800 mb-0">
              {selected.length} Student{selected.length > 1 ? "s" : ""} Selected
            </h4>
          )}

          <div>
            {/*  TODO this button is for publish and un-publish marks */}
            {enablePublishBtn && !isMobileView && (
              <ButtonComponent
                icon={null}
                image={PUBLISH_FOR_STUDENT}
                textColor="#9A9A9A"
                backgroundColor="#01B58A"
                disabled={!isPublish}
                buttonSize={isMobileView ? "small" : ""}
                type="transparent"
                label={`Publish for Students`}
                minWidth=""
                hideBorder={true}
                onClick={() => {
                  handlePublishMarks(data);
                }}
              />
            )}
            {enablePublishBtn && isMobileView && (
              <Button
                className={styles.publishBtn}
                disabled={!isPublish}
                onClick={() => {
                  handlePublishMarks(data);
                }}
              >
                <Typography className={styles.publishBtnTxt}>
                  Publish for students
                </Typography>
              </Button>
            )}

            {/* TODO this button is for unPublish student  */}
            {enableUnPublishBtn && !enablePublishBtn && !isMobileView && (
              <ButtonComponent
                icon={null}
                image={CROSS_ICON2}
                textColor="#9A9A9A"
                backgroundColor="#01B58A"
                disabled={marksUploaded}
                buttonSize=""
                type="transparent"
                label={`Un-Publish for Student${
                  selected.length > 1 ? "s" : ""
                }`}
                minWidth=""
                hideBorder={true}
                onClick={() => {
                  handleUnPublishMarkModal(data, selectedQuestion?.id);
                }}
              />
            )}
            {enableUnPublishBtn && !enablePublishBtn && isMobileView && (
              <Button
                className={styles.unPublishBtn}
                disabled={marksUploaded}
                onClick={() => {
                  handleUnPublishMarkModal(data, selectedQuestion?.id);
                }}
              >
                <Typography className={styles.unPublishBtnTxt}>
                  Un-Publish for Student
                </Typography>
              </Button>
            )}

            {!isMobileView ? (
              <ButtonComponent
                icon={null}
                image={PUBLISH_FOR_STUDENT}
                textColor="#9A9A9A"
                backgroundColor="#01B58A"
                disabled={!addScoreBtn}
                buttonSize=""
                type="transparent"
                label={`Add Scores to GradeBook`}
                minWidth=""
                hideBorder={true}
                onClick={scoreGradeBookModal}
              />
            ) : (
              <Button
                className={styles.addMarkBtn}
                disabled={!addScoreBtn}
                onClick={() => {
                  scoreGradeBookModal();
                }}
              >
                <Typography className={styles.addMarkBtnTxt}>
                  Add scores to gradebook
                </Typography>
              </Button>
            )}

            {!isMobileView && (
              <ButtonComponent
                icon={null}
                image={BULKUPLOAD}
                textColor="#9A9A9A"
                backgroundColor="#01B58A"
                disabled={bulkUploadMainBtn || bulkUploadBtn}
                buttonSize=""
                type="transparent"
                label={`Bulk Upload Mark${selected.length > 1 ? "s" : ""}`}
                minWidth=""
                hideBorder={true}
                onClick={() => {
                  setUploadMarks(true);
                  setOptions({
                    data: {
                      allocationIds: initialStudentList
                        .filter(
                          (item: any) =>
                            selected.includes(item.studentId) &&
                            item.status !== "Publish"
                        )
                        .map((item: any) => item.allocationId),
                      questionPaperId: selectedQuestion.id,
                      downloadForAll: false,
                    },
                    title: "Upload Student Marks In Bulk",
                    subtitle: selected.length
                      ? `You are uploading ${selected.length} students marks`
                      : "",
                    description:
                      "Check out our sample file and follow the format to upload bulk actions.",
                    excelName: {
                      questionName: selectedQuestion?.name,
                      name: "Student",
                      className: data[0]?.className,
                    },
                  });
                }}
              />
            )}
          </div>
        </div>
      )}
      {students?.length > 0 && !isMobileView && (
        <div
          className="assessPagenation"
          style={{
            display: "flex",
            justifyContent: "start",
            paddingTop: "0.5rem",
          }}
        >
          <Pagination
            count={Math.ceil(students.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            shape="rounded"
          />
        </div>
      )}
      {uploadSheet && (
        <FileUploadPopup
          options={options}
          isSheetUpload={uploadSheet}
          handleClose={handleClose}
        />
      )}
      {uploadMarks && (
        <FileUploadPopup
          options={options}
          isBulkMarks={uploadMarks}
          handleClose={handleClose}
          setSelectAll={setSelectAll}
          setSelected={setSelected}
        />
      )}
      {studentModalOpen && (
        <StudentViewModal
          handelClosePopUp={handelClosePopUp}
          studentData={studentData}
          selectedQuestion={selectedQuestion}
          allocationID={allocationID}
          setStudentData={setStudentData}
          individualStudentData={individualData}
          setStudentModalOpen={setStudentModalOpen}
        />
      )}

      {studentOfSet && (
        <React.Fragment>
          <StudentSetListModal
            handleCloseModal={handelClosePopUp}
            studentOfSet={studentOfSet}
            selectedQuestion={selectedQuestion}
            sectionFilter={sectionFilter}
            isEditable={isEditable}
          />
        </React.Fragment>
      )}

      {unPublishModal && (
        <UnPublishModal
          open={unPublishModal}
          title={"Un-publish Student Marks?"}
          onClose={() => setUnPublishModal(false)}
          deleteHandler={() => handleUnPublishMark()}
          SubTitle1={"Marks already published for the students."}
          SubTitle2={"Do you wish to un-publish"}
          btnlabel={"Un-Publish"}
        />
      )}

      {gradeBookModal && (
        <React.Fragment>
          <QListEventModal
            title={`Add scores to ${selected?.length}/${initialStudentList.length} students's gradebook`}
            handleCloseEvent={handelClosePopUp}
            data={selectedQuestion}
            width={800}
            gradeBookModal={gradeBookModal}
            gradeBookStudentId={gradeBookStudentId}
            gradeBookSectionId={gradeBookSectionId}
            setSelected={setSelected}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default EvaluationTable;
