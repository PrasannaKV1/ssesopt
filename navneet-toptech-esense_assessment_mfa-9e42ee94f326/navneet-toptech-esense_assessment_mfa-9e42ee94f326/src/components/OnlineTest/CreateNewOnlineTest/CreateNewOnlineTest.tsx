import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AlertColor, Box, FormControlLabel, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import InputFieldComponentForForm from "../../SharedComponents/FormFieldComponents/InputFieldComponent";
import DropdownSingleSelect from "../../SharedComponents/DropdownWithCheckbox/DropdownSingleSelect";
import DropdownWithCheckbox from "../../SharedComponents/DropdownWithCheckbox/DropdownWithCheckbox";
import ButtonComponent from "../../SharedComponents/ButtonComponent/ButtonComponent";
import Spinner from "../../SharedComponents/Spinner";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Toaster from "../../SharedComponents/Toaster/Toaster";
import "./CreateNewOnlineTest.css";
import { alphanumericNameRegex, areDateGreater, areDatesEqual, examTableCount, getLocalStorageDataBasedOnKey, numericRegex } from "../../../constants/helper";
import { Chapter, Grade, Subject, Theme } from "../../../interface/filters";
import { baseFilterApi, baseGradeApi, chaptersWithTheme, getThemesApi } from "../../../Api/AssessmentTypes";
import { State } from "../../../types/assessment";
import { Controller } from 'react-hook-form';
import { QuestionPaperViewApi, sectionAPI } from "../../../Api/QuestionTypePaper";
import SwitchComponentForForm from "../../SharedComponents/FormFieldComponents/SwitchComponentForForm";
import DropdownWithExpandCheckbox from "../../SharedComponents/DropdownWithCheckbox/DropdownWithExpandedCheckbox";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Polygon from "../../../../src/assets/images/Polygon.svg";
import UpPolygon from "../../../../src/assets/images/UpPolygon.svg";
import { getPreviewTemplate, getTemplateData } from "../../../Api/templateManage";
import { questionPaperPostAPI, radioGetAPICall } from "../../../Api/QuestionPaper";
import EditingModal from "../../SharedComponents/ModalPopup/EditingModal";
import PreviewTemplate from "../../QuestionPaperContainer/QuestionPaperOPTScreen/TemplatePreview/PreviewTemplate";
import { calculateDifferenceInMinutes } from "../../../constants/helperFunctions";

const tabValue = ["QUESTION PAPER BLUEPRINT", 'TOTAL MARKS', "TOTAL TIME", "CREATED BY", "ACTIONS"];

const CreateNewOnlineTest = () => {
    const tableScroll: any = useRef();
    const { state }: any = useLocation();
    const { gradeId: paramGrade, sectionId: paramSectionId, courseId: paramCourseId } = useParams();
    const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;
    const [spinnerStatus, setSpinnerStatus] = useState(false);
    const [selectedStartTime, setSelectedStartTime] = useState<any>(moment(new Date()));
    const [selStartDate, setSelStartDate] = useState<any>(null);
    const [snackBar, setSnackBar] = useState<boolean>(false);
    const [enableSteps, setEnableSteps] = useState<string[]>(['a'])
    const [snackBarText, setSnackBarText] = useState<string>("");
    const [subject, setSubject] = useState<Subject[]>([])
    const [theme, setTheme] = useState<Theme[]>([])
    const [chapter, setChapter] = useState<Chapter[]>([])
    const [grades, setGrades] = useState<Grade[]>([])
    const [section, setSection] = useState<any[]>([])
    const [apiReqObj, setApiReqObj] = useState({});
    const [previewTemplateOpenStatus, setPreviewTemplateOpenStatus] = useState<boolean>(false);
    const [previewTemplateData, setPreviewTemplateData] = useState();
    const [questionPaperAllData, setQuestionPaperAllData] = useState<any>();
    const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("success");
    const [initialValues, setInitialValues] = useState<any>({
        testName: '',
        gradeId: state?.lmsData?.gradeId ? state?.lmsData?.gradeId : paramGrade != undefined ? paramGrade : [],
        subjectId: '',
        themeId: [],
        chapterId: [],
        sectionId: [],
        totalTime: '',
        assignDate: new Date(),
        dueDate: '',
        startTime: '',
        endTime: '',
        lateSubmission: false,
    })
    const [sortDetails, setSortDetails] = useState<any>({
        sortColName: '',
        sortColOrder: '',
    });
    const [tableData, setTableData] = useState<any>([])
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [pageCount, setPageCount] = useState(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [isChange, setIsChanges] = useState<boolean>(false)
    const [selectedRadioValue, setSelectedRadioValue] = useState({ id: '' })
    const [stepCPreviewBody, setStepCPreviewBody] = useState();
    const [continueEditing, setcontinueEditing] = useState<boolean>(false);
    const [isAfterGenQP, setIsAfterGenQP] = useState(false);
    const [questionPaperID, setQuestionPaperID] = useState<any>();
    const [restrictTime, setRestrictTime] = useState(false);
    const [disableFields, setDisableFields] = useState(false);
    const [isEndTimeGreater, setIsEndTimeGreater] = useState(false);

    useEffect(() => {
        if (selectedRadioValue?.id) clickActionHandler(selectedRadioValue, false);
    }, [selectedRadioValue])

    let history = useNavigate();
    const methods = useForm<any>({
        defaultValues: initialValues,
        mode: "onBlur",
        reValidateMode: "onChange"
    });
    const updateSelection = (event: any, value: any) => {
        event.persist();
        setSelectedRadioValue({ id: value });
        methods?.setValue('radioValue', value);
    };

    const DiffFn = () => {
        if (typeof (methods?.getValues('gradeId')) === 'number' || methods?.getValues("chapterId")?.length > 0 || ((methods?.getValues("themeId")?.length > 0 && (theme?.length > 0 && methods?.getValues('subjectId')?.length > 0) ? true : false) || (theme?.length == 0 && methods?.getValues('subjectId')?.length > 0) ? true : false) || methods?.getValues("subjectId")?.length > 0 || methods?.getValues("sectionId")?.length > 0 || methods?.getValues("testName")?.length != 0 || methods?.getValues('radioValue') != '') {
            setcontinueEditing(true)
        } else {
            setcontinueEditing(false)
            history("/assess/evaluation/onlineAssesment")
        }
    }

    // "Api Block"
    const gradesAPI = async () => {
        try {
            setSpinnerStatus(true)
            const response = await baseGradeApi("staffActiveGrades", stateDetails.login.userData.userRefId)
            if (response?.status === "200") {
                setGrades(response?.data)
                setSpinnerStatus(false)
            }
        } catch (err) {
            setSpinnerStatus(false)
        }
    }

    let subjects: any;
    const subjectApi = async (list: Grade[] | null, element: any, reset?: boolean) => {
        if (reset) {
            methods?.setValue('gradeId', (element || element == 0) ? grades[element]?.es_gradeid : "")
            methods.reset({
                ...methods?.getValues(),
                chapterId: [],
                themeId: [],
                sectionId: [],
                subjectId: [],
                radioValue: ''
            })
            // },500)    
            setTheme([])
            setChapter([])
            setSection([])
            setSubject([])
            //setSelectedRadioValue({ id: '' })
            setEnableSteps(['a'])
            //setEnableBtn(true)
            //setPageNumber(1)
            if (element || element == 0) {
                const response = await baseFilterApi("subjects", { "gradeId": [grades[element]?.es_gradeid], "publicationId": 0, "staffId": stateDetails.login.userData.userRefId })
                if (response.status == '200') {
                    setSpinnerStatus(false)
                    // setSubject(response.data)
                    setSubject(response.data.filter((subj: any) => subj.isOnlineTestEnable === true))
                    sectionApi(element);
                } else {
                    setSpinnerStatus(false)
                }
            }
        } else {
            setSpinnerStatus(true)
            if (element != null) {
                let gradeIds = grades[element]?.es_gradeid ? grades[element]?.es_gradeid : element
                const response = await baseFilterApi("subjects", { "gradeId": [gradeIds], "publicationId": 0, "staffId": stateDetails.login.userData.userRefId })
                if (response.status == '200') {
                    setSpinnerStatus(false)
                    // setSubject(response.data)
                    setSubject(response.data.filter((subj: any) => subj.isOnlineTestEnable === true))
                    subjects = response?.data
                } else {
                    setSpinnerStatus(false)
                }
            } else {
                setSpinnerStatus(false)
                setSubject([])
                setSection([])
            }
        }
    }

    /*get section APi call*/
    const sectionApi = async (e: any) => {
        setSpinnerStatus(true)
        try {
            if (e != null) {
                const response = await sectionAPI(stateDetails.login.userData.userRefId)
                if (Object.keys(response)?.length > 0 && Object.keys(response?.data)?.length > 0 && response?.data?.classDetails?.length > 0) {
                    let gradeIds = grades[e]?.es_gradeid ? grades[e]?.es_gradeid : e
                    const sectionGrades = response?.data?.classDetails?.filter((a: any, i: number) => a?.es_gradeid == gradeIds)
                    var result = sectionGrades.reduce((uniqueData: any, o: any) => {
                        if (!uniqueData.some((obj: any) => obj.sectionid === o.sectionid)) {
                            uniqueData.push(o);
                        }
                        return uniqueData;
                    }, [])
                    setSection(result ?? [])
                    setSpinnerStatus(false)
                } else {
                    setSection([])
                }
            } else {
                setSection([])
                setSpinnerStatus(false)
            }
        } catch (err) {
            setSpinnerStatus(false)
            console.log(err)
        }
    }

    const getThemes = async (value: any) => {
        try {
            setSpinnerStatus(true)
            const response: any = await getThemesApi({ "subjectId": value })
            if (response?.status == 200) {
                setSpinnerStatus(false)
                let subjectWithTheme = [] as any;
                value?.map((ele: number) => {
                    let subWithTheme =
                    {
                        label: subject?.length > 0 ? subject?.find((x: any) => (ele == x?.courseId))?.courseName : subjects?.find((x: any) => (ele == x?.courseId))?.courseName,
                        value: ele,
                        childOptions: response?.data?.filter((b: any) => (b?.courseID == ele)).map((x: any) => {
                            return { label: x?.syllabusName, value: x?.syllabusID }
                        })
                    }
                    subjectWithTheme.push(subWithTheme)
                })
                setTheme(subjectWithTheme?.filter((x: any) => x?.childOptions?.length > 0))
            }
        } catch (err) {
            console.log(err)
            setSpinnerStatus(false)
        }
    }

    const chapterApi = async (list: Chapter[] | null, element: number[], reset: boolean) => {
        if (reset) {
            methods?.setValue('subjectId', element)
            methods.reset({
                ...methods?.getValues(),
                subjectId: element,
                chapterId: [],
                themeId: [],
                radioValue: ''
            })
            //setPageNumber(1)
            setTheme([])
            setChapter([])
            //setSelectedRadioValue({ id: '' })
            setEnableSteps(['a'])
        }
        if (!reset) {
            setSpinnerStatus(true)
            if (element?.length > 0) {
                const response = await baseFilterApi("chapters", { "gradeId": methods.getValues("gradeId") && [methods.getValues("gradeId")], "courseId": element, "staffId": stateDetails.login.userData.userRefId })
                const postObj = {
                    "gradeId": [methods.getValues("gradeId")],
                    "courseId": methods.getValues("subjectId") !== "" ? [methods.getValues("subjectId")] : element
                }
                const chapWithTheme = await chaptersWithTheme(postObj)
                if (response.status == 200 && chapWithTheme?.length) {
                    let subjectWithChapter = [] as any;
                    element?.map((ele: number) => {
                        let courseAndChapter =
                        {
                            label: subject?.length > 0 ? subject?.find((x: any) => (ele == x?.courseId))?.courseDisplayName : subjects?.find((x: any) => (ele == x?.courseId))?.courseDisplayName,
                            value: ele,
                            childOptions: (chapWithTheme?.find((b: any) => (b?.courseId == ele)))?.chapters?.map((x: any) => {
                                return { label: x?.name, value: x?.id }
                            })
                        }
                        subjectWithChapter.push(courseAndChapter)
                    })
                    setChapter(subjectWithChapter?.filter((x: any) => x?.childOptions?.length > 0))
                }
                await getThemes(element)
            }
        }
        setSpinnerStatus(false)
    }


    // useEffect block
    useEffect(() => {
        gradesAPI();
    }, []);


    const handleTimeDifference = (selectedTime: number) => {
        const assignDate = new Date(methods.watch("assignDate"));
        const dueDate = new Date(methods.watch("dueDate"));
        const startTime = methods.getValues("startTime");
        const endTime = methods.getValues('endTime');
        if (areDatesEqual(assignDate, dueDate)) {
            const differenceInMinutes = endTime !== "" && endTime?.diff(startTime, 'minutes');
            if (differenceInMinutes < selectedTime) {
                methods.reset({
                    ...methods?.getValues(),
                    startTime: '',
                    endTime: ''
                })
            }
        } 
        else {
            const convertedStartDate = moment(assignDate).format("YYYY-MM-DD");
            const convertedEndDate = moment(dueDate).format("YYYY-MM-DD");

            const convertedStartTime = moment(startTime?.$d).format("HH:mm:ss");
            const convertedEndTime = moment(endTime?.$d).format("HH:mm:ss");

            const startDateTime = new Date(`${convertedStartDate}T${convertedStartTime}`);
            const endDateTime = new Date(`${convertedEndDate}T${convertedEndTime}`);

            const differenceInMinutes = (endDateTime?.getTime() - startDateTime?.getTime()) / (1000 * 60);
            if (differenceInMinutes < selectedTime) {
                methods.reset({
                    ...methods.getValues(),
                    startTime: '',
                    endTime: ''
                });
            }
        }
    }

    useEffect(() => {
        if (methods.getValues("totalTime") !== "") {
            handleTimeDifference(methods.getValues("totalTime"))
        }
    }, [methods.getValues("totalTime")])

    // "Handler function block"
    const changeHandler = async (e: any, data: string) => {
        switch (data as string) {
            case 'testName':
                methods.reset({
                    ...methods?.getValues(),
                    testName: e
                });
                break;
            case 'totalTime':
                methods.reset({
                    ...methods?.getValues(),
                    totalTime: e
                });
                break;

            case 'grade':
                methods.reset({
                    ...methods?.getValues(),
                    gradeId: e != null ? grades[e].es_gradeid : '',
                    chapterId: [],
                    themeId: [],
                    subjectId: [],
                    sectionId: [],
                });
                subjectApi(null, e, false);
                sectionApi(e);
                break;


            case 'section':
                methods.reset({
                    ...methods?.getValues(),
                    sectionId: e,
                    chapterId: [],
                    themeId: [],
                    subjectId: [],
                });
                break;

            case 'subject':
                methods.reset({
                    ...methods?.getValues(),
                    subjectId: e != null ? subject[e].courseId : [],
                    chapterId: [],
                    themeId: []
                })
                chapterApi(null, e != null ? [subject[e].courseId] : [], false);
                break;

            case 'theme':
                methods.reset({
                    ...methods?.getValues(),
                    themeId: e,
                    chapterId: [],
                })
                break;

            case 'Chapter':
                methods?.setValue('chapterId', e)
                break;
        }
    }

    const convertToArrayOfObj = (keyName: string, data: []) => {
        return data && data?.length > 0 ? data?.map(id => ({ [keyName]: id })) : [];
    }

    const onSubmit = async (data: any, status: string) => {
        if (methods?.getValues('gradeId') !== "" && methods.getValues("subjectId") !== "" && methods.getValues("sectionId").length > 0 && methods.getValues("testName") && methods.getValues("totalTime") && methods.getValues("chapterId") && methods.getValues("assignDate") && methods.getValues("dueDate") && !!methods.getValues("endTime") && !!methods.getValues("startTime") && !isEndTimeGreater) {
            setEnableSteps([...enableSteps, 'b']);
        }
        if (enableSteps.includes("b") && methods?.getValues('gradeId') !== "" && methods.getValues("subjectId") !== "" && methods.getValues("sectionId").length > 0 && methods.getValues("testName") && methods.getValues("totalTime") && methods.getValues("chapterId") && methods.getValues("assignDate") && methods.getValues("dueDate") && !!methods.getValues("endTime") && !!methods.getValues("startTime")) {
            const courseObj: any = [{
                "courseID": Number(data.subjectId)
            }]
            const selectedSection = data?.sectionId.toString();
            const classId: any = section?.filter((el: any) => selectedSection?.includes(el?.sectionid?.toString()))?.map((id: any) => { return { sectionID: id?.classid } });
            const stepAReqObj = {
                name: data?.testName,
                examTypeID: 1,
                generationModeID: 2,
                gradeID: data?.gradeId,
                totalTime: Number(data?.totalTime),
                chapters: convertToArrayOfObj("chapterID", data?.chapterId),
                themes: convertToArrayOfObj("themeID", data?.themeId),
                // courses: convertToArrayOfObj("courseID", data?.subjectId),
                courses: courseObj,
                sections: classId,
                startDate: moment(data?.assignDate.$d).format("DD-MM-YYYY"),
                endDate: moment(data?.dueDate.$d).format("DD-MM-YYYY"),
                startTime: moment(data?.startTime.$d).format('hh:mm A'),
                endTime: moment(data?.endTime.$d).format('hh:mm A'),
                academicYearID: stateDetails.currentAcademic.acadamicId,
                questionPaperTypeID: 1,
                templateID: Number(methods?.getValues('radioValue')),
                templateMetaInfo: stepCPreviewBody,
                isLateSubmissionAllowed: data?.lateSubmission,
            };
            setApiReqObj(stepAReqObj);
            setSpinnerStatus(true)
            const response = await questionPaperPostAPI(stepAReqObj);
            if (response?.result?.responseCode == 0 || response?.result?.responseDescription === "Success") {
                setSpinnerStatus(false)
                setQuestionPaperID(response?.data?.paperId)
                setSnackBar(true);
                setSnackBarSeverity('success');
                setSnackBarText(`Question Paper added successfully`);
                methods?.reset({
                    ...initialValues
                })
                setIsAfterGenQP(true);
                clickActionHandler(response?.data?.paperId, false, true)
                //setSelectedRadioValue({ id: '' })
                //setPreviewTemplateOpenStatus(true)
                // setTimeout(() => {
                //     history(`${'/assess/evaluation/onlineAssesment'}`)
                // }, 1000)
                // history("/asses/onlineTest/preview")
            } else {
                setSpinnerStatus(false)
                // setGenerateLoader(false)
                setSnackBar(true);
                setSnackBarSeverity('error');
                setSnackBarText(response?.responseDescription)
                setSpinnerStatus(false)
            }
        }  
    }

    const scrollHandler = async () => {
        const { scrollTop, scrollHeight, clientHeight } = tableScroll.current;
        const tableHeight = Math.round(scrollTop) + clientHeight;

        if (tableHeight === scrollHeight || tableHeight - 1 === scrollHeight) {
            //   if (!isLastPage && pageCount >= pageNumber) {
            //     setPageNumber((prev) => prev + 1);
            //   }
        }
    };
    const sortToggle = (data: string) => {
        const sortdata = {
            sortColName: data,
            sortColOrder: sortDetails.sortColOrder === "ASC" ? "DESC" : "ASC",
        };
        setSortDetails(sortdata);
    }
    const getClassName = (key: string) => {
        if (key === sortDetails.sortColName) {
            return sortDetails.sortColOrder === "ASC"
                ? "activeUpArrow"
                : "activeDownArrow";
        }
        return "";
    };
    const getTableData = async () => {
        let postObj = {
            'pageNumber': 0,
            "orderByColumn": sortDetails?.sortColName || '',
            "orderBy": sortDetails?.sortColOrder || '',
            "isSchoolTemplate": 0,
            "limit": pageNumber * examTableCount,
            'status': [16],
            "templateType": [1],
            'gradeIds': [methods?.getValues('gradeId')],
            'courseIds': [methods?.getValues('subjectId')]
        }
        if (postObj?.gradeIds?.length > 0 && postObj?.courseIds?.length > 0) {
            const resp = await getTemplateData({ ...postObj, courseExactMatch: true })
            setTableData(resp?.data)
            const { totalRecords } = resp || {};
            const count =
                Math.ceil(totalRecords / examTableCount) === 0
                    ? 1
                    : Math.ceil(totalRecords / examTableCount);
            setIsLastPage(
                totalRecords <= examTableCount || !resp?.data
            );
            if (!isNaN(count)) setPageCount(count);
        }
        else {
            setTableData([])
            setPageNumber(1)
        }
    }
    const clickActionHandler = async (d: any, isPreview: boolean, isGenQp?: boolean) => {
        if (isPreview) {
            const previewTemplateData = await getPreviewTemplate(d?.id);
            if (previewTemplateData.status == '200') {
                if (isPreview) {
                    setPreviewTemplateOpenStatus(true)
                    setPreviewTemplateData(previewTemplateData?.data);
                    return;
                }
            }
        }

        if (!isPreview && !isGenQp) {
            const radioResponse = await radioGetAPICall(`templateId=${d?.id}`)
        if (radioResponse?.result?.responseCode == 0) {
            // chapThemePrePopulate(radioResponse?.data)
            // setStepCPreview(radioResponse?.data)
            setStepCPreviewBody(radioResponse?.data)
            // setStepCPreviewBodyCopy(radioResponse?.data)
            // let dataModel:any= {}
            // const templateParts = radioResponse?.data?.bodyTemplate?.templateBuilderInfo?.questionPaperFontMetaData;
            // Object.keys(templateParts?templateParts:{})?.forEach(function (key, value) {
            //   dataModel[key] = "0"
            // })
            // setInitialFormDefault(dataModel)
        }
        }
        if (isGenQp) {
            const response = await QuestionPaperViewApi(d, false);
            if (response?.result?.responseCode == 0) {
                setPreviewTemplateData(response?.data?.generatedQuestionPaper);
                setQuestionPaperAllData(response?.data);
                history(`${'/asses/onlineTest/preview'}`,
                    {
                        state: {
                            questionPaperID: d,
                            isAfterGenQP: true,
                            isFromTeacherWeb: state?.isFromTeacherWeb || (!!paramGrade && !!paramCourseId && !!paramSectionId) || false,
                        },
                    },
                );
            }
        }
        // } 
    };
    useEffect(() => {
        if (pageNumber > 1 && !isLastPage) {
            getTableData();
            setIsLastPage(false);
        }
        if (sortDetails?.sortColName && sortDetails?.sortColOrder) getTableData();
        if (methods.getValues("subjectId") != '' && methods.getValues("gradeId") != '') {
            getTableData();
        }
        if (methods.getValues("subjectId") == '' || methods.getValues("gradeId") == '') {
            setTableData([])
        }
        if (methods.getValues("subjectId")) {
            if (methods?.getValues('radioValue') != '' || methods?.getValues('themeId')?.length != 0 || methods?.getValues('chapterId')?.length != 0) {
                setIsChanges(true)
            } else {
                setIsChanges(false)
            }
        }
    }, [pageNumber, sortDetails, methods?.getValues('gradeId'), methods?.getValues("subjectId"), methods?.formState?.isValid])

    useEffect(() => {
        (async () => {
            if ((state?.lmsData && Object.keys(state.lmsData).length > 0) || (!!paramGrade && !!paramSectionId && !!paramCourseId)) {
                let gradeIndex;
                if (!!paramGrade) {
                    gradeIndex = grades?.findIndex((el: any) => el?.es_gradeid == paramGrade);
                } else {
                    gradeIndex = grades?.findIndex((el: any) => el?.es_gradeid == state?.lmsData?.gradeId);
                }
                await sectionApi(gradeIndex);
                await subjectApi(null, gradeIndex, false);
                await chapterApi(null, [state?.lmsData?.courseId || paramCourseId], false);
                methods.setValue("subjectId", [state?.lmsData?.courseId || paramCourseId]);
                methods.setValue("sectionId", [state?.lmsData?.sectionId || paramSectionId]);
                setDisableFields(true);
            }
        })();
    }, [state?.lmsData, grades])

    useEffect(() => {
        const selectedDate = new Date(methods.getValues("assignDate"));
        const currentDate = new Date();
        if (areDatesEqual(selectedDate, currentDate)) {
            setRestrictTime(true);
        } else {
            setRestrictTime(false);
        }
    }, [methods.getValues("assignDate")]);


    const handleCheckValidation = () => {
        if (!methods?.getValues('gradeId') || (!methods.getValues("subjectId")) || methods.getValues("sectionId")?.length == 0 || !methods.getValues("testName") || !methods.getValues("totalTime") || methods.getValues("chapterId").length == 0 || !methods.getValues("assignDate") || !methods.getValues("dueDate") || !methods.getValues("endTime") || !methods.getValues("startTime")) {
            setSnackBar(true);
            setSnackBarSeverity('error');
            setSnackBarText(`Please enter all the Required fields in step A`);
        }
        if (isEndTimeGreater && !enableSteps.includes('b')) {
            setSnackBar(true);
            setSnackBarSeverity('error');
            setSnackBarText(`Test start and End time should be greater than or equals to test timings`)
        }
    }

    const firstMethod = (e:any) => {
        const re = /^([^0-9a-zA-z[$&+,:;=?@#|'<>.^*()%!-]$%]*)$/;
        if (!re.test(e.key)) {
          e.preventDefault();
        }
      }


    useEffect(() => {
        const assignDate = new Date(methods.watch("assignDate"));
        const dueDate = new Date(methods.watch("dueDate"));
        const startTime = methods.getValues("startTime");
        const endTime = methods.getValues('endTime')
        const differenceInMinutes = calculateDifferenceInMinutes(assignDate, dueDate, startTime, endTime)
        const selectedTime = methods.getValues("totalTime")
        if (differenceInMinutes < selectedTime) {
            setIsEndTimeGreater(true)
        } else {
            setIsEndTimeGreater(false)
        }
    }, [methods.watch("startTime"), methods.watch("endTime"), methods.getValues("totalTime"), methods.watch("dueDate"), methods.watch("assignDate")])

    return (
        <div className="onlineTestContainer" >
            <FormProvider {...methods} >
                <form onSubmit={methods.handleSubmit((data: any) => onSubmit(data, ""))}>
                    <Box sx={{ display: "flex", alignItems: "center", height: '22px', cursor: 'pointer' }} className="goback" onClick={() => state?.isFromTeacherWeb ? history("/assess/teacher?tab_value=5") : history("/assess/evaluation/onlineAssesment")}>
                        <ArrowBackIosIcon />
                        <p className="mt-3">Go back</p>
                    </Box>
                    <p style={{ fontWeight: "800", fontSize: "24px" }}>Select Question Paper Blueprint to continue</p>
                    <p style={{ color: "black", fontSize: "16px", fontWeight: "300", marginTop: "-6px" }}>We use automation to help you quickly generate question papers.</p>
                    <div className="onlineQPContainer">
                        <Box className="stepperqsnpaperDetail stepperSection">
                            <Box className={`circle ${enableSteps?.includes('a') ? "active" : ""}`}>
                                <span>A</span>
                            </Box>
                            <Box className="qsnpaperdetails mt-2 w-100">
                                <h2>Question Paper Details</h2>
                                <p>Specify which grade and subject the generated question paper is for</p>
                                <Box className="fastmannualgenerationBox mt-2">
                                    <div className="row">
                                        <div className='col-6 mt-2'><InputFieldComponentForForm registerName={'testName'} inputType={"text"} label={"Test Name"} required={true} onChange={(e: any) => { changeHandler(e.target.value, 'testName') }} inputSize={"Large"} variant={""} maxLength={50} pattern={alphanumericNameRegex} /></div>
                                        <div className='col-6 mt-2'>
                                            <InputFieldComponentForForm registerName={'totalTime'} inputType={"number"} label={"Enter Test Time in Minutes"} required={true} onChange={(e: any) => { changeHandler(e.target.value, 'totalTime') }} inputSize={"Large"} variant={""} maxLimit={1440} />
                                        </div>
                                    </div>
                                    <Box className="row mt-4">
                                        <Box className="col-6"><DropdownSingleSelect registerName="gradeId" variant={'fill'} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'grade')} selectLabel={'Select Grade'} disabled={disableFields} selectList={grades} mandatory={true} showableLabel={"grade"} showableData={"es_gradeid"} menuHeader={"Select Grade"} /></Box>
                                        <Box className="col-6 onlinePaperOtpSectSub"><DropdownWithCheckbox registerName="sectionId" required={true} value={methods?.getValues('sectionId')} variant={'fill'} selectedValue={''} clickHandler={(e: any) => { changeHandler(e, 'section') }} selectLabel={'Select Section(s)'} disabled={disableFields || (section.length > 0 ? false : true)} selectList={section} mandatory={true} showableLabel={"section"} showableData={"sectionid"} menuHeader={"Select section(s)"} /></Box>
                                    </Box>
                                    <Box>
                                        <Box className="row mt-4">
                                            <Box className={theme.length > 0 ? "col-4 onlinePaperOtpSectSub" : "col-6 onlinePaperOtpSectSub"}>
                                                {/* <DropdownWithCheckbox registerName="subjectId" required={true} value={methods?.getValues('subjectId')} variant={'fill'} selectedValue={''} clickHandler={(e: any) => { changeHandler(e, 'subject') }} selectLabel={'Select Subject(s)'} disabled={disableFields || (!(methods.getValues("sectionId")?.length > 0 && subject?.length > 0))} selectList={subject} mandatory={true} showableLabel={"courseDisplayName"} showableData={"courseId"} menuHeader={"Select Subject"} /> */}
                                                <DropdownSingleSelect registerName="subjectId" variant={'fill'} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'subject')} selectLabel={'Select Subject(s)'} disabled={disableFields || (!(methods.getValues("sectionId")?.length > 0 && subject?.length > 0))} selectList={subject} mandatory={true} showableLabel={"courseDisplayName"} showableData={"courseId"} menuHeader={"Select Subjects"} />
                                            </Box>
                                            {theme.length > 0 && <Box className="onlinechapterSect col-4"><DropdownWithExpandCheckbox preSetVal={undefined} registerName="themeId" required={true} variant={'fill'} value={methods?.getValues('themeId')} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'theme')} selectLabel={'Select theme(s)'} selectList={theme} disabled={theme.length > 0 ? false : true} mandatory={true} showableLabel={"themeName"} showableData={"themeId"} menuHeader={"Select Theme"} /></Box>}
                                            <Box className={theme.length > 0 ? "onlinechapterSect col-4" : "onlinechapterSect col-6"}><DropdownWithExpandCheckbox preSetVal={undefined} registerName="chapterId" required={true} variant={'fill'} value={methods?.getValues('chapterId')} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'Chapter')} selectLabel={'Select Chapter(s)'} selectList={chapter} disabled={(methods.getValues("subjectId") == "" && chapter?.length == 0)} mandatory={true} showableLabel={"chapterName"} showableData={"chapterId"} menuHeader={"Select Chapter"} /></Box>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Box className="row mt-4">
                                            <div className="col-6 mt-2 datepickerContainer">
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Controller
                                                        name="assignDate"
                                                        control={methods.control}
                                                        rules={{ required: true, }}
                                                        //defaultValue={new Date()}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                {...field}
                                                                label="Select Start Date*"
                                                                inputFormat={"ddd D MMM, YYYY"}
                                                                onChange={(newValue) => { field.onChange(newValue); setSelStartDate(newValue); }}
                                                                minDate={moment(new Date(), "YYYY-MM-DD")}
                                                                maxDate={moment(stateDetails.currentAcademic?.endDate, "YYYY-MM-DD")}
                                                                renderInput={(params) => <TextField {...params} onKeyDown={(e)=> firstMethod(e)} style={{ backgroundColor: "#f4f6f9"}} />}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                            <div className='col-6 mt-2 timePickerContainer'>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Controller
                                                        name="startTime"
                                                        control={methods.control}
                                                        //defaultValue={moment().add(10, 'minutes')}
                                                        render={({ field }) => (
                                                            <TimePicker
                                                                label="Select Start Time*"
                                                                inputFormat={"h:mm a"}
                                                                minTime={restrictTime ? moment().add(10, 'minutes') : null}
                                                                {...field}
                                                                value={field.value || null}
                                                                onChange={(newValue) => { field.onChange(newValue); setSelectedStartTime(newValue) }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        style={{ backgroundColor: "#f4f6f9" }}
                                                                        {...params}
                                                                        onKeyDown={(e)=> firstMethod(e)}
                                                                        inputProps={{
                                                                            ...params.inputProps,
                                                                            //placeholder: "HH:MM pm"
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Box className="row mt-4">
                                            <div className='col-6 mt-2 datepickerContainer'>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Controller
                                                        name="dueDate"
                                                        control={methods.control}
                                                        rules={{ required: true, }}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                {...field}
                                                                label="Select Due Date *"
                                                                inputFormat={"ddd D MMM, YYYY"}
                                                                disabled={!methods.getValues("assignDate")}
                                                                minDate={selStartDate == null ? new Date() : moment(selStartDate?.$d, "YYYY-MM-DD")}
                                                                maxDate={moment(stateDetails.currentAcademic?.endDate, "YYYY-MM-DD")}
                                                                renderInput={(params) => <TextField {...params} onKeyDown={(e)=> firstMethod(e)} style={{ backgroundColor: "#f4f6f9" }} />}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                                {areDateGreater(new Date(methods.watch("assignDate")), new Date(methods.watch("dueDate"))) && <span className="err-cls">{"Due date should be greater than or equal to Assign Date"}</span>}
                                            </div>
                                            <div className='col-6 mt-2 timePickerContainer'>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Controller
                                                        name="endTime"
                                                        control={methods.control}
                                                        render={({ field }) => (
                                                            <TimePicker
                                                                label="Select Due Time*"
                                                                inputFormat={"h:mm a"}
                                                                {...field}
                                                                disabled={!methods.getValues("startTime")}
                                                                minTime={areDatesEqual(new Date(methods.watch("assignDate")), new Date(methods.watch("dueDate"))) ? moment(selectedStartTime?.$d).add(methods.getValues('totalTime'), 'minutes') : null}
                                                                value={field.value || null}
                                                                onChange={(newValue) => field.onChange(newValue)}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        style={{ backgroundColor: "#f4f6f9", }}
                                                                        onKeyDown={(e)=> firstMethod(e)}
                                                                        inputProps={{
                                                                            ...params.inputProps,
                                                                            //placeholder: "HH:MM pm"
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        <Box className="row mt-4 ms-4">
                            <SwitchComponentForForm registerName={`lateSubmission`} onChangeSwitch={() => { }} checked={false} disabled={false} beforeLabel={''} afterLabel={'Allow Submission after due date'} />
                            {/* <SwitchComponentForForm registerName={`multipleAttempts`} onChangeSwitch={() => { }} checked={false} disabled={false} beforeLabel={''} afterLabel={'Allow Multiple Attempts'} /> */}
                        </Box>

                        {enableSteps?.includes('b') &&
                        <Box className="slectquestion mt-4 pb-5 stepperSection">
                            <Box className={`circle ${enableSteps?.includes('b') ? "active" : ""}`}>
                                <span>B</span>
                            </Box>

                            <Box className="qsnpaperdetails mt-2 w-100">
                                <h2>Select Question Paper Blueprint</h2>
                                <p>Blueprint for question paper generation</p>
                                {
                                    // enableSteps?.includes('b') &&
                                    <Box
                                        className="questionPaperBluePrintTableContainer"
                                    >
                                        <TableContainer
                                            ref={tableScroll}
                                            onScrollCapture={scrollHandler}
                                        >
                                            <Table stickyHeader >
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell></TableCell>
                                                        {tabValue?.map((headCell: any, index: any) => (
                                                            <TableCell
                                                                style={{
                                                                    color: "#a1a1a1",
                                                                    fontWeight: '500',
                                                                    fontSize: '12px',
                                                                    textTransform: "uppercase",
                                                                    whiteSpace: "nowrap",
                                                                    cursor: "pointer"
                                                                }}
                                                                key={index}
                                                                onClick={() => {
                                                                    if (headCell === "TOTAL MARKS") {
                                                                        sortToggle("marks")
                                                                    }
                                                                }}
                                                            >
                                                                <div className="tableHeadArrowSect">
                                                                    {headCell}
                                                                    {
                                                                        headCell === "TOTAL MARKS" && (<span className={`resrTableSortArrow ${getClassName(
                                                                            "marks"
                                                                        )}`}>
                                                                            <img style={{ paddingLeft: "10px" }} alt="" src={UpPolygon} />
                                                                            <img style={{ paddingLeft: "10px" }} alt="" src={Polygon} />
                                                                        </span>)}
                                                                </div>
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {tableData?.length > 0 && tableData?.map((data: any, index: any) => (
                                                        <TableRow>
                                                            <TableCell align="left">
                                                                <RadioGroup
                                                                    name="value"
                                                                    value={selectedRadioValue?.id}
                                                                    onChange={updateSelection}
                                                                >
                                                                    <FormControlLabel
                                                                        label={''}
                                                                        key={data.id}
                                                                        value={data.id}
                                                                        control={
                                                                            <Radio
                                                                                sx={{
                                                                                    ' &.Mui-checked': {
                                                                                        color: '#01B58A !important',
                                                                                    },
                                                                                }}
                                                                            />}

                                                                    />
                                                                </RadioGroup>
                                                            </TableCell>
                                                            <TableCell align="left">{data?.templateName}</TableCell>
                                                            <TableCell align="left">{data?.marks}</TableCell>
                                                            <TableCell align="left"> {data?.timeInMinutes} {data?.timeInMinutes > 1 ? "mins" : "min"}</TableCell>
                                                            <TableCell align="left">{data?.customCreatedBy}</TableCell>
                                                            <TableCell align="left">
                                                                <div style={{ display: "flex", color: "#01B58A", fontWeight: "600", cursor: 'pointer', gap: "10px" }} onClick={() => { clickActionHandler(data, true) }}>
                                                                    Preview
                                                                    <KeyboardArrowRightIcon />
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                }
                            </Box>
                            </Box>}

                        <Box className="button" style={{ textAlign: "right", paddingTop: "20px" }}>
                            <ButtonComponent type={"contained"} status={'submit'} label={`${enableSteps?.includes('b') ? "Generate Question paper" : 'Next'}`} textColor={"white"} buttonSize={"Large"} minWidth={"256"} backgroundColor={"#01B58A"} disabled={(enableSteps?.includes('b') && !methods?.getValues('radioValue'))} onClick={() => handleCheckValidation()} />
                            <ButtonComponent type={"outlined"} label={"Cancel"} textColor={"black"} buttonSize={"Large"} minWidth={"256"} onClick={() => { DiffFn() }} />
                        </Box>
                        {spinnerStatus && <Spinner />}
                        <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />
                    </div>
                </form>
            </FormProvider>
            {previewTemplateOpenStatus && <PreviewTemplate open={previewTemplateOpenStatus} handleClose={() => { setPreviewTemplateOpenStatus(false) }} previewJson={previewTemplateData} isAfterGenQP={isAfterGenQP} questionPaperDetails={questionPaperAllData} questionPaperID={questionPaperID} />}
            {continueEditing && <EditingModal open={continueEditing} onClose={() => { setcontinueEditing(false) }} pathname={state?.isFromTeacherWeb ? '/assess/teacher' : '/assess/evaluation/onlineAssesment'} isFromTeacherWeb={(!!paramGrade && !!paramCourseId && !!paramSectionId)} search={!state?.isFromTeacherWeb ? "?refreshFilter=true" : ""} />}
        </div>
    )
}

export default CreateNewOnlineTest