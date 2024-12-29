import React from 'react';
import ButtonComponent from '../../../SharedComponents/ButtonComponent/ButtonComponent';
import ErrorText from '../../../SharedComponents/ErrorText/ErrorText';
import InputFieldComponentForForm from '../../../SharedComponents/FormFieldComponents/InputFieldComponent';
import MultiSelectComponent from '../../../SharedComponents/FormFieldComponents/MultiSelectComponent';
import SelectBoxComponentForForm from '../../../SharedComponents/FormFieldComponents/SelectBoxComponent';
import TextEditorForForm from '../../../SharedComponents/FormFieldComponents/TextEditor';
import AddIcon from '@mui/icons-material/Add';

const ComprehensiveQuestionType = () => {
    return (
        <div className='row'>
             <h2>Question 1*</h2>
            <div className='col-12 mt-3 mb-4'>
                <TextEditorForForm registerName="question" textEditorSize='Medium' mandatory={true} />
                {/* <ErrorText errors={errors} registerName="question"/> */}
            </div>
            <h2>Question Details*</h2>
            <div className='col-6 mt-2'>
                <InputFieldComponentForForm registerName="marks" inputType={"text"} label={'Marks'} required={true} onChange={() => { }} inputSize={"Large"} variant={""} maxLimit={100} steps={0.01}/>
                {/* <ErrorText errors={errors} registerName="marks"/> */}
            </div>
            <div className='col-6 mt-2'>
                <InputFieldComponentForForm registerName="completionTime" inputType={"number"} label={'Time in minutes'} required={false} onChange={() => { }} inputSize={"Large"} variant={""} maxLimit={1440}/>
                {/* <ErrorText errors={errors} registerName="completionTime"/> */}
            </div>
            <div className='col-6 my-4'>
                <SelectBoxComponentForForm registerName="questionLevelId" variant={'fill'} selectedValue={''} clickHandler={undefined} selectLabel={'Difficulty'} selectList={[]} mandatory={true} showableLabel={"level"} showableData={"id"}/>
                {/* <ErrorText errors={errors} registerName="questionLevelId"/> */}
            </div>
            <div className='col-6 my-4'>
                <SelectBoxComponentForForm registerName="questionObjectiveId" variant={'fill'} selectedValue={''} clickHandler={undefined} selectLabel={'Objectives'} selectList={[]} mandatory={true}  showableLabel={"name"} showableData={"id"}/>
                {/* <ErrorText errors={errors} registerName="questionObjectiveId"/> */}
            </div>
            <h2>Error Type* (Tag the errors a student can make for this question)</h2>
            <div className='col-12 mt-3 mb-4'>
                {/* <MultiSelectComponent registerName="questionErrorTypes" options={[]} onChange={(e: any) =>{}} mandatory={true} disable={false} multiType={"Multi2"} multiLabel={"Select Multiple Error Type"} showableLabel={"name"} showableData={"id"}/> */}
                {/* <ErrorText errors={errors} registerName="questionErrorTypes"/> */}
            </div>
            <h2>Model Answer* (Will be used to create model answer paper)</h2>
            <div className='col-12 mt-3 mb-4'>
                <TextEditorForForm registerName="question" textEditorSize='Medium' mandatory={true} />
                {/* <ErrorText errors={errors} registerName="question"/> */}
            </div>
            <h2>Hint</h2>
            <div className='col-12 mt-3 mb-4'>
                <TextEditorForForm registerName="question" textEditorSize='Small' mandatory={true} />
                {/* <ErrorText errors={errors} registerName="question"/> */}
            </div>
            <h2>Approach</h2>
            <div className='col-12 mt-3 mb-4'>
                <TextEditorForForm registerName="question" textEditorSize='Small' mandatory={true} />
                {/* <ErrorText errors={errors} registerName="question"/> */}
            </div>
            <div className='questionCompAddOptionSect compAddBtnSect'>
                <div>
                    <ButtonComponent icon={<AddIcon />} image={""} textColor="#01B58A" backgroundColor="#01B58A" disabled={false} buttonSize="Medium" type="transparent" onClick={() => {}} label="Add Another Question" minWidth="" />
                </div>
            </div>
        </div>
    );
};

export default ComprehensiveQuestionType;