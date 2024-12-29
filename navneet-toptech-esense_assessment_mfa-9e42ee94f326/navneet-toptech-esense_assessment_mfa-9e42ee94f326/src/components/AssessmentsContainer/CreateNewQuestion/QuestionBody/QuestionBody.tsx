import React, { useRef, useState } from 'react';
import QuestionComponent from '../QuestionComponent/QuestionComponent';
import { useFormContext } from "react-hook-form"
import TextEditorForForm from '../../../SharedComponents/FormFieldComponents/TextEditor';
import SelectBoxComponentForForm from '../../../SharedComponents/FormFieldComponents/SelectBoxComponent';
import InputFieldComponentForForm from '../../../SharedComponents/FormFieldComponents/InputFieldComponent';
import { selectFieldApi, selectFieldErrorApi } from '../../../../Api/AssessmentTypes';
import MultiSelectComponent from '../../../SharedComponents/FormFieldComponents/MultiSelectComponent';
import ErrorText from '../../../SharedComponents/ErrorText/ErrorText';
interface Props {
    questionTypeStatus?: number | undefined;
    errors?:any;
    compIndex?:number;
    title?:string;
    uniqueArr?:any;
    questionIndex?:number;
    setErrorSupport:any;
    errorSupport:any;
    addNewToggler?:boolean,
    key?:number,
    setSpinnerStatus?:(e:any)=>void
};
const QuestionBody: React.FC<Props> = ({setSpinnerStatus,questionTypeStatus,errors,uniqueArr,compIndex,questionIndex,setErrorSupport,errorSupport,addNewToggler,key}) => {
    let shouldLog = useRef(true)
    const[questionLevel,setQuestionLevel] = useState<string[]>([])
    const[objective,setObjective] = useState<any>([])
    const[errorTypes,setErrorTypes] = useState<any>([])
    const { setValue,setError,getValues } = useFormContext(); 

    const errorTypeApi =async(courseId:string)=>{
        try {
            const response = await selectFieldErrorApi(courseId)
            if(response && response?.baseResponse && response?.baseResponse?.data?.length ){                      
                setErrorTypes(response?.baseResponse?.data) 
            }else{
                setErrorTypes([])
                setError(`${compIndex? `questionErrorTypes_${compIndex}` : `questionErrorTypes`}`,{type:"custom",message: ''})
            }
        } catch (err) {
            console.log(err)
        }
    }
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
    
    React.useEffect(() => {
        if (getValues('subjectId')) errorTypeApi(getValues('subjectId'));
    }, [getValues('subjectId')])  
    
    return (
        <div className='row'>
            {/* {questionTypeStatus == 1 &&
                <div className='row m-0 p-0'>
                    <h2>Passage/ Extract</h2>
                    <TextEditorForForm registerName={``} textEditorSize='Medium' mandatory={false} />
                    <div className='my-4'>
                        <SelectBoxComponentForForm registerName="comprehensiveQuestionType" variant={'fill'} selectedValue={''} disabled={false} clickHandler={(e: number) => comprehensiveQuestionTypeHandler(questionTypeData, e)} selectLabel={'Select Question Type'} selectList={questionTypeData} mandatory={true} showableLabel={"type"} showableData={"id"} />
                        <ErrorText errors={methods.formState.errors} registerName="comprehensiveQuestionType" />
                    </div>
                </div>
            }
            {comprehensiveSelectType == 0 &&
                <ComprehensiveQuestionType />
            } */}
            {questionTypeStatus == 3 &&
                <>
                    {uniqueArr?.length ? uniqueArr.map((ele: any, index: number) => {
                        setValue(compIndex ? `blankMetaInfo_${compIndex}.${ele.labelId}.order` : `blankMetaInfo.${ele.labelId}.order`, index + 1)
                        return <React.Fragment key={ele?.labelId}>
                            <h2>Model Answer for Blank {index + 1}* (Will be used to create model answer paper)</h2>
                            <div className='col-12 mt-3 mb-4'>
                                <TextEditorForForm setSpinnerStatus={setSpinnerStatus} registerName={compIndex ? `blankMetaInfo_${compIndex}.${ele.labelId}.text` : `blankMetaInfo.${ele.labelId}.text`} textEditorSize='Medium' mandatory={true} addNewToggler={addNewToggler} key={key} />
                            </div>
                        </React.Fragment>
                    })
                        : null
                    }
                    {errors[compIndex ? `question_${compIndex}` : "question"] ? <></> :<ErrorText errors={errors} registerName={compIndex ? `blankMetaInfo_${compIndex}` : `blankMetaInfo`} />}
                </>
            }
            { questionTypeStatus !== 3 && questionTypeStatus !== 5  &&
            <React.Fragment>
             <h2>{questionIndex ? `Question ${questionIndex} *`:"Question*"}</h2>
            <div className='col-12 mt-3 mb-4'>
                <TextEditorForForm setSpinnerStatus={setSpinnerStatus} registerName={compIndex ? `question_${compIndex}` : `question` } textEditorSize='Medium' mandatory={true} addNewToggler={addNewToggler} key={key} />
                {/* <ErrorText errors={errors} registerName={compIndex ? `question_${compIndex}` : `question` }/> */}
            </div>
            </React.Fragment>
            }
            <h2>{'Question Details*'}</h2>
            <div className='col-6 mt-2'>
                <InputFieldComponentForForm registerName={compIndex? `marks_${compIndex}` : `marks`} inputType={"number"} label={'Marks'} required={true} onChange={() => { }} inputSize={"Large"} variant={""} maxLimit={99.99} steps={0.01}/>
                {/* <ErrorText errors={errors} registerName={compIndex? `marks_${compIndex}` : `marks`}/> */}
            </div>
            <div className='col-6 mt-2'>
                <InputFieldComponentForForm registerName={compIndex? `completionTime_${compIndex}` : `completionTime` } inputType={"number"} label={'Time in minutes'} required={false} onChange={() => { }} inputSize={"Large"} variant={""} maxLimit={1440}/>
                {/* <ErrorText errors={errors} registerName={compIndex? `completionTime_${compIndex}` : `completionTime` }/> */}
            </div>
            <div className='col-6 my-4'>
                <SelectBoxComponentForForm registerName={compIndex? `questionLevelId_${compIndex}` : `questionLevelId`} variant={'fill'} selectedValue={''} clickHandler={undefined} selectLabel={'Difficulty'} selectList={questionLevel} mandatory={true} showableLabel={"level"} showableData={"id"}/>
                {/* <ErrorText errors={errors} registerName={compIndex? `questionLevelId_${compIndex}` : `questionLevelId`}/> */}
            </div>
            <div className='col-6 my-4'>
                <SelectBoxComponentForForm registerName={compIndex? `questionObjectiveId_${compIndex}` : `questionObjectiveId`} variant={'fill'} selectedValue={''} clickHandler={undefined} selectLabel={'Objectives'} selectList={objective} mandatory={false}  showableLabel={"name"} showableData={"id"}/>
                {/* <ErrorText errors={errors} registerName={compIndex? `questionObjectiveId_${compIndex}` : `questionObjectiveId`}/> */}
            </div>
            {/* <h2>Error Type* (Tag the errors a student can make for this question)</h2>
            <div className='col-12 mt-3 mb-4'>
                <MultiSelectComponent registerName={compIndex? `questionErrorTypes_${compIndex}` : `questionErrorTypes`} options={errorTypes} onChange={(e: any) =>{}} mandatory={true} disable={false} multiType={"Multi2"} multiLabel={"Select Multiple Error Type"} showableLabel={"name"} showableData={"id"}  setErrorSupport={setErrorSupport} errorSupport={errorSupport}/>
                <ErrorText errors={errors} registerName={compIndex? `questionErrorTypes_${compIndex}` : `questionErrorTypes`}/>
            </div> */}
            <QuestionComponent  setSpinnerStatus={setSpinnerStatus} registerName={compIndex? `questionOptions_${compIndex}` : `questionOptions`} questionType={questionTypeStatus} errors={errors} compIndex={compIndex} addNewToggler={addNewToggler} key={key}/>
            <h2>Hint</h2>
            <div className='hint_texEditor col-12 mt-3 mb-4'>
                <TextEditorForForm setSpinnerStatus={setSpinnerStatus} registerName={compIndex? `hint_${compIndex}` : `hint`} textEditorSize='Small' mandatory={false} addNewToggler={addNewToggler} key={key} />
                {/* <ErrorText errors={errors} registerName={compIndex? `hint_${compIndex}` : `hint`}/> */}
            </div>
            <h2>Approach</h2>
            <div className='approach_textEditor col-12 mt-3 mb-4'>
                <TextEditorForForm setSpinnerStatus={setSpinnerStatus} registerName={compIndex? `approach_${compIndex}` : `approach`} textEditorSize='Small' mandatory={false} addNewToggler={addNewToggler} key={key} />
                {/* <ErrorText errors={errors} registerName={compIndex? `approach_${compIndex}` : `approach`}/> */}
            </div>
        </div>
    );
};

export default QuestionBody;