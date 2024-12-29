import React, { useState, useEffect } from 'react';
import ButtonComponent from '../../../SharedComponents/ButtonComponent/ButtonComponent';
import SwitchComponent from '../../../SharedComponents/SwitchComponent/SwitchComponent';
import TextEditor from '../../../SharedComponents/TextEditor/TextEditor';
import AddIcon from '@mui/icons-material/Add';
import Delete from "../../../../assets/images/delete.svg";
import "./QuestionComponent.css"
import TextEditorForForm from '../../../SharedComponents/FormFieldComponents/TextEditor';
import SwitchComponentForForm from '../../../SharedComponents/FormFieldComponents/SwitchComponentForForm';
import { useFormContext, useFieldArray } from "react-hook-form"
import ErrorText from '../../../SharedComponents/ErrorText/ErrorText';

interface Props {
    questionType: number | undefined;
    registerName: string,
    errors: any,
    compIndex?: number,
    addNewToggler?:boolean,
    key?:number,
    setSpinnerStatus?:(e:any)=>void
};

const QuestionComponent: React.FC<Props> = ({  setSpinnerStatus,questionType, registerName, key, compIndex, addNewToggler }) => {
    const { unregister, setValue, control, getValues, watch, clearErrors } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: registerName
    });
    // const [dynamicForMCQ, setDynamicForMCQ] = useState<any>([0, 1])

    // const addOption = () => {
    //     setDynamicForMCQ([...dynamicForMCQ, dynamicForMCQ[dynamicForMCQ.length - 1] + 1])
    // }
    // const deleteOption = (index: number, registeredName: string) => {
    //     if (dynamicForMCQ.length > 2) {
    //         setDynamicForMCQ(dynamicForMCQ.filter((ele: number) => ele !== index))
    //         unregister(registeredName)
    //     }
    // }
    const handleAppend = () => {
        append({ text: "", isCorrect: true, isFixed: false });
    };

    /*Remove Array in FormField*/
    const handleRemove = (index: any) => {
        remove(index);
    };
    useEffect(() => {
        if (getValues(registerName)) {
            const allowed = getValues(registerName).some((ele: any) => ele.isCorrect === true)
            if (allowed) {
                clearErrors("correctAnswer")
            }
        }
    }, [getValues(registerName) && getValues(registerName).some((ele: any) => ele.isCorrect === true)])

    return (
        <>
            {(questionType == 1 || questionType == 2) &&
                <div className='row m-0 p-0'>
                    <h2>Model Answer* (Will be used to create model answer paper)</h2>
                    <div className='col-12 mt-3 mb-4'>
                        <TextEditorForForm setSpinnerStatus={setSpinnerStatus} registerName={compIndex ? `solution_${compIndex}` : `solution`} textEditorSize='Medium' mandatory={true} addNewToggler={addNewToggler} key={key} />
                        {/* <ErrorText errors={errors} registerName={compIndex ? `solution_${compIndex}` : `solution`} /> */}
                    </div>
                </div>
            }

            {questionType == 0 &&
                <div className='row m-0 p-0'>
                    {/* {
                        dynamicForMCQ && dynamicForMCQ.map((ele: any, index: number) => {
                            return <div>
                                <h2>Option {index + 1}*</h2>
                                <div className='col-12 mt-3 mb-4'>
                                    <div className='questionTypeOptionSect'>
                                        <div className='questionTypeOptionSectSwitch'>
                                            <SwitchComponentForForm registerName={`fieldTypeAnswer[${index}].correctAnswer`} onChangeSwitch={() => { }} checked={true} disabled={false} beforeLabel={'Correct Answer'} afterLabel={''} />
                                            <SwitchComponentForForm registerName={`fieldTypeAnswer[${index}].shuffle`} onChangeSwitch={() => { }} checked={true} disabled={false} beforeLabel={'Shuffle'} afterLabel={''} />
                                            {dynamicForMCQ.length > 2 && <h4 className='align-items-center fontW600 m-0'>Delete <img width="26px" src={Delete} onClick={() => deleteOption(ele, `fieldTypeAnswer[${index}]`)} /></h4>}
                                        </div>
                                        <div className='questionTypeOptionSectEditor'>
                                            <TextEditorForForm registerName={`fieldTypeAnswer[${index}].answerOption`} textEditorSize='Medium' mandatory={true} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        })
                    } */}
                    {fields.map(({ id }: any, index: any) => {
                        setValue(`${registerName}[${index}].order`, index + 1)
                        return <div>
                           <h2>Option {index + 1}*</h2>
                            <div className='col-12 mt-3 mb-4' id={id}>
                                <div className='questionTypeOptionSect'>
                                    <div className='questionTypeOptionSectSwitch'>
                                        <SwitchComponentForForm registerName={`${registerName}[${index}].isCorrect`} onChangeSwitch={() => { }} checked={true} disabled={false} beforeLabel={'Correct Answer'} afterLabel={''} />
                                        <SwitchComponentForForm registerName={`${registerName}[${index}].isFixed`} onChangeSwitch={() => { }} checked={false} disabled={false} beforeLabel={'Shuffle'} afterLabel={''} />
                                        {fields.length > 2 && <h4 className='align-items-center fontW600 m-0'>Delete <img width="26px" src={Delete} onClick={() => handleRemove(index)} /></h4>}
                                    </div>
                                    <div className='questionTypeOptionSectEditor'>
                                        <TextEditorForForm setSpinnerStatus={setSpinnerStatus} registerName={`${registerName}[${index}].text`} textEditorSize='Medium' mandatory={true} addNewToggler={addNewToggler} key={key} />
                                    </div>
                                </div>

                            </div>
                        </div>
                    })}
                    {/* <ErrorText errors={errors} registerName={registerName} /> */}
                    {/* <ErrorText errors={errors} registerName="correctAnswer" /> */}
                    <div className='questionCompAddOptionSect'>
                        <div>
                            <ButtonComponent icon={<AddIcon />} image={""} textColor="#01B58A" backgroundColor="#01B58A" disabled={fields.length > 5 ? true : false} buttonSize="Medium" type="transparent" onClick={() => { handleAppend() }} label="Add Another Option" minWidth="200" hideBorder={true}/>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default QuestionComponent;