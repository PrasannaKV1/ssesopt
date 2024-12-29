import React, { useState, useEffect } from 'react';
import QuestionBody from '../QuestionBody/QuestionBody';
import FIBTextEditor from '../../../SharedComponents/FormFieldComponents/FIBTextEditor';
import { useFormContext } from "react-hook-form"
import { v4 as uuidv4 } from 'uuid';
import ErrorText from '../../../SharedComponents/ErrorText/ErrorText';

interface Props {
    errors: object,
    compIndex?: number,
    isEdit?: boolean,
    questionIndex?: number,
    setErrorSupport:any,
    errorSupport:any,
    addNewToggler?:boolean,
    key?: number,
    setSpinnerStatus?:(e:any)=>void
}
const FillInTheBlanks: React.FC<Props> = ({setSpinnerStatus,errors, compIndex, isEdit, questionIndex,setErrorSupport,errorSupport, addNewToggler,key }) => {
    const { getValues, setValue ,clearErrors} = useFormContext();
    const [uniqueArr, setUniqueArr] = useState<any[]>([])
    // const getEditUniqueArr = () => {
    //     let question = getValues("question")
    //     const findableValue = `<span class="ql-formula" data-value="_______________">﻿<span contenteditable="false"><span class="katex-error" title="ParseError: KaTeX parse error: Expected group after '_' at position 1: _̲______________" style="color:#f00">_______________</span></span>﻿</span>`
    //     const finalArray: any = []
    //     question = question.replaceAll("&nbsp;", " ")
    //     question = question.replaceAll("<p>", "")
    //     question.split(findableValue).forEach((ele: string, index: any) => {
    //         const id = uuidv4();
    //         const tempIndex = question.indexOf(findableValue)
    //         if (tempIndex !== -1) {
    //             finalArray.push({ index: tempIndex, id: id, labelId: index + 1 })
    //             question = question.replace(findableValue, " ")
    //         }
    //     })
    //     console.log(finalArray)
    //     setUniqueArr(finalArray)
    // }

    useEffect(() => {
        if(uniqueArr.length >= 1){
            clearErrors(compIndex ? `blankMetaInfo_${compIndex}` : 'blankMetaInfo')
        }
    }, [uniqueArr])

    return (
        <div className='row'>
            <h2>{questionIndex ? `Question ${questionIndex} *` : "Question*"}</h2>
            <div className='col-12 mt-3 mb-4'>
                <FIBTextEditor setSpinnerStatus={setSpinnerStatus} registerName={compIndex ? `question_${compIndex}` : "question"} textEditorSize='Medium' mandatory={true} fillInTheBlanks={true} uniqueArr={uniqueArr} setUniqueArr={setUniqueArr} isEdit={isEdit ? isEdit : false} compIndex={compIndex} addNewToggler={addNewToggler} key={key} />
                {/* <ErrorText errors={errors} registerName={compIndex ? `question_${compIndex}` : "question"} /> */}
            </div>
            <QuestionBody setSpinnerStatus={setSpinnerStatus} errors={errors} questionTypeStatus={3} uniqueArr={uniqueArr} compIndex={compIndex}  setErrorSupport={setErrorSupport} errorSupport={errorSupport} addNewToggler={addNewToggler} key={key} />
        </div>
    );
};

export default FillInTheBlanks;