import React, { useState, useEffect } from "react";
import styles from "./AssessmentsContainer.module.css";
import QuestionBank from "./QuestionBank/QuestionBank";
import EmptyScreen from "../SharedComponents/EmptyScreen/EmptyScreen";
import {
  Chapter,
  Grade,
  Question,
  QuestionType,
  Subject,
  Theme,
  Topics,
} from "../../interface/filters";
import MultiSelectComponent from "../SharedComponents/MultiSelectComponent/MultiSelectComponent";
import {
  baseFilterApi,
  baseGradeApi,
  gridGetApi,
  selectFieldQueTypeApi,
  getThemesApi,
  getCourseId,
} from "../../Api/AssessmentTypes";
import { MultiSelectDropdown } from "../../constants";
import Spinner from "../../components/SharedComponents/Spinner";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  examTableCount,
  getLocalStorageDataBasedOnKey,
  htmlTagRegex,
  resetLocalStorage,
} from "../../constants/helper";
import { Pagination } from "@mui/material";
import { State } from "../../types/assessment";
import MultiSearchFilter from "../SharedComponents/MultiSelectComponent/MultiSearchFilter";
import PointFilter from "./pointerFilter";
import Toaster from "../SharedComponents/Toaster/Toaster";
import MultiSelectWithCheckbox from "../SharedComponents/MultiSelectComponent/MultiSelectWithCheckbox";

const AssessmentsContainer = () => {
  const [topics, setTopics] = useState<Topics[]>([]);
  const [subject, setSubject] = useState<Subject[]>([]);
  const [theme, setTheme] = useState<Theme[]>([]);
  const [questionTable, setQuestionTable] = useState<Question[]>([]);
  const [chapter, setChapter] = useState<Chapter[]>([]);
  const [allFilters, setAllFilters] = useState<any>({
    gradeId: "",
    chapterId: "",
    subjectId: "",
    themeId: "",
    topicId: "",
    text: "",
    questionTypeId: "0",
    isPublic: "false",
    sortOrder: "",
    minMarks: "",
    maxMarks: "",
  });
  const [grades, setGrades] = useState<Grade[]>([]);
  const [spinnerStatus, setSpinnerStatus] = useState(true);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [questionTypeData, setQuestionTypeData] = useState<any>([]);
  const [questionTypeOptions, setQuestionTypeOptions] = useState<any>([]);
  const [currentSort, setCurrentSort] = useState<any>("");
  const [minMaxCall, setMinMaxCall] = useState<boolean>(false);
  let history: any = useNavigate();
  const stateDetails = JSON.parse(
    getLocalStorageDataBasedOnKey("state") as string
  ) as State;
  const cloneObj = {
    gradeId: "",
    chapterId: "",
    subjectId: "",
    themeId: "",
    topicId: "",
    text: "",
    questionTypeId: "0",
    isPublic: "false",
    sortOrder: "",
    minMarks: "",
    maxMarks: "",
  } as any;

  const [courseData, setCourseData] = useState<Number[]>([]);
  const [questionListStatus, setQuestionListStatus] = useState(true);
  const [istoggle, setIsToggle] = useState(false);
  const [tableRes, setTableRes] = useState<any>({});
  const [searchParams] = useSearchParams();
  const { state, pathname } = useLocation();
  const [snackBar, setSnackBar] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");
  const [snackBarSeverity, setSnackBarSeverity] = useState("");
  /*Regulte the data for API call when filter Changes*/
  const updateUser = (data: any, filter: string) => {
    if (MultiSelectDropdown.includes(filter)) {
      switch (filter) {
        case "questionTypeId":
          const getValueByIndex = data.map((e: any) => {
            return e?.value;
          });
          setAllFilters((prev: any) => ({
            ...prev,
            questionTypeId: getValueByIndex ?? "",
          }));
          break;
        case "gradeId":
          let gradeFilter = "";
          if (data?.length === 0) {
            resetLocalStorage(
              ["gradeId", "subjectId", "themeId", "chapterId", "topicId"],
              "qbList_history"
            );
          }
          data?.forEach((ele: number) => {
            gradeFilter += `${ele},`;
          });
          setAllFilters((prev: any) => ({
            ...prev,
            gradeId: gradeFilter.slice(0, -1),
            subjectId: "",
            chapterId: "",
            topicId: "",
            themeId: "",
          }));
          break;
        case "subjectId":
          let subjectFilter = "";
          if (data?.length === 0) {
            resetLocalStorage(
              ["subjectId", "themeId", "chapterId", "topicId"],
              "qbList_history"
            );
          }
          data?.forEach((ele: number) => {
            subjectFilter += `${ele},`;
          });
          setAllFilters((prev: any) => ({
            ...prev,
            subjectId: subjectFilter.slice(0, -1),
            chapterId: "",
            topicId: "",
            themeId: "",
          }));
          break;
        case "chapterId":
          let chapterFilter = "";
          if (data?.length === 0) {
            resetLocalStorage(["chapterId", "topicId"], "qbList_history");
          }
          data?.forEach((ele: number) => {
            chapterFilter += `${ele},`;
          });
          setAllFilters((prev: any) => ({
            ...prev,
            chapterId: chapterFilter.slice(0, -1),
            topicId: "",
          }));
          break;
        case "themeId":
          let themeFilter = "";
          if (data?.length === 0) {
            resetLocalStorage(["themeId"], "qbList_history");
          }
          data?.forEach((ele: number) => {
            themeFilter += `${ele},`;
          });
          setAllFilters((prev: any) => ({
            ...prev,
            themeId: themeFilter.slice(0, -1),
          }));
          break;
        case "topicId":
          let topicFilter = "";
          if (data?.length === 0) {
            resetLocalStorage(["topicId"], "qbList_history");
          }
          data?.forEach((ele: number) => {
            topicFilter += `${ele},`;
          });
          setAllFilters((prev: any) => ({
            ...prev,
            topicId: topicFilter.slice(0, -1),
          }));
          break;
      }
    } else if (filter === "isPublic") {
      setAllFilters((prev: any) => ({ ...prev, isPublic: data }));
      resetLocalStorage(["isPublic"], "qbList_history", data);
    } else if (filter === "text") {
      setAllFilters((prev: any) => ({ ...prev, text: data }));
    } else if (filter === "marks") {
      setCurrentSort("marks");
      setAllFilters((prev: any) => ({ ...prev, sortOrder: data }));
    } else if (filter === "questions") {
      setCurrentSort("questions");
      setAllFilters((prev: any) => ({ ...prev, sortOrder: data }));
    }
  };

  const sortArrayOfObjects = (array: [], key: string) => {
    let sortedArray = array.sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return -1;
      } else if (a[key] > b[key]) {
        return 1;
      } else {
        return 0;
      }
    });
    return sortedArray.filter((fil: any) => fil[key]);
  };

  /*Grades API*/
  const gradesAPI = async () => {
    try {
      const response = await baseGradeApi(
        "staffActiveGrades",
        stateDetails.login.userData.userRefId
      );
      if (response?.status == 200) {
        setGrades(sortArrayOfObjects(response?.data, "grade"));
      }
    } catch (err) {
      console.log(err);
    }
  };

  /*get Theme APi call*/
  const getThemes = async (element: any) => {
    try {
      const response: any = await getThemesApi({ subjectId: element });

      if (response?.status == 200) {
        setTheme(response?.data);
      }
      return response?.data;
    } catch (err) {
      console.log(err);
    }
  };

  const minMaxApiHandler = () => {
    if (minMaxCall) {
      if (
        +allFilters?.minMarks > 0 &&
        +allFilters?.maxMarks > 0 &&
        (+allFilters?.maxMarks > +allFilters?.minMarks ||
          +allFilters?.maxMarks == +allFilters?.minMarks)
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  /*Getting Questions API When filters Applied*/
  const getAllQuestionswithFilter = async (modifiedobj: any) => {
    const markHandler = minMaxApiHandler();
    try {
      if (JSON.stringify(modifiedobj) !== "{}" && !markHandler) {
        if (!localStorage.hasOwnProperty("qbList_history"))
          setSpinnerStatus(true);
        let filters = "";
        let pgSize = (pageNumber * examTableCount) as number;
        Object.entries(modifiedobj).forEach(([key, value]: any) => {
          if (
            (value && value !== "0") ||
            key === "maxMarks" ||
            key === "minMarks"
          ) {
            if (key === "sortOrder") {
              filters += `sortKey=${
                currentSort === "marks" ? "marks" : "questions"
              }&${key}=${value}&`;
            } else if (
              (key === "maxMarks" || key === "minMarks") &&
              +allFilters?.minMarks > 0 &&
              +allFilters?.maxMarks > 0 &&
              (+allFilters?.maxMarks > +allFilters?.minMarks ||
                +allFilters?.maxMarks == +allFilters?.minMarks)
            ) {
              filters += `${key}=${value}&`;
            } else if (key !== "maxMarks" && key !== "minMarks") {
              filters += `${
                key !== "isPublic" && key !== "text" ? key + "s" : key
              }=${value}&`;
            }
          }
        });
        const response = await gridGetApi(
          filters.slice(0, -1),
          pgSize,
          pageNumber - 1
        );
        if (response) {
          setTableRes(response);
          if (response?.privateQuestionsCount == 0) {
            setIsToggle(true);
          } else {
            setIsToggle(false);
          }
          setQuestionTable(
            response?.baseResponse?.data?.length > 0
              ? response?.baseResponse?.data
              : []
          );
          setQuestionListStatus(false);
        }
        if (!localStorage.hasOwnProperty("qbList_history"))
          setSpinnerStatus(false);
        setIsLastPage(response?.totalPages === 1 ? true : false);
        if (!isNaN(response?.totalPages)) setPageCount(response?.totalPages);
      }
    } catch (err) {
      console.log(err);
      if (!localStorage.hasOwnProperty("qbList_history"))
        setSpinnerStatus(false);
    }
  };

  const QuestionTypeApi = async (param: string) => {
    try {
      const response = await selectFieldQueTypeApi(`&subjectIds=${param}`);
      if (
        response &&
        response?.baseResponse &&
        response?.baseResponse?.data?.length
      ) {
        setQuestionTypeData(response?.baseResponse?.data);
      } else {
        setQuestionTypeData([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (questionTypeData.length > 0) createQuestionTypeOptionsArray();
    else setQuestionTypeOptions([]);
  }, [questionTypeData]);

  const createQuestionTypeOptionsArray = () => {
    let tempArr = [];
    for (let i of questionTypeData) {
      let option: any = {};
      option.value = i.id;
      option.label =
        i.title.replace(htmlTagRegex, "") + " (" + i.courseName + ")";
      option.disabled = false;
      tempArr.push(option);
    }
    setQuestionTypeOptions(tempArr);
  };

  /*Filter the List to configure Data for SelectBoxComponent*/
  const filtered = (list: any, element: string) => {
    if (element) {
      return list?.length ? list.map((ele: any) => ele[element]) : [];
    } else {
      return list?.length ? list.map((ele: any) => ele.name) : [];
    }
  };

  /*To add AllTypes Options for the MultiSelectDropDown*/
  const filteredQuestionType = (list: any) => {
    const tempArray = list?.length ? list?.map((ele: any) => ele?.title) : [];
    if (tempArray?.length > 0) tempArray.unshift("All types");
    return tempArray;
  };

  const convertStringToArray = (element: string) => {
    if (element.length) {
      const array = element.split(",").map((ele: string) => Number(ele));
      if (array.includes(0)) {
        return [];
      } else {
        return array;
      }
    } else {
      return [];
    }
  };
  const selectGrade = async (element: number[]) => {
    if (element) {
      const response = await baseFilterApi("subjects", {
        gradeId: element,
        publicationId: 0,
        staffId: stateDetails.login.userData.userRefId,
      });
      if (response?.status == 200) {
        setSubject(sortArrayOfObjects(response?.data, "courseDisplayName"));
        setChapter([]);
        setTopics([]);
      }
      return response?.data;
    }
  };

  const selectSubject = async (element: number[], grade?: number[]) => {
    if (element) {
      const response = await baseFilterApi("chapters", {
        gradeId: grade ? grade : convertStringToArray(allFilters.gradeId),
        courseId: element,
        staffId: stateDetails.login.userData.userRefId,
      });
      if (response?.status == 200) {
        setChapter(response.data);
        setTopics([]);
      }
      const themeRes = await getThemes(element);
      return { chap: response?.data, theme: themeRes };
    }
  };

  const selectChapter = async (
    element: number[],
    grade?: number[],
    subj?: number
  ) => {
    if (element) {
      const response = await baseFilterApi("topics", {
        gradeId: grade ? grade : convertStringToArray(allFilters.gradeId),
        courseId: subj
          ? subj
          : ConvertIdGroups(subject, "courseId")
          ? ConvertIdGroups(subject, "courseId")
          : convertStringToArray(allFilters.subjectId),
        chapterId: element,
        staffId: 1,
      });
      if (response?.status == 200) {
        setTopics(response.data);
      }
      return response?.data;
    }
  };

  const ConvertIdGroups = (value: any, keys: string) => {
    return value?.map((ele: any) => ele[keys]);
  };

  /*API calls When the Component Renders*/
  const getAllInitialData = () => {
    if (!localStorage.hasOwnProperty("qbList_history")) setSpinnerStatus(true);
    gradesAPI();
  };

  const courseDataFn = async () => {
    try {
      const response = await getCourseId(
        Number(stateDetails.login.userData.userRefId)
      );
      if (
        response &&
        Object.keys(response)?.length > 0 &&
        response?.data?.length > 0
      ) {
        setCourseData(response?.data?.map((sub: any) => sub?.courseId));
      } else {
        setCourseData([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllInitialData();
    courseDataFn();
  }, []);

  useEffect(() => {
    if (courseData?.length > 0) QuestionTypeApi(courseData?.toString());
    else setQuestionTypeData([]);
  }, [courseData]);

  const handleAllFilterState = async () => {
    let tempfilter = { ...allFilters };
    getAllQuestionswithFilter(tempfilter);
  };

  const callAllAPi = async () => {
    setAllFilters({
      ...allFilters,
      gradeId: "",
      subjectId: "",
      chapterId: "",
      themeId: "",
      topicId: "",
    });
  };

  useEffect(() => {
    callAllAPi();
  }, []);

  useEffect(() => {
    if (istoggle) {
      setAllFilters({ ...allFilters, isPublic: "true" });
    } else {
      setAllFilters({ ...allFilters, isPublic: "false" });
    }
  }, [istoggle]);

  const disableFilter = (type: string) => {
    switch (type) {
      case "grade":
        if (
          JSON.stringify(cloneObj) === JSON.stringify(allFilters) &&
          tableRes?.privateQuestionsCount == 0 &&
          tableRes?.publicQuestionsCount == 0
        ) {
          return true;
        } else {
          return false;
        }
      case "subject":
        if (
          (JSON.stringify(cloneObj) === JSON.stringify(allFilters) &&
            tableRes?.privateQuestionsCount == 0 &&
            tableRes?.publicQuestionsCount == 0) ||
          !allFilters?.gradeId
        ) {
          return true;
        } else {
          return false;
        }
      case "theme":
        if (
          (JSON.stringify(cloneObj) === JSON.stringify(allFilters) &&
            tableRes?.privateQuestionsCount == 0 &&
            tableRes?.publicQuestionsCount == 0) ||
          !allFilters?.gradeId ||
          !allFilters?.subjectId ||
          !theme?.length
        ) {
          return true;
        } else {
          return false;
        }
      case "chapter":
        if (
          (JSON.stringify(cloneObj) === JSON.stringify(allFilters) &&
            tableRes?.privateQuestionsCount == 0 &&
            tableRes?.publicQuestionsCount == 0) ||
          !allFilters?.gradeId ||
          !allFilters?.subjectId ||
          !chapter?.length
        ) {
          return true;
        } else {
          return false;
        }
      case "topic":
        if (
          (JSON.stringify(cloneObj) === JSON.stringify(allFilters) &&
            tableRes?.privateQuestionsCount == 0 &&
            tableRes?.publicQuestionsCount == 0) ||
          !allFilters?.gradeId ||
          !allFilters?.subjectId ||
          !allFilters?.chapterId ||
          !topics?.length
        ) {
          return true;
        } else {
          return false;
        }
      case "questionType":
        if (
          JSON.stringify(cloneObj) === JSON.stringify(allFilters) &&
          tableRes?.privateQuestionsCount == 0 &&
          tableRes?.publicQuestionsCount == 0
        ) {
          return true;
        } else {
          return false;
        }
      case "minMax":
        if (
          JSON.stringify(cloneObj) === JSON.stringify(allFilters) &&
          tableRes?.privateQuestionsCount == 0 &&
          tableRes?.publicQuestionsCount == 0
        ) {
          return true;
        } else {
          return false;
        }
    }
  };

  const [timeoutId, setTimeoutId] = React.useState(null);
  let newTimeoutId: any;
  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    newTimeoutId = setTimeout(() => {
      handleAllFilterState();
    }, 500);
    setTimeoutId(newTimeoutId);
  }, [allFilters, allFilters?.text, pageNumber]);

  useEffect(() => {
    setPageNumber(1);
  }, [allFilters]);

  const getQueryPoints = (param: string, type: string) => {
    setMinMaxCall(true);
    if (type == "min") {
      setAllFilters({ ...allFilters, minMarks: param });
    }
    if (type == "max") {
      setAllFilters({ ...allFilters, maxMarks: param });
    }
    if (type == "empty") {
      setAllFilters({ ...allFilters, maxMarks: "", minMarks: "" });
      if (allFilters?.minMarks == "" && allFilters?.maxMarks == "") {
        handleAllFilterState();
        setMinMaxCall(false);
      }
    }
  };

  useEffect(() => {
    if (allFilters?.minMarks && allFilters?.maxMarks) {
      handleAllFilterState();
    }
    if (allFilters?.minMarks == "" && allFilters?.maxMarks == "") {
      handleAllFilterState();
      setMinMaxCall(false);
    }
  }, [allFilters?.minMarks, allFilters?.maxMarks]);

  useEffect(() => {
    if (state?.severity) {
      setSnackBar(true);
      setSnackBarText(state?.text);
      setSnackBarSeverity(state?.severity);
    }
  }, [state]);

  const qbListHistoryHandler = () => {
    const StorageObj = JSON.stringify({ ...allFilters, pgNo: pageNumber });
    localStorage.setItem("qbList_history", StorageObj);
  };

  const [marksPreSet, setMarksPreSet] = React.useState<any | null>(null);
  useEffect(() => {
    if (localStorage.hasOwnProperty("qbList_history")) {
      const { minMarks = "", maxMarks = "" } = JSON.parse(
        localStorage.getItem("qbList_history") || "{}"
      );
      if (
        allFilters?.minMarks !== minMarks ||
        allFilters?.maxMarks !== maxMarks
      ) {
        setAllFilters((prev: any) => ({
          ...prev,
          minMarks: minMarks,
          maxMarks: maxMarks,
        }));
        if (minMarks != "" || maxMarks !== "") {
          setMarksPreSet({
            min: minMarks,
            max: maxMarks,
          });
        }
      }
    }
  }, []);

  setTimeout(() => {
    setSpinnerStatus(false);
    localStorage.removeItem("qbList_history");
  }, 1500);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center questionBankFilterSect mt-3">
        <div
          className={`${styles.selectTransBtnSect} questionBankFilterSectLeft`}
        >
          <MultiSearchFilter
            lsName={"gradeId"}
            options={grades}
            values={allFilters?.gradeId}
            onChange={(e: any) => {
              updateUser(e, "gradeId");
              selectGrade(e);
            }}
            disable={disableFilter("grade")}
            addableFiled="All Grades"
            showableField="grade"
            selectableField="es_gradeid"
          />
          <MultiSearchFilter
            lsName={"subjectId"}
            options={subject}
            values={allFilters?.subjectId}
            onChange={(e: any) => {
              updateUser(e, "subjectId");
              selectSubject(e);
            }}
            disable={disableFilter("subject")}
            addableFiled="All Subjects"
            showableField="courseDisplayName"
            selectableField="courseId"
          />
          <span className="fontW600 selectGreyText me-2">for&nbsp;</span>
          <MultiSearchFilter
            lsName={"themeId"}
            options={theme}
            values={allFilters?.themeId}
            onChange={(e: any) => {
              updateUser(e, "themeId");
            }}
            disable={disableFilter("theme")}
            addableFiled="All Themes"
            showableField="syllabusName"
            selectableField="syllabusID"
          />
          <MultiSearchFilter
            lsName={"chapterId"}
            options={chapter}
            values={allFilters?.chapterId}
            onChange={(e: any) => {
              updateUser(e, "chapterId");
              selectChapter(e);
            }}
            disable={disableFilter("chapter")}
            addableFiled="All Chapters"
            showableField="chapterName"
            selectableField="chapterId"
          />
          <MultiSearchFilter
            lsName={"topicId"}
            options={topics}
            values={allFilters?.topicId}
            onChange={(e: any) => {
              updateUser(e, "topicId");
            }}
            disable={disableFilter("topic")}
            addableFiled="All Topics"
            showableField="topicName"
            selectableField="topicId"
          />
        </div>
        <div className="d-flex gap-2 questionBankFilterSectRight">
          <MultiSelectWithCheckbox
            items={questionTypeOptions}
            limitTags={1}
            label="Select Question Type"
            selectAllLabel="All Types"
            onChange={(e: any) => updateUser(e, "questionTypeId")}
            disable={disableFilter("questionType") as boolean}
            multiType={"Multi1"}
            lsName={"questionTypeId"}
            noOptionsText={"No match found"}
          />

          {/*<MultiSelectComponent lsName={"questionTypeId"} questionTypeData={questionTypeData} options={filteredQuestionType(questionTypeData)} onChange={(e: any) => updateUser(e, "questionTypeId")} disable={disableFilter('questionType') as boolean} multiType={"Multi1"} /> */}
          <PointFilter
            preSetVal={marksPreSet}
            getQueryPoints={(param: string, type: string) => {
              getQueryPoints(param, type);
            }}
            disable={disableFilter("minMax") as boolean}
          />
        </div>
      </div>

      <div className={styles.questionBankContSect}>
        <div className={styles.questionBankCont}>
          {!questionListStatus && (
            <>
              {tableRes?.privateQuestionsCount == 0 &&
              tableRes?.publicQuestionsCount == 0 ? (
                <EmptyScreen
                  emptyBtnTxt={"Create New Question"}
                  title={"You haven’t created any questions yet"}
                  desc={"Press the button below to create a new question"}
                  onClickBtn={() => {
                    history("/assess/createnewquestion");
                  }}
                />
              ) : (
                <QuestionBank
                  qbListHistoryHandler={qbListHistoryHandler}
                  questionData={questionTable}
                  accessFilter={(e: string | string, type: string) =>
                    updateUser(e, type)
                  }
                  getAllQuestionswithFilter={handleAllFilterState}
                  setPageNumber={setPageNumber}
                  pageCount={pageCount}
                  pageNumber={pageNumber}
                  toggle={istoggle}
                  allFilters={allFilters}
                />
              )}
            </>
          )}
        </div>
        {pageCount > 0 && (
          <Pagination
            className="assessPagenation"
            style={{ padding: "15px 5px" }}
            count={pageCount}
            shape="rounded"
            page={pageNumber}
            onChange={(e, p: number) => {
              setPageNumber(p);
            }}
          />
        )}
      </div>
      <Toaster
        onClose={() => {
          setSnackBar(false);
        }}
        severity={snackBarSeverity}
        text={snackBarText}
        snakeBar={snackBar}
      />
      {spinnerStatus && <Spinner />}
    </>
  );
};

export default AssessmentsContainer;
