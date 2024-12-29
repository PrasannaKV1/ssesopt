import './style/onlineAssesment.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, TextField } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';

// Spinner 
import Spinner from '../SharedComponents/Spinner';
import { RootStore } from '../../redux/store';
import SelectBoxComponent from '../SharedComponents/SelectBoxComponent/SelectBoxComponent';
import OnlineAssesmentTabMenu from './components/OnlineAssesmentTabMenu';
import OnlineAssesmentQuestionPaperfilter from './components/OnlineAssesmentQuestionPaperfilter';
import OnlineQpCards from './components/OnlineQpCards';
import { chapterChallengeQP, getChapterDetails, getGreadsDetails, getQuestionPaperList, getStudentList, getSubjectDetails } from '../../Api/OnlineAssements';
import { getLocalStorageDataBasedOnKey } from '../../constants/helper';
import { State } from '../../types/assessment';
import { Loader, onlineAssementQpChapterEventActions, onlineAssementQpGradeEventActions, onlineAssementQpList, onlineAssementQpPaperTypeEventActions, onlineAssementQpSubjectEventActions, onlineCurrentQPaperStudentEventActions, onlineQPaperStudentEventActions, onlineUpdateCurrentQpDetails } from '../../redux/actions/onlineAssement';
import { QuestionPaperInterface, StudentList } from './interface/online-assesment-interface';
import EmptyScreen from '../SharedComponents/EmptyScreen/EmptyScreen';
import OnlineStudentListTable from './components/OnlineStudentListTable';
import OnlineStudentListTablefilter from './components/OnlineStudentListTablefilter';
import { GetQuestionPaperAcademicId } from '../../Api/QuestionTypePaper';
import { qListMenuEventActions } from '../../redux/actions/assesmentQListEvent';
import moment from 'moment';
import OnlineColorToggleButton from './components/OnlineColorToggleButton';

type Props = {
    isFromTeacherWeb?: boolean;
}
const OnlineAssesment: React.FC<Props> = ({ isFromTeacherWeb }) => {
    const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;
    const routeState: any = useLocation();
    const startAcadamicDate = new Date(stateDetails?.currentAcademic?.startDate)
    const endAcadamicDate = new Date(stateDetails?.currentAcademic?.endDate)
    const dispatch = useDispatch();
    const history = useNavigate();
    const lmsAssessData: any = isFromTeacherWeb && JSON.parse(localStorage.getItem("topAssessData") as string);
    const isLoading = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.isLoading);
    const allGreads = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.qGrade);
    const allQpList = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.qpListOnlineAssesment);
    const allChaptersDetails = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.qpChapters);
    const allStubjects = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.qSubjects);
    const currentQuestionPaper = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.currentQp);
    const onlineQpStudentListing = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.onlineQPaperStudent);
    const currentQpStudentList = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.currentQpStudentList);
    const sectionFilter = useSelector((state: RootStore) => state?.onlineSearchFilterEvents?.sectionFilter);
    const allSearchFIlter = useSelector((state: RootStore) => state?.onlineSearchFilterEvents?.searchFilter);
    const qMenuEvaluationEvent = useSelector((state: RootStore) => state?.qMenuEvent?.option);
    const chapterNotifyDate = JSON.parse(localStorage.getItem("chapterNotificationData") as string);

    const [qpList, setQpList] = useState<QuestionPaperInterface[]>(allQpList);
    const [initialStudentList, setInitialStudentList] = useState<StudentList[] | any>([]);
    const [searchfilter, setSearchFilter] = useState<any>(allSearchFIlter);
    const [searchTimeout, setSearchTimeout] = useState<number | null | any>(null);
    const [searchStudentQuery, setSearchStudentQuery] = useState<string>();
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionPaperInterface | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState<string>();
    const [emptyScreen, setEmptyScreen] = useState<boolean>(false);
    const [gradesLoaded, setGradesLoaded] = useState<boolean>(false);
    const [subjectsLoaded, setSubjectsLoaded] = useState<boolean>(false);
    const [createOnlineTestBtn, setCreateOnlineTestBtn] = useState<boolean>(false);
    const [createChapterTestBtn, setCreateChapterTestBtn] = useState<boolean>(false);
    const [questionCount, setQuestionsCount] = useState<number | undefined>();
    const [academicYearDataSelected, setAcademicYearDataSelected] = useState("");
    const [academicDateRange, setAcademicDateRange] = useState([{
        startDate: startAcadamicDate,
        endDate: endAcadamicDate
    }])
    const [academicYearDataInfo, setAcademicYearDataInfo] = useState([]);
    const [academicYearData, setAcademicYearData] = useState<any>({});
    const [selectedTabVal,setSelectedTabVal] = useState("Online Tests")
    const [selectedOption, setSelectedOption] = useState<null | string>(null);
    const [currentAcadmicYearId, setCurrentAcadmicYearId] = useState<any>();
    const [chapterNotCompleted, setChapterNotCompleted] = useState<boolean>(false)
    const [chapterNotAssigned, setChapterNotAssigned] = useState<boolean>(false)
    const [chapterGradeId, setChaptergradeId] = useState<number>();
    const [chapterSearchFilter, setChapterSearchFilter] = useState<any>({
        gradeId: "",
        subjectId: "",
        chapterId: "",
        classId: "",
        startDate: "",
        endDate: "",
        sectionId: isFromTeacherWeb ? lmsAssessData.sectionId : '',
    });
    const [spinnerStatus, setSpinnerStatus] = useState(false);

    useEffect(() => {
        if (routeState?.state?.selectedTab) {
            setSelectedOption(routeState?.state?.selectedTab);
            history(routeState.pathname, {});
        } else if (chapterNotifyDate?.notificationDate) {
            setSelectedOption("1");
        } else {
            setSelectedOption('0');
            localStorage.removeItem('filters');
        }
    }, [])

    /**
     *  TODO : please Add all the controller's function below this stament
     */
    const handleSearch = (value: any) => {
        clearTimeout(searchTimeout); // Clear the previous timeout
        const timeout = setTimeout(() => {
            setSearchQuery(value); // Update search query after the delay
        }, 300); // 300 milliseconds delay
        setSearchTimeout(timeout); // Save the new timeout
    };

    const handleCardClick = (item: any) => {
        setSelectedQuestion(item);
        dispatch(onlineUpdateCurrentQpDetails(item));
        localStorage.setItem('onlineCurrentQp', JSON.stringify(item));
    };

    const handleOptionChange = (newValue: string, tabStringValue: any) => {
        if (selectedOption !== newValue) {
        setQpList([])
        setSelectedQuestion(undefined);
        dispatch(onlineAssementQpList([]));
        dispatch(onlineUpdateCurrentQpDetails({}));
        dispatch(onlineCurrentQPaperStudentEventActions([]));
        setInitialStudentList([]);
        localStorage.removeItem('onlineCurrentQp')
        localStorage.removeItem('filters')
        setSelectedOption(newValue);
        setSelectedTabVal(tabStringValue)
        // Additional logic based on selected option
        }
    };
    const filterQuestions = async () => {
        dispatch(Loader(true));
        let filteredQuestions: QuestionPaperInterface[] = await allQpList; // Start with all questions
        // Apply search query filter
        if (selectedOption == "0") {
            if ((searchfilter?.gradeId || searchfilter?.subjectId) && allQpList?.length) {
                if (searchfilter?.gradeId) {
                    const gradeIds = searchfilter.gradeId.split(',');
                    filteredQuestions = filteredQuestions?.filter((item: any) => gradeIds.includes(`${item?.gradeID}`));
                }

                // TODO : courseId is not exist in The list || once added in api call we Are taking forword

                if (searchfilter?.subjectId) {
                    const courseIds = searchfilter?.subjectId.split(',');
                    filteredQuestions = filteredQuestions?.filter((item: any) => {
                        return item.questionPaperCourseDetails?.some((course: any) => courseIds.includes(`${course.courseID}`));
                    });
                }

                if (searchfilter?.chapterId) {
                    const questionPaperChapterIds = searchfilter.chapterId.split(',');
                    filteredQuestions = filteredQuestions?.filter((item: any) => {
                        return item.questionPaperChapterDetails?.some((course: any) => questionPaperChapterIds.includes(`${course.chapterID}`));
                    });
                }
                setQpList(filteredQuestions);
            } else {
                setQuestionsCount(filteredQuestions?.length);
            }
            if (searchfilter?.endDate && searchfilter.startDate) {
                const startFilterDate = moment(searchfilter.startDate, 'YYYY-MM-DD');
                const endFilterDate = moment(searchfilter.endDate, 'YYYY-MM-DD');
                filteredQuestions = filteredQuestions?.filter((question: any) => {
                    // Convert the question's start and end dates to Date objects
                    const questionStartDate = moment(question.startDate, 'YYYY-MM-DD');
                    const questionEndDate = moment(question.endDate, 'YYYY-MM-DD');

                    // Check if the question's date range falls within the filter range
                    // Check if the question's date range falls within the filter range
                    return (
                        questionStartDate.isSameOrAfter(startFilterDate) &&
                        questionEndDate.isSameOrBefore(endFilterDate)
                    )
                });

                // Set the filtered questions list
                setQpList(filteredQuestions);
                setTimeout(() => {
                    localStorage.removeItem("assessNotificationData");
                }, 4000);  
            }

            if (searchQuery) {
                filteredQuestions = filteredQuestions?.filter((question: any) => {
                    if (question.name && question.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                        return question;
                    }
                });
                setQpList(filteredQuestions);
            }

            if (searchQuery === "" || !searchQuery) {
                setQpList(filteredQuestions);
            }
        }

        if (selectedOption == "1" || chapterNotifyDate?.notificationDate) {
            if (chapterSearchFilter?.chapterId) {
                const questionPaperChapterIds = chapterSearchFilter.chapterId.split(',').map((id: any) => id.trim());
                filteredQuestions = filteredQuestions?.filter((item: any) =>
                    questionPaperChapterIds.includes(String(item.chapterId))
                );

                setQpList(filteredQuestions)
            }
            if (chapterSearchFilter?.startDate && chapterSearchFilter?.endDate) {
                const startFilterDate = moment(chapterSearchFilter.startDate, 'YYYY-MM-DD').startOf('day');
                const endFilterDate = moment(chapterSearchFilter.endDate, 'YYYY-MM-DD').endOf('day'); 

                filteredQuestions = filteredQuestions?.filter((question: any) => {
                    const questionAssignedDate = moment(question?.assignedDate, 'YYYY-MM-DD');
                    return (
                        questionAssignedDate.isSameOrAfter(startFilterDate) &&
                        questionAssignedDate.isSameOrBefore(endFilterDate)
                    );
                });

                // Set the filtered questions list
                setQpList(filteredQuestions);
                setTimeout(() => {
                    localStorage.removeItem("chapterNotificationData");
                }, 3000);  
            }

            if (searchQuery) {
                filteredQuestions = filteredQuestions?.filter((question: any) => {
                    if (question.chapterName && question.chapterName.toLowerCase().includes(searchQuery.toLowerCase())) {
                        return question;
                    }
                });
                setQpList(filteredQuestions);
            }
            if (searchQuery === "" || !searchQuery) {
                setQpList(filteredQuestions);
            }
        }
        dispatch(Loader(false));
    };

    const fetchFilteredStudent: StudentList[] = useMemo(() => {
        let result = [...currentQpStudentList]; // Initialize as an empty array of StudentList

        if (sectionFilter?.section != 0) {
            result = result?.filter((student: any) => {
                return (
                    (sectionFilter.section ? (student.sectionId.toString() === sectionFilter.section) : true) &&
                    (!searchStudentQuery ? true : (
                        student?.studentName?.toLowerCase().includes(searchStudentQuery.toLowerCase()) ||
                        student?.rollNo?.toString().startsWith(searchStudentQuery.toLowerCase())
                    ))
                );
            });
        }
        if (searchStudentQuery) {
            const query = searchStudentQuery.toLowerCase();
            result = result.filter((student) => (
                student?.studentName?.toLowerCase().includes(query) ||
                student?.rollNo?.toString().startsWith(query)
            ));
        }
        return result;
    }, [searchStudentQuery, sectionFilter, initialStudentList]);

    const handleStudentNameSearch = useCallback((value: any) => {
        clearTimeout(searchTimeout); // Clear the previous timeout
        const timeout = setTimeout(() => {
            setSearchStudentQuery(value); // Update search query after the delay
        }, 300); // 300 milliseconds delay
        setSearchTimeout(timeout); // Save the new timeout
    }, [searchStudentQuery]);

    const fetchQuetionPaperList = async (newAcadamicId?: any) => {

        // TODO : intitial current acadmic year
        const academicYearIds = newAcadamicId ? academicYearData[newAcadamicId]?.acadamicId : academicYearData[academicYearDataSelected]?.acadamicId;

        try {
            const apiPayload = {
                searchKey: "",
                sortKey: "",
                sortKeyOrder: "",
                questionPaperTypeId: "",
                questionPaperStatus: "",
                gradeIds: "",
                courseIds: "",
                pageNo: 0,
                pageSize: 200, //chaged Online Max QP size to 200 as discussed with Shamik Sir
                chapterIds: "",
                maxMarks: "",
                academicYearIds: academicYearIds,
                startDate: "",
                endDate: "",
                examModeId: 1, // Online Question paper pass the value as 1 
            }
            dispatch(Loader(true));
            setCurrentAcadmicYearId(academicYearIds);
            const response = await getQuestionPaperList(apiPayload);
            if (response?.data && response?.result?.responseDescription === "Success") {
                let QuestionPapersList = response?.data;

                if (lmsAssessData && QuestionPapersList.length) {
                    if (lmsAssessData?.gradeId) {
                        const gradeIdArray = Array.isArray(lmsAssessData?.gradeId)
                            ? lmsAssessData?.gradeId?.map(String)
                            : [String(lmsAssessData?.gradeId)];

                        QuestionPapersList = QuestionPapersList?.filter((item: any) =>
                            gradeIdArray.includes(`${item?.gradeID}`));
                    }

                    if (lmsAssessData?.courseId) {
                        const courseIdArray = Array.isArray(lmsAssessData?.courseId)
                            ? lmsAssessData?.courseId?.map(String) // If it's already an array, convert all items to strings
                            : [String(lmsAssessData?.courseId)];
                        QuestionPapersList = QuestionPapersList?.filter((item: any) => {
                            return item.questionPaperCourseDetails?.some((course: any) => courseIdArray?.includes(`${course.courseID}`));
                        });
                    }

                    if (lmsAssessData?.sectionId) {
                        const filterSectionId = Number(lmsAssessData?.sectionId); // Convert to number for comparison
                        QuestionPapersList = QuestionPapersList?.filter((item: any) => {
                            const sections = item.questionPaperSectionDetails || [];
                            const hasMatchingSection = sections.some((section: any) => section.sectionID === filterSectionId);
                            return hasMatchingSection;
                        });
                    }
                }

                dispatch(onlineAssementQpList(QuestionPapersList));
                setQuestionsCount(QuestionPapersList?.length);
                if (academicYearData[newAcadamicId]?.academicStatusId < 0) {
                    setCreateOnlineTestBtn(true);
                } else {
                    setCreateOnlineTestBtn(false);
                }
            }
            if (!response?.data && response?.result?.responseDescription === "Success" && lmsAssessData) {
                setEmptyScreen(true)
            }

            if (!response?.data && response?.result?.responseDescription === "Success") {
                dispatch(onlineAssementQpList([]));
                setQuestionsCount(0);
                if (academicYearData[newAcadamicId]?.academicStatusId < 0) {
                    setCreateOnlineTestBtn(true)
                } else {
                    setCreateOnlineTestBtn(false)
                }
            }
        } catch (error) {
            console.error("Error while fetching the queation peaper listing api");
        }
        dispatch(Loader(false));
    }

    const fetchChapterChallengeQp = async (newAcadamicId?: any) => {
        const academicYearIds = newAcadamicId ? academicYearData[newAcadamicId]?.acadamicId : academicYearData[academicYearDataSelected]?.acadamicId;
        try {
            // TODO - need to  change from static to dynamic
            const payload = {
                "curriculumId": null,
                "courseId": lmsAssessData ? lmsAssessData?.courseId : chapterSearchFilter?.subjectId,
                "gradeId": lmsAssessData ? lmsAssessData?.gradeId : chapterSearchFilter?.gradeId,
                "departmentId": null,
                "userId": stateDetails.login.userData.userRefId,
                "classId": lmsAssessData ? lmsAssessData?.classId : chapterSearchFilter?.classId,
                "statusId": 15,
                "academicId": stateDetails?.currentAcademic?.acadamicId
            }
            setSpinnerStatus(true)
            const response = await chapterChallengeQP(payload)
            setQpList(response?.data?.result)
            setSelectedQuestion(response?.data?.result[0])
            dispatch(onlineAssementQpList(response?.data?.result));
            if (academicYearData[newAcadamicId]?.academicStatusId < 0) {
                setCreateChapterTestBtn(true);
            } else {
                setCreateChapterTestBtn(false);
            }

            if (response?.data?.result.length === 0 && response?.status === "200") {
                dispatch(onlineAssementQpList([]));
                setEmptyScreen(true)
                setQuestionsCount(0);
                if (academicYearData[newAcadamicId]?.academicStatusId < 0) {
                    setCreateChapterTestBtn(true)
                } else {
                    setCreateChapterTestBtn(false)
                }
            }
        } catch (error) {
            console.error(error);
        }
        setSpinnerStatus(false)
    }

    useEffect(() => {
        if (selectedOption == "1" && chapterSearchFilter?.classId !== "" && chapterSearchFilter?.subjectId !== "") {
            fetchChapterChallengeQp();
            setSearchQuery('')
            setSearchStudentQuery('')
        }
    }, [chapterSearchFilter?.classId, chapterSearchFilter?.subjectId, selectedOption]);

    const fetchGreadDetails = async () => {
        try {
            const response = await getGreadsDetails(stateDetails.login.userData.userRefId);
            if (response?.status === '200') {
                dispatch(onlineAssementQpGradeEventActions(response?.data));
                setGradesLoaded(true); // Set grades loaded to true
            }
        } catch (error) {
            console.error("Error while calling the fetchGreadDetails api");
        }
    }

    const fetchSubjectDetails = async () => {
        const gradeId = allGreads?.map((item: any) => item?.es_gradeid);
        try {
            const apiPayload = {
                gradeId,
                "publicationId": 0,
                "staffId": stateDetails?.login?.userData?.userRefId
            }
            const response = await getSubjectDetails(apiPayload);
            if (response?.status === '200') {
                dispatch(onlineAssementQpSubjectEventActions(response?.data));
                setSubjectsLoaded(true); // Set subjects loaded to true
            }
        } catch (error) {
            console.error("Error while calling the fetchSubjectDetails api");
        }
    }

    const fetchChapterDetails = async () => {
        const gradeId = allGreads?.map((item: any) => item?.es_gradeid);
        const courseId = allStubjects?.map((item: any) => item?.courseId);
        try {
            const apiPayload = {
                gradeId,
                courseId
            }
            const response = await getChapterDetails(apiPayload);
            if (response?.status === '200') {
                dispatch(onlineAssementQpChapterEventActions(response?.data));
            }
        } catch (error) {
            console.error("Error while calling the fetchChapterDetails api");
        }
    }

    
    const getAcademicYear = async () => {
        if (selectedOption == "0") {
            const response = await GetQuestionPaperAcademicId()
        if (response?.status === "200") {
            let academicYears = response?.data?.academicData?.filter((year: any) => year?.academicStatusId < 1)
            academicYears = academicYears.sort((a: any, b: any) => b?.academicStatusId - a?.academicStatusId)
            setAcademicYearData(academicYears)
            let academicData: any = []
            academicYears?.map((e: any, index: number) => {
                let academicLabel = e.acadamicYear + (e.academicStatusId == 0 ? " (Current)" : "");
                academicData.push(academicLabel);
                if (e?.academicStatusId == 0) setAcademicYearDataSelected(index.toString())
            });
            setAcademicYearDataInfo(academicData)
        }
        }
    }

    const AcademicYearSelectHandler = async (indexData: number) => {
        try {
            if (currentAcadmicYearId != academicYearData[indexData]?.acadamicId) {
                const data = [{
                    startDate: new Date(academicYearData[indexData].startDate),
                    endDate: new Date(academicYearData[indexData].endDate),
                }]
                setAcademicDateRange(data)
                setAcademicYearDataSelected(indexData.toString());
                dispatch(onlineAssementQpList([]));
                dispatch(onlineQPaperStudentEventActions({}));
                dispatch(onlineCurrentQPaperStudentEventActions([]));
                setInitialStudentList([]);
                if (selectedOption == "0") {
                    await fetchQuetionPaperList(indexData);
                }
                // Need to call chapter challenge QP Cards API
            }
            // if (selectedOption == "1") {
            //     setAcademicYearDataSelected(indexData.toString());
            //     dispatch(onlineAssementQpList([]));
            //     dispatch(onlineQPaperStudentEventActions({}));
            //     dispatch(onlineCurrentQPaperStudentEventActions([]));
            //     setInitialStudentList([]);
            //     await fetchChapterChallengeQp(indexData);

            // }
        } catch (error) {
            console.error('Error');
        }
    }

    const handleSectionFilter = (sectionIds: any) => {
        if (sectionIds.length > 0) {
            const filtered = currentQpStudentList?.filter((student: { sectionId: any; }) => sectionIds.includes(student.sectionId));
            setInitialStudentList(filtered);
        }
        if (sectionIds.length === 0) {
            setInitialStudentList(currentQpStudentList)
        }
    };

    /**
     *  TODO : please Add all the useEffect below this stament
     */

    // @@@@@@@@@ Loading Question Paper @@@@@@@@@@@@@@@@@@@
    useEffect(() => {
        // Update questions when filters change
        if (searchQuery || !searchQuery || searchfilter) {
            filterQuestions();
        }
    }, [searchQuery, searchfilter, selectedTabVal, chapterSearchFilter, allQpList]);

    useEffect(() => {
        if (academicYearData && academicYearDataSelected) {
            if (selectedOption == "0") {
                fetchQuetionPaperList();
            }
            // Need to call chapter challenge QP Cards API
            // if (selectedOption == "1") {
            //     if (chapterSearchFilter?.gradeId !== "" && chapterSearchFilter?.subjectId !== "") {
            //         fetchChapterChallengeQp();
            //     }
            // }
        }
    }, [academicYearData]);

    useEffect(() => {
        if (!gradesLoaded && !allGreads?.length) {
            fetchGreadDetails();
        } else if (gradesLoaded && !subjectsLoaded && !allStubjects?.length) {
            fetchSubjectDetails();
        } else if (gradesLoaded && subjectsLoaded && !allChaptersDetails?.length) {
            fetchChapterDetails();
        }
    }, [gradesLoaded, subjectsLoaded, allGreads, allStubjects, allChaptersDetails]);

    useEffect(() => {
        if (qpList && qpList?.length === 0) {
            setQpList(allQpList);
        }

        // if the QP is deleted then Updating the setQPList here
        if (qpList?.length > allQpList?.length) {
            setQpList(allQpList);
        }
    }, [allQpList])

    // this useEffect for - while we create new duplicate qp then we are calling new qp list and de-select the current question paper to new duplicate qp
    useEffect(() => {
        if (qpList?.length < allQpList?.length && selectedOption == "0") {
            setSelectedQuestion(undefined);
            dispatch(onlineUpdateCurrentQpDetails({}));
            setQpList(allQpList);
        }
    }, [allQpList])
    useEffect(() => {

        /*  This logic for showing empty screen so we added date filter condition - if date filter is applied(Active) 
                we will show no data found else we will show empty screen
                if selected option =0 means online test and
                selected option = 2 means chapter challenge
        */
        // --------------Destructure this logic into Utility Functions -----------------------
        // const isOnlyGradeIdFilterActive = isFromTeacherWeb ? selectedOption == "0" ? 
        // (!searchfilter?.gradeId || searchfilter?.gradeId) && (!searchfilter?.subjectId || searchfilter?.subjectId) && !searchfilter?.startDate && !searchfilter?.endDate :
        //  (!chapterSearchFilter?.gradeId || chapterSearchFilter?.gradeId) &&
        //     (!chapterSearchFilter?.subjectId || chapterSearchFilter?.subjectId) && !chapterSearchFilter?.startDate && !chapterSearchFilter?.endDate:
        //  selectedOption == "0" ? (!searchfilter?.gradeId || searchfilter?.gradeId) && !searchfilter?.subjectId && !searchfilter?.startDate && !searchfilter?.endDate : 
        // (!chapterSearchFilter?.gradeId || chapterSearchFilter?.gradeId) &&    (!chapterSearchFilter?.subjectId || chapterSearchFilter?.subjectId) && !chapterSearchFilter?.startDate && !chapterSearchFilter?.endDate

        const isGradeIdFilterActive = (filter: any) =>
            (!filter?.gradeId || filter?.gradeId) &&
            (!filter?.subjectId || filter?.subjectId) &&
            !filter?.startDate &&
            !filter?.endDate;

        const isGradeIdFilterActive2 = (filter: any) =>
            (!filter?.gradeId || filter?.gradeId) &&
            !searchfilter?.subjectId &&
            !filter?.startDate &&
            !filter?.endDate;

        const isOnlyGradeIdFilterActive = isFromTeacherWeb
            ? (selectedOption === "0" ? isGradeIdFilterActive(searchfilter) : isGradeIdFilterActive(chapterSearchFilter))
            : (selectedOption === "0" ? isGradeIdFilterActive2(searchfilter) : isGradeIdFilterActive(chapterSearchFilter));

        const isSearchQueryEmpty = !searchQuery;
        const areQuestionsEmpty = !qpList || qpList.length === 0;

        if (isOnlyGradeIdFilterActive && isSearchQueryEmpty && areQuestionsEmpty) {
            setEmptyScreen(true);
        } else {
            setEmptyScreen(false);
        }
    }, [searchfilter, searchQuery, qpList, lmsAssessData, chapterSearchFilter])

    /**
    *  TODO Default Question Paper Selection 
    */
    useEffect(() => {
        if (qpList?.length > 0 && !selectedQuestion && (!currentQuestionPaper || Object.keys(currentQuestionPaper).length === 0)) {
            const defaultSelection = qpList[0];
            setSelectedQuestion(defaultSelection);
            dispatch(onlineUpdateCurrentQpDetails(defaultSelection)); // Dispatch action to update currentQuestionPaper details
            localStorage.setItem('onlineCurrentQp', JSON.stringify(defaultSelection));
        } else if (currentQuestionPaper && Object.keys(currentQuestionPaper).length > 0) {
            if (currentQuestionPaper?.id) {
                const payload = qpList;
                const data = payload?.filter((item: any) => currentQuestionPaper?.id === item?.id);
                if (data?.[0]) {
                    setSelectedQuestion(data?.[0]);
                } else {
                    setSelectedQuestion(currentQuestionPaper); // Set selectedQuestion to currentQuestionPaper if it exists and is not empty
                }
            }
        }
    }, [qpList, selectedQuestion, selectedOption]); // Add dependencies to ensure it runs when these change
    // TODO : calling the Student List API
    useEffect(() => {
        if (selectedOption == "0") {
            const fetchStudentList = async (item: any) => {
                try {
                    const apiPayload = {
                        sortKey: "studentName",
                        sortKeyOrder: "desc",
                        questionPaperId: selectedQuestion?.id,
                        classId: "",
                        studentName: ""
                    };

                    const response = await getStudentList(apiPayload);

                    if (response?.result?.responseDescription === "Success" && !response?.data) {
                        dispatch(onlineQPaperStudentEventActions({ qId: selectedQuestion?.id, data: [] }));
                        dispatch(onlineCurrentQPaperStudentEventActions([]));
                        setInitialStudentList([]);
                    }
                    if (response?.result?.responseDescription === "Success" && response?.data) {

                        const sortedData = response?.data?.sort((a: any, b: any) => {
                            const rollNumberA = parseInt(a?.rollNo, 10);
                            const rollNumberB = parseInt(b?.rollNo, 10);
                            // Use numeric comparison
                            return rollNumberA - rollNumberB;
                        });
                        //TODO -> assing the Student List 
                        dispatch(onlineQPaperStudentEventActions({ qId: selectedQuestion?.id, data: response?.data }));
                        dispatch(onlineCurrentQPaperStudentEventActions(sortedData || []));
                        setInitialStudentList(sortedData);
                    }
                } catch (error) {
                    console.error(error);
                }
                if (routeState?.state?.reloadStudentList) {
                    history(routeState.pathname, {});
                }
            };
            if (selectedQuestion) {
                if (onlineQpStudentListing[`${selectedQuestion?.id}`]) {
                    dispatch(onlineCurrentQPaperStudentEventActions(onlineQpStudentListing[`${selectedQuestion?.id}`]));
                    setInitialStudentList(onlineQpStudentListing[`${selectedQuestion?.id}`]);
                } else {
                    // API call
                    fetchStudentList(selectedQuestion);
                }
            }
            if (routeState?.state?.reloadStudentList) {
                fetchStudentList(selectedQuestion);
            }
        }

    }, [selectedQuestion, onlineQpStudentListing, qpList]);

    const fetchChapterStudentList = async (selectedQuestion: any) => {
        if (selectedQuestion) {
            const { isAssigned, isCompleted, id } = selectedQuestion;

            if (isAssigned) {
                setChapterNotCompleted(false);
                setChapterNotAssigned(false);

                try {
                    const apiPayload = {
                        sortKey: "studentName",
                        sortKeyOrder: "desc",
                        questionPaperId: id,
                        classId: "",
                        studentName: ""
                    };

                    const response = await getStudentList(apiPayload);

                    if (response?.result?.responseDescription === "Success") {
                        if (!response?.data) {
                            // No student data
                            dispatch(onlineQPaperStudentEventActions({ qId: id, data: [] }));
                            dispatch(onlineCurrentQPaperStudentEventActions([]));
                            setInitialStudentList([]);
                        } else {
                            // Sort student data by roll number
                            const sortedData = response.data.sort((a: any, b: any) => {
                                const rollNumberA = parseInt(a?.rollNo, 10);
                                const rollNumberB = parseInt(b?.rollNo, 10);
                                return rollNumberA - rollNumberB;
                            });

                            // Dispatch sorted data
                            dispatch(onlineQPaperStudentEventActions({ qId: id, data: response.data }));
                            dispatch(onlineCurrentQPaperStudentEventActions(sortedData));
                            setInitialStudentList(sortedData);
                        }
                    } else {
                        console.warn('API response not successful');
                    }
                } catch (error) {
                    console.error('Error fetching student list:', error);
                }
            } else if (!isCompleted) {
                // Question is not completed
                setChapterNotAssigned(false);
                setChapterNotCompleted(true);
            } else if (isCompleted && !isAssigned) {
                // Question is completed but not assigned
                setChapterNotCompleted(false);
                setChapterNotAssigned(true);
            }
        }
    }

    useEffect(() => {
        if (selectedOption == "1" && selectedQuestion != undefined) {
            fetchChapterStudentList(selectedQuestion);
        }
    }, [selectedQuestion, selectedOption])

    // useEffect(() => {
    //     if (!!lmsAssessData && Object.keys(lmsAssessData).length > 0) {
    //         handleSectionFilter(String(lmsAssessData?.sectionID))
    //     }
    // }, [lmsAssessData])

    useEffect(() => {
        getAcademicYear()
    }, [selectedOption])

    const createNewTest = () => {
        const lmsAssessData: any = isFromTeacherWeb && JSON.parse(localStorage.getItem("topAssessData") as string);
        const data = {
            isFromTeacherWeb: isFromTeacherWeb ? isFromTeacherWeb : false,
            lmsData: lmsAssessData
        };
        history('/assess/evaluation/onlineTest', { state: data });
    };

    const goToCurriculumBtn = () => {
        const obj = {
            gradeId: Number(chapterSearchFilter?.gradeId),
            courseId: Number(chapterSearchFilter?.subjectId)
        }
        //assessCurriculumData -> for chapter challenge we are setting the localstorage.
        localStorage.setItem("assessCurriculumData", JSON.stringify(obj));
        window.location.href = window.location.origin + `/teacher/account-info/CurriculumPlan`;
    }

    const handleQuestionMenuEvent = (qMenuItems: {
        option: string;
        payload: any;
    }) => {
        dispatch(qListMenuEventActions(qMenuItems));
    };

    useEffect(() => {
        if (qMenuEvaluationEvent === "View Online Test report" || qMenuEvaluationEvent === "View Chapter Challenge report") {
            history("/assess/evaluation/teacherReport", {
                state: { id: selectedQuestion?.id, onlineReport: true, tabSelected: selectedOption, isFromTeacherWeb: isFromTeacherWeb }
            });
        }
    }, [qMenuEvaluationEvent, selectedQuestion?.id]);

    useEffect(() => {
        const isSearchQueryEmpty = searchQuery === undefined || searchQuery === "";
        if (isFromTeacherWeb && isSearchQueryEmpty && qpList?.length === 0) {
            setEmptyScreen(true)
        }
    }, [isFromTeacherWeb, searchQuery, qpList])
    return (
        <div className={isFromTeacherWeb ? 'online-assessment-test' : 'online-aasesment-main'}>
            {/* {isLoading && <Spinner />} */}
            {spinnerStatus && <Spinner />}
            {/* Online Assement  Header seaction*/}
            {!isFromTeacherWeb && <div className='online-aasesment-heading'>
                <div className='online-aasesment-heading-title' style={{paddingTop:(selectedOption == "1") ? "4px":"0px"}}>Online Tests</div>
                {selectedOption == "0" &&
                <div className='online-aasesment-calender'>
                    {/*  This is */}
                    <SelectBoxComponent variant={'fill'} selectedValue={academicYearDataSelected} clickHandler={(e: number) => { AcademicYearSelectHandler(e) }} selectLabel={'Academic Year:'} selectList={academicYearDataInfo} mandatory={false} />
                </div>
                }
            </div>}
            {/* online assement menu bar section */}
            {/* {!isFromTeacherWeb && <div className='online-assesment-submenu' style={{paddingTop:(selectedOption == "1") ? "4px":"0px"}}>
                <OnlineAssesmentTabMenu />
            </div>} */}

            {/* online assesment Question paper filters */}
            <div className='online-assesment-qp-filters' style={{ marginTop: isFromTeacherWeb ? "20px" : "" }}>
                {/* Moved Toggle Button Component to Parent Component from QP Filter component */}
                <div>
                    <OnlineColorToggleButton selectedTab={selectedOption} onChange={handleOptionChange} isFromTeacherWeb={isFromTeacherWeb} />
                </div>
                {/* Please create the stateleass component  */}
                <OnlineAssesmentQuestionPaperfilter
                    setSearchFilter={setSearchFilter}
                    isFromTeacherWeb={isFromTeacherWeb}
                    emptyScreen={emptyScreen}
                    questionsCount={questionCount}
                    questions={qpList}
                    setSelectedTabVal={setSelectedTabVal}
                    academicDateRange={academicDateRange}
                    selectedOption={selectedOption}
                    chapterSearchFilter={chapterSearchFilter}
                    setChapterSearchFilter={setChapterSearchFilter}
                />
            </div>

            {/* TODD : Qp & Student table section */}
            {emptyScreen && selectedOption == "0" && <EmptyScreen
                emptyBtnTxt={'Create New Online Test'}
                title={'You haven’t created any question papers yet'}
                desc={'Press the button below to create a new question paper'}
                onClickBtn={() => createNewTest()}
                btnDisable={createOnlineTestBtn}
                createButtonActionObj={undefined}
                style={{ width: "100%" }}
            />}
            {emptyScreen && selectedOption == "1" && <EmptyScreen
                emptyBtnTxtWithoutIcon={'Go to Curriculum'}
                title={'Curriculum not published for this subject'}
                desc={'Press the button below to go to curriculum'}
                onClickBtn={() => goToCurriculumBtn()}
                btnDisable={createChapterTestBtn}
                createButtonActionObj={undefined}
                style={{ width: "100%" }}
            />}
            {!emptyScreen &&
                <div className='online-assesment-container'>
                    {/*  This React Fragment is from empty Screen */}
                    <React.Fragment>
                        <div className='online-assesmnet-qp-section'>
                            {/* Search Input */}
                            <TextField id="search-for-student"
                                name="SearchForStudent"
                                className='onlineTestSearchField'
                                variant="outlined"
                                size='medium'
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
                            <div className={qpList?.length === 0 ? 'qp-empty-card-section' : 'qp-cards-section'}>
                                {qpList && qpList?.length !== 0 && qpList?.map((item: QuestionPaperInterface, index: number) => {
                                    return <div key={index} onClick={() => handleCardClick(item)}><OnlineQpCards data={item} key={index} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} qpList={qpList} handleQuestionMenuEvent={handleQuestionMenuEvent} selectedTabVal={selectedTabVal} selectedOption={selectedOption} chapterSearchFilter={chapterSearchFilter} setQpList={setQpList} lmsAssessData={lmsAssessData} isFromTeacherWeb={isFromTeacherWeb} /></div>
                                })}
                                {qpList?.length === 0 ? <React.Fragment>
                                    No match found!
                                </React.Fragment> : <></>}
                            </div>
                        </div>
                        <div className='online-assesment-student-table-section'>
                            <div className='studnet-list-filtes'>
                                <OnlineStudentListTablefilter
                                    handleStudentNameSearch={handleStudentNameSearch}
                                    isFromTeacherWeb={isFromTeacherWeb}
                                    selectedQuestion={selectedQuestion}
                                    handleSectionFilter={handleSectionFilter}
                                    createOnlineTestBtn={createOnlineTestBtn}
                                    selectedOption={selectedOption}
                                />
                            </div>
                            {qpList && qpList.length > 0 &&
                            <OnlineStudentListTable
                                questionPaper={selectedQuestion}
                                selectedOption={selectedOption}
                                chapterNotCompleted={chapterNotCompleted}
                                chapterNotAssigned={chapterNotAssigned}
                                data={fetchFilteredStudent} // Ensure this is of type StudentList[]
                                chapterSearchFilter={chapterSearchFilter}
                                setQpList={setQpList}
                                setChapterNotAssigned={setChapterNotAssigned}
                                setChapterNotCompleted={setChapterNotCompleted}
                                setSelectedQuestion={setSelectedQuestion}
                                isFromTeacherWeb={isFromTeacherWeb}
                                />}
                        </div>
                    </React.Fragment>
                </div>}
        </div>
    )
}

export default OnlineAssesment