import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../../SharedComponents/ButtonComponent/ButtonComponent';
import { ReactComponent as Delete } from "../../../../assets/images/delete.svg";
import { ReactComponent as Undo } from "../../../../assets/images/Undo.svg";
import { ReactComponent as Redo } from "../../../../assets/images/Redo.svg";
import AddIcon from '@mui/icons-material/Add';
import "./MatchFollowing.css"
import QuestionBody from './QuestionBody';
import { useFormContext, useFieldArray } from "react-hook-form"
import SwitchComponentForForm from '../../../SharedComponents/FormFieldComponents/SwitchComponentForForm';
import TextEditorForForm from '../../../SharedComponents/FormFieldComponents/TextEditor';
import ErrorText from '../../../SharedComponents/ErrorText/ErrorText';
import InputFieldComponentForForm from '../../../SharedComponents/FormFieldComponents/InputFieldComponent';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

interface Props {
    errors: object,
    compIndex?: number,
    isEdit?: boolean | null,
    questionIndex?: number,
    addNewToggler?: boolean,
    setErrorSupport:any,
    errorSupport:any,
    key?: number,
    setSpinnerStatus?:(e:any)=>void
}
const MatchFollowing: React.FC<Props> = ({setSpinnerStatus,errors, compIndex, isEdit, questionIndex, addNewToggler ,setErrorSupport,errorSupport,key}) => {
    const [toggleDeleteRowBtn, setToggleDeleteRowBtn] = useState(false);
    const [toggleDeleteColBtn, setToggleDeleteColBtn] = useState(false);
    const [historyData, setHistoryData] = useState<any>({})
    const [redoHistory, setRedoHistory] = useState<any>({})
    const { unregister, register, setValue, control, getValues } = useFormContext();
    const [deleteSelectOpen, setDeleteSelectOpen] = React.useState(false);
    const [firstRender, setFirstRender] = React.useState(true);
    const [firstRenderForAddNew, setFirstRenderForAddNew] = React.useState(false);
    const [deleteRowSelectOpen, setDeleteRowSelectOpen] = React.useState(false);
    // const { fields, append, remove } = useFieldArray({
    //     control,
    //     name: "options"
    // });
    const [data, setData] = useState<any>({
        "0":
        {
            "0": { text: "", shuffle: true },
            "1": { text: "", shuffle: true }
        },
        "1": {
            '0': { text: "", shuffle: true },
            "1": { text: "", shuffle: true }
        }
    })

    // const handleAppend = () => {
    //     append({ text: "", isCorrect: true, isFixed: true });
    // };

    // /*Remove Array in FormField*/
    // const handleRemove = (index: any) => {
    //     remove(index);
    // };
    const aliginingData = () => {
        if (compIndex) {
            const temperorayAllignData: any = {}
            const questionOPtions: any = getValues(`questionMTFOptions_${compIndex}`)
            if (questionOPtions.length) {
                questionOPtions.map((ele: any, ind: number) => {
                    setValue(`columntitle_${compIndex}[${ind}]`, ele.columnLabel)
                    ele.details.map((element: any, index: number) => {
                        if (ind === 0) {
                            setValue(`data_${compIndex}.${index}.${ind}.text`, element.question)
                            setValue(`data_${compIndex}.${index}.${ind}.shuffle`, element.isShuffle)
                            // temperorayAllignData.index.ind= { ques: "", shuffle: true }
                        } else {
                            setValue(`data_${compIndex}.${index}.${ind}.text`, element.question)
                            setValue(`data_${compIndex}.${index}.${ind}.shuffle`, element.isShuffle)
                            // temperorayAllignData.index.ind= { text: "", shuffle: true }
                        }
                    })
                })
                questionOPtions[0].details.map((ele: any, index: number) => {
                    temperorayAllignData[`${index}`] = questionOPtions.length == 2 ? { "0": { text: "", shuffle: true }, "1": { text: "", shuffle: true } } : { '0': { text: "", shuffle: true }, "1": { text: "", shuffle: true }, "2": { text: "", shuffle: true } }
                })
                setData(temperorayAllignData)
            }
        } else {
            const temperorayAllignData: any = {}
            const questionOPtions: any = getValues(`questionMTFOptions`)
            if (questionOPtions?.length) {
                questionOPtions.map((ele: any, ind: number) => {
                    setValue(`columntitle[${ind}]`, ele.columnLabel)
                    ele.details.map((element: any, index: number) => {
                        if (ind === 0) {
                            setValue(`data.${index}.${ind}.text`, element.question)
                            setValue(`data.${index}.${ind}.shuffle`, element.isShuffle)
                            // temperorayAllignData.index.ind= { ques: "", shuffle: true }
                        } else {
                            setValue(`data.${index}.${ind}.text`, element.question)
                            setValue(`data.${index}.${ind}.shuffle`, element.isShuffle)
                            // temperorayAllignData.index.ind= { ans: "", shuffle: true }
                        }
                    })
                })
                questionOPtions[0].details.map((ele: any, index: number) => {
                    temperorayAllignData[`${index}`] = questionOPtions.length == 2 ? { "0": { text: "", shuffle: true }, "1": { text: "", shuffle: true } } : { '0': { text: "", shuffle: true }, "1": { text: "", shuffle: true }, "2": { text: "", shuffle: true } }
                })
                setData(temperorayAllignData)
            }
        }
    }
    useEffect(() => {
        if (isEdit &&firstRender&& (getValues(`questionMTFOptions_${compIndex}`) || getValues(`questionMTFOptions`))) {
            aliginingData()
            setFirstRender(false)
        }
    }, [getValues(`questionMTFOptions_${compIndex}`), getValues(`questionMTFOptions`)])

    const getFirstIndex = (obj: object) => {
        return Object.keys(obj)[0]
    }
    const indexForColTitle = (index: number) => {
        const temp = Object.keys(data[Object.keys(data)[0]]).map((ele: string, ind: number) => {
            if (Number(ele) == index) {
                return Number(ind)
            }
        })
        return Number(temp.filter((ele: any) => ele !== undefined)[0]) ? Number(temp.filter((ele: any) => ele !== undefined)[0]) : index
    }
    const addRow = () => {
        setHistoryData({ type: "row", action: "add", index: Number(Object.keys(data)[Object.keys(data).length - 1]) + 1 })
        setRedoHistory({})
        setData({ ...data, [Number(Object.keys(data)[Object.keys(data).length - 1]) + 1]: data[getFirstIndex(data)] });
    };

    const addCol = () => {
        setHistoryData({ type: "column", action: "add", index: Number(Object.keys(data[getFirstIndex(data)])[Object.keys(data[getFirstIndex(data)]).length - 1]) + 1 })
        setRedoHistory({})
        const lastColCount = Number(Object.keys(data[getFirstIndex(data)])[Object.keys(data[getFirstIndex(data)]).length - 1]) + 1
        let tempObject = { ...data }
        Object.keys(data).forEach((ele: any) => {
            tempObject[ele] = { ...tempObject[ele], [lastColCount]: { ans: "", shuffle: true } }
        })
        setData(tempObject);
    };
    const delRow = (index: string, isHistory: boolean) => {
        if (Object.keys(data).length > 2) {
            if (isHistory) {
                setHistoryData({ type: "row", action: "delete", index: index, data: getValues(compIndex ? `data_${compIndex}.${index}` : `data.${index}`) })
                setRedoHistory({})
            }
            delete data[index]
            setData(data)
            unregister(compIndex ? `data_${compIndex}.${index}` : `data.${index}`)
            // setValue("data", getValues('data').filter((data:any)=> data))
            // const dataObj: any = {}
            // Object.values(data).forEach((value, index:number )=>{
            //     dataObj[index] = value
            // })
            // setData(dataObj)
        }
    };
    const delCol = (index: string, isHistory: boolean) => {
        if (Object.keys(data[getFirstIndex(data)]).length > 2) {
            let historyObject: any = { type: "column", action: "delete", index: index, data: {}, columnTitle: getValues(compIndex ? `columntitle_${compIndex}[${indexForColTitle(Number(index))}]` : `columntitle[${indexForColTitle(Number(index))}]`) }
            unregister(compIndex ? `columntitle_${compIndex}[${indexForColTitle(Number(index))}]` : `columntitle[${indexForColTitle(Number(index))}]`)
            let tempObject = { ...data }
            Object.keys(data).forEach((ele: any) => {
                historyObject.data = { ...historyObject.data, [ele]: getValues(compIndex ? `data_${compIndex}.${ele}.${index}` : `data.${ele}.${index}`) }
                delete tempObject[ele][index]
                unregister(compIndex ? `data_${compIndex}.${ele}.${index}` : `data.${ele}.${index}`)
            })
            setValue(compIndex ? `columntitle_${compIndex}` : 'columntitle', getValues(compIndex ? `columntitle_${compIndex}` : 'columntitle').filter((ele: any) => ele !== undefined))
            // setValue("data", getValues('data').map((changeData: any)=>changeData?.filter((data:any)=> data)))
            // const dataObj: any = {}
            // Object.values(tempObject).forEach((value:any, index:number )=>{
            //     let valArr:any = []
            //     Object.values(value).forEach((nestedVal:any, ind:number)=>{
            //         valArr[ind]=nestedVal
            //     })
            //     dataObj[index] = valArr
            // })
            // setData(dataObj)
            if (isHistory) {
                setHistoryData(historyObject)
                setRedoHistory({})
            }
            setData(tempObject);
        }
    };
    const unDo = () => {
        switch (historyData.action) {
            case "add":
                switch (historyData.type) {
                    case "row":
                        setRedoHistory({ type: "row", action: "add", index: historyData.index, data: getValues(compIndex ? `data_${compIndex}.${historyData.index}` : `data.${historyData.index}`) })
                        delRow(historyData.index, false)
                        setHistoryData({})
                        break
                    case "column":
                        let historyObject: any = { type: "column", action: "add", index: historyData.index, data: {}, columnTitle: "" }
                        let tempObject = { ...data }
                        historyObject.columnTitle = getValues(compIndex ? `columntitle_${compIndex}[${indexForColTitle(historyData.index)}]` : `columntitle[${indexForColTitle(historyData.index)}]`)
                        unregister(compIndex ? `columntitle_${compIndex}[${indexForColTitle(historyData.index)}]` : `columntitle[${indexForColTitle(historyData.index)}]`)
                        setValue(compIndex ? `columntitle_${compIndex}` : 'columntitle', getValues(compIndex ? `columntitle_${compIndex}` : 'columntitle')?.filter((ele: any) => ele !== undefined))
                        Object.keys(data).forEach((ele: any) => {
                            historyObject.data = { ...historyObject.data, [ele]: getValues(compIndex ? `data_${compIndex}.${ele}.${historyData.index}` : `data.${ele}.${historyData.index}`) }
                            delete tempObject[ele][historyData.index]
                            unregister(compIndex ? `data_${compIndex}.${ele}.${historyData.index}` : `data.${ele}.${historyData.index}`)
                        })
                        setRedoHistory(historyObject)
                        delCol(historyData.index, false)
                        setHistoryData({})
                        break
                }
                break
            case "delete":
                switch (historyData.type) {
                    case "row":
                        setData({ ...data, [historyData.index]: data[getFirstIndex(data)] })
                        setValue(compIndex ? `data_${compIndex}.${historyData.index}` : `data.${historyData.index}`, historyData.data)
                        setRedoHistory(historyData)
                        setHistoryData({})
                        break
                    case "column":
                        const columnArray = getValues(compIndex ? `columntitle_${compIndex}` : "columntitle")
                        columnArray.splice(Number(indexForColTitle(historyData.index)), 0, historyData.columnTitle)
                        setValue(compIndex ? `columntitle_${compIndex}` : "columntitle", columnArray)
                        let tempObject = { ...data }
                        Object.keys(historyData.data).forEach((ele: any) => {
                            tempObject[ele] = { ...tempObject[ele], [historyData.index]: { ans: "", shuffle: true } }
                            setValue(compIndex ? `data_${compIndex}.${ele}.${historyData.index}` : `data.${ele}.${historyData.index}`, historyData.data[ele])
                        })
                        setData(tempObject);
                        setRedoHistory(historyData)
                        setHistoryData({})
                        break
                }
                break
        }
    }
    const reDo = () => {
        switch (redoHistory.action) {
            case "add":
                switch (redoHistory.type) {
                    case "row":
                        setData({ ...data, [redoHistory.index]: data[getFirstIndex(data)] })
                        setValue(compIndex ? `data_${compIndex}.${redoHistory.index}` : `data.${redoHistory.index}`, redoHistory.data)
                        setHistoryData(redoHistory)
                        setRedoHistory({})
                        break
                    case "column":
                        const columnArray = getValues(compIndex ? `columntitle_${compIndex}` : "columntitle")
                        columnArray?.splice(Number(indexForColTitle(redoHistory.index)), 0, redoHistory.columnTitle)
                        setValue(compIndex ? `columntitle_${compIndex}` : "columntitle", columnArray)
                        let tempObject = { ...data }
                        Object.keys(redoHistory.data).forEach((ele: any) => {
                            tempObject[ele] = { ...tempObject[ele], [redoHistory.index]: { ans: "", shuffle: true } }
                            setValue(compIndex ? `data_${compIndex}.${ele}.${redoHistory.index}` : `data.${ele}.${redoHistory.index}`, redoHistory.data[ele])
                        })
                        setData(tempObject);
                        setHistoryData(redoHistory)
                        setRedoHistory({})
                        break
                }
                break
            case "delete":
                switch (redoHistory.type) {
                    case "row":
                        setHistoryData({ type: "row", action: "delete", index: redoHistory.index, data: getValues(compIndex ? `data_${compIndex}.${redoHistory.index}` : `data.${redoHistory.index}`) })
                        delRow(redoHistory.index, false)
                        setRedoHistory({})
                        break
                    case "column":
                        let historyObject: any = { type: "column", action: "delete", index: redoHistory.index, data: {}, columnTitle: redoHistory.columnTitle }
                        historyObject.columnTitle = redoHistory.columnTitle
                        unregister(compIndex ? `columntitle_${compIndex}[${indexForColTitle(redoHistory.index)}]` : `columntitle[${indexForColTitle(redoHistory.index)}]`)
                        setValue(compIndex ? `columntitle_${compIndex}` : 'columntitle', getValues(compIndex ? `columntitle_${compIndex}` : 'columntitle').filter((ele: any) => ele !== undefined))
                        let tempObject = { ...data }
                        Object.keys(data).forEach((ele: any) => {
                            historyObject.data = { ...historyObject.data, [ele]: getValues(compIndex ? `data_${compIndex}.${ele}.${redoHistory.index}` : `data.${ele}.${redoHistory.index}`) }
                            delete tempObject[ele][redoHistory.index]
                            unregister(compIndex ? `data_${compIndex}.${ele}.${redoHistory.index}` : `data.${ele}.${redoHistory.index}`)
                        })
                        setHistoryData(historyObject)
                        delCol(redoHistory.index, false)
                        setRedoHistory({})
                }
                break
        }
    }

    useEffect(() => {
        if(addNewToggler) setFirstRenderForAddNew(true)
        if (firstRenderForAddNew || addNewToggler) {
          setData({
            "0": {
              "0": { text: "", shuffle: true },
              "1": { text: "", shuffle: true },
            },
            "1": {
              "0": { text: "", shuffle: true },
              "1": { text: "", shuffle: true },
            },
          });
          }
        setHistoryData({})
        setRedoHistory({})
    }, [addNewToggler])

    const handleClose = () => {
        setDeleteSelectOpen(false);
      };
    
      const handleOpen = () => {
        setDeleteSelectOpen(true);
      };

      const handleRowClose = () => {
        setDeleteRowSelectOpen(false);
      };
    
      const handleRowOpen = () => {
        setDeleteRowSelectOpen(true);
      };

    return (
        <div className='row'>
            <h2>{questionIndex ? `Question ${questionIndex} *` : "Question*"}</h2>
            <div className='col-12 mt-3 mb-4'>
                <TextEditorForForm setSpinnerStatus={setSpinnerStatus} registerName={compIndex ? `question_${compIndex}` : `question`} textEditorSize='Medium' mandatory={true} addNewToggler={addNewToggler} />
                {/* <ErrorText errors={errors} registerName="question" /> */}
            </div>
            <div className='col-12 d-flex justify-content-center mb-4 mtfUndoRedoSect' style={{ gap: "20px" }}>
                <ButtonComponent icon={<Undo />} image={""} textColor="#000000" backgroundColor="#01B58A" disabled={(JSON.stringify(historyData) === "{}")} buttonSize="Medium" type="outlined" onClick={() => { unDo() }} label="Undo" minWidth="" />
                <ButtonComponent icon={<Redo />} image={""} textColor="#000000" backgroundColor="#01B58A" disabled={(JSON.stringify(redoHistory) === "{}")} buttonSize="Medium" type="outlined" onClick={() => { reDo() }} label="Redo" minWidth="" />
                <div className="matchBtnDrop">
                    <FormControl className={`matchSelectDropField ${Object.keys(data).length < 3 ? "matchBtnDropDisable" : ""}`}  sx={{ m: 1, minWidth: 150 }}>
                        <Delete />
                        <InputLabel id="demo-simple-select-helper-label">Delete Row</InputLabel>
                        <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        open={deleteRowSelectOpen}
                        onClose={handleRowClose}
                        onOpen={handleRowOpen}
                        autoWidth
                        >
                            {Object.keys(data).map((ele: any, index: number) => {
                                return (
                                    <MenuItem onClick={() => {setDeleteRowSelectOpen(false);delRow(ele, true)}}>Row {`${index + 1}`}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </div>
                <div className="matchBtnDrop"   >
                    <FormControl className={`matchSelectDropField ${Object.keys(data[getFirstIndex(data)]).length < 3 ? "matchBtnDropDisable" : ""}`} sx={{ m: 1, minWidth: 170 }}>
                        <Delete />
                        <InputLabel id="demo-simple-select-helper-label">Delete Column</InputLabel>
                        <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        open={deleteSelectOpen}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        autoWidth
                        >
                            {Object.keys(data[getFirstIndex(data)]).map((ele: any, index: number) => {
                                return (
                                    <MenuItem onClick={() => {setDeleteSelectOpen(false);delCol(ele, true)}}>Column {`${index + 1}`}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className='col-12 d-flex justify-content-end'>
                <ButtonComponent icon={<AddIcon />} image={""} textColor="#01B58A" backgroundColor="" disabled={Object.keys(data[getFirstIndex(data)]).length > 2 ? true : false} buttonSize="Medium" type="transparent" onClick={() => { addCol() }} label="Add Column " minWidth="" hideBorder={true} />
            </div>
            {
                Object.keys(data).length && Object.keys(data).map((ele: any, index: number) => {
                    return (
                        <div className={`gridview-${Object.keys(data[ele]).length > 2 ? "three" : "two"}`}>
                            {Object.keys(data[ele]).map((element: any, ind: number) => {
                                return (
                                    <div className='mt-3 mb-4 mr-3 matchGridWidth' key={`${compIndex ? `data_${compIndex}.${ele}.${element}.text` : `data.${ele}.${element}.text`}`}>
                                        {index === 0 &&
                                            <div className='col-12 mt mb-4'>
                                            <TextEditorForForm setSpinnerStatus={setSpinnerStatus} registerName={compIndex ? `columntitle_${compIndex}.${ind}` : `columntitle.${ind}`} textEditorSize='MatchSmall' mandatory={true} fieldsRequired={["language"]} placeholder={`Column ${ind + 1} title`} isEdit={isEdit} addNewToggler={addNewToggler} restrictImage={true} key={key} eqEditor={false}/>
                                                {/* <InputFieldComponentForForm registerName={compIndex ? `columntitle_${compIndex}.${ind}` : `columntitle.${ind}`} inputType={"text"} label={`Column ${ind + 1} title`} required={true} onChange={() => { } } inputSize={"Large"} variant={""} maxLength={50} /> */}
                                            </div>
                                        }
                                        <div className="d-flex justify-content-between">
                                        <h2>{`Row${Number(index) + 1}`}{" "} {ind === 0 ? `Column${Number(ind) + 1} *` : `Column${Number(ind) + 1} *`}</h2>
                                            <SwitchComponentForForm registerName={compIndex ? `data_${compIndex}.${ele}.${element}.shuffle` : `data.${ele}.${element}.shuffle`} onChangeSwitch={() => { }} checked={true} disabled={false} beforeLabel={'Shuffle'} afterLabel={''} />
                                        </div>
                                        <div className='matchFollTextEditor'>
                                            <TextEditorForForm setSpinnerStatus={setSpinnerStatus} registerName={`${compIndex ? `data_${compIndex}.${ele}.${element}.text` : `data.${ele}.${element}.text`}`} textEditorSize='Medium' mandatory={true} isEdit={isEdit} addNewToggler={addNewToggler} key={key} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })
            }
            {/* <ErrorText errors={errors} registerName="data" /> */}
            <div className='col-12 mb-2 d-flex'>
                <ButtonComponent icon={<AddIcon />} image={""} textColor="#01B58A" backgroundColor="" disabled={Object.keys(data).length > 9 ? true : false} buttonSize="Medium" type="transparent" onClick={() => { addRow() }} label="Add Row" minWidth="" addRow={true} hideBorder={true}/>
                <hr className='ruler'></hr>
            </div>
            <QuestionBody setSpinnerStatus={setSpinnerStatus} errors={errors} questionTypeStatus={5} compIndex={compIndex}  setErrorSupport={setErrorSupport} errorSupport={errorSupport} addNewToggler={addNewToggler}/>
        </div >
    );
};

export default MatchFollowing;