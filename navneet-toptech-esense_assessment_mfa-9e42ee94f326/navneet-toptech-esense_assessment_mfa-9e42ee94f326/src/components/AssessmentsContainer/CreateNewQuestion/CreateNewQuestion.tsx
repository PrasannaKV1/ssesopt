import React, { useEffect, useState,useRef } from 'react';
import styles from "./CreateNewQuestion.module.css";
import goBack from "../../../assets/images/goBack.svg"
import QuestionBody from './QuestionBody/QuestionBody';
import { useLocation, useNavigate } from 'react-router-dom';
import InformativeIconComponent from '../../SharedComponents/InformativeIconComponent/InformativeIconComponent';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import { useForm, FormProvider } from "react-hook-form";
import SelectBoxComponentForForm from '../../SharedComponents/FormFieldComponents/SelectBoxComponent';
import SwitchComponentForForm from '../../SharedComponents/FormFieldComponents/SwitchComponentForForm';
import MatchFollowing from './QuestionBody/MatchFollowing';
import FillInTheBlanks from './QuestionComponent/FillInTheBlanks';
import { Topics, Subject,Chapter, Theme, Grade } from '../../../interface/filters';
import { baseFilterApi,  baseGradeApi, comprehensivePostApiCall, getQuestionApi, getThemesApi, postMatchTheFollowingApi, postQuestionApi, questionPutApi, questionPutApiForComprehensive, questionPutApiForMTF, selectFieldApi, selectFieldQueTypeApi } from '../../../Api/AssessmentTypes';
import ModalPopup from '../../SharedComponents/ModalPopup/ModalPopup';
import Toaster from '../../SharedComponents/Toaster/Toaster';
import { AlertColor } from '@mui/material';
import Spinner from '../../SharedComponents/Spinner';
import TextEditorForForm from '../../SharedComponents/FormFieldComponents/TextEditor';
import AddIcon from '@mui/icons-material/Add';
import { ReactComponent as Delete } from "../../../assets/images/delete.svg";
import DeleteModalComponent from '../../SharedComponents/DeleteModalComponent/DeleteModalComponent';
import { arrangingDataWithQuestionType, getUpdatedMTFOptions, getUpdatedOptions, getWholeImageArray,hintApproachRTEhandler, getuploadPathWithQuestion, removeUploadsFromText } from '../../../constants/helperFunctions';
import ModalPopupDuplicate from '../../SharedComponents/ModalPopup/duplicateModalPopup';
import EditingModal from '../../../components/SharedComponents/ModalPopup/EditingModal'
import { getLocalStorageDataBasedOnKey } from '../../../constants/helper';
import { State } from '../../../types/assessment';
import DynamicModalPopup from '../../SharedComponents/ModalPopup/DynamicModalPopup';
import { popupMessages } from '../../../constants';
import Selectsearch from '../../SharedComponents/FormFieldComponents/selectComponent';
import InputFieldComponentForForm from '../../SharedComponents/FormFieldComponents/InputFieldComponent';
interface Props {
    edit?: boolean
    isDuplicate?: boolean
}

const CreateNewQuestion: React.FC<Props> = ({ edit,isDuplicate }) => {
    let shouldLog = useRef(true)
    const [isEdit, setisEdit] = useState<boolean>(edit ? edit :false)
    let history = useNavigate();
    const { state } = useLocation();
    const [questionTypeData, setQuestionTypeData] = useState<any>([])
    const [comprehensiveQuestionTypeData, setComprehensiveQuestionTypeData] = useState<any>([])
    const [questionInitialValues, setquestionInitialValues] = useState<any>([])
    const [topics, setTopics] = useState<Topics[]>([])
    const [subject, setSubject] = useState<Subject[]>([])
    const [theme, setTheme] = useState<Theme[]>([])
    const [chapter, setChapter] = useState<Chapter[]>([])
    const [grades, setGrades] = useState<Grade[]>([])
    const [addNewToggler, setAddNewToggler] = useState<boolean>(false)
    const [addNew, setAddNew] = useState<boolean>(false)
    const [initialValues, setInitialValues] = useState({
        questionTypeMasterId: "",
        question: "",
        isPublic: false,
        marks: "",
        completionTime: "",
        questionLevelId: "",
        questionObjectiveId: "",
        questionErrorTypes: [],
        isOptions: true,
        questionOptions: [],
        hint: "",
        approach: "",
        gradeId: "",
        subjectId: "",
        themeId: "",
        chapterId: "",
        topicId: "",
        solution: ""
    })
    const [cloneData, setCloneData] = useState({} as object)
    const methods = useForm<any>({
        defaultValues: initialValues,
        mode: "onBlur",
        reValidateMode: "onChange"
    });
    const [questionType, setQuestionType] = useState("")
    const tooltipText = "<b>Private</b>: Only you can see the private questions <br> <b>Public</b>: Other subject teachers of the same subject can see public questions(They cannot be edited or deleted)"
    const defaultQUestionTypes = ["MCQ", "Subjective", "Match The Following", "Fill in the blanks", "Comprehensive"]
    const [snackBar, setSnackBar] = useState<boolean>(false);
    const [snackBarText, setSnackBarText] = useState<string>("");
    const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("success");
    const [spinnerStatus, setSpinnerStatus] = useState(false);
    const [data, setData] = useState<any>([])
    const [deleteComprehensiveModal, setDeleteComprehensiveModal] = useState<boolean>(false)
    const [deletableQuestion, setDeletableQuestion] = useState<number>(0)
    const [dupliacteEntry,setDuplicateEntry] = useState<boolean>(false)
    const [continueEditing,setcontinueEditing] = useState<boolean>(false)
    const [saveAndCon,setSaveAndCon] = useState<boolean>(false)
    const [gradeChangePopup,setGradeChangePopup] = useState<boolean>(false)
    const [subjectChangePopup,setSubjectChangePopup] = useState<boolean>(false)
    const [questionChangePopup,setQuestionChangePopup] = useState<boolean>(false)
    const [latestId,setLatestId] = useState<any>({})
    const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;
    const [quesTypeEnabled,setQuesTypeEnabled] = useState<boolean>(false)
    const [preventFirstRenderA, setPreventFirstRenderA] = useState<number>(0)
    const [preventFirstRenderB, setPreventFirstRenderB ]=useState<number>(0)
    const [errorSupport,setErrorSupport]=useState<boolean>(false)
    const [disableBtn, setDisableBtnBtn] = useState<boolean>(false)
    const[questionLevel,setQuestionLevel] = useState<any>([])
    const[objective,setObjective] = useState<any>([])
    const [key, setKey] = useState<number>(0)
    const [isQTChange, setQTChange] = useState<boolean>(false)
    const [cloneduplicateData, setCloneduplicateData] = useState<any>({})

    /*Grades API*/
    const gradesAPI = async (editData: any={}) => {
        setSpinnerStatus(true)
        try {            
            const response = await baseGradeApi("staffActiveGrades", stateDetails.login.userData.userRefId)
            if (response?.status === "200") {
                setGrades(response?.data)
                if(isEdit){
                        selectGrade(response?.data, getIndexById(response?.data,"es_gradeid",state?.data?.gradeId || methods.getValues('gradeId') || editData?.gradeID || editData?.gradeId),false, editData)
                }
                else{
                    setSpinnerStatus(false)
                }
            }
        } catch (err) {
            console.log(err)
            setSpinnerStatus(false)
        }
    }

     /*get Theme APi call*/
     const getThemes = async (value:any) => {
        try {
            setSpinnerStatus(true)
            const response:any = await getThemesApi({"subjectId": value?.length > 0 ? value.includes(null || undefined) ? [] : value : []})   
            if(response?.status == 200){
                setSpinnerStatus(false)
                setTheme(response?.data)
                //setQuesTypeEnabled(response.data.length === 0 ? chapter?.length > 0 ? true : false : false)
            }
        } catch (err) {
            console.log(err)
            setSpinnerStatus(false)
        }
    }

    /*API calls When the Component Renders*/
    const getAllInitialData = (editData={}) => {
        gradesAPI(editData)
    }

    const handleSwitchChange = (switchStatus: any) => {
        setInitialValues({
            ...methods.getValues(),
            'isPublic': switchStatus
        })
    }

    const questionTypeHandler = (data: any, questionType: any ,inputType:string) => {
        switch (inputType) {
            case "index":
                setQTChange(!isQTChange)
                const tempIndex = defaultQUestionTypes?.indexOf(data[questionType]?.type)
                setQuestionType(tempIndex.toString())
                // setData([])
                break;
            case "id":
                setQTChange(!isQTChange)
                const tempId = defaultQUestionTypes?.indexOf(data?.find((ele:any)=>ele.id===questionType)?.type)
                setQuestionType(tempId.toString())
                // setData([])
                break;
        }
    }

    useEffect(()=>{
        if(isDuplicate) {
            if(preventFirstRenderA<3){
                setPreventFirstRenderA(prev=>++prev)
                return
            }
            methods.reset({
                ...initialValues,
                options: questionInitialValues,
                questionTypeMasterId: methods.getValues("questionTypeMasterId"),
                gradeId: methods.getValues("gradeId"),
                subjectId: methods.getValues("subjectId"),
                themeId: methods.getValues("themeId"),
                chapterId: methods.getValues("chapterId"),
                topicId: methods.getValues("topicId")
            })
            setKey(Math.random())
        }
    },[questionType])

    const diffFn = () => {
        let userEnterData: object = {
            questionTypeMasterId: methods.getValues("questionTypeMasterId"),
            gradeId: methods.getValues("gradeId"),
            subjectId: methods.getValues("subjectId"),
            themeId: methods.getValues("themeId"),
            chapterId: methods.getValues("chapterId"),
            topicId: methods.getValues("topicId")
        }        

        if (isEdit == true || isDuplicate == true) {
            // editQuestion page && duplicate page --> cancel and goback functionality
            if (Object.keys(methods?.formState?.dirtyFields).length > 0 || methods.formState.isDirty) {
                setSaveAndCon(true)
                setcontinueEditing(false);

            }
            else {                
                history("/assess/questionbank")
                setSaveAndCon(false)
            }
        }
        else{       
            // create new question page --> cancel and goback functionality
            if (methods?.formState?.isValid) {
                setcontinueEditing(false);
                setSaveAndCon(true)
            }
            else {
                if (JSON.stringify(cloneData) === JSON.stringify(userEnterData)) {
                    history("/assess/questionbank") 
                }
                else {
                    setcontinueEditing(true);
                    setSaveAndCon(false)
                }
            }
        }
    }    

    const allignBodyForMTF = (data: any) => {
        const rowAlligned = data?.filter((ele: any) => ele != undefined)
        const alligned = rowAlligned?.map((ele: any) => {
            return ele.filter((element: any) => element != undefined)
        })
        return alligned
    }

    const sortArrayWithOrder=(list:any)=>{
        let indexArray = list.map((ele: any) => ele?.order)
        indexArray.sort((a: number, b: number) => {
            return a - b;
        });
        const settedArray = indexArray.map((ele: number) => {
            return list.find((element: any) => element?.order === ele)
        })
        return settedArray
    }

    const allignBodyForComprehensive = (data: any) => {
        // comprehension post api call 
        let questionTypesComObj: any = Object.fromEntries(Object.entries(data).filter(([key]) => key.includes('comprehensiveQuestionType'))) as object;
        let reFormObj = {} as any;
        Object.keys(questionTypesComObj).forEach(key => {
            reFormObj[key] = questionTypeData?.filter((x:any,i:number)=> x?.id === questionTypesComObj[key])?.[0]?.templateUsed;
        }) 
        const objectArray = Object.entries(reFormObj) as any;
        let arrayMetaInfo = [] as any[];
        objectArray?.forEach(([key, value]: any) => {
            if (String(value) === '1') {
                // object forming for subjective type of questions
                let returnOnlyNumbers = key.replace(/\D/g, "") as string;
                let retrunCorrespondingValue = Object.fromEntries(Object.entries(data).filter(([key]) => key.includes(returnOnlyNumbers))) as any;
                let finalObjForSubjective = {
                    "question": hintApproachRTEhandler(retrunCorrespondingValue[`question_${returnOnlyNumbers}`]),
                    "questionImages" : getWholeImageArray(retrunCorrespondingValue[`question_${returnOnlyNumbers}`], retrunCorrespondingValue[`approach_${returnOnlyNumbers}`], retrunCorrespondingValue[`hint_${returnOnlyNumbers}`], retrunCorrespondingValue[`solution_${returnOnlyNumbers}`]) ,
                    "questionObjectiveId": retrunCorrespondingValue[`questionObjectiveId_${returnOnlyNumbers}`],
                    "questionTypeMasterId": retrunCorrespondingValue[`comprehensiveQuestionType_${returnOnlyNumbers}`],
                    "completionTime": retrunCorrespondingValue[`completionTime_${returnOnlyNumbers}`],
                    "version": 0,
                    "isPublic": data?.isPublic,
                    "conceptNo": 1,
                    "conceptName": "",
                    "marks": retrunCorrespondingValue[`marks_${returnOnlyNumbers}`],
                    "hint":hintApproachRTEhandler(retrunCorrespondingValue[`hint_${returnOnlyNumbers}`]),
                    "solution": hintApproachRTEhandler(retrunCorrespondingValue[`solution_${returnOnlyNumbers}`]),
                    "approach":hintApproachRTEhandler(retrunCorrespondingValue[`approach_${returnOnlyNumbers}`]),
                    "gradeId": data?.gradeId,
                    "questionErrorTypes": retrunCorrespondingValue[`questionErrorTypes_${returnOnlyNumbers}`],
                    "questionLevelId":retrunCorrespondingValue[`questionLevelId_${returnOnlyNumbers}`]
                } as any
                arrayMetaInfo.push(finalObjForSubjective)
            }
            else if (String(value) == '2') {
                // object forming for MCQ type of questions
                let returnOnlyNumbers = key.replace(/\D/g, "") as string;
                let retrunCorrespondingValue = Object.fromEntries(Object.entries(data).filter(([key]) => key.includes(returnOnlyNumbers))) as any;
                let finalObjForMcq = {
                    "question": hintApproachRTEhandler(retrunCorrespondingValue[`question_${returnOnlyNumbers}`]),
                    "questionImages" : getWholeImageArray(retrunCorrespondingValue[`question_${returnOnlyNumbers}`], retrunCorrespondingValue[`approach_${returnOnlyNumbers}`], retrunCorrespondingValue[`hint_${returnOnlyNumbers}`], retrunCorrespondingValue[`solution_${returnOnlyNumbers}`]) ,
                    "questionLevelId": retrunCorrespondingValue[`questionLevelId_${returnOnlyNumbers}`],
                    "questionObjectiveId": retrunCorrespondingValue[`questionObjectiveId_${returnOnlyNumbers}`],
                    "questionTypeMasterId": retrunCorrespondingValue[`comprehensiveQuestionType_${returnOnlyNumbers}`],
                    "completionTime": retrunCorrespondingValue[`completionTime_${returnOnlyNumbers}`],
                    "version": 0,
                    "isPublic": data?.isPublic,
                    "conceptNo": 1,
                    "conceptName": "",
                    "marks": retrunCorrespondingValue[`marks_${returnOnlyNumbers}`],
                    "hint": hintApproachRTEhandler(retrunCorrespondingValue[`hint_${returnOnlyNumbers}`]),
                    "solution": retrunCorrespondingValue[`solution_${returnOnlyNumbers}`],
                    "approach":hintApproachRTEhandler( retrunCorrespondingValue[`approach_${returnOnlyNumbers}`]),
                    "gradeId": data?.gradeId,
                    "noOfOptions": retrunCorrespondingValue[`questionOptions_${returnOnlyNumbers}`] ? retrunCorrespondingValue[`questionOptions_${returnOnlyNumbers}`]?.length : 0,
                    "questionOptions": getUpdatedOptions(retrunCorrespondingValue[`questionOptions_${returnOnlyNumbers}`]),
                    "questionErrorTypes": retrunCorrespondingValue[`questionErrorTypes_${returnOnlyNumbers}`]
                } as any;
                arrayMetaInfo.push(finalObjForMcq)
            }
            else if (String(value) == '4') {
                // object forming for FIB type of questions
                let returnOnlyNumbers = key.replace(/\D/g, "") as string;
                let retrunCorrespondingValue = Object.fromEntries(Object.entries(data).filter(([key]) => key.includes(returnOnlyNumbers))) as any;
                let finalObjForFIB = {
                    "question": hintApproachRTEhandler(retrunCorrespondingValue[`question_${returnOnlyNumbers}`]),
                    "questionImages" : getWholeImageArray(retrunCorrespondingValue[`question_${returnOnlyNumbers}`], retrunCorrespondingValue[`approach_${returnOnlyNumbers}`], retrunCorrespondingValue[`hint_${returnOnlyNumbers}`], retrunCorrespondingValue[`solution_${returnOnlyNumbers}`]) ,
                    "questionLevelId": retrunCorrespondingValue[`questionLevelId_${returnOnlyNumbers}`],
                    "questionObjectiveId": retrunCorrespondingValue[`questionObjectiveId_${returnOnlyNumbers}`],
                    "questionTypeMasterId": retrunCorrespondingValue[`comprehensiveQuestionType_${returnOnlyNumbers}`],
                    "completionTime": retrunCorrespondingValue[`completionTime_${returnOnlyNumbers}`],
                    "isPublic": data?.isPublic,
                    "conceptNo": 1,
                    "conceptName": "",
                    "marks": retrunCorrespondingValue[`marks_${returnOnlyNumbers}`],
                    "hint": hintApproachRTEhandler(retrunCorrespondingValue[`hint_${returnOnlyNumbers}`]),
                    "solution": retrunCorrespondingValue[`solution_${returnOnlyNumbers}`],
                    "approach": hintApproachRTEhandler(retrunCorrespondingValue[`approach_${returnOnlyNumbers}`]),
                    "gradeId": data?.gradeId,
                    "syllabusId": data?.syllabusId,
                    "themeId": data?.themeId,
                    "chapterId": data?.chapterId,
                    "topicId": data?.topicId,
                    "subjectId": data?.subjectId,
                    "questionErrorTypes": retrunCorrespondingValue[`questionErrorTypes_${returnOnlyNumbers}`],
                    "isBlanks": true,
                    "blankMetaInfo": getUpdatedOptions(sortArrayWithOrder(retrunCorrespondingValue[`blankMetaInfo_${returnOnlyNumbers}`].filter((ele: any) => ele !== undefined)))
                } as any;
                arrayMetaInfo.push(finalObjForFIB)
            }
            else if (String(value) == '3') {
                // object forming for MTF type of questions
                let returnOnlyNumbers = key.replace(/\D/g, "") as string;
                let retrunCorrespondingValue = Object.fromEntries(Object.entries(data).filter(([key]) => key.includes(returnOnlyNumbers))) as any;
                const MTFdata = allignBodyForMTF(data[`data_${returnOnlyNumbers}`])
                let questionOptions = []
                if (MTFdata?.length) {
                    let xMaxLength = MTFdata[0]?.length
                    let yMaxLength = MTFdata?.length
                    let rowCount = 0
                    for (let i = 0; i < xMaxLength; i++) {
                        let eachArr = []
                        for (let j = 0; j < yMaxLength; j++) {
                            let currentData = MTFdata[j][i]
                            rowCount += 1
                            let obj = {
                                question: currentData?.text,
                                row: j + 1,
                                isShuffle: currentData?.shuffle,
                                orderId: rowCount,
                                solutionOrderId: i === 0 ? null : j + 1
                            }
                            eachArr.push(obj)
                        }
                        let eachObj = {
                            columnLabel: data[`columntitle_${returnOnlyNumbers}`][i] ? `${data[`columntitle_${returnOnlyNumbers}`][i]}` : '',
                            columnNo: i + 1,
                            details: eachArr
                        }
                        delete data[`columntitle_${returnOnlyNumbers}`][i]
                        questionOptions.push(eachObj)
                    }
                }
                let finalObjForMTF = {
                    "question": hintApproachRTEhandler(retrunCorrespondingValue[`question_${returnOnlyNumbers}`]),
                    "questionImages" : getWholeImageArray(retrunCorrespondingValue[`question_${returnOnlyNumbers}`], retrunCorrespondingValue[`approach_${returnOnlyNumbers}`], retrunCorrespondingValue[`hint_${returnOnlyNumbers}`], retrunCorrespondingValue[`solution_${returnOnlyNumbers}`]),
                    "questionLevelId": retrunCorrespondingValue[`questionLevelId_${returnOnlyNumbers}`],
                    "questionObjectiveId": retrunCorrespondingValue[`questionObjectiveId_${returnOnlyNumbers}`],
                    "questionTypeMasterId": retrunCorrespondingValue[`comprehensiveQuestionType_${returnOnlyNumbers}`],
                    "completionTime": retrunCorrespondingValue[`completionTime_${returnOnlyNumbers}`],
                    "isPublic": data?.isPublic,
                    "marks": retrunCorrespondingValue[`marks_${returnOnlyNumbers}`],
                    "hint":hintApproachRTEhandler(retrunCorrespondingValue[`hint_${returnOnlyNumbers}`]),
                    "solution": retrunCorrespondingValue[`solution_${returnOnlyNumbers}`] ?? '',
                    "approach": hintApproachRTEhandler(retrunCorrespondingValue[`approach_${returnOnlyNumbers}`]),
                    "gradeId": data?.gradeId,
                    "syllabusId": data?.syllabusId ?? 0,
                    "themeId": data?.themeId,
                    "chapterId": data?.chapterId,
                    "topicId": data?.topicId,
                    "subjectId": data?.subjectId,
                    "questionErrorTypes": retrunCorrespondingValue[`questionErrorTypes_${returnOnlyNumbers}`],
                    "questionMTFOptions": getUpdatedMTFOptions(questionOptions)
                } as any;
                arrayMetaInfo.push(finalObjForMTF)
            }
        });
        let postBody = {
            "question": hintApproachRTEhandler(data?.test),
            "questionTextWithoutImages": removeUploadsFromText(data?.test),
            "questionImages": getuploadPathWithQuestion(data?.test),
            "questionObjectiveId": data?.questionObjectiveId,
            "questionLevelId": data?.questionLevelId,
            "questionTypeMasterId": data?.questionTypeMasterId,
            "completionTime": data?.completionTime,
            "isPublic": data?.isPublic,
            "conceptNo": data?.conceptNo ?? 0,
            "conceptName": data?.conceptName ?? '',
            "marks": data?.marks,
            "hint": hintApproachRTEhandler(data?.hint),
            "solution": hintApproachRTEhandler(data?.solution),
            "approach": hintApproachRTEhandler(data?.approach),
            "syllabusId": data?.syllabusId,
            "themeId": data?.themeId,
            "chapterId": data?.chapterId,
            "topicId": data?.topicId,
            "subjectId": data?.subjectId,
            "questionErrorTypes": data?.questionErrorTypes_1,
            "gradeId": data?.gradeId,
            "isBlanks": data?.isBlanks ?? false,
            "metaInfo": arrayMetaInfo,
        } as any;

        return postBody;
    }

    const onSubmit = async (data: any,status:string) => {
        data['noOfOptions'] = data?.questionOptions ? data?.questionOptions.length : 0
        try {
            let response;
            !dupliacteEntry && setSpinnerStatus(true) 
            if(questionType == "0"){
                const allowed = data.questionOptions.some((ele:any)=>ele.isCorrect ===true)
                if(!allowed){
                    methods.setError("correctAnswer",{type:"custom",message: 'Please select at least one correct answer'})                   
                    setSnackBar(true);
                    setSnackBarSeverity('error');
                    setSnackBarText(`Please select at least one correct answer`)
                    setSpinnerStatus(false) 
                    return
                }
            }
            if(questionType == "4"){
                let questionTypesComObj: any = Object.fromEntries(Object.entries(data).filter(([key]) => key.includes('questionOptions'))) as object;
                const objectArray = Object.entries(questionTypesComObj);
                let isEnable = [] as boolean[];
                objectArray?.forEach((a: any, i: any) => {
                    if (Array.isArray(a[1]) && a[1].length) {
                        if (a[1].some((x: any) => x?.isCorrect === true)) {
                            isEnable.push(true);
                        } else {
                            isEnable.push(false);
                        }
                    }
                })
                if(isEnable?.includes(false)){
                    methods.setError("correctAnswer",{type:"custom",message: 'Please select at least one correct answer'})                   
                    setSnackBar(true);
                    setSnackBarSeverity('error');
                    setSnackBarText(`Please select at least one correct answer`)
                    setSpinnerStatus(false) 
                    return
                }
            }
            if (isEdit && !isDuplicate) {
                if (questionType == "0") {
                    response = await questionPutApi(state.data.id, arrangingDataWithQuestionType(data,"MCQ"));
                }
                if (questionType == "1") {
                    response = await questionPutApi(state.data.id, arrangingDataWithQuestionType(data,"Subjective"));
                }

                else if (questionType == "3") {
                    data["isBlanks"] = true
                    data["blankMetaInfo"] = data.blankMetaInfo.filter((ele: any) => ele !== undefined)
                    response = await questionPutApi(state.data.id, arrangingDataWithQuestionType(data,"Fill in the Blanks"));
                }
                if (questionType == "2") {
                    const MTFdata = allignBodyForMTF(data.data)
                    let questionOptions = []
                    if (MTFdata?.length) {
                        let xMaxLength = MTFdata[0]?.length
                        let yMaxLength = MTFdata?.length
                        let rowCount = 0
                        for (let i = 0; i < xMaxLength; i++) {
                            let eachArr = []
                            for (let j = 0; j < yMaxLength; j++) {
                                let currentData = MTFdata[j][i]
                                rowCount += 1
                                let obj = {
                                    question:currentData?.text,
                                    row: j + 1,
                                    isShuffle: currentData?.shuffle,
                                    orderId: rowCount,
                                    solutionOrderId: i === 0 ? null : j + 1
                                }
                                eachArr.push(obj)
                            }
                            let eachObj = {
                                columnLabel: data.columntitle[i] ? data.columntitle[i] : "",
                                columnNo: i + 1,
                                details: eachArr
                            }
                            delete data.columntitle[i]
                            questionOptions.push(eachObj)
                        }
                    }
                    data.solution=""
                    data['questionMTFOptions'] = questionOptions;
                    response = await questionPutApiForMTF(state.data.id, arrangingDataWithQuestionType(data,"Match The following"));
                }
                if(questionType == "4"){
                     // comprehension put api call 
                     const res =  await allignBodyForComprehensive(data)
                     response = await questionPutApiForComprehensive(state.data.id,res)
                }
                if ((response?.result?.responseCode == 0 || response?.result?.responseDescription === "Success")) {
                    setSnackBar(true);
                    setSnackBarSeverity('success');
                    setSnackBarText(`Question updated successfully in the Question bank `)
                    setSpinnerStatus(false)
                    if (status!=="addNew"){
                        setTimeout(() => {
                            history("/assess/questionbank") 
                        }, 1500);
                    }                                     
                } else {
                    setSnackBar(true);
                    setSnackBarSeverity('error');
                    setSnackBarText(response?.responseDescription ? response?.responseDescription :`something went wrong`)
                    setSpinnerStatus(false)
                }
                if (status==="addNew") {
                    setisEdit(false)
                    setAddNewToggler(!addNewToggler)
                    setAddNew(true)
                    methods.reset({
                        options: questionInitialValues,
                        questionTypeMasterId: methods.getValues("questionTypeMasterId"),
                        gradeId: methods.getValues("gradeId"),
                        subjectId: methods.getValues("subjectId"),
                        themeId: methods.getValues("themeId"),
                        chapterId: methods.getValues("chapterId"),
                        topicId: methods.getValues("topicId"),
                        isPublic: methods.getValues("isPublic")
                    })
                    setKey(Math.random())
                    setErrorSupport(true)
                    setData([])
                    setQuesTypeEnabled(false)
                    window.scrollTo(0, 0)
                    window.history.replaceState({}, '', '/assess/createnewquestion');
                }
            }
            else {
                if (questionType == "0") {
                    if(!isDuplicate && !isEdit) {
                    response = await postQuestionApi(arrangingDataWithQuestionType(data,"MCQ"));
                    }else{
                        if (isDuplicate && isEdit) {
                            if (cloneduplicateData !== JSON.stringify(methods?.getValues())) {
                                if (methods?.formState?.isDirty || Object.keys(methods?.formState?.dirtyFields).length > 0) {
                                    response = await postQuestionApi(arrangingDataWithQuestionType(data, "MCQ"));
                                }
                                else {
                                    setSpinnerStatus(false)
                                    setDuplicateEntry(true)
                                    return
                                }
                            }
                            else {
                                setSpinnerStatus(false)
                                setDuplicateEntry(true)
                                return
                            }
                        }
                    }
                }
                if (questionType == "1") {                    
                    if(!isEdit && !isDuplicate) {
                        response = await postQuestionApi(arrangingDataWithQuestionType(data, "Subjective"));
                    } else {
                        if (isDuplicate && isEdit) {
                            if (cloneduplicateData !== JSON.stringify(methods?.getValues())) {
                                if (methods?.formState?.isDirty || Object.keys(methods?.formState?.dirtyFields).length > 0) {
                                    response = await postQuestionApi(arrangingDataWithQuestionType(data, "Subjective"));
                                }
                                else {
                                    setSpinnerStatus(false)
                                    setDuplicateEntry(true)
                                    return
                                }
                            } else {
                                setSpinnerStatus(false)
                                setDuplicateEntry(true)
                                return
                            }
                        }
                    }
                }
                else if (questionType == "3") {
                    delete data?.isOptions;
                    data["isBlanks"] = true
                    delete data?.questionOptions;
                    data["blankMetaInfo"] = sortArrayWithOrder(data.blankMetaInfo.filter((ele: any) => ele !== undefined))
                    // response = await postQuestionApi(arrangingDataWithQuestionType(data,"Fill in the Blanks"));
                    if(!isDuplicate && !isEdit) {
                        response = await postQuestionApi(arrangingDataWithQuestionType(data, "Fill in the Blanks"));
                    } else {
                        if(isDuplicate && isEdit) {
                        if (methods?.formState?.isDirty || Object.keys(methods?.formState?.dirtyFields).length > 0) {
                            response = await postQuestionApi(arrangingDataWithQuestionType(data, "Fill in the Blanks"));
                        }
                        else {          
                            setSpinnerStatus(false)                   
                            setDuplicateEntry(true)  
                            return
                        }}
                    }
                }
                if (questionType == "2") {
                    const MTFdata = allignBodyForMTF(data.data)
                    let questionOptions = []
                    if (MTFdata?.length) {
                        let xMaxLength = MTFdata[0]?.length
                        let yMaxLength = MTFdata?.length
                        let rowCount = 0
                        for (let i = 0; i < xMaxLength; i++) {
                            let eachArr = []
                            for (let j = 0; j < yMaxLength; j++) {
                                let currentData = MTFdata[j][i]
                                rowCount += 1
                                let obj = {
                                    question:currentData?.text,
                                    row: j + 1,
                                    isShuffle: currentData?.shuffle,
                                    orderId: rowCount,
                                    solutionOrderId: i === 0 ? null : j + 1
                                }
                                eachArr.push(obj)
                            }
                            let eachObj = {
                                columnLabel: data.columntitle[i] ? data.columntitle[i] : "",
                                columnNo: i + 1,
                                details: eachArr
                            }
                            delete data.columntitle[i]
                            questionOptions.push(eachObj)
                        }
                    }
                    delete data?.data;
                    delete data?.options;
                    delete data?.columntitle;
                    delete data?.questionOptions;
                    data.solution=""
                    data.questionMTFOptions = questionOptions;
                    if (!isDuplicate && !isEdit) {
                        response = await postMatchTheFollowingApi(arrangingDataWithQuestionType(data, "Match The following"));
                    } else {
                        if(isDuplicate && isEdit) {
                            if (cloneduplicateData !== JSON.stringify(methods?.getValues())) {
                                if (methods?.formState?.isDirty || Object.keys(methods?.formState?.dirtyFields).length > 0) {
                                    response = await postMatchTheFollowingApi(arrangingDataWithQuestionType(data, "Match The following"));
                                }
                                else {
                                    setSpinnerStatus(false)
                                    setDuplicateEntry(true)
                                    return
                                }
                            } else {
                                setSpinnerStatus(false)
                                setDuplicateEntry(true)
                                return
                            }
                        }
                    }
                }
                if(questionType == "4"){
                    // comprehension post api call 
                    const res = await allignBodyForComprehensive(data)
                    if (!isDuplicate && !isEdit) {
                        response = await comprehensivePostApiCall(res)
                    } else {
                        if(isDuplicate && isEdit) {
                            if (cloneduplicateData !== JSON.stringify(methods?.getValues())) {
                                if (methods?.formState?.isDirty || Object.keys(methods?.formState?.dirtyFields).length > 0) {
                                    response = await comprehensivePostApiCall(res)
                                }
                                else {
                                    setSpinnerStatus(false)
                                    setDuplicateEntry(true)
                                    return
                                }
                            } else {
                                setSpinnerStatus(false)
                                setDuplicateEntry(true)
                                return
                            }
                        }
                    }
                }
                if ((response?.responseCode == 0 || response?.responseDescription === "Success") || ((response?.result?.responseCode == 0 || response?.result?.responseDescription === "Success"))) {
                    setSnackBar(true);
                    setSnackBarSeverity('success');
                    setSnackBarText(`Question added sucuessfully to question bank`)                    
                    setSpinnerStatus(false) 
                    if (status!=="addNew"){
                        setTimeout(() => {
                            history("/assess/questionbank") 
                        }, 1500);
                    }
                    // if (status==="addNew" && !dupliacteEntry) {
                    //     setTimeout(() => {
                    //         history("/assess/createnewquestion")
                    //     }, 1500);
                    // }                                
                }
                else {
                    if(response !== undefined){
                    setSnackBar(true);
                    setSnackBarSeverity('error');
                    setSnackBarText(response?.responseDescription ?response?.responseDescription:`something went wrong`)                    
                    }
                    setSpinnerStatus(false) 
                }
                if (status === "addNew") {
                    setAddNewToggler(!addNewToggler)
                    setAddNew(true)
                    methods.reset({
                        ...initialValues,
                        options: questionInitialValues,
                        questionTypeMasterId: methods.getValues("questionTypeMasterId"),
                        gradeId: methods.getValues("gradeId"),
                        subjectId: methods.getValues("subjectId"),
                        themeId: methods.getValues("themeId"),
                        chapterId: methods.getValues("chapterId"),
                        topicId: methods.getValues("topicId"),
                        isPublic: methods.getValues("isPublic")
                    })
                    setKey(Math.random())
                    setErrorSupport(true)
                    setData([])
                    setQuesTypeEnabled(false)
                    window.scrollTo(0, 0)
                    window.history.replaceState({}, '', '/assess/createnewquestion');
                } 
            }
        } catch (err) {
            console.log(err)
            setSpinnerStatus(false)
        }
    }
    const dataAlignationForComprehensiveEdit=(fields:any)=>{
        const newObj = Object.keys(fields).reduce((x:any) => {
            return {...fields, ['metaInfo']: fields?.metaInfo?.filter((x:any)=>x?.questionTypeActive == true )};
          }) as any;
        let settableData={...newObj} as any;
        const dataField:any[]=[]
        newObj.metaInfo.forEach((element:any,index:number)=>{
            Object.entries(element).forEach(([key,value],ind:number)=>{
                if(key==="questionTypeMasterId"){
                    settableData={...settableData, [`comprehensiveQuestionType_${index+1}`]:value}
                }else{
                    settableData={...settableData, [`${key}_${index+1}`]:value}
                }
            })
            dataField.push({ title: `comprehensive_${index + 1}`, enable: true, questiontype: element.questionTypeMasterId, index:index + 1})
        })
        settableData["test"] =newObj.question
        delete settableData.metaInfo
        let formattedResultData = dataField?.map((a: any, i: any) => {
            if (i === dataField.length - 1) {
                return { ...a, enable: true };
            } else {
                return { ...a, enable: false };
            }
        }) as any;
        setData(formattedResultData)
        setTimeout(()=>{
            methods.reset(settableData,{ keepDirty: false, keepDirtyValues: false })
            setSpinnerStatus(false)
        },500)
        setTimeout(() => {
            setCloneduplicateData(JSON.stringify(methods?.getValues()))
        }, 1000)
    }

    /*Filter the List to configure Data for SelectBoxComponent*/
    const filtered = (list: any, element: string) => {
        if (element) {
            return list?.length ? list.map((ele: any) => ele[element]) : []
        } else {
            return list?.length ? list.map((ele: any) => ele.name) : []
        }
    }
    let subjects:any;

    const selectGrade = async (list: Grade[] | null, element: number, reset: boolean, editData:any={}) => {
        setSpinnerStatus(true)
        const response = await baseFilterApi("subjects", { "gradeId": [list ? list[element]?.es_gradeid : grades[element]?.es_gradeid], "publicationId": 0, "staffId": stateDetails?.login?.userData?.userRefId  })
        if (response.status == '200') {
            setSubject(response.data)
            subjects = response.data
            if (isEdit) {
                selectSubject(response.data, getIndexById(response?.data, "courseId", state?.data?.subjectId || methods.getValues('subjectId') || editData?.subjectId),false, editData)
            } else{
                setSpinnerStatus(false)
            }
            if(reset){
                setQuestionType("")
                methods.reset({
                    gradeId: methods.getValues("gradeId")
                })
                //setQuesTypeEnabled(false)
            }
            setChapter([])
            setTopics([])
        } else {
            console.log("subject API error")
            setSpinnerStatus(false)
        }
    }

    const selectSubject = async (list: Subject[] | null, element: number, reset: boolean, editData:any={}) => {
        const response = await baseFilterApi("chapters", { "gradeId": [methods.getValues("gradeId") ? methods.getValues("gradeId") : state?.data?.gradeId || editData?.gradeId], "courseId": [list ? list[element]?.courseId : subject[element]?.courseId || editData?.courseId],'staffId' : stateDetails?.login?.userData?.userRefId })
        if (response.status==200) {
            setChapter(response.data)            
            setQuesTypeEnabled(response?.data?.length === 0 ? true : false)
            if (isEdit) {
                selectChapter(response?.data, getIndexById(response?.data, "chapterId", state?.data?.chapterId || methods.getValues("chapterId") || editData?.chapterId), editData)
            }else{
                setSpinnerStatus(false)                
            }
            if(reset){
                setQuestionType("")
                methods.reset({
                    gradeId: methods.getValues("gradeId"),
                    subjectId: methods.getValues("subjectId")
                })
               //setQuesTypeEnabled(false)
            }
            setTopics([])
        } else {
            console.log("Chapter API error")
            setSpinnerStatus(false)
        }
       if(isEdit || isDuplicate){
           if(editRes?.themeId){
            await getThemes([subjects[element]?.courseId])
           }
       }else if(!isEdit && !isDuplicate){
          await getThemes([subject[element]?.courseId])
       }
       
    }
    const selectChapter = async (list: Chapter[] | null, element: number, editData:any={}) => {
     try{

         setSpinnerStatus(true)
         const response = await baseFilterApi("topics", { "gradeId": [methods.getValues("gradeId") ? methods.getValues("gradeId") : state?.data?.gradeId || editData?.gradeId], "courseId": [methods.getValues("subjectId") ? methods.getValues("subjectId") : state?.data?.subjectId || editData?.subjectId], "chapterId": [list ? list[element]?.chapterId : chapter[element]?.chapterId || editData?.chapterId], "staffId": 1 })
         if (response.status == 200) {
             setSpinnerStatus(false)
             setTopics(response?.data)
             setQuesTypeEnabled(response?.data?.length === 0 ? true : false )
             
            }
            setSpinnerStatus(false)
        }catch(e){
            setSpinnerStatus(false)
        }
    }

    const getComprehensiveMaterType = (id:any, array:[]) => {
        const masterType:any = array?.filter((arr:any)=> arr.id == id)
        if(masterType?.length){
            return defaultQUestionTypes?.indexOf(masterType[0]?.type)
        }
        else return
    }

    const selectTopic = (list: any, element: number) =>{
       let indexArr = list?.map((a:any,i:number)=>a?.topicId)
       const tempIndex = indexArr[element]
       setQuesTypeEnabled(tempIndex ? true : false)
    }

    useEffect(() => {
        if (!isEdit || isDuplicate || addNewToggler) {
            let questionData :any[]=[]
            if (Number(questionType) == 1) {
                questionData=[]
                setquestionInitialValues([])
            } else if (Number(questionType) == 0) {
                questionData=[{ text: "", isCorrect: true, isFixed: false, order: 1 }, { text: "", isCorrect: true, isFixed: false, order: 2 }]
                setquestionInitialValues([{ text: "", isCorrect: true, isFixed: false, order: 1 }, { text: "", isCorrect: true, isFixed: false, order: 2 }])
            } else if (Number(questionType) == 5) {
                questionData=[[{ ques: "", shuffle: true }, { ans: "", shuffle: true }], [{ ques: "", shuffle: true }, { ans: "", shuffle: true }]]
                setquestionInitialValues([[{ ques: "", shuffle: true }, { ans: "", shuffle: true }], [{ ques: "", shuffle: true }, { ans: "", shuffle: true }]])
            }
            if(preventFirstRenderB<3 && (isEdit || isDuplicate )){
                setPreventFirstRenderB(prev=>++prev)
            }else{
                if(!isDuplicate||addNew){
                  setSpinnerStatus(true)
                setTimeout(() => {
                    methods.reset({
                        ...initialValues,
                        questionOptions: questionData,
                        questionTypeMasterId: methods.getValues("questionTypeMasterId"),
                        gradeId: methods.getValues("gradeId"),
                        subjectId: methods.getValues("subjectId"),
                        themeId: methods.getValues("themeId"),
                        chapterId: methods.getValues("chapterId"),
                        topicId: methods.getValues("topicId")
                    });
                setSpinnerStatus(false);
            },1500)
        }
        }
        }
        setKey(Math.random())
    }, [questionType,addNewToggler,isQTChange])
    useEffect(()=>{
        if(methods?.getValues("question") === ""){
            setKey(Math.random())
        }
    },[methods?.getValues("question")])
    useEffect(() => {
        methods.reset({ ...initialValues });
        setKey(Math.random())
    }, [initialValues])

    const QuestionTypeApi = async (subjectId:string) => {
        try {
            setSpinnerStatus(true)
            const response = await selectFieldQueTypeApi(`&subjectIds=${subjectId}`)
            if (response && response?.baseResponse && response?.baseResponse?.data?.length) {
                setQuestionTypeData(response?.baseResponse?.data)
                setComprehensiveQuestionTypeData(response?.baseResponse?.data?.filter((compre:any)=>compre?.type !== "Comprehensive"))
                if(isEdit || isDuplicate){
                    questionTypeHandler(response?.baseResponse?.data, state?.data?.questionTypeMasterId,"id")
                    setSpinnerStatus(false)
                }else{
                    setSpinnerStatus(false) 
                }
            } else {
                setSpinnerStatus(false) 
                setQuestionTypeData([])
                setComprehensiveQuestionTypeData([])
            }
        } catch (err) {
            setSpinnerStatus(false) 
            console.log(err)
        }
    }

    const removeCodeCogs = (response: any, isComp?: boolean) => {
        const regex:any = /<span class="codeCogsEditor" (.*?)>(.*?)<img(.*?)\/?>(.*?)<\/span>/g;
        const regexSingle:any = /<span class="codeCogsEditor" (.*?)>(.*?)<img(.*?)\/?>(.*?)<\/span>/;
        
        // Handle FIB

        if(response?.blankMetaInfo?.length){
            response.blankMetaInfo = response?.blankMetaInfo?.map((question: any) => {
                let text:any = question.text
                const match = regex.exec(text);
                // const images = question.match(regex)
                if (match && match[1]) {
                    // text = text.replace(regex, `<img$3style="width: auto;" alt=${match[1].split("=")[1]}/>`)
                    const altArr = match[1].split("=")
            altArr.shift()
            const alt = altArr.join("=")
            text = text?.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
                }
                return {...question, text}
            })
        }
        
        // Handle Comprehensive
        if (isComp) {
            const metaInfo = response.metaInfo.map((questionInfo: any) => {
                let question:any = questionInfo?.question
                const match:any = regex?.exec(question);
                const images:any= question?.match(regex)
                // if (match && match[1]) {
                //     const altArr:any = match[1].split("=")
                //     altArr.shift()
                //     const alt = altArr.join("=")
                //     question = question?.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
                // }
                images?.forEach((img:any) => {
                    const div = document?.createElement("div")
                    div.innerHTML = img
                    const alt = div?.querySelector("span")?.dataset?.latex
                    question = question?.replace(regexSingle, `<img$3style="width: auto;" alt=${alt}/>`)
                })

                let solution:any = questionInfo?.solution
                const match1:any = regex.exec(solution);
                const imagesSolution:any = solution?.match(regex) || []
                imagesSolution?.forEach((img:any) => {
                    const div = document.createElement("div")
                    div.innerHTML = img
                    const alt = div.querySelector("span")?.dataset.latex
                    solution = solution.replace(regexSingle, `<img$3style="width: auto;" alt=${alt}/>`)
                })

                let hint:any = questionInfo?.hint
                const match2:any = regex.exec(hint);
                if (match2 && match2[1]) {
                    const altArr:any = match2[1].split("=")
                    altArr.shift()
                    const alt:any = altArr.join("=")
                    hint = hint?.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
                }
                let approach:any = questionInfo?.approach
                const match3:any = regex?.exec(approach);
                if (match3 && match3[1]) {
                    const altArr:any = match3[1].split("=")
                    altArr.shift()
                    const alt:any = altArr.join("=")
                    approach = approach?.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
                }

                let questionOptions:any =
                    questionInfo?.questionOptions?.map((item: any) => {
                        const match4:any = regex.exec(item?.text);
                        const images:any = item?.text?.match(regex)
                        // if (match4 && match4[1]) {
                        //     const altArr = match4[1].split("=")
                        //     altArr.shift()
                        //     const alt = altArr.join("=")
                        //     item.text = item?.text?.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
                        // }
                        images?.forEach((img:any) => {
                            const div = document.createElement("div")
                            div.innerHTML = img
                            const alt = div.querySelector("span")?.dataset.latex
                            item.text = item?.text.replace(regexSingle, `<img$3style="width: auto;" alt=${alt}/>`)
                        })
                        return item;
                    });

                let questionMTFOptions:any =
                    questionInfo?.questionMTFOptions?.map((fItem: any) => {

                        fItem?.details?.map((item: any) => {
                            const match5 = regex.exec(item?.question);
                            const images:any = item?.question?.match(regex)
                            // if (match5 && match5[1]) {
                            //     const altArr = match5[1].split("=")
                            //     altArr.shift()
                            //     const alt = altArr.join("=")
                            //     item.question = item?.question?.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
                            // }
                            images?.forEach((img:any) => {
                                const div = document.createElement("div")
                                div.innerHTML = img
                                const alt = div.querySelector("span")?.dataset.latex
                                item.question = item.question.replace(regexSingle, `<img$3style="width: auto;" alt=${alt}/>`)
                            })
                            return item;
                        })
                        return fItem;
                    })
                return { ...questionInfo, question, solution, hint, approach, questionOptions, questionMTFOptions }
            })

            let question:any = response?.question
            const match:any = regex.exec(question);
            if (match && match[1]) {
                // question = question.replace(regex, `<img$3style="width: auto;" alt=${match[1].split("=")[1]}/>`)
                const altArr = match[1].split("=")
                altArr.shift()
                const alt = altArr?.join("=")
                question = question?.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
            }
            let solution:any = response.solution
            const match1 = regex.exec(solution);
            if (match1 && match1[1]) {
                const altArr = match1[1].split("=")
                altArr.shift()
                const alt = altArr.join("=")
                solution = solution?.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
            }

            let hint:any = response.hint
            const match2 = regex.exec(hint);
            if (match2 && match2[1]) {
                const altArr = match2[1].split("=")
                altArr.shift()
                const alt = altArr.join("=")
                hint = hint.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
            }
            let approach = response.approach
            const match3 = regex.exec(approach);
            if (match3 && match3[1]) {
                const altArr = match3[1].split("=")
                altArr.shift()
                const alt = altArr.join("=")
                approach = approach.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
            }
            let questionOptions =
                response?.questionOptions?.map((item: any) => {
                    const match4 :any= regex.exec(item?.text);
                    if (match4 && match4[1]) {
                        const altArr = match4[1].split("=")
                        altArr.shift()
                        const alt = altArr.join("=")
                        item.text = item?.text?.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
                    }
                    return item;
                });

            let questionMTFOptions:any =
                response?.questionMTFOptions?.map((fItem: any) => {
                    fItem?.details?.map((item: any) => {
                        const match5 = regex.exec(item?.question);
                        if (match5 && match5[1]) {
                            const altArr = match5[1].split("=")
                            altArr.shift()
                            const alt = altArr.join("=")
                            item.question = item?.question?.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
                        }
                        return item;
                    })
                    return fItem;
                })
            return { ...response, metaInfo, question, solution, hint, approach, questionOptions, questionMTFOptions }
        }
        
        let question:any = response?.question
        const images:any= question?.match(regex)
        images?.forEach((img:any) => {
            const div = document.createElement("div")
            div.innerHTML = img
            const alt = div.querySelector("span")?.dataset.latex
            question = question.replace(regexSingle, `<img$3style="width: auto;" alt=${alt}/>`)
        })
        response.question = question

        // let solution = response.solution
        // const match1 = regex.exec(solution);
        // if (match1 && match1[1]) {
        //     const altArr = match1[1].split("=")
        //     altArr.shift()
        //     const alt = altArr.join("=")
        //     solution = solution.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
        // }
        // response.solution = solution

        let solution:any = response?.solution
        const imagesSolution:any = solution?.match(regex) || []
        imagesSolution?.forEach((img:any) => {
            const div = document.createElement("div")
            div.innerHTML = img
            const alt = div.querySelector("span")?.dataset.latex
            solution = solution.replace(regexSingle, `<img$3style="width: auto;" alt=${alt}/>`)
        })
        response.solution = solution

        let hint:any = response.hint
        const match2 = regex.exec(hint);
        if (match2 && match2[1]) {
            const altArr = match2[1].split("=")
            altArr.shift()
            const alt = altArr.join("=")
            hint = hint.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
        }
        response.hint = hint

        let approach:any = response.approach
        const match3 = regex.exec(approach);
        if (match3 && match3[1]) {
            const altArr = match3[1].split("=")
            altArr.shift()
            const alt = altArr.join("=")
            approach = approach.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
        }
        response.approach = approach

        // let question:any = response.question
        // const images = question.match(regex)
        // images.forEach((img:any) => {
        //     const div = document.createElement("div")
        //     div.innerHTML = img
        //     const alt = div.querySelector("span")?.dataset.latex
        //     question = question.replace(regexSingle, `<img$3style="width: auto;" alt=${alt}/>`)
        // })
        // response.question = question

        let questionOptions:any = response?.questionOptions?.map((item:any) =>{
            const images:any = item?.text?.match(regex)
            // if (match4 && match4[1]) {
            //     const altArr = match4[1].split("=")
            //     altArr.shift()
            //     const alt = altArr.join("=")
            //     item.text = item?.text?.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
            // }
            images?.forEach((img:any) => {
            const div = document.createElement("div")
            div.innerHTML = img
            const alt = div.querySelector("span")?.dataset.latex
            item.text = item?.text.replace(regexSingle, `<img$3style="width: auto;" alt=${alt}/>`)
        })
                return item;
            });
        response.questionOptions = questionOptions

        
// let question:any = response.question
        // const images = question.match(regex)
        // images.forEach((img:any) => {
        //     const div = document.createElement("div")
        //     div.innerHTML = img
        //     const alt = div.querySelector("span")?.dataset.latex
        //     question = question.replace(regexSingle, `<img$3style="width: auto;" alt=${alt}/>`)
        // })
        // response.question = question

        let questionMTFOptions:any =
        response?.questionMTFOptions?.map((fItem:any)=>{
                 fItem?.details?.map((item:any) => {
            const match5 = regex.exec(item?.question);
            const images:any = item?.question?.match(regex)
                    // if (match5 && match5[1]) {
                    //     const altArr = match5[1].split("=")
                    //     altArr.shift()
                    //     const alt = altArr.join("=")
                    //     item.question = item?.question?.replace(regex, `<img$3style="width: auto;" alt=${alt}/>`)
                    // }

                    images?.forEach((img:any) => {
                        const div = document.createElement("div")
                        div.innerHTML = img
                        const alt = div.querySelector("span")?.dataset.latex
                        item.question = item.question.replace(regexSingle, `<img$3style="width: auto;" alt=${alt}/>`)
                    })
                        return item;
                })
                return fItem;
            })
            response.questionMTFOptions = questionMTFOptions




        return response
    }

    let editRes:any;
    const getQuestionForEdit = async () => {
        try {
            setSpinnerStatus(true)
            const response = await getQuestionApi(state.data.id)
            editRes = response
            if (response) {
               const formattedResponse =  removeCodeCogs(response)
                if (Object.keys(response)?.includes('metaInfo')) {    
                const formattedResponseForComp =  removeCodeCogs(response, true)
                    dataAlignationForComprehensiveEdit(formattedResponseForComp)
                }else{
                    setTimeout(()=>{
                        methods.reset({ ...formattedResponse }, { keepDirty: false, keepDirtyValues: false })
                        setSpinnerStatus(false)                  
                    }, 1500)
                }
                getAllInitialData(formattedResponse)
                setTimeout(() => {
                    setCloneduplicateData(JSON.stringify(methods?.getValues()))
                }, 2000)
            } else {
                console.log(response)
                setSpinnerStatus(false)
            }
        } catch (err) {
            console.log(err)
            setSpinnerStatus(false)
        }

    }
    const getIndexById=(list:any,selectableId:string,id:number)=>{
        return list.indexOf(list.find((ele:any)=>ele[selectableId] == id))
    }

    useEffect(() => {
        if (isEdit) {
            setTimeout(() => {
                setCloneData(JSON.parse(JSON.stringify(methods.getValues() as object)))
            }, 1500)
        } else {
            setCloneData({
                questionTypeMasterId: "",
                gradeId: "",
                subjectId: "",
                themeId: "",
                chapterId: "",
                topicId: ""
            } as object)
        }
        if (isEdit) {
            getQuestionForEdit()
        }else{
            setTimeout(() => {
                getAllInitialData()
            },1000)
        }
    }, [])

    useEffect(()=>{
        if(methods?.getValues('subjectId')) QuestionTypeApi(methods?.getValues('subjectId'))
     },[methods?.getValues('subjectId')])

    const indexOfFunction = (id: number) => {
        return defaultQUestionTypes.indexOf(questionTypeData?.find((ele: any) => ele.id === id).type)
    }

    const comprehensiveQuestionTypeHandler = (array: any, questionType: any, index: number | null) => {
        const lastIndex = data?.length ? data[data.length - 1].index + 1 : 0
        const tempIndex = array[questionType]?.id
        const lastObject = { title: `comprehensive_${index ? lastIndex : 1}`, enable: true, questiontype: tempIndex, index: index ? lastIndex : 1 }
        if (index === null) {
            setData([lastObject])
            methods.setValue(`comprehensiveQuestionType_1`, array[questionType].id)
            methods.reset({
                ...methods.getValues(),
                [`hint_${1}`]: '',
                [`questionObjectiveId_${1}`]: '',
                [`question_${1}`]: '',
                [`completionTime_${1}`]: '',
                [`approach_${1}`]: '',
                [`questionOptions_${1}`]: [{ text: "", isCorrect: true, isFixed: false, order: 1 }, { text: "", isCorrect: true, isFixed: false, order: 2 }]
            })
            setKey(Math.random())
        } else {
            const temp = data.map((ele: any, ind: number) => {
                if (index === ind) {
                    ele.questiontype = tempIndex
                    return ele
                } else {
                    return ele
                }
            })
            setData(temp)
            const variableIndex=data[index].index
            methods.reset({
                ...methods.getValues(),
                [`comprehensiveQuestionType_${variableIndex}`]: array[questionType].id,
                [`hint_${variableIndex}`]: '',
                [`questionObjectiveId_${variableIndex}`]: '',
                [`questionLevelId_${variableIndex}`]: '',
                [`questionErrorTypes_${variableIndex}`]: [],
                [`question_${variableIndex}`]: '',
                [`marks_${variableIndex}`]: '',
                [`completionTime_${variableIndex}`]: '',
                [`approach_${variableIndex}`]: '',
                [`questionOptions_${variableIndex}`]: [{ text: "", isCorrect: true, isFixed: false, order: 1 }, { text: "", isCorrect: true, isFixed: false, order: 2 }]
            })
            setKey(Math.random())
        }
    }

    const addInputFn = (index: number) => {
        const lastIndex = data[data.length - 1].index + 1
        methods.setValue(`comprehensiveQuestionType_${lastIndex}`, data[data.length - 1].questiontype)       
        const enableFalse = data?.map((data: any, i: number) => {
            if (Number(index) == Number(i)) {
                return { ...data, enable: false };
            }
            return data;
        });          
        setData([...enableFalse, { ...data[data.length - 1], title: `comprehensive_${lastIndex}`, index: lastIndex }])
        methods.reset({
            ...methods.getValues(),
            [`hint_${lastIndex}`]: '',
            [`questionObjectiveId_${lastIndex}`]: '',
            [`question_${lastIndex}`]: '',
            [`completionTime_${lastIndex}`]: '',
            [`questionLevelId_${lastIndex}`]: '',
            [`questionErrorTypes_${lastIndex}`]: [],
            [`marks_${lastIndex}`]: '',
            [`approach_${lastIndex}`]: '',
            [`questionOptions_${lastIndex}`]: [{ text: "", isCorrect: true, isFixed: false, order: 1 }, { text: "", isCorrect: true, isFixed: false, order: 2 }]
        })
    }

    const deleteRow = (delInd: number) => {
        let filteredData: any = data.filter((item: any, i: number) => {
            return item.index !== delInd
        })
        Object.keys(methods.getValues()).forEach((element: any) => {
            if (Number(element.split("_")[1]) == delInd) {
                methods.unregister(element)
            }
        })
        setData([...filteredData])
        const enableTrue = filteredData.map((d: any, i: number) => {
            if ((filteredData?.length - 1) === i) {
                return { ...d, enable: true };
            }
            return d;
        });
        setData([...enableTrue])
    }

    const popupSelection=(status:boolean,selection:string)=>{
        switch (selection) {
            case "grade" :
                if(status){
                    selectGrade(null,latestId.element,true)
                    setGradeChangePopup(false)
                }else{
                    methods.setValue("gradeId",latestId.data)
                    setGradeChangePopup(false)            
                }
                break
            case "subject" :
                if(status){
                    selectSubject(null,latestId.element,true)
                    setSubjectChangePopup(false)
                }else{
                    methods.setValue("subjectId",latestId.data)
                    setSubjectChangePopup(false)            
                }
                break
            case "questionType" :
                if(status){
                    questionTypeHandler(questionTypeData, latestId.element,"index")
                    setQuestionChangePopup(false)
                }else{
                    methods.setValue("questionTypeMasterId",latestId.data)
                    setQuestionChangePopup(false)            
                }
                break
        }
    }
    const gradeFilterChanges = (e: any) => {
        setLatestId({ data: methods.getValues("gradeId"), element: e })
        if (methods.getValues("gradeId") && (methods.getValues("subjectId") || methods.getValues("questionTypeMasterId") ||  methods.getValues("themeId")|| methods.getValues("chapterId") )) {
            setGradeChangePopup(true)
        }
        else selectGrade(null, e,true)
    }
    const subjectFilterChanges = (e:any) => {
        setLatestId({ data: methods.getValues("subjectId"), element: e })
        if (methods.getValues("subjectId") && (methods.getValues("questionTypeMasterId") ||  methods.getValues("themeId") || methods.getValues("chapterId"))) {
            setSubjectChangePopup(true)
        }
        else selectSubject(null, e,true)
    }
    const questionFilterChanges = (e:any) => {
        setLatestId({ data: methods.getValues("questionTypeMasterId"), element: e })
        if ( methods.getValues("questionTypeMasterId")) {
            setQuestionChangePopup(true)
        }
        else questionTypeHandler(questionTypeData, e,"index") 
    }

    const questionDisable = () => {
        if (isEdit && !isDuplicate) {
            return true
        }
        else if(isEdit && isDuplicate){
            if(methods.getValues(['chapterId','subjectId','topicId']).includes('')){
                if(chapter?.length == 0){
                    return false
                }
                return true
            }
            return false
        }
        else {
            if (quesTypeEnabled || addNew) {
                return false               
            }else{
                return true
            }
        }
    }

    const saveAndAddNewDisFn = () =>{
        if (questionType == '3') {
            if (methods?.formState?.isValid && methods.getValues('blankMetaInfo')?.length) {
                setDisableBtnBtn(false) 
            } else {
                setDisableBtnBtn(true) 
            }
        }
        else if(questionType == '4'){
            let isTrue;
            data?.map((element: any, index: number) => {
                if ((element.questiontype == 3)) {
                    if (Object.fromEntries(Object.entries(methods.getValues()).filter(([key]) => key.includes('blankMetaInfo')))) {
                        let metalInfo = Object.fromEntries(Object.entries(methods.getValues()).filter(([key]) => key.includes('blankMetaInfo'))) as any;
                        let quesType = Object.fromEntries(Object.entries(methods.getValues()).filter(([key]) => key.includes('comprehensiveQuestionType'))) as any;
                        if (Object.values(quesType).includes(4)) {
                            Object.keys(metalInfo).forEach((a: any, i: number) => {
                                if (metalInfo[a]?.length) {
                                    isTrue = true as Boolean;
                                } else {
                                    isTrue = false as Boolean;
                                }
                            })
                        } else {
                            isTrue = true as Boolean;
                        }
                    }
                } else {
                    isTrue = true as Boolean;
                }
            })
            if(methods?.formState?.isValid && isTrue){
                setDisableBtnBtn(false) 
            } else {
                setDisableBtnBtn(true) 
            }
        }        
        else{
            if (methods?.formState?.isValid) {
                setDisableBtnBtn(false) 
            } else {
                setDisableBtnBtn(true) 
            }
        }
    }

    useEffect(() => {
      saveAndAddNewDisFn();
    }, [methods.getValues()]);

    useEffect(() => {
      setTimeout(() => {
        saveAndAddNewDisFn();
      }, 1500);
    }, []);

    const ObjectiveApi =async()=>{
        try {
            const response = await selectFieldApi("referencedata/question/objectives")
            if(response  && response !== undefined){
                setObjective(response)
            }else{
                setObjective([])
            }
        } catch (err) {
            console.log(err)
        }
    }
    const QuestionLevelApi =async()=>{
        try {
            const response = await selectFieldApi("referencedata/question/levels")
            if(response && response !== undefined){
                setQuestionLevel(response)
            }else{
                setQuestionLevel([])
            }
        } catch (err) {
            console.log(err)
        }
    }

    React.useEffect(()=>{
        // Fix for useEffect called twice
        if(shouldLog.current){
        shouldLog.current= false
        ObjectiveApi();
        QuestionLevelApi()
        }
    },[])

    const comprehensionMarksAndTime = (Key:string) =>{
        const returnkKeys = Object.keys(methods?.getValues())?.filter((str: any) => str?.includes(Key) && /\d/.test(str));
        return returnkKeys?.map((x: any) => {
            let val = methods?.getValues(x);
            return Number(val) || 0
        }).reduce((accumulator:any, currentValue:any) => Number(accumulator) + Number(currentValue), 0)
    }

    React.useEffect(()=>{
        if(questionType=='4'){
           methods?.setValue('marks',comprehensionMarksAndTime('marks') != 0 ? comprehensionMarksAndTime('marks') : '')
           methods?.setValue('completionTime',comprehensionMarksAndTime('completionTime') != 0 ? comprehensionMarksAndTime('completionTime') : '')
        }
    },[methods?.getValues()])


const handleSubmit = (e:any,data:string) => {
    e.preventDefault()
    onSubmit(methods.getValues(),data)
}

    return (
        <div className={styles.assessmentContainerCreatSect}>
            <FormProvider {...methods} >
                <form onSubmit={(e) => handleSubmit(e,"")}>
                    <h4 className='cursorPointer' onClick={() => { diffFn() }}><img src={goBack} />Go Back</h4>
                    <h1 className='assessmentTitles'>{(isEdit && !isDuplicate) ? 'Edit Question' : 'Create New Question'} </h1>
                    <div className={styles.questionBodyCont}>
                        <div className={styles.questionBodySect}>
                            <h2>Tag Question</h2>
                            <div className='row'>
                                <div className='col-6 mt-4'>
                                    <SelectBoxComponentForForm registerName="gradeId" variant={'fill'} selectedValue={''} clickHandler={(e: any) => gradeFilterChanges(e)} selectLabel={'Grade'} disabled={(isEdit && !isDuplicate)} selectList={grades} mandatory={true} showableLabel={"grade"} showableData={"es_gradeid"} menuHeader={"Select Grade"}/>
                                    {/* <ErrorText errors={methods.formState.errors ? methods.formState.errors : {}} registerName="gradeId" /> */}
                                </div>
                                <div className='col-6 mt-4'>
                                    <SelectBoxComponentForForm registerName="subjectId" variant={'fill'} selectedValue={''} clickHandler={(e: any) => subjectFilterChanges(e)} selectLabel={'Subject'} selectList={subject} disabled={(isEdit && !isDuplicate) ? true : subject.length > 0 ? false : true} mandatory={true} showableLabel={"courseDisplayName"} showableData={"courseId"} menuHeader={"Select Subject"}/>
                                    {/* <ErrorText errors={methods.formState.errors} registerName="subjectId" /> */}
                                </div>
                                <div className='col-12 mt-0'>
                                    <div className='d-flex justify-content-between' style={{gap: "20px"}}>
                                        <div className={`w-100 mt-4 ${(theme.length == 0 && methods?.getValues('subjectId')) ? 'd-none' : ''}`}>
                                            <SelectBoxComponentForForm registerName="themeId" variant={'fill'} selectedValue={''} clickHandler={undefined} selectLabel={'Theme'} selectList={theme} disabled={(isEdit && !isDuplicate) ? true : theme.length > 0 ? false : true} mandatory={methods?.getValues('subjectId') && theme?.length > 0 ? true : false} showableLabel={"syllabusName"} showableData={"syllabusID"} menuHeader={"Select Theme*"} />
                                            {/* <ErrorText errors={methods.formState.errors} registerName="themeId" /> */}
                                        </div>
                                        <div className={`w-100 mt-4`}>
                                            <SelectBoxComponentForForm registerName="chapterId" variant={'fill'} selectedValue={''} clickHandler={(e: any) => selectChapter(null, e)} selectLabel={'Chapter'} selectList={chapter} disabled={(isEdit && !isDuplicate) ? true : chapter.length > 0 ? false : true} mandatory={true} showableLabel={"chapterName"} showableData={"chapterId"} menuHeader={"Select Chapter"}/>
                                            {/* <ErrorText errors={methods.formState.errors} registerName="chapterId" /> */}
                                        </div>
                                        <div className={`w-100 mt-4`}>
                                            <SelectBoxComponentForForm registerName="topicId" variant={'fill'} selectedValue={''} clickHandler={(e: any) => selectTopic(topics,e)} selectLabel={'Topic'} selectList={topics} disabled={(isEdit && !isDuplicate) ? true : topics.length > 0 ? false : true} mandatory={true} showableLabel={"topicName"} showableData={"topicId"} menuHeader={"Select Topic"}/>
                                            {/* <ErrorText errors={methods.formState.errors} registerName="topicId" /> */}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className='mt-4'>
                                    {/* <SelectBoxComponentForForm registerName="questionTypeMasterId" variant={'fill'} selectedValue={''} disabled={questionDisable()} clickHandler={(e: number) => questionFilterChanges(e)} selectLabel={'Select Question Type'} selectList={questionTypeData} mandatory={true} showableLabel={"title"} showableData={"id"} menuHeader={"Search Question type..."}/> */}
                                    {/* <ErrorText errors={methods.formState.errors} registerName="questionTypeMasterId" /> */}
                                    <Selectsearch registerName="questionTypeMasterId" variant={'fill'} selectedValue={''} disabled={questionDisable()} clickHandler={(e: number) => {questionFilterChanges(e)}} selectLabel={'Select Question Type'} selectList={questionTypeData} mandatory={true} showableLabel={"title"} showableData={"id"} menuHeader={"Search Question type..."}/>
                                </div>
                                <div className='d-flex my-4' style={{ gap: "5px" }}>
                                    <InformativeIconComponent color="#F6BC0C" label="" title={tooltipText} />
                                    <SwitchComponentForForm registerName={"isPublic"} onChangeSwitch={handleSwitchChange} checked={false} disabled={false} beforeLabel={'Private'} afterLabel={'Public'} />
                                </div>
                                {(questionType == "0" || questionType == "1") &&
                                    <QuestionBody setSpinnerStatus={setSpinnerStatus} errors={methods.formState.errors} questionTypeStatus={parseInt(questionType)} setErrorSupport={setErrorSupport} errorSupport={errorSupport} addNewToggler={addNewToggler} key={key} />
                                }
                                {questionType == "2" &&
                                    <MatchFollowing setSpinnerStatus={setSpinnerStatus} errors={methods.formState.errors} isEdit={isEdit ? isEdit : null} addNewToggler={addNewToggler} setErrorSupport={setErrorSupport} errorSupport={errorSupport} key={key} />
                                }
                                {questionType == "3" &&
                                    <FillInTheBlanks setSpinnerStatus={setSpinnerStatus} errors={methods.formState.errors} isEdit={isEdit ? isEdit : false} setErrorSupport={setErrorSupport} errorSupport={errorSupport} addNewToggler={addNewToggler} key={key} />
                                }
                                {questionType == '4' &&
                                    <>
                                        <div className='row m-0 p-0'>
                                            <h2>Passage/ Extract*</h2>
                                            <TextEditorForForm setSpinnerStatus={setSpinnerStatus} registerName={`test`} textEditorSize='Medium' mandatory={true} addNewToggler={addNewToggler} key={key} />
                                        <div className='col-6 mt-3'>
                                            <InputFieldComponentForForm registerName={`marks`} inputType={"number"} label={'Marks'} required={true} onChange={() => { }} inputSize={"Large"} variant={""} maxLimit={99.99} steps={0.01} disabled={true} />
                                            {/* <ErrorText errors={errors} registerName={compIndex? `marks_${compIndex}` : `marks`}/> */}
                                        </div>
                                        <div className='col-6 mt-3'>
                                            <InputFieldComponentForForm registerName={`completionTime`} inputType={"number"} label={'Time in minutes'} required={false} onChange={() => { }} inputSize={"Large"} variant={""} maxLimit={1440} disabled={true} />
                                            {/* <ErrorText errors={errors} registerName={compIndex? `completionTime_${compIndex}` : `completionTime` }/> */}
                                        </div>
                                        <div className='col-6 my-4'>
                                            <SelectBoxComponentForForm registerName={`questionLevelId`} variant={'fill'} selectedValue={''} clickHandler={undefined} selectLabel={'Difficulty'} selectList={questionLevel} mandatory={true} showableLabel={"level"} showableData={"id"} />
                                            {/* <ErrorText errors={errors} registerName={compIndex? `questionLevelId_${compIndex}` : `questionLevelId`}/> */}
                                        </div>
                                        <div className='col-6 my-4'>
                                            <SelectBoxComponentForForm registerName={`questionObjectiveId`} variant={'fill'} selectedValue={''} clickHandler={undefined} selectLabel={'Objectives'} selectList={objective} mandatory={false} showableLabel={"name"} showableData={"id"} />
                                            {/* <ErrorText errors={errors} registerName={compIndex? `questionObjectiveId_${compIndex}` : `questionObjectiveId`}/> */}
                                        </div>
                                       
                                            {data.length===0 &&<div className='my-4'>
                                                <Selectsearch registerName={`comprehensiveQuestionType_${data.length ? data[0].index : 1}`} variant={'fill'} selectedValue={''} disabled={false} clickHandler={(e: number) => comprehensiveQuestionTypeHandler(comprehensiveQuestionTypeData, e, data.length ? 0 : null)} selectLabel={'Select Question Type'} selectList={comprehensiveQuestionTypeData} mandatory={true} showableLabel={"title"} showableData={"id"} menuHeader={"Search Question type..."}/>
                                                {/* <ErrorText errors={methods.formState.errors} registerName={`comprehensiveQuestionType_${data.length ? data[0].index : 1}`} /> */}
                                            </div>}
                                        </div>
                                        {data.length > 0 && data?.map((element: any, index: number) => (
                                            <>
                                                {index !== 0 &&
                                                    <div className="dashed_line"></div>
                                                }
                                                {data.length > 1 ?
                                                    <div className='col-12 pt-2 d-flex justify-content-end'>
                                                        <ButtonComponent icon={<Delete />} image={""} textColor="#000000" backgroundColor="" disabled={false} buttonSize="Medium" type="trnasparent" onClick={() => {setDeleteComprehensiveModal(true); setDeletableQuestion(element.index) }} label="Delete" minWidth="" hideBorder={true} />
                                                    </div> : null
                                                }
                                                {<div className='my-4'>
                                                    <Selectsearch registerName={`comprehensiveQuestionType_${element.index}`} variant={'fill'} selectedValue={''} disabled={false} clickHandler={(e: number) => comprehensiveQuestionTypeHandler(comprehensiveQuestionTypeData, e, index)} selectLabel={'Select Question Type'} selectList={comprehensiveQuestionTypeData} mandatory={true} showableLabel={"title"} showableData={"id"} menuHeader={"Search Question type..."}/>
                                                    {/* <ErrorText errors={methods.formState.errors} registerName={`comprehensiveQuestionType_${element.index}`} /> */}
                                                </div>}
                                                {(getComprehensiveMaterType(element.questiontype , questionTypeData) == 0 || getComprehensiveMaterType(element.questiontype , questionTypeData) == 1) && <QuestionBody setSpinnerStatus={setSpinnerStatus} errors={methods.formState.errors} questionTypeStatus={getComprehensiveMaterType(element.questiontype , questionTypeData)} compIndex={element.index} title={element?.title} questionIndex={index + 1} setErrorSupport={setErrorSupport} errorSupport={errorSupport} addNewToggler={addNewToggler} key={key}/>}
                                                {getComprehensiveMaterType(element.questiontype , questionTypeData) == 2 && <MatchFollowing setSpinnerStatus={setSpinnerStatus} errors={methods.formState.errors} compIndex={element.index} questionIndex={index + 1} isEdit={isEdit} setErrorSupport={setErrorSupport} errorSupport={errorSupport} addNewToggler={addNewToggler} key={key}/>}
                                                {getComprehensiveMaterType(element.questiontype , questionTypeData) == 3 && <FillInTheBlanks setSpinnerStatus={setSpinnerStatus} errors={methods.formState.errors} compIndex={element.index} questionIndex={index + 1} isEdit={isEdit} setErrorSupport={setErrorSupport} errorSupport={errorSupport}  addNewToggler={addNewToggler} key={key}/>}
                                                {getComprehensiveMaterType(element.questiontype , questionTypeData) !== (null || undefined) && (element?.enable == true) &&
                                                    <div className='questionCompAddOptionSect compAddBtnSect'>
                                                        <div>
                                                            <ButtonComponent icon={<AddIcon />} image={""} textColor="#01B58A" backgroundColor="#01B58A" disabled={data.length > 9 ? true :false} buttonSize="Medium" type="transparent" onClick={() => { addInputFn(index) }} label="Add Another Question" minWidth="210" hideBorder={true}/>
                                                        </div>
                                                    </div>
                                                }
                                            </>
                                        ))}
                                    </>
                                }
                                <div className='col-12 d-flex justify-content-end mt-4 mb-2 pt-2' style={{ gap: "20px" }}>
                                    <ButtonComponent status={"submit"} icon={""} image={""} textColor="" backgroundColor="#01B58A" buttonSize="Large" type="contained" onClick={() => {}} disabled={disableBtn} label="Save" minWidth="200" />
                                    <ButtonComponent status={"button"} icon={""} image={""} textColor="#1B1C1E" backgroundColor="#01B58A" disabled={disableBtn} onClick={(e:any) => { onSubmit(methods?.getValues(),"addNew") }} buttonSize="Large" type="outlined" label="Save & Add New" minWidth="200" />
                                    <ButtonComponent icon={""} image={""} textColor="#1B1C1E" backgroundColor="#01B58A" disabled={false} buttonSize="Large" type="outlined" onClick={diffFn} label="Cancel" minWidth="200" />
                                </div>
                            </div>
                            {saveAndCon && <ModalPopup open={saveAndCon} clickHandler={() => {onSubmit(methods?.getValues(),""); setSaveAndCon(false) }} onClose={() => { setSaveAndCon(false) }} pathname={'/assess/questionbank'} />}
                            {continueEditing && <EditingModal open={continueEditing} onClose={() => { setcontinueEditing(false)}} pathname={'/assess/questionbank'} />}
                            <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />
                            {spinnerStatus && <Spinner />}            
                            <DeleteModalComponent open={deleteComprehensiveModal} onClose={() => { setDeleteComprehensiveModal(false)}} descriptionText={"Selected Question will be deleted from the list,Its not revertible, do you wish to continue?"} title={`Delete the Selected Question`} deleteHandler={()=>{deleteRow(deletableQuestion);setDeleteComprehensiveModal(false)}}/>
            <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />
            {dupliacteEntry && <ModalPopupDuplicate open={dupliacteEntry} onClose={() => { setDuplicateEntry(false)}} />}
            <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />
                                <DynamicModalPopup open={gradeChangePopup} clickHandler={(e:boolean)=>popupSelection(e,"grade")} content={popupMessages("grade")} header="You will lose your progress" label1='Continue' label2='Cancel' onClose={()=>{setGradeChangePopup(false);popupSelection(false,"grade")}} />
                                <DynamicModalPopup open={subjectChangePopup} clickHandler={(e:boolean)=>popupSelection(e,"subject")} content={popupMessages("subject")} header="You will lose your progress" label1='Continue' label2='Cancel' onClose={()=>{setSubjectChangePopup(false);popupSelection(false,"subject")}} />
                                <DynamicModalPopup open={questionChangePopup} clickHandler={(e:boolean)=>popupSelection(e,"questionType")} content={popupMessages("question type")} header="You will lose your progress" label1='Continue' label2='Cancel' onClose={()=>{setQuestionChangePopup(false);popupSelection(false,"questionType")}} />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default CreateNewQuestion;