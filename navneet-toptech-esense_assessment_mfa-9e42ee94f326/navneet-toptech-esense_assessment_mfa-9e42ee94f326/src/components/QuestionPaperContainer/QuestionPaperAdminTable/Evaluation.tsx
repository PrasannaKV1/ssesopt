import "./QuestionPaperTable.css";
import "./EvaluationTab.css";

// TODO import external dependancy
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Alert, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// TODO : imports file dependancy
import {
  EvaluationTablePayloadInterface,
  EvaluationQuestionListInterface1,
  StudnetListInterfaceData,
} from "../../../interface/assesment-interface";
import EvaluationQuestionCards from "./TemplateCreation/EvaluationQuestionCards";
import {
  qListMenuEventActions,
  qModeEventActions,
  qPaperList,
  qPaperStudentEventActions,
  qPaperTypeEventActions,
  qStudentListEventActions,
  studentSeletectListToUpload,
  updateCurrentQpDetails,
} from "../../../redux/actions/assesmentQListEvent";
import { RootStore } from "../../../redux/store";
import QListEventModal from "./EvaluationPopUpModels/QListEventModal";
import ViewModal from "./EvaluationPopUpModels/ViewModal";
import EvaluationTable from "./TemplateCreation/EvaluationTable";
import EvaluationTableFilters from "./TemplateCreation/EvaluationTableFilters";
import EvaluationQuestionSets from "./TemplateCreation/EvaluationQuestionSets";
import EvaluationPanal from "./EvaluationPanal";
import {
  QuestionPaperModeApi,
  QuestionPaperTypeapi,
  getQuestionPaperList,
  getAllStudentListApi1,
} from "../../../Api/QuestionTypePaper";
import EmptyScreen from "../../SharedComponents/EmptyScreen/EmptyScreen";
import { getLocalStorageDataBasedOnKey } from "../../../constants/helper";
import { State } from "../../../types/assessment";
import Spinner from "../../SharedComponents/Spinner/index";
import StudentSetListModal from "./EvaluationPopUpModels/StudentSetModal";
import { sectionFilterEventActions } from "../../../redux/actions/searchFilterEventAction";
import { ReduxStates } from "../../../redux/reducers";
import EvaluationListModal from "./EvaluationListModal/EvaluationListModal";
import EvaluationWrapperFilter from "./EvaluationWrapperFilter";

const alertStyle = {
  backgroundColor: "rgba(246, 188, 12, 0.1)",
  marginLeft: "10px",
  marginRight: "10px",
  borderRadius: "8px",
};

const questionPaperStatus: string[] = ["print", "approved", "saved"];
const EvaluationBeta = () => {
  const isMobileView = useSelector(
    (state: ReduxStates) => state?.mobileMenuStatus?.isMobileView
  );
  const dispatch = useDispatch();
  const history = useNavigate();
  const location = useLocation();
  const stateDetails = JSON.parse(
    getLocalStorageDataBasedOnKey("state") as string
  ) as State;

  // TODO - selectors
  const qMenuEvaluationEvent = useSelector(
    (state: RootStore) => state?.qMenuEvent?.option
  );
  const qMenuEvaluationEventPayload = useSelector(
    (state: RootStore) => state?.qMenuEvent?.qPayload
  );
  const qPapersList = useSelector(
    (state: RootStore) => state?.qMenuEvent?.qPaperList
  );
  const qPaperMode = useSelector(
    (state: RootStore) => state?.qMenuEvent?.qMode
  );
  const qPaperType = useSelector(
    (state: RootStore) => state?.qMenuEvent?.qPaperType
  );
  const greads = useSelector((state: RootStore) => state?.qMenuEvent?.qGrade);
  const subjects =
    useSelector((state: RootStore) => state?.qMenuEvent?.qSubjects) || [];
  const paperTypes = useSelector(
    (state: RootStore) => state?.qMenuEvent?.qPaperType
  );
  const qPaperSets = useSelector(
    (state: RootStore) => state?.qMenuEvent?.qPaperSet
  );
  const initialStudentList =
    useSelector((state: RootStore) => state?.qMenuEvent?.qStudentList) || [];
  const qPaperStudentList = useSelector(
    (state: RootStore) => state?.qMenuEvent?.qPaperStudent
  );
  const sectionFilter = useSelector(
    (state: RootStore) => state?.searchFilterEvents?.sectionFilter
  );
  const currentQuestionPaper = useSelector(
    (state: RootStore) => state?.qMenuEvent?.currentQp
  );

  const [questionCount, setQuestionsCount] = useState<any>(0);
  const [questions, setQuestions] =
    useState<EvaluationQuestionListInterface1[]>(qPapersList);
  const [searchQuery, setSearchQuery] = useState<string>();
  const [searchStudentQuery, setSearchStudentQuery] = useState<string>();
  const [searchTimeout, setSearchTimeout] = useState<number | null | any>(null);
  const [searchApiFilters, setSearchApiFilter] = useState<any>();
  const [studentList, setStudentList] = useState<
    StudnetListInterfaceData[] | any[]
  >([]);
  const [spinnerStatus, setSpinnerStatus] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any | undefined>(
    undefined
  );
  const [emptyScreen, setEmptyScreen] = useState<boolean>(false);
  const [studentOfSet, setStudentOfSet] = useState<boolean>(false);
  const [bulkUploadMainBtn, setBulkUploadMainBtn] = useState<any>(false);
  const [page, setPage] = useState<number>(1);
  const [studentModalOpen, setStudentModalOpen] = useState<boolean>(false);
  const[tableLoading,setTableLoading]=useState<boolean>(false)

  /**################################## Function Section ##########################################*/
  const handleSearch = (value: any) => {
    clearTimeout(searchTimeout); // Clear the previous timeout
    const timeout = setTimeout(() => {
      setSearchQuery(value); // Update search query after the delay
    }, 300); // 300 milliseconds delay
    setSearchTimeout(timeout); // Save the new timeout
  };

  const handleQuestionPaperMode = async (dispatch: any) => {
    setSpinnerStatus(true);
    const mode = await QuestionPaperModeApi();
    if (mode?.length > 0) {
      //setSpinnerStatus(false);
      dispatch(qModeEventActions(mode));
    }
  };

  const handleQuestionPaperType = async (dispatch: any) => {
    setSpinnerStatus(true);
    const res = await QuestionPaperTypeapi();
    if (res) {
      // setSpinnerStatus(false);
      dispatch(qPaperTypeEventActions(res));
    }
  };

  const handleCardClick = (item: any) => {
    // ! while changing the Question Paper card Making the student selected List empty
    dispatch(studentSeletectListToUpload([]));
    setSelectedQuestion(item);
    dispatch(updateCurrentQpDetails(item));
    // Store the item in local storage
    localStorage.setItem("currentQp", JSON.stringify(item));
  };
  // TODO - need to changes payload object for getting student list

  /**
   *  @function handleStudentNameSearch
   *  @description this function using for search student name from the Student List
   */
  const handleStudentNameSearch = useCallback(
    (value: any) => {
      clearTimeout(searchTimeout); // Clear the previous timeout
      const timeout = setTimeout(() => {
        setSearchStudentQuery(value); // Update search query after the delay
      }, 300); // 300 milliseconds delay
      setSearchTimeout(timeout); // Save the new timeout
    },
    [searchStudentQuery]
  );

  const filterQuestions = () => {
    setSpinnerStatus(true);
    let filteredQuestions = qPapersList; // Start with all questions
    // Apply search query filter

    if (
      searchApiFilters?.gradeId ||
      searchApiFilters?.subjectId ||
      searchApiFilters?.questionPaperTypeId ||
      searchApiFilters?.minMarks ||
      searchApiFilters?.maxMarks
    ) {
      if (searchApiFilters?.gradeId) {
        const gradeIds = searchApiFilters.gradeId.split(",");
        filteredQuestions = filteredQuestions.filter((item: any) =>
          gradeIds.includes(`${item?.gradeID}`)
        );
      }

      // TODO : courseId is not exist in The list || once added in api call we Are taking forword

      if (searchApiFilters?.subjectId) {
        const courseIds = searchApiFilters?.subjectId.split(",");
        filteredQuestions = filteredQuestions.filter((item: any) => {
          return item.questionPaperCourseDetails?.some((course: any) =>
            courseIds.includes(`${course.courseID}`)
          );
        });
      }

      /**
       *  TODO ! this code should not delete if we are having
       */
      // if (searchApiFilters?.subjectId) {
      //     const courseIds = searchApiFilters.subjectId.split(',');
      //     filteredQuestions = filteredQuestions.filter((item) => {
      //         // Get all courseIDs from the question paper
      //         const itemCourseIds = item.questionPaperCourseDetails?.map(course => `${course.courseID}`) || [];

      //         // Check if all courseIds in the filter are present in itemCourseIds
      //         return courseIds.every(courseId => itemCourseIds.includes(courseId));
      //     });
      // }

      if (searchApiFilters.questionPaperTypeId) {
        const questionPaperTypeIds =
          searchApiFilters.questionPaperTypeId.split(",");
        filteredQuestions = filteredQuestions.filter((item: any) =>
          questionPaperTypeIds.includes(`${item?.questionPaperTypeID}`)
        );
      }

      if (searchApiFilters?.minMarks && searchApiFilters?.maxMarks) {
        filteredQuestions = filteredQuestions.filter((item: any) => {
          if (
            item?.marks <= searchApiFilters?.maxMarks &&
            item?.marks >= searchApiFilters?.minMarks
          ) {
            return item;
          }
        });
      }
    } else {
      // if (searchQuery === "" || !searchQuery) {
      setQuestionsCount(filteredQuestions.length);
      // }
    }
    if (searchQuery) {
      filteredQuestions = filteredQuestions.filter((question: any) => {
        if (
          question.name &&
          question.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return question;
        }
      });
      setQuestions(filteredQuestions);
    }

    if (searchQuery === "" || !searchQuery) {
      setQuestions(filteredQuestions);
    }
    //setSpinnerStatus(false);
  };

  const fetchFilteredStudent = useMemo(() => {
    let result = [...initialStudentList]; // Create a copy to avoid mutating the original array

    if (qPaperSets && qPaperSets.setId) {
      // Perform filtered based on qPaperSets if it exists

      if (sectionFilter?.section != 0) {
        result = result.filter((student: any) => {
          return (
            (sectionFilter.section
              ? student.classId.toString() === sectionFilter.section
              : true) &&
            (!searchStudentQuery
              ? true
              : student?.firstName
                  ?.toLowerCase()
                  .includes(searchStudentQuery.toLowerCase()) ||
                student?.rollNumber
                  ?.toString()
                  .startsWith(searchStudentQuery.toLowerCase())) &&
            student.setId === qPaperSets.setId
          );
        });
      } else {
        result = result.filter((student: any) => {
          return (
            (!searchStudentQuery
              ? true
              : student?.firstName
                  ?.toLowerCase()
                  .includes(searchStudentQuery.toLowerCase()) ||
                student?.rollNumber
                  ?.toString()
                  .startsWith(searchStudentQuery.toLowerCase())) &&
            student.setId === qPaperSets.setId // Compare result.setId with qPaperSets.setId
          );
        });
      }
    } else {
      if (sectionFilter?.section != 0) {
        result = result.filter((student: any) => {
          return (
            (sectionFilter.section
              ? student.classId.toString() === sectionFilter.section
              : true) &&
            (!searchStudentQuery
              ? true
              : student?.firstName
                  ?.toLowerCase()
                  .includes(searchStudentQuery.toLowerCase()) ||
                student?.rollNumber
                  ?.toString()
                  .startsWith(searchStudentQuery.toLowerCase()))
          );
        });
      }
      if (searchStudentQuery) {
        const query = searchStudentQuery.toLowerCase();
        result = result.filter(
          (student) =>
            student?.firstName?.toLowerCase().includes(query) ||
            student?.rollNumber?.toString().startsWith(query)
        );
      }
      // Perform normal filtering if qPaperSets or setId does not exist
    }

    setPage(1);
    return result;
  }, [
    searchStudentQuery,
    sectionFilter,
    initialStudentList,
    qPaperSets,
    qPaperStudentList,
    qPapersList,
  ]);

  // TODO -> Handle Questions Menu
  /**
   *  @function handleQuestionMenuEvent
   *  @description this function is responsible for Handle the Question Menu events
   *  @param qMenuItems string value either of the two ['View assessment report','Add scores to gradebook']
   */
  const handleQuestionMenuEvent = (qMenuItems: {
    option: string;
    payload: EvaluationQuestionListInterface1;
  }) => {
    dispatch(qListMenuEventActions(qMenuItems));
  };

  const handelClosePopUp = useCallback(() => {
    dispatch(qListMenuEventActions(null));
  }, [qMenuEvaluationEvent]);

  /**
   *  @developer dharmikshah@navneettoptech.com
   *  @function qustionPaperPreview
   *  @description this function return for preview the question Paper
   */
  const qustionPaperPreview = useCallback(
    (payload: any) => {
      history("/MIFprintForPreview", {
        state: {
          state: false,
          templateId: payload?.id,
          print: false,
          questionPaperTypeID: payload?.questionPaperTypeID,
          enablebtnPrint:
            payload?.questionPaperTypeID === 2
              ? payload.statusID === 2 || payload.statusID === 6
                ? false
                : true
              : false,
          disableBtnPrint:
            payload?.questionPaperTypeID === 2
              ? payload.statusID === 2 ||
                payload.statusID === 6 ||
                payload.statusID === 5
                ? true
                : false
              : false,
          editStatus: false,
          isAssesment: true,
        },
      });
    },
    [history]
  );

  const getAllQuestionPaperList = async (requestPayload: any) => {
    setSpinnerStatus(true);
    try {
      // Storing all the Question Data into store
      //setSpinnerStatus(true)

      const response = await getQuestionPaperList(requestPayload);
      if (response) {
        if (response?.baseResponse?.data) {
          const filterdQuestions: any = response?.baseResponse?.data?.filter(
            (item: EvaluationQuestionListInterface1) =>
              questionPaperStatus?.includes(item?.statusName?.toLowerCase())
          );
          fetchStudentListOnRender(filterdQuestions?.[0]);
          dispatch(qPaperList(filterdQuestions || []));
          setQuestionsCount(filterdQuestions?.length);
          // setLoading(false)
        }
        //setSpinnerStatus(false);
      }
    } catch (error) {
      console.error("Error While Calling Question Paper Api");
      //setSpinnerStatus(false);
      //setLoading(false)
    }
    //setSpinnerStatus(false)
  };

  const handleSectionFilter = (sectionIds: any) => {
    if (sectionIds.length > 0) {
      const filtered = initialStudentList.filter(
        (student: { classId: any }) => sectionIds.includes(student.classId)
      );
      setStudentList(filtered);
    }
    if (sectionIds.length === 0) {
      setStudentList(initialStudentList);
    }
  };

  const handleCloseModal = useCallback(() => {
    setStudentOfSet(false);
  }, [studentOfSet]);

  /**################################## UseEffect Section ##########################################*/

  useEffect(() => {
    if (questionCount !== 0) {
      setSpinnerStatus(false);
    } else {
      setTimeout(() => {
        setSpinnerStatus(false);
      }, 1000);
    }
  }, [spinnerStatus]);

  useEffect(() => {
    // Update questions when filters change
    if (searchQuery || searchApiFilters) {
      setQuestionsCount(qPapersList.length);
      filterQuestions();
      // !-REF-001
      //   filterQuestions();
    }
  }, [searchQuery, searchApiFilters, qPapersList]);

  const fetchStudentListOnRender = async (item: any) => {
    try {
      const gradeIds = item?.gradeID ? [item?.gradeID] : [];
      const courseIds =
        item?.questionPaperCourseDetails.map(
          (course: { courseID: any }) => course.courseID
        ) || [];
      const sectionIds =
        item?.questionPaperSectionDetails.map(
          (section: { sectionID: any }) => section?.sectionID
        ) || [];
      const extractSetNumber = (name: string): number | null => {
        const match = name.match(/\(Set (\d+)\)/);
        return match ? parseInt(match[1], 10) : null;
      };

      const setIds = item?.questionPaperSetsInfo
        ? item.questionPaperSetsInfo
            .map((item: any) => ({
              id: item?.id,
              setName: item?.name,
              setNumber: extractSetNumber(item?.name),
            }))
            .filter((item: any) => item?.setNumber !== null)
        : [];
      const setNum = setIds?.map((item: any) => item?.setNumber);
      const setIds2 = item?.questionPaperSetsInfo
        ? item.questionPaperSetsInfo.map((set: { id: any }) => set.id)
        : [];

      const qpId = item?.id;
      const qpTypeId = item?.questionPaperTypeID;
      const apiPayload = {
        staffId: stateDetails.login.userData.userRefId || 1,
        courseId: courseIds || [],
        sectionId: sectionIds || [],
        gradeId: gradeIds || [],
        qpId: qpId,
        qpTypeId: qpTypeId,
        isStudentCourse: true,
        setId: setIds2 || "",
      };

      setSpinnerStatus(true);
      const response = await getAllStudentListApi1(apiPayload);
      if (
        response?.result?.responseDescription === "Success" &&
        !response?.data
      ) {
        setStudentList([]);
        dispatch(qStudentListEventActions([]));
        dispatch(qPaperStudentEventActions({ qId: qpId, data: [] }));
      }
      if (
        response?.result?.responseDescription === "Success" &&
        response?.data
      ) {
        const sortedData = response?.data?.sort((a: any, b: any) => {
          const rollNumberA = parseInt(a?.rollNumber, 10);
          const rollNumberB = parseInt(b?.rollNumber, 10);
          return rollNumberA - rollNumberB;
        });

        setStudentList(sortedData);

        dispatch(qStudentListEventActions(sortedData));
        dispatch(qPaperStudentEventActions({ qId: qpId, data: sortedData }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchStudentList = async (item: any) => {
      try {
        const gradeIds = item.gradeID ? [item.gradeID] : [];
        const courseIds =
          item?.questionPaperCourseDetails.map(
            (course: { courseID: any }) => course.courseID
          ) || [];
        const sectionIds =
          item?.questionPaperSectionDetails.map(
            (section: { sectionID: any }) => section.sectionID
          ) || [];
        const extractSetNumber = (name: string): number | null => {
          const match = name.match(/\(Set (\d+)\)/);
          return match ? parseInt(match[1], 10) : null;
        };

        const setIds = item?.questionPaperSetsInfo
          ? item.questionPaperSetsInfo
              .map((item: any) => ({
                id: item?.id,
                setName: item?.name,
                setNumber: extractSetNumber(item?.name),
              }))
              .filter((item: any) => item?.setNumber !== null)
          : [];
        const setNum = setIds?.map((item: any) => item?.setNumber);
        const setIds2 = item?.questionPaperSetsInfo
          ? item.questionPaperSetsInfo.map((set: { id: any }) => set.id)
          : [];

        const qpId = item?.id;
        const qpTypeId = item?.questionPaperTypeID;
        const apiPayload = {
          staffId: stateDetails.login.userData.userRefId || 1,
          courseId: courseIds || [],
          sectionId: sectionIds || [],
          gradeId: gradeIds || [],
          qpId: qpId,
          qpTypeId: qpTypeId,
          isStudentCourse: true,
          setId: setIds2 || "",
        };

        setSpinnerStatus(true);
        // const res = await getAllStudentListApi(apiPayload);
        const response = await getAllStudentListApi1(apiPayload);

        if (
          response?.result?.responseDescription === "Success" &&
          !response?.data
        ) {
          setStudentList([]);
          dispatch(qStudentListEventActions([]));
          dispatch(qPaperStudentEventActions({ qId: qpId, data: [] }));
        }
        if (
          response?.result?.responseDescription === "Success" &&
          response?.data
        ) {
          // Sort the response data based on rollNumber
          // const sortedData = response?.data?.sort((a: any, b: any) => {
          //     const rollNumberA = a?.rollNumber?.toString()?.toLowerCase();
          //     const rollNumberB = b?.rollNumber?.toString()?.toLowerCase();
          //     if (rollNumberA < rollNumberB) return -1;
          //     if (rollNumberA > rollNumberB) return 1;
          //     return 0;
          // });

          const sortedData = response?.data?.sort((a: any, b: any) => {
            const rollNumberA = parseInt(a?.rollNumber, 10);
            const rollNumberB = parseInt(b?.rollNumber, 10);
            // Use numeric comparison
            return rollNumberA - rollNumberB;
          });

          setStudentList(sortedData);

          // dispatch(sectionFilterEventActions({ section: sortedData?.[0]?.sectionId }))
          dispatch(qStudentListEventActions(sortedData));
          dispatch(qPaperStudentEventActions({ qId: qpId, data: sortedData }));
        }
      } catch (error) {
        console.error(error);
      }
      //setSpinnerStatus(false)
    };

    if (selectedQuestion) {
      if (qPaperStudentList[`${selectedQuestion?.id}`]) {
        setStudentList(qPaperStudentList[`${selectedQuestion?.id}`]);
        dispatch(
          qStudentListEventActions(qPaperStudentList[`${selectedQuestion?.id}`])
        );
        // fetchStudentList(selectedQuestion);
      } else {
        // API call
        fetchStudentList(selectedQuestion);
      }
    }
  }, [selectedQuestion, qPapersList, studentOfSet]);

  useEffect(() => {
    if (qPaperMode && qPaperMode.length === 0) {
      handleQuestionPaperMode(dispatch);
    }
    if (qPaperType && qPaperType.length === 0) {
      handleQuestionPaperType(dispatch);
    }
  }, [qPaperType, qPaperMode]);

  useEffect(() => {
    const payload = qPapersList;
    if (payload && payload.length) {
      setQuestions(payload);
    }
  }, []);

  // @@@@@@@@@ Loading Question Paper @@@@@@@@@@@@@@@@@@@
  useEffect(() => {
    const gradeIds: any[] =
      greads?.map((item: { es_gradeid: any }) => item?.es_gradeid) || [];
    const courseIds: any[] =
      subjects?.map((item: { courseId: any }) => item?.courseId) || [];
    const questionPaperTypeId: any[] =
      paperTypes?.map((item: { id: any }) => item?.id) || [];

    const requestPayload = {
      gradeIds,
      courseIds,
      searchKey: "",
      sortKey: "",
      sortKeyOrder: "",
      questionPaperTypeId,
      questionPaperStatus: "",
      pageNo: 0,
      pageSize: 200, //Offline Max QP size is 200 as discussed with Shamik Sir
      minMarks: "",
      maxMarks: "",
      academicYearIds: stateDetails?.currentAcademic?.acadamicId,
    };

    if (qPapersList?.length === 0) {
      getAllQuestionPaperList(requestPayload);
    }
  }, []);

  /**
   * !-REF-001
   * TODO : this api call is repeatedly happening so commented
   * ! please don't deletd this api
   *  @developer shivrajkhetri@navneettoptech.com
   * */

  // useEffect(() => {
  //     // const fetchQuestionPapers = async () => {
  //     //     if (searchApiFilters?.gradeId || searchApiFilters?.subjectId || searchApiFilters?.questionPaperTypeId || searchApiFilters?.minMarks || searchApiFilters?.maxMarks) {
  //     //         const requestPayload = {
  //     //             gradeIds: searchApiFilters?.gradeId || "",
  //     //             courseIds: searchApiFilters?.subjectId || "",
  //     //             searchKey: "",
  //     //             sortKey: "",
  //     //             sortKeyOrder: "",
  //     //             questionPaperTypeId: searchApiFilters?.questionPaperTypeId || "",
  //     //             questionPaperStatus: "",
  //     //             pageNo: 0,
  //     //             pageSize: 10,
  //     //             minMarks: "",
  //     //             maxMarks: "",
  //     //             academicYearIds: ""
  //     //         };

  //     //         if (searchApiFilters?.minMarks && searchApiFilters?.maxMarks) {
  //     //             Object.assign(requestPayload, { minMarks: searchApiFilters?.minMarks, maxMarks: searchApiFilters?.maxMarks })
  //     //         }
  //     //         try {
  //     //             setSpinnerStatus(true)
  //     //             const response = await getQuestionPaperList(requestPayload);
  //     //             setQuestions(response?.baseResponse?.data || []);
  //     //         } catch (error) {
  //     //             console.error('Error fetching question papers:', error);
  //     //         }
  //     //         setSpinnerStatus(false)
  //     //     } else {
  //     //         // Handle case when no filters are applied
  //     //         setQuestions(qPapersList);
  //     //     }
  //     // };

  //     if (qPapersList?.length !== 0) {
  //         // fetchQuestionPapers();

  //     }
  // }, [searchApiFilters, qPapersList, getQuestionPaperList]);

  useEffect(() => {
    const isOnlyGradeIdFilterActive =
      (!searchApiFilters?.gradeId || searchApiFilters?.gradeId) &&
      !searchApiFilters?.subjectId &&
      !searchApiFilters?.questionPaperTypeId &&
      !searchApiFilters?.minMarks &&
      !searchApiFilters?.maxMarks;

    const isSearchQueryEmpty = searchQuery === undefined || searchQuery === "";

    const areQuestionsEmpty = questions?.length === 0;

    if (isOnlyGradeIdFilterActive && isSearchQueryEmpty && areQuestionsEmpty) {
      setEmptyScreen(true);
    } else {
      setEmptyScreen(false);
    }
  }, [searchApiFilters, questions, searchQuery]);

  /**
   *  TODO Default Question Paper Selection
   */
  useEffect(() => {
    if (
      questions.length > 0 &&
      !selectedQuestion &&
      (!currentQuestionPaper || Object.keys(currentQuestionPaper).length === 0)
    ) {
      const defaultSelection = questions[0];
      setSelectedQuestion(defaultSelection);
      dispatch(updateCurrentQpDetails(defaultSelection)); // Dispatch action to update currentQuestionPaper details
      localStorage.setItem("currentQp", JSON.stringify(defaultSelection));
    } else if (
      currentQuestionPaper &&
      Object.keys(currentQuestionPaper).length > 0
    ) {
      if (currentQuestionPaper?.id) {
        const payload = qPapersList;
        const data = payload.filter(
          (item: any) => currentQuestionPaper?.id === item?.id
        );
        if (data[0]) {
          setSelectedQuestion(data[0]);
        } else {
          setSelectedQuestion(currentQuestionPaper); // Set selectedQuestion to currentQuestionPaper if it exists and is not empty
        }
      }
    }
  }, [
    questions,
    selectedQuestion,
    currentQuestionPaper,
    initialStudentList,
    qPapersList,
    dispatch,
  ]); // Add dependencies to ensure it runs when these change

  useEffect(() => {
    // Update questions when qPapersList changes
    if (qPapersList.length) {
      setQuestions([...qPapersList]); // Use spread operator to create a new array
    }
  }, [qPapersList]);

  useEffect(() => {
    if (qMenuEvaluationEvent === "View assessment report") {
      history("/assess/evaluation/teacherReport", {
        state: { id: selectedQuestion?.id },
      });
    }
  }, [qMenuEvaluationEvent, selectedQuestion?.id]);

  const handleStudentModal = () => {
    if (isMobileView) {
      setTableLoading(true)
      setStudentModalOpen(true);
    } else {
      setTableLoading(false)
      setStudentModalOpen(false);
    }
  };

  const closeStudentModal = () => {
    setStudentModalOpen(false);
    setTableLoading(false)
  };

  return (
    <React.Fragment>
      <div className="evaluation-container">
        {!isMobileView ? (
          <React.Fragment>
            {spinnerStatus && <Spinner />}
            {/* ********************** Filters ************************** */}
            <EvaluationPanal
              questionsCount={questionCount}
              setSearchApiFilter={setSearchApiFilter}
              questions={questions}
            />
            {/* ************************ Tables ***************************/}
          </React.Fragment>
        ) : (
          " "
        )}

        <div className="info-container">
          {emptyScreen && !spinnerStatus && (
            <EmptyScreen
              emptyBtnTxt={"Go To Question Papers"}
              title={"You haven’t created any question papers yet"}
              desc={"Press the button below to create a new question paper"}
              onClickBtn={() => history("/assess/questionpaper")}
              btnDisable={undefined}
              createButtonActionObj={undefined}
              style={{ width: "100%" }}
            />
          )}
          {!emptyScreen && (
            <React.Fragment>
              <div className="left-side">
                {/* Search Input */}
                <TextField
                  id="search-for-student"
                  name="SearchForStudent"
                  variant="outlined"
                  size="medium"
                  sx={{ width: "100%", pt: 2, pb: 1 }}
                  onChange={(event: any) => handleSearch(event.target.value)}
                  placeholder="Search For Question Papers..."
                  InputProps={{
                    startAdornment: (
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
                {/* Render Question Cards */}
                <div className="question-paper-section">
                  {questions?.length > 0 &&
                    questions
                      ?.filter((item: EvaluationQuestionListInterface1) =>
                        questionPaperStatus?.includes(
                          item?.statusName?.toLowerCase()
                        )
                      )
                      ?.map(
                        (
                          item: EvaluationQuestionListInterface1,
                          index: number
                        ) => (
                          <div
                            key={index}
                            onClick={() => handleCardClick(item)}
                            // className={`evaluation-card-wrapper ${selectedQuestion?.id === item?.id ? 'active-question-paper' : ''}`}
                          >
                            <EvaluationQuestionCards
                              payload={item}
                              handleQuestionMenuEvent={handleQuestionMenuEvent}
                              qustionPaperPreview={qustionPaperPreview}
                              selectedQuestion={selectedQuestion}
                              handleStudentModal={handleStudentModal}
                            />
                          </div>
                        )
                      )}
                  {questions?.length === 0 ? (
                    <React.Fragment>No match found!</React.Fragment>
                  ) : null}
                </div>
              </div>
              {!isMobileView ? (
                <div
                  className="right-side"
                  style={{
                    backgroundColor: studentList.length > 0 ? "" : "white",
                  }}
                >
                  {/* TODO future purpose */}
                  <EvaluationQuestionSets selectedQuestion={selectedQuestion} />
                  <EvaluationTableFilters
                    handleStudentNameSearch={handleStudentNameSearch}
                    studentList={initialStudentList}
                    handleSectionFilter={handleSectionFilter}
                    selectedQuestion={selectedQuestion}
                    bulkUploadMainBtn={bulkUploadMainBtn}
                  />
                  {/* Alert Message */}
                  <div className="bg-color-white">
                    <Alert
                      variant="outlined"
                      sx={alertStyle}
                      className="alert-div"
                      severity="warning"
                    >
                      You can only publish the grades of students once their
                      marks are added to the system.
                    </Alert>
                  </div>
                  {((selectedQuestion?.isSetsAllocated &&
                    selectedQuestion?.isSetsPresent) ||
                    (!selectedQuestion?.isSetsAllocated &&
                      !selectedQuestion?.isSetsPresent)) && (
                    <EvaluationTable
                      data={fetchFilteredStudent}
                      selectedQuestion={selectedQuestion}
                      setBulkUploadMainBtn={setBulkUploadMainBtn}
                      bulkUploadMainBtn={bulkUploadMainBtn}
                      page={page}
                      setPage={setPage}
                    />
                  )}
                  {selectedQuestion?.isSetsPresent &&
                    !selectedQuestion?.isSetsAllocated && (
                      <EmptyScreen
                        emptyBtnTxt={
                          "Assign question paper sets(s) to students"
                        }
                        title={
                          "Please assign all students to respective Set(s)"
                        }
                        desc={
                          "After assigning all the students to their respective sets you can bulk upload their marks"
                        }
                        onClickBtn={() => setStudentOfSet(!studentOfSet)}
                        btnDisable={undefined}
                        createButtonActionObj={undefined}
                      />
                    )}
                </div>
              ) : (
                ""
              )}
            </React.Fragment>
          )}
        </div>
        {/* ************************ POP UP ****************************/}
        {qMenuEvaluationEvent === "Add scores to gradebook" && (
          <React.Fragment>
            <QListEventModal
              title={qMenuEvaluationEvent}
              qMenuEvaluationEvent={qMenuEvaluationEvent}
              handleCloseEvent={handelClosePopUp}
              data={qMenuEvaluationEventPayload}
              width={800}
            />
          </React.Fragment>
        )}
        {studentOfSet && (
          <React.Fragment>
            <StudentSetListModal
              handleCloseModal={handleCloseModal}
              studentOfSet={studentOfSet}
              selectedQuestion={selectedQuestion}
              sectionFilter={sectionFilter}
            />
          </React.Fragment>
        )}

        <EvaluationListModal
          studentModalOpen={studentModalOpen}
          handleStudentModal={handleStudentModal}
          closeStudentModal={closeStudentModal}
          data={fetchFilteredStudent}
          selectedQuestion={selectedQuestion}
          setBulkUploadMainBtn={setBulkUploadMainBtn}
          bulkUploadMainBtn={bulkUploadMainBtn}
          page={page}
          setPage={setPage}
          handleStudentNameSearch={handleStudentNameSearch}
          tableLoading={tableLoading}
          setTableLoading={setTableLoading}
          studentList={initialStudentList}
          handleSectionFilter={handleSectionFilter}
        />
      </div>
      <div>
        {isMobileView && (
          <EvaluationWrapperFilter
            questionsCount={questionCount}
            setSearchApiFilter={setSearchApiFilter}
            questions={questions}
            setFilterCancel={undefined}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default EvaluationBeta;
