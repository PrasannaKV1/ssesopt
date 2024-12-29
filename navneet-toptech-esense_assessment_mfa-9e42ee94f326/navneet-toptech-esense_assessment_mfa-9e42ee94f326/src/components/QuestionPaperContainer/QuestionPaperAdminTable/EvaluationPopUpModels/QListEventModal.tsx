import "./QListEventModal.css";
import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Box,
  Modal,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import ButtonComponent from "../../../SharedComponents/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../../../redux/store";
import {
  addScoreToGradeBook,
  getSubjectDetails,
  getTestTypeDetails,
} from "../../../../Api/QuestionTypePaper";
import UnPublishModal from "./UnPublishModal";
import { SnackbarEventActions } from "../../../../redux/actions/snackbarEvent";
import { getLocalStorageDataBasedOnKey } from "../../../../constants/helper";
import { State } from "../../../../types/assessment";
import DropdownSingleSelect from "../../../SharedComponents/DropdownWithCheckbox/DropdownSingleSelect";
import { useForm, FormProvider } from "react-hook-form";
import Spinner from "../../../SharedComponents/Spinner/index";
import { ReduxStates } from "../../../../redux/reducers";

interface QListEventModalPropsInterface {
  title: string;
  handleCloseEvent: () => void;
  data: any;
  width?: number;
  gradeBookModal?: any;
  gradeBookStudentId?: any[];
  gradeBookSectionId?: any[];
  qMenuEvaluationEvent?: any;
  setSelected?: any;
}
const subTitles: any = {
  "View assessment report":
    "Select a the Test type and the sub test type you want to add scores to",
  "Add scores to gradebook":
    "Select a the Test type and the sub test type you want to add scores to",
};

interface SubTermPayloadInterface {
  terms: any[];
  subjectDetails: any[];
  classId: number | null;
  templateId: number | null;
}

const QListEventModal = (props: QListEventModalPropsInterface) => {
  const {
    data,
    title,
    handleCloseEvent,
    gradeBookModal,
    gradeBookStudentId,
    gradeBookSectionId,
    qMenuEvaluationEvent,
    setSelected,
  } = props;
  const qPaperMode = useSelector(
    (state: RootStore) => state?.qMenuEvent?.qMode
  );
  const qPaperType = useSelector(
    (state: RootStore) => state?.qMenuEvent?.qPaperType
  );
  const initialStudentList =
    useSelector((state: RootStore) => state?.qMenuEvent?.qStudentList) || [];
  const isMobileView = useSelector(
    (state: ReduxStates) => state?.mobileMenuStatus?.isMobileView
  );
  const stateDetails = JSON.parse(
    getLocalStorageDataBasedOnKey("state") as string
  ) as State;
  const { userId } = stateDetails?.login?.userData || {};
  const dispatch = useDispatch();
  const subjectRef = useRef("");
  const termRef = useRef("");
  const testTypeRef = useRef("");
  // const subjectRef = useRef()
  const [open, setOpen] = useState(true);
  const [testTypePayload, setTestTypePayload] = useState<any[]>([]);
  const [overwriteModal, setOverwriteModal] = useState<boolean>(false);
  const [subTestType, setSubTestType] = useState<boolean>(false);
  const [selectedTheoryMarks, setSelectedTheoryMarks] = useState<any>();
  const [selectedPracticalMarks, setSelectedPracticalMarks] = useState<any>();
  const [theoryPracticalValue, setTheoryPracticalValue] =
    useState<boolean>(false);
  const [sectionFilledId, setSectionFilledId] = useState<any[]>([]);
  const [sectionList, SetSectionList] = useState<any[]>([]);
  const [studentCount, setStudentCount] = useState<any>();
  const [selectedSectionID, setSelectedSectionID] = useState<any>();
  const [spinnerStatus, setSpinnerStatus] = useState(false);
  const [subTermPayload, setSubTermPayload] = useState<
    SubTermPayloadInterface[] | []
  >([
    {
      terms: [],
      subjectDetails: [],
      classId: null,
      templateId: null,
    },
  ]);
  const [initialValues, setInitialValues] = useState<any>({
    sectionId: [],
    subjectId: [],
    termId: [],
    testTypeId: [],
    selectTheoryPracticalId: [],
    subTestTypeId: [],
  });
  const methods = useForm<any>({
    defaultValues: initialValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const counts: any = {};
  initialStudentList.forEach((item: any) => {
    if (!counts[item.sectionId]) {
      counts[item.sectionId] = 0;
    }
    counts[item.sectionId]++;
  });

  const resultArray = Object.keys(counts).map((key) => ({
    sectionId: parseInt(key),
    count: counts[key],
  }));

  const TheoryPractical = [
    {
      id: 1,
      name: `Theory - ${selectedTheoryMarks}`,
    },
    {
      id: 2,
      name: `Practical - ${selectedPracticalMarks}`,
    },
  ];

  const subTestTypeList = [
    {
      id: 1,
      subTestName: "Test 1",
    },
    {
      id: 2,
      subTestName: "Test 2",
    },
    {
      id: 3,
      subTestName: "Test 3",
    },
  ];

  const modeName = qPaperMode?.filter((e: any) => e?.id == data?.examTypeID);
  const typeName = qPaperType?.filter(
    (e: any) => e?.id == data?.questionPaperTypeID
  );
  const handleClose = () => {
    handleCloseEvent();
    setOpen(false);
  };
  const handleClickAddEvent = async () => {
    const courseGroupIdValue = subTermPayload[0].subjectDetails.find(
      (item) =>
        item.courseID === methods.getValues("subjectId") &&
        item.courseGroupId !== null
    );
    try {
      setSpinnerStatus(true);
      const apiPayload = {
        courseGroupId: courseGroupIdValue?.courseGroupId ?? null,
        courseId: methods.getValues("subjectId"),
        termId: methods.getValues("termId"),
        testTypeId: methods.getValues("testTypeId"),
        maxMarks: data?.marks,
        classId: subTermPayload[0]?.classId,
        isPractical:
          methods.getValues("selectTheoryPracticalId") === 2 ? true : false,
        gradebookTemplateId: subTermPayload[0]?.templateId,
        subTestTypeId:
          methods.getValues("subTestTypeId") === ""
            ? 1
            : methods.getValues("subTestTypeId"),
        questionPaperId: data?.id,
        studentIds: gradeBookModal ? gradeBookStudentId : [],
        isOverride: false,
        userId: userId,
      };

      const response = await addScoreToGradeBook(apiPayload);

      if (response?.status === "200") {
        if (
          response.message ===
          "Marks already added for this subject in Gradebook. Do you wish to overwrite?"
        ) {
          setOverwriteModal(true);
        } else {
          dispatch(
            SnackbarEventActions({
              snackbarOpen: true,
              snackbarType: "success",
              snackbarMessage: `${
                !gradeBookModal
                  ? `${studentCount}/${studentCount}`
                  : `${gradeBookStudentId?.length}/${initialStudentList?.length}`
              } students scores are successfully added to GradeBook`,
            })
          );
          gradeBookModal && handleClose();
          gradeBookModal && setSelected([]);

          const newSectionIds = await methods.getValues("sectionId");

          setSectionFilledId((prevSectionFilledId) => [
            ...prevSectionFilledId,
            newSectionIds,
          ]);
          methods.setValue("sectionId", "");
          methods.setValue("subjectId", "");
          methods.setValue("termId", "");
          methods.setValue("testTypeId", "");
          methods.setValue("selectTheoryPracticalId", "");
          methods.setValue("subTestTypeId", "");
        }
      } else if (response?.status === "400") {
        dispatch(
          SnackbarEventActions({
            snackbarOpen: true,
            snackbarType: "error",
            snackbarMessage: response?.message,
          })
        );
      } else {
        dispatch(
          SnackbarEventActions({
            snackbarOpen: true,
            snackbarType: "error",
            snackbarMessage: response?.message || "Something went wrong",
          })
        );
      }
    } catch (error) {
      console.error("something went wrong", error);
    }
    setSpinnerStatus(false);
  };

  const overWriteMarks = async () => {
    const courseGroupIdValue = subTermPayload[0].subjectDetails.find(
      (item) =>
        item.courseID === methods.getValues("subjectId") &&
        item.courseGroupId !== null
    );
    try {
      setSpinnerStatus(true);
      const apiPayload = {
        courseGroupId: courseGroupIdValue?.courseGroupId ?? null,
        courseId: methods.getValues("subjectId"),
        termId: methods.getValues("termId"),
        testTypeId: methods.getValues("testTypeId"),
        maxMarks: data?.marks,
        classId: subTermPayload[0]?.classId,
        isPractical:
          methods.getValues("selectTheoryPracticalId") === 2 ? true : false,
        gradebookTemplateId: subTermPayload[0]?.templateId,
        subTestTypeId:
          methods.getValues("subTestTypeId") === ""
            ? 1
            : methods.getValues("subTestTypeId"),
        questionPaperId: data?.id,
        studentIds: gradeBookModal ? gradeBookStudentId : [],
        isOverride: true,
        userId: userId,
      };
      const response = await addScoreToGradeBook(apiPayload);
      if (response && response?.status === "200") {
        dispatch(
          SnackbarEventActions({
            snackbarOpen: true,
            snackbarType: "success",
            snackbarMessage: `${
              !gradeBookModal
                ? `${studentCount}/${studentCount}`
                : `${gradeBookStudentId?.length}/${initialStudentList.length}`
            } students scores are successfully added to GradeBook`, // TODO - need to  changes success msg
          })
        );
        gradeBookModal && handleClose();
        gradeBookModal && setSelected([]);
        setOverwriteModal(false);

        const newSectionIds = await methods.getValues("sectionId");

        setSectionFilledId((prevSectionFilledId) => [
          ...prevSectionFilledId,
          newSectionIds,
        ]);
        methods.setValue("sectionId", "");
        methods.setValue("subjectId", "");
        methods.setValue("termId", "");
        methods.setValue("testTypeId", "");
        methods.setValue("selectTheoryPracticalId", "");
        methods.setValue("subTestTypeId", "");
      }
    } catch (error) {
      console.error("something went wrong", error);
    }
    setSpinnerStatus(false);
  };

  const handleChangeSectionId = async (value: any) => {
    try {
      // const selectedNewId = event.target.value;
      const obj = {
        gradeID: data?.gradeID,
        sectionId: value,
      };

      const getSubjectTermDetails = await getSubjectDetails(obj);

      if (getSubjectTermDetails?.data && getSubjectTermDetails?.data?.length) {
        const apiResponse = getSubjectTermDetails?.data[0] || [];
        setSubTermPayload([apiResponse]);
        setSubTestType(false);
        testTypeRef.current = "";
        termRef.current = "";
        subjectRef.current = "";
        // Reset state values when section ID changes
      }
      const section = data?.questionPaperSectionDetails.find(
        (section: any) => section.sectionID === value
      );
      const sectionName = section ? section.sectionName : "Unknown Section";

      if (
        getSubjectTermDetails?.data?.length === 0 &&
        getSubjectTermDetails?.message.toLowerCase() ===
          "gradebooktemplate is not published" &&
        getSubjectTermDetails?.status === "200"
      ) {
        setSubTermPayload([]);
        dispatch(
          SnackbarEventActions({
            snackbarOpen: true,
            snackbarType: "error",
            snackbarMessage: `Gradebook not published for the section ${sectionName}, Kindly deselect the section to proceed`,
          })
        );
      }
    } catch (error) {
      console.error("something went wrong", error);
    }
  };

  const changeHandler = async (e: any, data1: string) => {
    switch (data1 as string) {
      case "section":
        methods.reset({
          ...methods?.getValues(),
          sectionId: e != null ? sectionList[e].sectionID : "",
        });
        setSelectedSectionID(sectionList[e].sectionID);
        methods.setValue("subjectId", "");
        methods.setValue("termId", "");
        methods.setValue("testTypeId", "");
        methods.setValue("selectTheoryPracticalId", "");
        methods.setValue("subTestTypeId", "");
        setTheoryPracticalValue(false);
        setSubTestType(false);
        handleChangeSectionId(sectionList[e].sectionID);
        break;
      case "subject":
        methods.reset({
          ...methods?.getValues(),
          subjectId:
            e != null ? subTermPayload[0]?.subjectDetails[e].courseID : "",
        });
        methods.setValue("termId", "");
        methods.setValue("testTypeId", "");
        methods.setValue("selectTheoryPracticalId", "");
        methods.setValue("subTestTypeId", "");
        setTheoryPracticalValue(false);
        setSubTestType(false);
        break;
      case "term":
        methods.reset({
          ...methods?.getValues(),
          termId: e != null ? subTermPayload[0]?.terms[e].termId : "",
        });
        methods.setValue("testTypeId", "");
        methods.setValue("selectTheoryPracticalId", "");
        methods.setValue("subTestTypeId", "");
        setTheoryPracticalValue(false);
        handleChangeGradeTerm(subTermPayload[0]?.terms[e].termId);
        break;
      case "testType":
        methods.reset({
          ...methods?.getValues(),
          testTypeId:
            e != null
              ? testTypePayload.filter((item) => data?.marks <= item?.maxMarks)[
                  e
                ].testTypeID
              : "",
        });
        setTheoryPracticalValue(false);
        setSubTestType(false);
        methods.setValue("selectTheoryPracticalId", "");
        methods.setValue("subTestTypeId", "");
        handelenChangeTestType(
          testTypePayload.filter((item) => data?.marks <= item?.maxMarks)[e]
            .testTypeID
        );
        break;
      case "theoryPractical":
        methods.reset({
          ...methods?.getValues(),
          selectTheoryPracticalId: e != null ? TheoryPractical[e].id : "",
        });
        break;
      case "subTestType":
        methods.reset({
          ...methods?.getValues(),
          subTestTypeId: e != null ? subTestTypeList[e].id : "",
        });
        break;
    }
  };

  const handleChangeGradeTerm = async (termId: any) => {
    try {
      const obj = {
        classId: subTermPayload[0]?.classId,
        templateId: subTermPayload[0]?.templateId,
        termId: termId,
        courseId: methods.getValues("subjectId"),
        maxMarks: data?.marks,
      };
      const obj2 = {
        classId: 88,
        templateId: 7655,
        termId: 1,
        courseId: 1173,
      };
      const testType = await getTestTypeDetails(obj);

      if (testType?.data && testType?.data?.length) {
        const apiResponse = testType?.data || [];
        setTestTypePayload(apiResponse);
      }
    } catch (error) {
      console.error("something went wrong", error);
    }
    setSubTestType(false);
  };
  const handelenChangeTestType = (testTypeId: any) => {
    const subTestType = testTypePayload.find(
      (item) => item.testTypeID === testTypeId && item.maxTest === 3
    );
    const theoryPracticalVal = testTypePayload.find(
      (item) =>
        item.testTypeID === testTypeId &&
        item.practicalMarks > 0 &&
        item.theoryMarks > 0
    );

    setSelectedPracticalMarks(theoryPracticalVal?.practicalMarks);
    setSelectedTheoryMarks(theoryPracticalVal?.theoryMarks);
    if (subTestType) {
      setSubTestType(true);
    } else {
      setSubTestType(false);
    }
    if (theoryPracticalVal) {
      setTheoryPracticalValue(true);
    } else {
      setTheoryPracticalValue(false);
    }
  };

  const getSubjects = (data: any) => {
    try {
      if (data.questionPaperCourseDetails) {
        const courseNames = data.questionPaperCourseDetails.map(
          (course: any) => course.courseName
        );
        return courseNames.join(", ");
      }
      return "";
    } catch (error) {
      console.error("Error getting course names", error);
      return "";
    }
  };

  const gradeName = data?.questionPaperClassDetails?.map((item: any) => {
    const grade = item.className.split(" - ")[0];
    return grade;
  });

  //@@@@@@@@@@@@@@@@@  load the data gradebook event @@@@@@@@@@@@@@@@@@@@@@/

  useEffect(() => {
    const sectionIdData = data?.questionPaperSectionDetails;
    SetSectionList(sectionIdData);
    methods.setValue(
      "sectionId",
      gradeBookModal ? gradeBookSectionId : sectionIdData[0]?.sectionID
    );
    handleChangeSectionId(
      gradeBookModal ? gradeBookSectionId : sectionIdData[0]?.sectionID
    );
    setSelectedSectionID(sectionIdData[0]?.sectionID);
    methods.setValue("subjectId", "");
    methods.setValue("termId", "");
    methods.setValue("testTypeId", "");
  }, []);

  useEffect(() => {
    if (!gradeBookModal) {
      const filteredNewIds = data?.questionPaperSectionDetails?.filter(
        (data: any) => !sectionFilledId.includes(data?.sectionID)
      );
      methods.setValue("sectionId", filteredNewIds[0]?.sectionID);
      if (filteredNewIds[0]?.sectionID && sectionFilledId.length > 0) {
        handleChangeSectionId(filteredNewIds[0]?.sectionID);
        setSelectedSectionID(filteredNewIds[0]?.sectionID);
      }

      if (
        filteredNewIds.length === 0 &&
        sectionList?.length === sectionFilledId?.length
      ) {
        methods.setValue("sectionId", "");
      }
    }
  }, [sectionFilledId, sectionList]);
  useEffect(() => {
    if (selectedSectionID) {
      const abc = resultArray.map((item) => item.sectionId);
      if (abc.includes(selectedSectionID)) {
        const matchedSection = resultArray.find(
          (item) => item.sectionId === selectedSectionID
        );
        const count = matchedSection ? matchedSection.count : 0;
        setStudentCount(count);
      } else {
        setStudentCount(0);
      }
    }
  }, [selectedSectionID, resultArray, sectionFilledId, sectionList]);
  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          overflow: isMobileView ? "auto" : "",
          marginInline: isMobileView ? "10px" : "",
        }}
      >
        <Box
          className="previewTemplateSect qpCustomFontPopup assement-q-modal"
          sx={{
            width: isMobileView ? "100%" : props?.width || "auto",
          }}
        >
          <form>
            <FormProvider {...methods}>
              <div className="main-container">
                <div className="evaluation-modal-header">
                  <div style={{ display: "flex", gap: "16px" }}>
                    {!gradeBookModal && (
                      <Grid item xs={isMobileView ? 12 : 6}>
                        <TextField
                          id="grade"
                          sx={{ width: "270px" }}
                          label="Grade"
                          variant="outlined"
                          name="gerad"
                          value={gradeName[0]}
                        />
                      </Grid>
                    )}

                    {!gradeBookModal && (
                      <Grid item xs={isMobileView ? 12 : 6}>
                        <FormControl sx={{ width: "290px" }}>
                          <DropdownSingleSelect
                            SectionDisabledID={sectionFilledId}
                            registerName="sectionId"
                            variant={"fill"}
                            selectedValue={""}
                            clickHandler={(e: any) =>
                              changeHandler(e, "section")
                            }
                            selectLabel={"Select Section"}
                            disabled={false}
                            selectList={sectionList}
                            mandatory={true}
                            showableLabel={"sectionName"}
                            showableData={"sectionID"}
                            menuHeader={"Select Section"}
                          />
                        </FormControl>
                      </Grid>
                    )}
                    {!gradeBookModal && (
                      <div className="section-filled-div">
                        Sections Filled {sectionFilledId?.length}/
                        {sectionList?.length}
                      </div>
                    )}
                  </div>
                  <p className="modal-title">
                    {`Add scores to ${
                      !gradeBookModal
                        ? `${studentCount}/${studentCount}`
                        : `${gradeBookStudentId?.length}/${initialStudentList.length}`
                    } students gradebook`}
                  </p>
                  <p className="modal-subtitle">{subTitles[title]}</p>
                  <p
                    className="m-0 close-icon"
                    style={{ top: !gradeBookModal ? "100px" : "" }}
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    <ClearIcon />
                  </p>
                </div>
                <div className="modal-body" style={{ background: "#fff" }}>
                  <Grid
                    container
                    spacing={2}
                    sx={{ px: isMobileView ? 0 : 2, py: 2 }}
                  >
                    {gradeBookModal && (
                      <Grid item xs={isMobileView ? 12 : 6}>
                        <TextField
                          id="grade"
                          label="Grade"
                          variant="outlined"
                          name="gerad"
                          value={gradeName[0]}
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                    )}
                    {gradeBookModal && (
                      <Grid item xs={isMobileView ? 12 : 6}>
                        <FormControl sx={{ width: "100%" }}>
                          <DropdownSingleSelect
                            registerName="sectionId"
                            variant={"fill"}
                            selectedValue={""}
                            clickHandler={(e: any) =>
                              changeHandler(e, "section")
                            }
                            selectLabel={"Select Section"}
                            disabled={gradeBookModal}
                            selectList={sectionList}
                            mandatory={true}
                            showableLabel={"sectionName"}
                            showableData={"sectionID"}
                            menuHeader={"Select Section"}
                          />
                        </FormControl>
                      </Grid>
                    )}
                    <Grid item xs={isMobileView ? 12 : 6}>
                      <TextField
                        id="questionpapertitle"
                        label="Question Paper Title"
                        value={data?.name}
                        name="QuestionPaperTitle"
                        variant="outlined"
                        sx={{ width: "100%" }}
                      />
                    </Grid>
                    <Grid item xs={isMobileView ? 12 : 6}>
                      <TextField
                        id="subject"
                        label="Subject"
                        variant="outlined"
                        name="Subject"
                        value={getSubjects(data)}
                        sx={{ width: "100%" }}
                      />
                    </Grid>
                    <Grid item xs={isMobileView ? 12 : 4}>
                      <TextField
                        id="questionpapermarks"
                        label="Question Paper Marks"
                        name="QuestionPaperMarks"
                        value={data?.marks}
                        variant="outlined"
                        sx={{ width: "100%" }}
                      />
                    </Grid>
                    <Grid item xs={isMobileView ? 12 : 4}>
                      <TextField
                        id="type"
                        label="Type"
                        name="Type"
                        variant="outlined"
                        value={typeName[0]?.name || "N/A"}
                        sx={{ width: "100%" }}
                      />
                    </Grid>
                    <Grid item xs={isMobileView ? 12 : 4}>
                      <TextField
                        id="mode"
                        label="Mode"
                        name="Mode"
                        variant="outlined"
                        value={modeName[0]?.name || "Offline"}
                        sx={{ width: "100%" }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={isMobileView ? 12 : qMenuEvaluationEvent ? 12 : 4}
                    >
                      <DropdownSingleSelect
                        registerName="subjectId"
                        variant={"fill"}
                        selectedValue={""}
                        clickHandler={(e: any) => changeHandler(e, "subject")}
                        selectLabel={"Select Gradebook Subject"}
                        disabled={!methods.getValues("sectionId")}
                        selectList={subTermPayload[0]?.subjectDetails}
                        mandatory={true}
                        showableLabel={"courseDisplayName"}
                        showableData={"courseID"}
                        menuHeader={"Select Subject"}
                      />
                    </Grid>
                    <Grid item xs={isMobileView ? 12 : (qMenuEvaluationEvent ? 12 : 4)}>
                      <DropdownSingleSelect
                        registerName="termId"
                        variant={"fill"}
                        selectedValue={""}
                        clickHandler={(e: any) => changeHandler(e, "term")}
                        selectLabel={"Select Term"}
                        disabled={!methods.getValues("subjectId")}
                        selectList={subTermPayload[0]?.terms}
                        mandatory={true}
                        showableLabel={"termTitle"}
                        showableData={"termId"}
                        menuHeader={"Select Term"}
                      />
                    </Grid>
                    <Grid item xs={isMobileView ? 12 : (qMenuEvaluationEvent ? 12 : 4)}>
                      <DropdownSingleSelect
                        registerName="testTypeId"
                        variant={"fill"}
                        selectedValue={""}
                        clickHandler={(e: any) => changeHandler(e, "testType")}
                        selectLabel={"Select Test Type"}
                        disabled={!methods.getValues("termId")}
                        selectList={testTypePayload.filter(
                          (item) => data?.marks <= item?.maxMarks
                        )}
                        mandatory={true}
                        showableLabel={"testTypeDisplayName"}
                        showableData={"testTypeID"}
                        menuHeader={"Select Test Type"}
                        showableLabel2={"maxMarks"}
                      />
                    </Grid>
                    {theoryPracticalValue && (
                      <Grid item xs={subTestType ? 6 : 12}>
                        <DropdownSingleSelect
                          registerName="selectTheoryPracticalId"
                          variant={"fill"}
                          selectedValue={""}
                          clickHandler={(e: any) =>
                            changeHandler(e, "theoryPractical")
                          }
                          selectLabel={"Select Theory Practical "}
                          disabled={!methods.getValues("testTypeId")}
                          selectList={TheoryPractical}
                          mandatory={true}
                          showableLabel={"name"}
                          showableData={"id"}
                          menuHeader={"Select Theory Practical"}
                        />
                      </Grid>
                    )}
                    {subTestType && (
                      <Grid item xs={theoryPracticalValue ? 6 : 12}>
                        <DropdownSingleSelect
                          registerName="subTestTypeId"
                          variant={"fill"}
                          selectedValue={""}
                          clickHandler={(e: any) =>
                            changeHandler(e, "subTestType")
                          }
                          selectLabel={"Select Sub-Test Type "}
                          disabled={!methods.getValues("testTypeId")}
                          selectList={subTestTypeList}
                          mandatory={true}
                          showableLabel={"subTestName"}
                          showableData={"id"}
                          menuHeader={"Select Theory Practical"}
                        />
                      </Grid>
                    )}
                  </Grid>
                </div>
                <div
                  className={
                    isMobileView
                      ? "block justify-content-center "
                      : "previewTemplateFooter d-flex gap-3 justify-content-start mt-4"
                  }
                  style={{ boxShadow: "none" }}
                >
                  <ButtonComponent
                    icon={""}
                    image={""}
                    textColor="#FFFFFF"
                    backgroundColor=" #01B58A"
                    disabled={!methods.getValues("testTypeId")}
                    buttonSize="Medium"
                    type="contained"
                    label="Add Scores"
                    minWidth={isMobileView ? "" : "220"}
                    width={isMobileView ? "100%" : ""}
                    onClick={handleClickAddEvent}
                  />
                  <ButtonComponent
                    icon={""}
                    image={""}
                    textColor="#1B1C1E"
                    backgroundColor="#01B58A"
                    disabled={false}
                    buttonSize="Medium"
                    type="outlined"
                    label="Cancel"
                    minWidth={isMobileView ? "" : "220"}
                    width={isMobileView ? "100%" : ""}
                    marginTop={isMobileView ? "10px" : ""}
                    onClick={handleClose}
                  />
                </div>
              </div>
            </FormProvider>
          </form>
        </Box>
      </Modal>
      {overwriteModal && (
        <React.Fragment>
          <UnPublishModal
            open={overwriteModal}
            title={"Overwrite Marks on Gradebook?"}
            onClose={() => setOverwriteModal(false)}
            deleteHandler={() => overWriteMarks()}
            SubTitle1={"Marks already added for this subject in GradeBook"}
            SubTitle2={"Do you wish to overwrite"}
            btnlabel={"Overwrite"}
          />
        </React.Fragment>
      )}
      {spinnerStatus && <Spinner />}
    </React.Fragment>
  );
};

export default QListEventModal;
