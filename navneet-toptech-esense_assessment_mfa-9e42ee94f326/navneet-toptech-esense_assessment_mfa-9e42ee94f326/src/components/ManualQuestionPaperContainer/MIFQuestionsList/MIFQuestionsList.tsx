import * as React from 'react';
import Box from '@mui/material/Box';
import paper, { Paper } from '@mui/material'
import Button from '@mui/material/Button';
import closeIcon from "../../../assets/images/closeIcon.svg";
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import "./MIFQuestionsList.css";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RadioButtonComponent from '../../SharedComponents/RadioButtonComponent/RadioButtonComponent';
import PreviewMultiSelectComponent from '../../SharedComponents/PrefixMultiSelectComponent/PrefixMultiSelectComponent';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import { getReplaceQnsTableApi, getReplaceQnsTablePreview } from '../../../Api/QuestionPaper';
import DropdownWithCheckbox from '../../SharedComponents/DropdownWithCheckbox/DropdownWithCheckbox';
import Spinner from '../../SharedComponents/Spinner';
import { baseFilterApi, chaptersWithTheme, createdByReplaceApi, getThemesApi, putReplaceApi, selectFieldApi, selectFieldQueTypeApi } from '../../../Api/AssessmentTypes';
import { getLocalStorageDataBasedOnKey } from '../../../constants/helper';
import { State } from '../../../types/assessment';
import { useForm, FormProvider } from "react-hook-form";
import PointFilter from '../../AssessmentsContainer/pointerFilter';
import ReplacePreviewModalComponent from '../MIFQuestionPaperOPTScreen/MIFReplacePreviewModalComponent';
import InputFieldComponentForForm from '../../SharedComponents/FormFieldComponents/InputFieldComponent';
import { FormControlLabel, RadioGroup } from "@mui/material";
import {Checkbox} from '@mui/material';
import PreviewModalImage from '../../AssessmentsContainer/CreateNewQuestion/PreviewModalComponent/PreviewModalImage';
import ClearFilter from "../../../assets/images/ClearFilter.svg"
import BlurClearFilter from "../../../assets/images/BlurClearFilter.svg"
import EmptyScreen from '../../SharedComponents/EmptyScreen/EmptyScreen';
import DropdownWithExpandCheckbox from '../../SharedComponents/DropdownWithCheckbox/DropdownWithExpandedCheckbox';
import SingleSelect from '../../SharedComponents/DropdownWithCheckbox/SingleSelect';
import TransitionsModal from './ModelQuestionList';
import { PAGE_SIZE } from '../../../constants/urls';
import InfiniteScroll from 'react-infinite-scroll-component';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    height: "650px"
};
type props = {
    replaceFilterObj: any,
    replace?: any,
    replaceQp?: any,
    ReqBody: any,
    setEnableBtn?: (enableBtn: boolean) => void
    enableBtn?: boolean
    setQuestions?: (questions: any[]) => void
    questions?: any[]
}
const MIFQuestionsList: React.FC<props> = ({ replaceFilterObj, ReqBody, replace, replaceQp,setEnableBtn,setQuestions }) => {
    const [preSetVal, setPreSetVal] = React.useState<any | null>({
        subjectId: [],
        themeId: [],
        chapterId: [],
        topicId: [],
        questionTypeIds: [],
        questionLevelIds: [],
        minMarks: "",
        maxMarks: "",
        createdById: [],
        marks:0,
        countOfQuestions:0
    })
    const [compPresetval, setCompval] = React.useState<any | null>({
        subjectId: [],
        themeId: [],
        chapterId: [],
        topicId: [],
        questionTypeIds: [],
        questionLevelIds: [],
        minMarks: "",
        maxMarks: "",
        createdById: [],
        marks:0,
        countOfQuestions:0
    })
    const [trigger, settrigger] = React.useState<boolean>(false)
    const [marksPreSet, setMarksPreSet] = React.useState<any | null>(null)
    const [paperId, setPaperId] = React.useState<any | null>(null)
    const [initialValues, setInitialValues] = React.useState({
        subjectId: replaceFilterObj.courseId,
        themeId: replaceFilterObj.themeId,
        chapterId: replaceFilterObj.chapterIds,
        topicId: [],
        questionTypeIds: [],
        questionLevelIds: [],
        minMarks: "",
        maxMarks: "",
        createdById: [],
        radioValue: "",
        textReplace: "",
        marks:"0",
        countOfQuestions:"0",
    })
    const methods = useForm<any>({
        defaultValues: initialValues,
        mode: "onBlur",
        reValidateMode: "onChange"
    });
    const [pgNo, setPgNo] = React.useState<number>(0)
    const [spinnerStatus, setSpinnerStatus] = React.useState(false);
    const [subject, setSubject] = React.useState<any[]>([])
    const [chapter, setChapter] = React.useState<any[]>([])
    const [theme, setTheme] = React.useState<any[]>([])
    const [topics, setTopics] = React.useState<any[]>([])
    const [QuestionType, setQuestionTypeData] = React.useState<any>([])
    const [questionLevel, setQuestionLevel] = React.useState<string[]>([])
    const [createdBy, setCreatedBy] = React.useState<any[]>([])
    const [minMaxCall, setMinMaxCall] = React.useState<boolean>(false)
    const [selectedRadioValue, setSelectedRadioValue] = React.useState({ id: '' })
    const [openPreviewImg, setOpenPreviewImg] = React.useState<boolean>(false)
    const [imgContent, setImgContent] = React.useState<string>("")
    const [tableRowSelected, setTableRowSelected] = React.useState<any[]>([]);
    const [openTransitionModal,setOpenTransitionModal] = React.useState(false)
    const [DataForModal,setDataForModal]= React.useState<any>([])
    const [loadMore, setLoadMore] = React.useState(true)
    const[totalPage,setTotalPage]=React.useState<number>(0)
    const [postObj, setpostObj] = React.useState<any>({
        subjectId: [],
        chapterId: [],
        themeId: [],
        topicId: [],
        questionTypeIds: [],
        questionLevelIds: [],
        minMarks: "",
        maxMarks: "",
        createdById: [],
        radioValue: "",
        textReplace: "",
        marks:0,
        countOfQuestions:0
    })
    let excludeId: any = [];

    const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;

    const [tabledata, settabledata] = React.useState<any[]>([])
    const [allFilters, setAllFilters] = React.useState<any>()
    const infiniteScrollRef  = React.useRef(null)

    const maxGreatMin = (+postObj?.maxMarks > +postObj?.minMarks || +postObj?.minMarks == +postObj?.maxMarks) ? true : false;
    const mincondiCheck = postObj?.minMarks && +postObj?.minMarks > 0 && (maxGreatMin) ? true : false;
    const maxcondiCheck = postObj?.maxMarks && +postObj?.maxMarks > 0 && (maxGreatMin) ? true : false;
    const minMaxApiHandler = () => {
        if (minMaxCall) {
            if (mincondiCheck && maxcondiCheck) {
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    }

    // const excludeQns = ( ) => {
    //     const traverseJson = (obj:any) => {
    //       for (const key in obj) {
    //         if (typeof obj[key] === "object" && obj[key] !== null) {
    //           if (
    //             obj[key].hasOwnProperty("questionInfo") && obj[key]?.type === "Question"
    //           ) {
    //             if( obj[key]?.questionInfo && obj[key]?.questionInfo?.id){
    //                 excludeId = Array.from(
    //                     new Set([...excludeId,obj[key]?.questionInfo?.id]))
    //             }

    //           }
    //           traverseJson(obj[key]);
    //         }
    //       }
    //     };
    //     traverseJson(ReqBody);
    //   };

    const getReplaceQnsTableData = async (isScroll?: boolean) => {
            // excludeQns();
        const markHandler = minMaxApiHandler();
        if (methods?.getValues("createdById").length > 0) {
            if(!isScroll && infiniteScrollRef.current){
                (infiniteScrollRef.current as any).el.scrollTop = 0;
            }
            setSpinnerStatus(true)
            setLoadMore(true)
            const params = {
                "pageNo":  isScroll ? pgNo : 0,
                "pageSize": PAGE_SIZE,
                "questionTypeIds": methods?.getValues("questionTypeIds").toString() || null,
                "published": true,
                "gradeIds": replace?.gradeID,
                "subjectIds": methods?.getValues("subjectId").toString() || null,
                "chapterIds": methods?.getValues("chapterId").toString() || null,
                "themeIds": methods?.getValues("themeId").toString() || null,
                "topicIds": methods?.getValues("topicId").toString() || null,
                "minMarks": mincondiCheck ? postObj?.minMarks : null,
                "maxMarks": maxcondiCheck ? postObj?.maxMarks : null,
                "questionLevelIds": methods?.getValues("questionLevelIds").toString() || null,
                "createdByIds": methods?.getValues("createdById").toString() || null,
                "text": methods?.getValues("textReplace") || null,
                "forQPListing": true,
                "isPublic": true,
                "excludedQIds": excludeId.toString()
            }
            if (!params.maxMarks) {
                params.minMarks = null
            }
            if (!params.minMarks) {
                params.maxMarks = null
            }
            const res = await getReplaceQnsTableApi(params)
            if(res?.baseResponse?.data){
                setSpinnerStatus(false)
                methods?.setValue("radioValue", "")
                setSelectedRadioValue({ id: '' })
                const selectedIds = tableRowSelected.map((el: any) => el.id)
                const resIds = res?.baseResponse?.data.map((el: any) => el.id)
                const filteredSelectedRow = tableRowSelected.filter((el: any) => resIds.includes(el.id))
                const filteredResRow =  res?.baseResponse?.data.filter((el: any) => !selectedIds.includes(el.id))
                const tableData = [...filteredSelectedRow, ...filteredResRow]
                setTotalPage(res.totalPages)
                settabledata(isScroll ? [...tabledata, ...tableData] : tableData)
                // }else{
                //     settabledata(tableRowSelected)
                // }
                // methods?.setValue('marks', "0")
                // methods?.setValue('countOfQuestions', "0")
                // setTableRowSelected([])
                setTimeout(() => {
                    setSpinnerStatus(false)
                }, 300)
            } else {
                setSpinnerStatus(false)
                settabledata([]);
            }
          
        }
    }

    const subApiCall = async (gradeId: any) => {
        setSpinnerStatus(true)
        if (replace?.gradeID) {
            const response: any = await baseFilterApi("subjects", { "gradeId": replace?.gradeID && [replace?.gradeID], "publicationId": 0, "staffId": stateDetails.login.userData.userRefId })
            if (response.status == '200') {
                setSubject(response.data)
            }
        }
        setTimeout(() => {
            setSpinnerStatus(false)
        }, 2000)
    }
    const getThemes = async (value: any) => {
        setSpinnerStatus(true)
        if (value) {
            try {
                const response: any = await getThemesApi({ "subjectId": value })
                if (response?.status == 200) {
                    let subjectWithTheme = [] as any;
                    value?.map((ele: number) => {
                        let subWithTheme = {
                            label: subject?.find((x: any) => (ele == (x?.courseId)))?.courseName,
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
            }
        }
        setTimeout(() => {
            setSpinnerStatus(false)
        }, 2000)
    }
    const chapterApi = async (list: any[] | null, element: number[]) => {
        setSpinnerStatus(true)
        if (element?.length > 0) {
            const response = await baseFilterApi("chapters", { "gradeId": replace?.gradeID && [replace?.gradeID], "courseId": element, "staffId": stateDetails.login.userData.userRefId })
            if (response.status == 200) {
                let subjectWithChapter = [] as any;
                element?.map((ele: number) => {
                    let courseAndChapter =
                    {
                        label: subject?.find((x: any) => (ele == x?.courseId))?.courseDisplayName,
                        value: ele,
                        childOptions: response?.data?.filter((b: any) => (b?.courseId == ele)).map((x: any) => {
                            return { label: x?.chapterName, value: x?.chapterId }
                        })
                    }
                    subjectWithChapter.push(courseAndChapter)
                })
                setChapter(subjectWithChapter?.filter((x: any) => x?.childOptions?.length > 0))
            }
            // await getThemes(element)
        } else {
            setChapter([])
            setTheme([])
            setTopics([])
            methods.setValue("topicId", '')
            methods.setValue("themeId", '')
            methods.setValue("chapterId", '')
        }
        setTimeout(() => {
            setSpinnerStatus(false)
        }, 2000)
    }
    const TopicApi = async (list: any[] | null, element: number[]) => {
        if (element?.length > 0) {
            setSpinnerStatus(true)
            const response = await baseFilterApi("topics", { "gradeId": replace?.gradeID && [replace?.gradeID], "courseId": methods.getValues("subjectId") && methods.getValues("subjectId"), "chapterId": element, "staffId": stateDetails.login.userData.userRefId })
            if (response.status == 200) {
                setTopics(response.data)
            }
            setTimeout(() => {
                setSpinnerStatus(false)
            }, 2000)
        } else {
            setTopics([])
            methods.setValue("topicId", '')
        }
    }
    const addCourseNameQT = ((QTData:any) => {
        QTData.map((items:any) => {
            items.title = items.title + " ( "+ items.courseName + " )"
        })
        return QTData
    }) 

    const QuestionTypeApi = async (param: string) => {
        setSpinnerStatus(true)
        try {
            const response = await selectFieldQueTypeApi(`&subjectIds=${param}`)
            if (response && response?.baseResponse && response?.baseResponse?.data?.length) {
                setQuestionTypeData(addCourseNameQT(response?.baseResponse?.data))
            } else {
                setQuestionTypeData([])
            }
        } catch (err) {
            console.log(err)
        }
        setTimeout(() => {
            setSpinnerStatus(false)
        }, 2000)
    }
    const QuestionLevelApi = async () => {
        setSpinnerStatus(true)
        try {
            const response = await selectFieldApi("referencedata/question/levels")
            if (response && response !== undefined) {
                setQuestionLevel(response)
            } else {
                setQuestionLevel([])
            }
        } catch (err) {
            console.log(err)
        }
        setTimeout(() => {
            setSpinnerStatus(false)
        }, 2000)
    }
    const createdByApi = async () => {
        setSpinnerStatus(true)
        try {
            const response = await createdByReplaceApi("referencedata/question/createdBy")
            if (response && response !== undefined) {
                setCreatedBy(response)
                const val: any = (typeof (replaceFilterObj?.questionInfo?.isNTTQuestion) === 'boolean') ? (replaceFilterObj?.questionInfo?.isNTTQuestion ? 1 : 2) : null
                const createBy: any = val ? response?.filter((x: any) => (x?.id == val)).map((y: any) => y.id) : response?.map((x: any) => x?.id)
                setPreSetVal((prev: any) => ({ ...prev, "createdById": createBy }))
                setCompval((prev: any) => ({ ...prev, "createdById": createBy }))
            } else {
                setCreatedBy([])
            }
        } catch (err) {
            console.log(err)
        }
        setTimeout(() => {
            setSpinnerStatus(false)
        }, 2000)
    }
    const filterPostObj = {
        subjectId: methods?.getValues("subjectId"),
        themeId: methods?.getValues("themeId") ? methods?.getValues("themeId") : [],
        chapterId: methods?.getValues("chapterId"),
        topicId: methods?.getValues("topicId"),
        questionTypeIds: methods?.getValues("questionTypeIds"),
        questionLevelIds: methods?.getValues("questionLevelIds"),
        minMarks: postObj?.minMarks || "",
        maxMarks: postObj?.maxMarks || "",
        createdById: methods?.getValues("createdById"),
        marks: parseInt(methods?.getValues('marks')),
        countOfQuestions: parseInt(methods.getValues("countOfQuestions"))
    }
    const enableOverAllClearFilter: boolean = JSON.stringify(compPresetval) === JSON.stringify(filterPostObj) ? false : true;
    const changeHandler = async (e: any, data: string) => {
        setPgNo(0)
        switch (data as string) {
            case 'textReplace':
                methods?.setValue('textReplace', e)
                setpostObj((prev: any) => ({ ...prev, text: e }))
                break
            case 'subject':
                methods?.setValue('subjectId', e)
                setpostObj((prev: any) => ({ ...prev, subjectId: e }))
                chapterApi(null, e);
                break
            case 'theme':
                if(JSON.stringify(postObj.themeId) != JSON.stringify(e)){
                    setpostObj((prev: any) => ({ ...prev, themeId: e }))
                    methods?.setValue('themeId', e)
                }
                break
            case 'Chapter':
                if(JSON.stringify(postObj.themeId) != JSON.stringify(e)){
                    methods?.setValue('chapterId', e)
                    setpostObj((prev: any) => ({ ...prev, chapterId: e }))
                    TopicApi(null, e)
                }
                break
            case 'topic':
                methods?.setValue('topicId', e)
                setpostObj((prev: any) => ({ ...prev, topicId: e }))
                break
            case 'questionTypeIds':
                methods?.setValue('questionTypeIds', e)
                setpostObj((prev: any) => ({ ...prev, questionTypeIds: e }))
                break
            case 'questionLevelIds':
                methods?.setValue('questionLevelIds', e)
                setpostObj((prev: any) => ({ ...prev, questionLevelIds: e }))
                break
            case 'createdBy':
                methods?.setValue('createdById', e)
                setpostObj((prev: any) => ({ ...prev, createdById: e }))
                break
            case 'marks':
                methods?.setValue('marks', e)
                // setpostObj((prev: any) => ({ ...prev, createdById: e }))
                break
            case 'countOfQuestions':
                methods?.setValue('countOfQuestions', e)
                // setpostObj((prev: any) => ({ ...prev, createdById: e }))
                break    
        }
    }
    const getQueryPoints = (param: string, type: string) => {
        setMinMaxCall(true)
        if (type == "min") {
            setpostObj((prev: any) => ({ ...prev, minMarks: param }))
        }
        if (type == "max") {
            setpostObj((prev: any) => ({ ...prev, maxMarks: param }))
        }
        if (type == "empty") {
            setpostObj((prev: any) => ({ ...prev, maxMarks: "", minMarks: "" }))
            if ((postObj?.minMarks == "" && postObj?.maxMarks == "")) {
                getReplaceQnsTableData()
                setMinMaxCall(false)
            }
        }
    }
    const updateSelection = (event: any, value: any) => {
        if (typeof (event) !== "string") {
            event.persist();
        }
        setSelectedRadioValue({ id: value });
        methods?.setValue('radioValue', value);
        if (event === "prev") {
            setSpinnerStatus(true)
            putReplaceApiCall()
        }
    };

    const findAndReplaceData = (
        json: any,
        mainKey: any,
        mainValue: any,
        secondKey: any,
        secondValue: any
    ) => {
        const traverseJson = (obj: any) => {
            for (const key in obj) {
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    if (
                        obj[key][mainKey] &&
                        obj[key][mainKey][secondKey] === mainValue[secondKey]
                    ) {
                        const replacementObject = tabledata.find(
                            (item: any) => item[secondKey] === secondValue
                        );
                        if (replacementObject) {
                            obj[key][mainKey] = replacementObject;
                        }
                    }
                    traverseJson(obj[key]);
                }
            }
        };

        // Create a deep copy of the json object
        const updatedJson = JSON.parse(JSON.stringify(json));

        traverseJson(updatedJson);
        return { updatedJson, originalJson: json };
    };


    const putReplaceApiCall = async () => {
        if (methods?.getValues("radioValue") && paperId && replaceFilterObj?.questionInfo?.id) {
            const { updatedJson, originalJson } = findAndReplaceData(
                ReqBody,
                "questionInfo",
                { id: replaceFilterObj?.questionInfo?.id },
                "id",
                +methods?.getValues("radioValue")
            );
            replaceQp(updatedJson)

            setSpinnerStatus(false)
        }
    }
    (window as any).handleClick = (key: any, event: any) => {
        event.preventDefault()
        setOpenPreviewImg(true)
        setImgContent(key)
    };

    const getQuestionTitle = (dataList: any) => {
        let str = dataList?.question;
        dataList?.questionImageDetails?.forEach((questionImage: any) => {
            str = str?.replace(
                `{{${questionImage?.key}}}`,
                `<a href="${questionImage?.src}" onclick="handleClick('${questionImage?.src}',event)" style="margin-top:10px">${questionImage?.tag}</a>`
            );
        });
        return str;
    };
    const selectRandomHandler = () => {
        const availarrLen = tabledata?.length
        const random = Math.floor(Math.random() * availarrLen);
        setSelectedRadioValue({ id: tabledata[random]?.id });
        methods?.setValue('radioValue', tabledata[random]?.id);
    }

    // const chaptersThemeData=async()=>{
    //     const postObj={
    //         "gradeId": [replace?.gradeID],
    //         "courseId":replaceFilterObj?.courseId
    //     }
    //     const response = await chaptersWithTheme(postObj)
    //     console.log("response========",response)
    // }

    // React.useEffect(()=>{ 
    //     chaptersThemeData() 
    // },[replace?.gradeID])
    
    React.useEffect(() => {
        if (postObj?.minMarks && postObj?.maxMarks) {
            getReplaceQnsTableData();
        }
        if ((postObj?.minMarks == "" && postObj?.maxMarks == "")) {
            getReplaceQnsTableData();
            setMinMaxCall(false)
        }
    }, [postObj?.minMarks, postObj?.maxMarks])

    React.useEffect(() => {
        if (replace?.gradeID) {
            subApiCall(replace?.gradeID)
            QuestionLevelApi()
            createdByApi()
        }
    }, [replace?.gradeID])
    React.useEffect(() => {
        if (replace?.gradeID) {
            getReplaceQnsTableData()
        }
    }, [postObj])
    React.useEffect(() => {
        getReplaceQnsTableData(true)
    }, [pgNo])
    React.useEffect(() => {
        setPaperId(replace?.paperId)
    }, [replace?.paperId])

    React.useEffect(() => {
        presetValueHandler()
    }, [replaceFilterObj])

    React.useEffect(() => {
        QuestionTypeApi(methods?.getValues("subjectId"))
        chapterApi(null, methods?.getValues("subjectId"));
    }, [methods?.getValues("subjectId")])

    React.useEffect(() => {
        TopicApi(null, methods?.getValues("chapterId"))
    }, [methods?.getValues("chapterId")]) 

    const [replacePreviewClose, setReplacePreviewClose] = React.useState(false)
    const [replacePreviewData, setReplacePreviewData] = React.useState<any>();

    const replacePreview = async (id: string) => {
        const params = {
            "questionTypeIds": methods?.getValues("questionTypeIds").toString() || "",
            "published": true,
            "gradeIds": replace?.gradeID,
            "subjectIds": methods?.getValues("subjectId").toString() || "",
            "chapterIds": methods?.getValues("chapterId").toString() || "",
            "themeIds": methods?.getValues("themeId").toString() || "",
            "topicIds": methods?.getValues("topicId").toString() || "",
            "minMarks": mincondiCheck ? postObj?.minMarks : "",
            "maxMarks": maxcondiCheck ? postObj?.maxMarks : "",
            "questionLevelIds": methods?.getValues("questionLevelIds").toString() || "",
            "createdByIds": methods?.getValues("createdById").toString() || "",
            "text": methods?.getValues("textReplace") || "",
            "forQPListing": true,
            "isPublic": true,
            "excludedQIds": ""
        }
        setAllFilters(params)
        const previewData = await getReplaceQnsTablePreview(id)
        setReplacePreviewData(previewData?.data)
        setReplacePreviewClose(true)
    }
    const presetValueHandler = () => {
        settrigger((prev: boolean) => !prev)
        setPreSetVal((prev: any) => ({
            ...prev,
            "subjectId": replaceFilterObj?.courseId,
            "themeId": replaceFilterObj?.themeId,
            "chapterId": replaceFilterObj?.chapterIds,
            "minMarks": "",
            "maxMarks": ""
        }))
    }

    const handleCheck = (checkStatus: boolean, data: any) => {
        let newQuestion = tableRowSelected
        if(checkStatus){
            newQuestion = [...tableRowSelected, data]
        }else{
            newQuestion = tableRowSelected.filter((el) => el.id != data.id)
        }
        setTableRowSelected(newQuestion)
        setQuestions?.(newQuestion)
        const newMarks = newQuestion.reduce((preVal, newVal) => preVal + newVal.marks, 0)
        if(!newQuestion.length){
            methods.setValue("countOfQuestions", "0")
            methods.setValue("marks", "0")
            setEnableBtn?.(true)
        }else{
            setEnableBtn?.(false)
            methods.setValue("countOfQuestions", newQuestion.length)
            methods.setValue("marks", newMarks)
        }
    }

    const handleSelected=(data:any)=>{
        handleCheck(true, data)
    }

    const endIconOnClick=(data:any)=>{
        let rowSelected=tableRowSelected
        if(rowSelected.length>0){
            setOpenTransitionModal(true)
            setDataForModal(rowSelected)
        }
    }

    const extractContent = (html: any) => {
        let span = document.createElement('span');
        span.innerHTML = html;
        const text = span.textContent || span.innerText
        span.remove()
        return text;
    }

    const fetchMoreData = async () => {
        if (pgNo+1 >= totalPage) {
            setLoadMore(false)
        } else {
            setPgNo((totalPage) > pgNo ? pgNo + 1 : pgNo);
        }
    };
    return (
        <div>
            <div >
                <Box sx={style} className='MIFReplaceQuestionModal'>
                    <FormProvider {...methods} >
                        <div className='MIFReplaceQuestionsContent'>
                            {/* <h2 className='replaceQuestionsHeading'>Replace Questions</h2>
                            <p className='replaceQuestionsSubHeading'>Select the question that you want to replace on the generated question paper</p> */}

                            <div className='d-flex MIFlistSearchSect mt-4 pt-3' style={{ gap: "10px" }}>
                                <div className='w-70'><InputFieldComponentForForm className={'searchIcon'} registerName={'textReplace'} inputType={"text"} label={"Search for Questions..."} required={false} onChange={() => { }} onChangehandle={(e: any) => changeHandler(e, 'textReplace')} inputSize={"Large"} variant={"searchIcon"} /></div>
                                <div className='selectMultiCreatedBy w-30'><DropdownWithCheckbox trigger={trigger} setCompval={setCompval} setpostObj={setpostObj} preSetVal={preSetVal} registerName="createdById" required={true} value={methods?.getValues('createdById')} variant={'fill'} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'createdBy')} selectLabel={'Created By'} selectList={createdBy} disabled={createdBy.length > 0 ? false : true} mandatory={true} showableLabel={"title"} showableData={"id"} menuHeader={"Select Created By"} flag={true} /></div>
                            </div>
                            {methods?.getValues("createdById").length === 0 && !spinnerStatus && <div style={{ "textAlign": "right", "fontSize": "14px", "color": "red", "paddingRight": "5px" }}><span>*Atleast one selection is mandatory</span></div>}
                            <div className='col-12 d-flex justify-content-between py-3' style={{ gap: '10px' }}>
                            <div className='selectMultiSubject w-100'><DropdownWithCheckbox  trigger={trigger} setCompval={setCompval} setpostObj={setpostObj} preSetVal={preSetVal} registerName="subjectId"  required={true}  value={methods?.getValues('subjectId')} variant={'fill'} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'subject')} selectLabel={'Subject'} selectList={subject} mandatory={true} showableLabel={"courseDisplayName"} showableData={"courseId"} menuHeader={"Select Subject"} flag={true} /></div>
                                {/* <div className={`selectMultiTheme w-100 ${(theme.length == 0 && methods?.getValues('subjectId')?.length > 0) ? 'd-none' : ''}`}><DropdownWithExpandCheckbox trigger={trigger} setCompval={setCompval} setpostObj={setpostObj} preSetVal={preSetVal} registerName="themeId" required={(theme?.length > 0 && methods?.getValues('subjectId')?.length > 0) ? true : false} variant={'fill'} value={methods?.getValues('themeId')} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'theme')} selectLabel={'Theme'} selectList={theme} disabled={theme.length > 0 ? false : true} mandatory={true} showableLabel={"syllabusName"} showableData={"syllabusID"} menuHeader={"Select Theme*"} /></div> */}
                                <div className='selectMultiChapter w-100'><DropdownWithExpandCheckbox setCompval={setCompval} setpostObj={setpostObj} trigger={trigger} preSetVal={preSetVal} registerName="chapterId" required={true} variant={'fill'} value={methods?.getValues('chapterId')} selectedValue={''} clickHandler={(e: any) => changeHandler(e, 'Chapter')} selectLabel={'Chapter'} selectList={chapter} disabled={chapter.length > 0 ? false : true} mandatory={true} showableLabel={"chapterName"} showableData={"chapterId"} menuHeader={"Select Chapter"} flag={true} /></div>
                                <div className='selectMultiTopic w-100'><DropdownWithCheckbox setCompval={setCompval} setpostObj={setpostObj} trigger={trigger} preSetVal={preSetVal} registerName="topicId" required={true} variant={'fill'} value={methods?.getValues('topicId')} selectedValue={''} clickHandler={(e: any) => { changeHandler(e, 'topic') }} selectLabel={'Topic'} selectList={topics} disabled={topics.length > 0 ? false : true} mandatory={true} showableLabel={"topicNameWithChapter"} showableData={"topicId"} menuHeader={"Select Topic"} flag={true}/></div>
                            </div>
                            <div className='col-12 d-flex ' style={{ gap: '10px' }}>
                                <div className='selectMultiQuestionType w-100'><DropdownWithCheckbox setCompval={setCompval} trigger={trigger} setpostObj={setpostObj} preSetVal={preSetVal} registerName="questionTypeIds" required={true} variant={'fill'} value={methods?.getValues('questionTypeIds')} selectedValue={''} selectList={QuestionType} clickHandler={(e: any) => changeHandler(e, "questionTypeIds")} selectLabel={"Question Type"} disabled={false} mandatory={true} showableLabel={"title"} showableData={"id"} menuHeader={"Select Question Type"} flag={true} /></div>
                                <div className='selectMultiQuestionLevel w-100'><DropdownWithCheckbox setCompval={setCompval} trigger={trigger} setpostObj={setpostObj} preSetVal={preSetVal} registerName="questionLevelIds" required={true} variant={'fill'} value={methods?.getValues('questionLevelIds')} selectedValue={''} selectList={questionLevel} clickHandler={(e: any) => changeHandler(e, "questionLevelIds")} selectLabel={"Difficulty"} disabled={false} mandatory={true} showableLabel={"level"} showableData={"id"} menuHeader={"Select Question Type"} flag={true} /></div>
                                <div className='selectMultiMarks w-70'><PointFilter trigger={trigger} getQueryPoints={(param: string, type: string) => { getQueryPoints(param, type) }} disable={false} preSetVal={marksPreSet} label={"marks"} nullable={true} /></div>
                                <div>{enableOverAllClearFilter ? <img style={{cursor: "pointer"}} src={ClearFilter} onClick={() => { presetValueHandler() }} /> : <img src={BlurClearFilter} />} </div>
                            </div>
                            <div className='d-flex MIFlistSearchSect mt-4 pb-3' style={{ gap: "8px" }}>
                                <div className='w-50'><InputFieldComponentForForm readOnly className={'inputBackgraound'} registerName={'countOfQuestions'} inputType={"text"} label={"Total Selected Questions"} required={false} onChange={() => { }} onChangehandle={(e: any) => changeHandler(e, 'countOfQuestions')} inputSize={"Large"} variant={""} endIconOnClick={(e:any) => endIconOnClick(e)} iconFlag={tableRowSelected.length>0 ? true : false} /></div>
                                <div className='w-50'><InputFieldComponentForForm readOnly className={'inputBackgraound'} registerName={'marks'} inputType={"text"} label={"Calculated Marks"} required={false} onChange={() => { }} onChangehandle={(e: any) => changeHandler(e, 'marks')} inputSize={"Large"} variant={""}/></div>
                            </div>

                            { tabledata?.length > 0 ?
                             <InfiniteScroll
                             dataLength={tabledata.length}
                             next={fetchMoreData}
                             hasMore={loadMore}
                             loader={spinnerStatus&&<Spinner/>}
                             height={600}
                            //  endMessage={
                            //     <p style={{ textAlign: 'center'}}>
                            //       <b>Yay! You have seen it all</b>
                            //     </p>
                            //   }
                             className="infiniteGridView"
                             ref={infiniteScrollRef}
                         >
                                <TableContainer sx={{marginTop:'10px', border:"1px solid #DEDEDE"}} >
                                    <Table stickyHeader>
                                        <TableHead >
                                            <TableRow>
                                                <TableCell ></TableCell>
                                                <TableCell >
                                                    <div className="tableheaddata">
                                                        question
                                                    </div>
                                                </TableCell>
                                                <TableCell >
                                                    <div className="tableheaddata">
                                                        marks
                                                    </div>
                                                </TableCell>
                                                <TableCell >
                                                    <div className="tableheaddata">
                                                        created by
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="tableheaddata">Actions</div>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                       
                                            <TableBody >
                                                { tabledata.length > 0 && tabledata?.map((data) => (
                                                    <TableRow>
                                                        <TableCell >
                                                            <FormControlLabel
                                                                label={''}
                                                                key={data.id}
                                                                value={data.id}
                                                                onChange={(e: any) => handleCheck(e.target.checked,data)}
                                                                checked={tableRowSelected.find(el => el.id === data.id) || false}
                                                                control={
                                                                    <Checkbox
                                                                        sx={{
                                                                            ' &.Mui-checked': {
                                                                                color: '#01B58A !important',
                                                                            },
                                                                            marginTop:'-10px'
                                                                        }}
                                                                        
                                                                    />}
                                                            />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className={`${data?.question.indexOf("<table>") > -1 ? "replaceQuestionListSect tableDataQuestion" : "tableDataQuestion"}`} style={{ height: '38px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                                                            <div style={{ flex: '1', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, textOverflow: 'ellipsis', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                                <div dangerouslySetInnerHTML={{ __html: getQuestionTitle(data) }}></div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            {data.marks}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='tableDataCreatedBy'>
                                                            {data.createdByUser}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <div onClick={() => { replacePreview(data?.id) }} style={{ display: "flex", color: "#01B58A", gap: '17px', cursor: "pointer" }}>
                                                            Preview
                                                            <KeyboardArrowRightIcon />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                        </TableBody>

                                    </Table>
                                </TableContainer>
                                </InfiniteScroll>
                                :
                                <EmptyScreen style={{ "height": "200px" }} title={'No available questions'} desc={'Please contact your Navneet TopTech Representative'} />
                            }

                            <div>

                            </div>
                        </div>
                    </FormProvider>
                    {spinnerStatus && <Spinner />}
                </Box>

            </div>
          
            {openPreviewImg && <PreviewModalImage header={''} openPreview={openPreviewImg} setOpenPreview={setOpenPreviewImg} content={imgContent} setContent={setImgContent} />}
            {(replacePreviewClose && replacePreviewData) && <ReplacePreviewModalComponent checked={tableRowSelected.some(data=>data.id===replacePreviewData.id)} manual={"Select"} header={''} modelOpen={replacePreviewClose} setOpenPreview={setReplacePreviewClose} selectedData={replacePreviewData} updateSelection={updateSelection} setSelected={(selectedData)=> handleSelected(selectedData)} allFilters={allFilters}  />}
            {openTransitionModal && <TransitionsModal handleOpen={openTransitionModal} handleClose={()=>setOpenTransitionModal(false)} selectedData={DataForModal} getQuestionTitle={getQuestionTitle}/>}
        </div>
    );

}

function areEqual(prevProps:any, nextProps:any) {
    /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
   return true
  }

export default React.memo(MIFQuestionsList,areEqual);