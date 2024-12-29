import React, { useEffect, useState } from "react";
import "./QuestionPaperTemplate.css";
import ReplaceIcon from "../../../../assets/images/Replace.svg"
import ReplaceQuestionModal from "../../ReplaceQuestionModal/ReplaceQuestionModal";
import { Box, Slider, Stack, TextField, Tooltip, Typography } from "@mui/material";
import PreviewModalImage from "../../../AssessmentsContainer/CreateNewQuestion/PreviewModalComponent/PreviewModalImage";
// import { removeSpaceFromString } from "../../../../constants/helper";
import { addNumberOfLinesToQuestions, availableModules, getLineCountForMarks, numberOfLinesCount, parseJwt, typeOflines } from "../../../../constants/helper";
import DropDownButtonComponent from "../../../SharedComponents/DropDownButtonComponent/DropDownButtonComponent";
import DropdownSingleSelect from "../../../SharedComponents/DropdownWithCheckbox/DropdownSingleSelect";
import SelectBoxComponent from "../../../SharedComponents/SelectBoxComponent/SelectBoxForWorkBook";

interface Question {
  id: number;
  type: "Part" | "Section" | "Question" | "Main Question";
  title?: string;
  mainQuestion?: string;
  question?: string;
  children?: Question[] | Question;
  elementTitle?: string;
  questionInfo?: any;
  orOptionConfig?: any;
  partAlignment?: string;
  marks?: string;
  marksFormat?: string;
  sequenceText?: any;
  orAlignment?:string;
  sectionAlignment?:string,
  instruction?:string
  numberOfLines?:any
  typeOfLines?:any
}

interface QuestionPaperProps {
  questionData: Question;
  masterDropdown: any;
  initialValue: any;
  replace?:any,
  replaceQp?:any
  questionPaperFilter?:any,
  previewMode?:string,
  templatePrintEdit?:boolean,
  setAnchorEl?:any,
  changedPopoverValue?:any,
  setChangedPopoverValue?:(changedPopoverValue:any)=>void,
  ReqBody:any,
  markerrorQnsIds?:any,
  printWithAnswer?:any;
  qpCourses?:any;
  setStateFunction?:any;
  setmarkerrorQnsIds?:any;
  grperrorQnsIds?:any
  enableDoneBtnByValue:any
  questionIndex:any;
  setCompMarkValue?:any
  viewAnswer?: boolean
  typeOfLine?:string
  workbookStyle?:boolean
  templateJson?:any
  isWorksheetEdit?:any
}
interface SelectedTypeItem {
  id: string | null;
  value: string | null;
  count: string | null;
  row: string | null;
  column: string | null;
  space: string | null;
}


const RecussivePaperGenerator: React.FC<QuestionPaperProps> = ({
  questionData,
  masterDropdown,
  initialValue,
  replace,
  replaceQp,
  questionPaperFilter,
  previewMode,
  templatePrintEdit,
  setAnchorEl,
  changedPopoverValue,
 setChangedPopoverValue,
 ReqBody,
 markerrorQnsIds,
 printWithAnswer,
 qpCourses,
 setStateFunction,
 setmarkerrorQnsIds, 
 grperrorQnsIds,
 enableDoneBtnByValue,
 questionIndex,
  setCompMarkValue,
  viewAnswer,
  typeOfLine,
  workbookStyle,
  templateJson,
  isWorksheetEdit
}) => {
  const [replaceModal, setReplaceModal] = useState(false)
  const [replaceFilterObj,setReplaceFilterObj]=useState<any|null>(null)
  const [openPreviewImg, setOpenPreviewImg] = React.useState<boolean>(false)
  const [imgContent, setImgContent] = React.useState<string>("")
  const isOnline = window.location.href.includes('onlineAssesment/printforpreview') || window.location.href.includes('asses/onlineTest/preview') || window.location.href.includes('assess/evaluation/onlineAssesment');

  const [types, setTypes] = React.useState(typeOflines) as any;
  const [selectedType, setSelectedType] = React.useState<SelectedTypeItem[]>([
    {
      id: null,
      value: null,
      count: null,
      row: null,
      column: null,
      space: '10'
    },
  ]);
  
  
  const replaceNestedObjectByIdField = (template:any, id: string, replacement: any, type:any)=> {
    if (template?.templateBuilderInfo && template?.templateBuilderInfo?.templateParts) {
      const parts = template.templateBuilderInfo.templateParts;
      replaceNestedObject(parts, id, replacement, type);
    }
  }
  const replaceNestedObject = (parts:any, id: string, replacement: any, questionType:any)=> {
    for (let i = 0; i < parts?.length; i++) {
      if (parts[i].id === id && parts[i].type == questionType) {
        parts[i] = replacement;
        return;
      } else if (parts[i]?.children) {
        replaceNestedObject(parts[i].children, id, replacement, questionType);
      }
    }
  }
  const handleApplyValueChanges = (value:any,changedPopoverValue:any) => {
    setStateFunction && setStateFunction('actions', JSON.parse(JSON.stringify(ReqBody)))
    let html :any;
    if(changedPopoverValue?.key=== "marks"){
      html=value;
    }
    if(!changedPopoverValue?.sectionName){
      changedPopoverValue.currentQuestion[changedPopoverValue?.key] = html
      replaceNestedObjectByIdField(ReqBody?.bodyTemplate, changedPopoverValue?.currentQuestion?.id, changedPopoverValue.currentQuestion, changedPopoverValue.questionType)
    }
    setStateFunction && setStateFunction('undo',false)
    setStateFunction && setStateFunction('redo',true)
    if(setmarkerrorQnsIds && changedPopoverValue?.key=="marks" ){
      //const removeQP=grperrorQnsIds?.filter((ele:any)=>ele?.find((e:any)=>[changedPopoverValue?.currentQuestion?.id]?.includes(e)))?.flatMap((x:any)=>x)
      setmarkerrorQnsIds([])
      
      if( parseInt(value) <= 0 || value==''){
        enableDoneBtnByValue(true)
      }else{
        let questionData1: any = questionData.children;
        enableDoneBtnByValue(false,questionData1)
      }
    }
  };

  const getFilteredArray = (options: any, type: string) => {
    let filteredData = [];
    if (type == "mainQuestionOrder" || type == "questionOrder") {
      const langArr = options?.filter((opt: any) => opt?.lang == "English");
      filteredData = langArr?.length > 0 && langArr[0]?.options?.filter(
        (opt: any) => opt.id == initialValue[type]
      );
    } else {
      filteredData = options?.filter((opt: any) => opt.id == initialValue[type]);
    }
    if (filteredData?.length > 0) {
      return filteredData[0];
    } else {
      return filteredData;
    }
  };
  const renderQuestions = (data: Question[] | Question) => {
    if (Array.isArray(data)) {
      return data.map((item: any) => renderQuestion(item));
    } else {
      return renderQuestion(data);
    }
  };
  (window as any).handleClick = (key: any, event: any) => {
    setOpenPreviewImg(true)
    setImgContent(key)
};

const fontFamilyCheck = ((fontFamily:string) => {
  return fontFamily == "Arial" ? "previewFontArial" : fontFamily == "Times New Roman" ? "previewFontTimesNewRoman" : fontFamily == "Verdana" ? "previewFontVerdana" : fontFamily == "Helvetica" ? "previewFontHelvetica" : ""
})

const QuestionTypeActaualAnswerRender = (QPOptions:any, type:string) => {
  let MTFrenderObject:any = {};
  let MCQrenderArray:Array<string> = [];
  let FIBrenderArray:Array<string> = [];
  
    QPOptions?.map((list:any) => {
      if(type == "MTF"){
      list.details.map((QPDetails:any) => {       
        if(QPDetails?.row in MTFrenderObject == false){MTFrenderObject[QPDetails.row] = []}
        MTFrenderObject[QPDetails.row].push(QPDetails.question)
        }
      )}else if(type == "FIB"){
        FIBrenderArray.push(list?.text)
      }
    })
  return (<>
      {type == "MTF" &&         
        <div className="ps-4">
        <table>
          <tr>
          {(QPOptions).map((QPOptionsList: any) => {
            return(
              <>
                {/* <th dangerouslySetInnerHTML={{ __html: removeSpaceFromString(QPOptionsList?.columnLabel)}} /> */}
                <th dangerouslySetInnerHTML={{ __html: QPOptionsList?.columnLabel}} />
              </>
            )
          })}                
          </tr>
            {Object.keys(MTFrenderObject).map((MTFrenderRow: any, index: number) => {
                return (
                  <>
                  <tr>
                  {MTFrenderObject[MTFrenderRow].map((MTFrenderRowList: any) => {
                    return (
                      <>
                    {/* <td dangerouslySetInnerHTML={{ __html: removeSpaceFromString(MTFrenderRowList)}} /> */}
                    <td dangerouslySetInnerHTML={{ __html: MTFrenderRowList}} />
                    </>
                    )
                  }
                  )}
                  </tr>
                  </>
                )
            })}
        </table>
      </div>
        }
        {(type == "MCQ") && 
            <ul className={`subQuestionLisOption subQuestionLisOptionMCQ renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label}`}>
            {QPOptions.map((MCQList: any, index: number) => {
              return (<li className={`${!MCQList?.isCorrect ? "mcqWrong" :""}`}><div dangerouslySetInnerHTML={{ __html: MCQList?.text }}></div></li>)
            })}
          </ul>
          }
        {(type == "FIB") && 
          <ul className="subQuestionLisOption">
          {FIBrenderArray.map((MCQList: any, index: number) => {
            return (<li><div className={`renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label}`}  dangerouslySetInnerHTML={{ __html: MCQList }}></div></li>)
          })}
        </ul>
        }
    </>)
}
  const getQuestionTitle = (dataList: any) => {
    // let str = removeSpaceFromString(dataList?.question)
    let str = dataList?.question
    dataList?.questionImageDetails?.forEach((questionImage: any) => { 
      str = str?.replace(
        `{{${questionImage?.key}}}`,
        `<span class="listImageTag" onclick="handleClick('${questionImage?.src}',event)">${questionImage?.tag}</span>`
      );
    });
    return str;
  };
  const changeMarks = (e: React.ChangeEvent<HTMLInputElement>,question:any,index?: any) => {
    const newValue = parseInt(e.target.value);
    let currentQuestionJson = JSON.parse(JSON.stringify(question))
    let totalMarkCalc = 0;
    if(newValue > 0 && newValue <= 100){      
      currentQuestionJson.questionInfo.metaInfo[index].marks = newValue;     
      enableDoneBtnByValue(false)      
    }else if(Number.isNaN(newValue)){
      currentQuestionJson.questionInfo.metaInfo[index].marks = 0
      enableDoneBtnByValue(true)
    }else{
      return
    }
    currentQuestionJson.questionInfo.metaInfo.map((meta:any) => {
      totalMarkCalc +=  meta.marks
    })
    currentQuestionJson.questionInfo.marks = totalMarkCalc;
    currentQuestionJson.marks = totalMarkCalc;
    isWorksheetEdit(true)
    setCompMarkValue(currentQuestionJson)
    setmarkerrorQnsIds([])
  }

  useEffect(() => {
    if (typeOfLine) {
      const updatedJson = JSON.parse(JSON.stringify(ReqBody));
      let hasUpdated = false;
  
      const updateBorderTypeInTypeOfLines = (parts:any) => {
        parts.forEach((part:any) => {
          if (part.typeOfLines !== null && part.type === "Question" && part.typeOfLines) {
            // Iterate through each typeOfLines entry to update borderType
            Object.keys(part.typeOfLines).forEach((lineType) => {
              if (part.typeOfLines[lineType]) {
                part.typeOfLines[lineType].borderType = typeOfLine;
                hasUpdated = true;
              }
            });
          }
  
          if (part.type === "Question" && part.questionInfo?.metaInfo) {
            part.questionInfo.metaInfo.forEach((meta:any) => {
              if (meta.typeOfLines) {
                // Update borderType within meta typeOfLines as well
                Object.keys(meta.typeOfLines).forEach((lineType) => {
                  if (meta.typeOfLines[lineType]) {
                    meta.typeOfLines[lineType].borderType = typeOfLine;
                    hasUpdated = true;
                  }
                });
              }
            });
          }
  
          if (part.children && part.children.length > 0) {
            updateBorderTypeInTypeOfLines(part.children);
          }
        });
      };
  
      if (updatedJson?.bodyTemplate?.templateBuilderInfo?.templateParts) {
        updateBorderTypeInTypeOfLines(updatedJson.bodyTemplate.templateBuilderInfo.templateParts);
      }
  
      if (hasUpdated) {
        const newJson = { ...updatedJson };
        replaceQp(newJson);
      }
    }
  }, [typeOfLine]);
  
  useEffect(() => {
    if (workbookStyle) {
      const updatedJson: any = JSON.parse(JSON.stringify(ReqBody));
      let hasUpdated = false; // Flag to check if any updates are made
  
      const updateAllTypeOfLines = (parts: any) => {
        parts.forEach((part: any) => {
          if (part.typeOfLines === null && part.type === "Question") {
            const typeoflines = {
              "Solid Line(s)": {
                "count": getLineCountForMarks(parseInt(part?.marks ?? '0')),
                "row": null,
                "column": null,
                "space": "10",
                "borderType": typeOfLine
              }
            };
            part.typeOfLines = typeoflines;
            hasUpdated = true;
          }  
          if (part.type === "Question" && part.questionInfo?.metaInfo) {
            part.questionInfo.metaInfo.forEach((meta: any) => {
              if (!meta.typeOfLines === null || meta.typeOfLines == null) {
                const typeoflines = {
                  "Solid Line(s)": {
                    "count": getLineCountForMarks(parseInt(meta?.marks ?? '0')),
                    "row": null,
                    "column": null,
                    "space": "10",
                    "borderType": typeOfLine
                  }
                };
                meta.typeOfLines = typeoflines;
                hasUpdated = true;
              }
            });
          }  
          if (part.children && part.children.length > 0) {
            updateAllTypeOfLines(part.children);
          }
        });
      };

      if (updatedJson?.bodyTemplate?.templateBuilderInfo?.templateParts) {
        updateAllTypeOfLines(updatedJson.bodyTemplate.templateBuilderInfo.templateParts);
      }
  
      if (hasUpdated) {
        const newJson = { ...updatedJson };
        replaceQp(newJson);
      }
    }
  }, [workbookStyle]);
  

  const handleTypeLines = (e: any, question: any, type: string, metaInfo:any) => {
    const newObj = metaInfo ? metaInfo.typeOfLines : question.typeOfLines || {};
    const mainHandler = type === 'typeOfLine' ? typeOflines[e] : Object.keys(newObj)[0];
  
    const defaultProperties = {
      count: '1',
      row: '1',
      column: '1',
      space: '10',
      borderType: typeOfLine
    };
  
    const value = Number(e);
  
    let updatedObj = {
      [mainHandler]: { ...defaultProperties },
    };
  
    const propertyUpdates: { [key: string]: keyof typeof defaultProperties } = {
      row: 'row',
      column: 'column',
      space: 'space',
      count: 'count',
      borderType: 'borderType'
    };
  
    if (propertyUpdates[type]) {
      updatedObj[mainHandler] = {
        ...newObj[mainHandler],
        [propertyUpdates[type]]: type === 'space' ? `${value}` : value + 1,
      };
    }
  
    if (Object.keys(updatedObj).length) {
      const updatedJson = JSON.parse(JSON.stringify(ReqBody));
      addNumberOfLinesToQuestions(updatedJson?.bodyTemplate, updatedObj, 'Question', question, metaInfo);
  
      const newJson = { ...updatedJson };
      replaceQp(newJson);
      isWorksheetEdit(true);    }
  };
  
  const workBookStructure = (question: any, label: string, metaInfo? :any) => {
    const newObj = metaInfo ? metaInfo.typeOfLines : question.typeOfLines;
    const hasBoxOrRectangle = newObj &&
      (Object.keys(newObj).some(lineType =>
        lineType === 'Box(s)' || lineType === 'Rectangle(s)'
      ));
  
    const hasTypeOfLines = newObj && Object.keys(newObj).length > 0;
  
    // Determine the column class based on the conditions
    const columnClass = hasTypeOfLines ?
      (hasBoxOrRectangle ? "col-3" : "col-4") :
      "col-12";
  
    return (
      <div className="workbookSelectType" style={{ display: 'flex', gap: '5px', padding: '10px', marginLeft: '25px' }}>
        <Box className={columnClass}>
          <SelectBoxComponent
            variant={'fill'}
            selectedValue={newObj
              ? typeOflines.findIndex((lineType: string) => Object.keys(newObj).includes(lineType))
              : ''}
            clickHandler={(e: number) => handleTypeLines(e, question, 'typeOfLine',metaInfo)}
            selectLabel={label}
            selectList={types}
            mandatory={true}
          />
        </Box>
  
        {/* Only show additional inputs if hasTypeOfLines is true */}
        {hasTypeOfLines && (
          <>
            {hasBoxOrRectangle ? (
              <>
                <Box className="col-3">
                  <SelectBoxComponent
                    variant={'fill'}
                    selectedValue={newObj ? newObj[Object.keys(newObj)[0]].row - 1 as any : ''}
                    clickHandler={(e: number) => handleTypeLines(e, question, 'row',metaInfo)}
                    selectLabel={'Row(s)'}
                    selectList={numberOfLinesCount.slice(0,20)}
                    mandatory={true}
                  />
                </Box>
                <Box className="col-3">
                  <SelectBoxComponent
                    variant={'fill'}
                    selectedValue={newObj ? newObj[Object.keys(newObj)[0]].column - 1 as any : ''}
                    clickHandler={(e: number) => handleTypeLines(e, question, 'column',metaInfo)}
                    selectLabel={'Column(s)'}
                    selectList={numberOfLinesCount.slice(0,12)}
                    mandatory={true}
                  />
                </Box>
                <Box className="col-3" sx={{ width: 200, marginTop: '-5px', marginLeft: '5px' }}>
                  <Typography>{'Spacing*'}</Typography>
                  <Stack spacing={3} direction="column" sx={{ alignItems: 'center', marginLeft: '10px' }}>
                    <Box sx={{ width: '100%', position: 'relative' }}>
                      <Slider
                        aria-label="Spacing"
                        size="medium"
                        value={newObj ? newObj[Object.keys(newObj)[0]]?.space : ''}
                        onChange={(e: any) => handleTypeLines(e.target.value, question, 'space', metaInfo)}
                        style={{ color: '#01B58A', paddingTop: 0 }}
                        min={10}
                        max={50}
                      />
                      <Typography sx={{ position: 'absolute', left: 0, top: '16px', fontSize: '14px' }}> {'Less'} </Typography>
                      <Typography sx={{ position: 'absolute', right: 0, top: '16px', fontSize: '14px' }}> {'More'} </Typography>
                    </Box>
                  </Stack>
                </Box>
              </>
            ) : (
              <>
                <Box className="col-4">
                  <SelectBoxComponent
                    variant={'fill'}
                    selectedValue={newObj ? newObj[Object.keys(newObj)[0]].count - 1 as any : ''}
                    clickHandler={(e: number) => handleTypeLines(e, question, 'count',metaInfo)}
                    selectLabel={'Count'}
                    selectList={numberOfLinesCount}
                    mandatory={true}
                  />
                </Box>
                <Box className="col-4" sx={{ width: 200, marginTop: '-5px', marginLeft: '5px' }}>
                  <Typography>{'Spacing*'}</Typography>
                  <Stack spacing={3} direction="column" sx={{ alignItems: 'center', marginLeft: '10px' }}>
                    <Box sx={{ width: '100%', position: 'relative' }}>
                      <Slider
                        aria-label="Spacing"
                        size="medium"
                        value={newObj ? newObj[Object.keys(newObj)[0]]?.space : ''}
                        onChange={(e: any) => handleTypeLines(e.target.value, question, 'space',metaInfo)}
                        style={{ color: '#01B58A', paddingTop: 0 }}
                        min={10}
                        max={50}
                      />
                      <Typography sx={{ position: 'absolute', left: 0, top: '16px', fontSize: '14px' }}> {'Less'} </Typography>
                      <Typography sx={{ position: 'absolute', right: 0, top: '16px', fontSize: '14px' }}> {'More'} </Typography>
                    </Box>
                  </Stack>
                </Box>
              </>
            )}
          </>
        )}
      </div>
    )
  };

  const linesToRender = (question: any) => {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', margin: '5px' }}>
          <span style={{ paddingLeft: '30px' }}>Ans :</span>
          <div className="workbook-printTable" style={{ display: 'flex', flexDirection: 'column', padding: '10px', flexGrow: "1" }}>
            {(() => {
              const { typeOfLines, marks } = question || {};
              if (typeOfLines) {
                if (typeOfLines['Rectangle(s)']) {
                  const { row, column, space } = typeOfLines['Rectangle(s)'];
                  return (
                    <table className="workbook-print" style={{ border: `1px solid #000`, width: '100%', margin: '10px 0', borderCollapse: 'collapse' }}>
                      {[...Array(row)].map((_, rowIndex) => (
                        <tr key={rowIndex}>
                          {[...Array(column)].map((_, colIndex) => (
                            <td key={colIndex} style={{ border: `1px solid #000`, height: `${(space ?? 10) * 5}px` }}></td>
                          ))}
                        </tr>
                      ))}
                    </table>
                  );
                }
                if (typeOfLines['Box(s)']) {
                  const { row, column, space } = typeOfLines['Box(s)'];
                  const boxSize = 54;
                  const totalWidth = `${(boxSize * column) + (space * (column - 1 || 1))}px`;
                  const totalHeight = `${(boxSize * row) + (space * (row - 1 || 1))}px`;
                  return (
                    <table className="workbook-print" style={{ borderCollapse: 'collapse', width: totalWidth, height: totalHeight, margin: '10px 0' }} >
                      <tbody>
                        {[...Array(row)].map((_, rowIndex) => (
                          <tr key={rowIndex}>
                            {[...Array(column)].map((_, colIndex) => (
                              <td key={colIndex} style={{ border: `1px solid #000`, width: `${boxSize}px`, height: `${boxSize}px`, marginRight: `${space}px`, marginBottom: `${space}px`, boxSizing: 'border-box' }}></td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                }
                if (typeOfLines['2 Lines'] || typeOfLines['3 Lines'] || typeOfLines['4 Lines'] || typeOfLines['5 Lines']) {
                  const lineState = typeOfLines['2 Lines'] || typeOfLines['3 Lines'] || typeOfLines['4 Lines'] || typeOfLines['5 Lines'];
                  const { count, space } = lineState
                  const type =  lineState?.borderType ? lineState?.borderType?.split(' ')[0]?.toLowerCase() : 'solid';
                  const upperLines = lineState?.borderType ? lineState?.borderType?.split(' ')[1]?.toLowerCase() : 'upper';
                  const lineCount = typeOfLines['2 Lines'] ? 2 : typeOfLines['3 Lines'] ? 3 : typeOfLines['4 Lines'] ? 4 : 5;
                  return (
                    <div>
                      {[...Array(count)].map((_, index) => (
                        <div className="line-set-container" key={index} style={{ margin: lineCount !== 2 ? '10px 0' : '', padding: lineCount == 2 ? index == 0 ? (upperLines == 'upper' ? '0' : '10px 0') : '10px 0' : '' }}>
                          {[...Array(lineCount)].map((_, i) => {
                            let lineColor = '#000';
                            let borderStyle = 'solid';
                            if (lineCount > 2) {
                              const isFirstLine = i === 0;
                              const isLastLine = i === (lineCount - 1);
                              const isMiddleLine = lineCount === 5 && i === 2;

                              lineColor = isFirstLine || isLastLine ? '#DA1414' : isMiddleLine ? 'black' : 'blue';
                              borderStyle = isMiddleLine ? 'dotted' : 'solid';
                            }
                            return (
                              <hr
                                key={i}
                                style={{
                                  margin: '-5px 0',
                                  padding: `${space == null ? (lineCount == 2 ? 15 : 10) : space}px 0`,
                                  borderTop: `1px ${lineCount == 2 ? type : borderStyle} ${lineColor}`,
                                }}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  );
                }
                if (typeOfLines['Solid Line(s)']) {
                  const { count, space } = typeOfLines['Solid Line(s)'];
                  const type =  typeOfLines['Solid Line(s)']?.borderType ? typeOfLines['Solid Line(s)']?.borderType?.split(' ')[0]?.toLowerCase() : 'solid';
                  const upperLines = typeOfLines['Solid Line(s)']?.borderType ? typeOfLines['Solid Line(s)']?.borderType?.split(' ')[1]?.toLowerCase() : 'upper';
                  return (
                    <div>
                      {[...Array(count)].map((_, index) => (
                        <hr key={index} style={{ 
                          margin: typeOfLines['Solid Line(s)']?.borderType ? upperLines === 'upper' ? '-5px 0' : '5px 0' : '5px 0',
                          padding: `${space == null ? 10 : space}px 0`, 
                          borderTop: `1px ${type} #000` 
                        }} />
                      ))}
                    </div>
                  );
                }
                if (typeOfLines['Blank']) {
                  const { count, space } = typeOfLines['Blank'];
                  return (
                    <div style={{ border: `none`, height: `${count * (space ?? 10) * 3}px`, margin: '10px 0' }}></div>
                  );
                }
              }
              // return (
              //   [...Array(getLineCountForMarks(parseInt(marks ?? '0')))].map((_, index) => {
              //     return (
              //       <hr
              //         key={index}
              //         style={{
              //           borderTop: `0px ${type} #000`,
              //           margin: '5px 0',
              //           padding: '10px 0',
              //         }}
              //       />
              //     );
              //   })
              // );
            })()}
          </div>
        </div>
    )
  }

  const renderQuestion: any = (question: Question) => {
    if (question.type === "Part") {
      return (
        <>
          {question?.orOptionConfig?.show && (
            <div className={`previewTemplateOrCase renderFontSize${(parseInt(masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label) + 2)} ${question?.orAlignment == "0" ? "text-start" : question?.orAlignment == "1" ? "text-center" : question?.orAlignment == "1" ? "text-end" : "text-center"}`}>
              {question?.orOptionConfig?.text}
            </div>
          )}
          <p
            className={`partTitle
            ${fontFamilyCheck(masterDropdown?.partTextFontStyle?.options[parseInt(questionPaperFilter?.partTextFontStyle)]?.label)}
            ${
              question?.partAlignment == "0"
                ? "text-start"
                : question?.partAlignment == "1"
                ? "text-center"
                : "text-end"
            } ${question?.instruction ? "m-0": ""}`}
            style={{fontSize: masterDropdown?.partFontSize.options[parseInt(questionPaperFilter?.partFontSize)]?.label+"px"}}
          >
            {question?.elementTitle}
            {(workbookStyle) && templatePrintEdit && workBookStructure(question,"Apply Type for Section")}    
            {/* {templatePrintEdit && availableModules.includes(20) && <span className="workBook-btn-auto" style={{margin:'-1px -39px 6px 1px'}}><DropDownButtonComponent buttonName={''} minWidth="50" buttonOptions={['numberOfLines','englishLine','table','blankBox','borderBox']}  onChangeHandler={(e)=>{ console.log(e); handleLines(question,e,true)}} /> </span> } */}
            </p>
          {question?.instruction && <p className={`partTitle 
          ${fontFamilyCheck(masterDropdown?.partTextFontStyle?.options[parseInt(questionPaperFilter?.partTextFontStyle)]?.label)}
          ${
              question?.partAlignment == "0"
                ? "text-start"
                : question?.partAlignment == "1"
                ? "text-center"
                : "text-end"
            }`} style={{fontSize: (parseInt(masterDropdown?.partFontSize.options[parseInt(questionPaperFilter?.partFontSize)]?.label) - 3)+"px"}}>({question?.instruction})</p>}
          {renderQuestions(question.children || [])}
        </>
      );
    } else if (question?.type === "Section") {
      return (
        <>
          {question?.orOptionConfig?.show && (
            <div className={`previewTemplateOrCase renderFontSize${(parseInt(masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label) + 2)} ${question?.orAlignment == "0" ? "text-start" : question?.orAlignment == "1" ? "text-center" : question?.orAlignment == "2" ? "text-end" : "text-center"}`}>
              {question?.orOptionConfig?.text}
            </div>
          )}
          <div style={{marginBottom:"20px"}}>
            <p
            className={`sectionTitle
            ${fontFamilyCheck(masterDropdown?.sectionFontStyle?.options[parseInt(questionPaperFilter?.sectionFontStyle)]?.label)}
            ${
              question?.sectionAlignment == "0"
                ? "text-start"
                : question?.sectionAlignment == "1"
                ? "text-center"
                : "text-end"
            } ${question?.instruction ? "m-0": ""}`}
            style={{fontSize: masterDropdown?.sectionFontSize?.options[parseInt(questionPaperFilter?.sectionFontSize)]?.label+"px"}}
          >
            {question?.elementTitle}
            {(workbookStyle) && templatePrintEdit && workBookStructure(question,"Apply Type for Main Questions")}       
            {/* {templatePrintEdit && availableModules.includes(20) && <span className="workBook-btn-auto" style={{margin:'-1px -39px 6px 1px'}}><DropDownButtonComponent buttonName={''} minWidth="50" buttonOptions={['numberOfLines','englishLine','table','blankBox','borderBox']}  onChangeHandler={(e)=>{ console.log(e); handleLines(question,e,true)}} /> </span> } */}
            </p>
          {question?.instruction && <p className={`partTitle 
          ${fontFamilyCheck(masterDropdown?.sectionFontStyle?.options[parseInt(questionPaperFilter?.sectionFontStyle)]?.label)}
          ${
              question?.sectionAlignment == "0"
                ? "text-start"
                : question?.sectionAlignment == "1"
                ? "text-center"
                : "text-end"
            }`} style={{fontSize: (parseInt(masterDropdown?.sectionFontSize.options[parseInt(questionPaperFilter?.sectionFontSize)]?.label) - 3)+"px"}}>({question?.instruction})</p>}
            </div>
          {renderQuestions(question?.children || [])}
        </>
      );
    } else if (question.type === "Question") {
      return (
        <>
          {question?.orOptionConfig?.show && (
            <div className={`previewTemplateOrCase renderFontSize${(parseInt(masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label) + 2)} ${question?.orAlignment == "0" ? "text-start" : question?.orAlignment == "1" ? "text-center" : question?.orAlignment == "2" ? "text-end" : "text-center"}`}>
              {question?.orOptionConfig?.text}
            </div>
          )}
          {question?.elementTitle && (
            <>
            <div className="subQuestionBlk">
              <div className={`subQuestionListSect ${fontFamilyCheck(masterDropdown?.questionFontStyle?.options[parseInt(questionPaperFilter?.questionFontStyle)]?.label)}`}>
              {!templatePrintEdit ? <p style={{pointerEvents: isOnline ? 'none' : 'auto' }} className={`m-0 pTagDangerous questionBullet renderFontSize${masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label}`} dangerouslySetInnerHTML={{__html: question?.sequenceText }} /> : <p style={{pointerEvents: isOnline ? 'none' : 'auto' }} onClick={(event) => {setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({currentQuestion:question, key:'sequenceText', value:question?.sequenceText, questionType: question?.type })}} className={`sequenceTextEdit ${markerrorQnsIds && markerrorQnsIds?.length > 0 && markerrorQnsIds?.includes(question?.id)?"marksError":""}`}><span>{`Q)`}</span><p className="squenTextHtml" dangerouslySetInnerHTML={{__html: question?.sequenceText }}></p></p>}
              
                  <p style={{ color: isOnline && !question?.questionInfo ? 'red' : '' }}
                  className={`questionSectList m-0 me-3 renderFontSize${masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label} ${fontFamilyCheck(masterDropdown?.questionFontStyle?.options[parseInt(questionPaperFilter?.questionFontStyle)]?.label)} ${!question?.questionInfo?.question ? "red-text":""}`}
                  dangerouslySetInnerHTML={{
                    // __html: question?.questionInfo?.question ? getQuestionTitle(question?.questionInfo).replaceAll("color:#f00", "color:#000000"): removeSpaceFromString(question?.elementTitle),
                    __html: question?.questionInfo?.question ? getQuestionTitle(question?.questionInfo).replaceAll("color:#f00", "color:#000000"): question?.elementTitle,
                  }}
                />                
              </div>
              <div className="subQuestionListMarkSect">
              {/* {question?.marks ? (!templatePrintEdit ? <span style={{fontSize: masterDropdown?.marksFontSize?.options[parseInt(questionPaperFilter?.marksFontSize)]?.label+"px"}}>{masterDropdown ? masterDropdown?.marksFormat?.options[parseInt(questionPaperFilter?.marksFormat)]?.label?.replace("1", question?.marks): question?.marks}</span> : <p className={`sequenceTextEdit ${markerrorQnsIds && markerrorQnsIds?.length > 0 && markerrorQnsIds?.includes(question?.id)?"marksError":""}`} onClick={(event) => {setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({currentQuestion:question, key:'marks', value: question?.marks, questionType: question?.type })}}>{question?.marks}<span>Marks</span></p>):""} */}
              {!templatePrintEdit ? <span className={`${fontFamilyCheck(masterDropdown?.questionFontStyle?.options[parseInt(questionPaperFilter?.questionFontStyle)]?.label)}`} style={{fontSize: masterDropdown?.marksFontSize?.options[parseInt(questionPaperFilter?.marksFontSize)]?.label+"px"}}>{masterDropdown ? masterDropdown?.marksFormat?.options[parseInt(questionPaperFilter?.marksFormat)]?.label?.replace("1", question?.marks): question?.marks}</span> 
              :
              <div className={`sequenceTextEdit sequenceMarkEdit ${markerrorQnsIds && markerrorQnsIds?.length > 0 && markerrorQnsIds?.includes(question?.id)?"marksError":""}`}>
              <TextField    
              style={question?.questionInfo?.metaInfo?.length > 0 ? {pointerEvents:'none'} :{} }
              value={question?.marks}
              disabled={isOnline}
                onChange={(event:any) => {
                handleApplyValueChanges(event.target.value,{currentQuestion: question, key:'marks', value: question?.marks, questionType: question?.type })
              }}
              onKeyPress={(event:any) => {
                const allowedKeys = /[0-9\b\.\b]/;
                const inputValue = event.target.value + event.key; // Combine existing input with pressed key
                const maxValue = 100;

                if (!allowedKeys.test(event.key) || parseFloat(inputValue) > maxValue) {
                  event.preventDefault();
                }    
          }}
             /><span>Marks</span></div>}
              {templatePrintEdit ? <button>Question <Tooltip placement="top" title="Replace"><img src={ReplaceIcon} onClick={() => {setReplaceModal(true);setReplaceFilterObj(question??null)}}/></Tooltip></button> : ""}
              {/* {templatePrintEdit && availableModules.includes(20) && <div className="workBook-btn-auto" style={{margin:'-1px -39px 6px 1px'}}><DropDownButtonComponent buttonName={''} minWidth="50" buttonOptions={[0,1,2,3,4,5,6,7,8,9,10]}  onChangeHandler={(e)=>{ console.log(e); handleLines(question,e)}} /> </div> } */}

              </div>
            </div>
            {((printWithAnswer) && question?.questionInfo?.blankMetaInfo) && <div className="solutionSection MCQSolutionSect FIBSolutionSect">
              <div className="solutionSectionBlk">
                <p className="Title">Solution:</p>
                  {QuestionTypeActaualAnswerRender(question?.questionInfo?.blankMetaInfo, "FIB")}
              </div>
            </div>}
            {question?.questionInfo?.questionTypeName == "MCQ" && 
            <>
            <ul className={`subQuestionLisOption renderFontSize${masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label}`}>
              {question?.questionInfo?.questionOptions && question?.questionInfo?.questionOptions.map((ele: any, index: number) => {
                      //return (<li className={`${fontFamilyCheck(masterDropdown?.questionFontStyle?.options[parseInt(questionPaperFilter?.questionFontStyle)]?.label)}`}><div className={`${fontFamilyCheck(masterDropdown?.questionFontStyle?.options[parseInt(questionPaperFilter?.questionFontStyle)]?.label)}`} dangerouslySetInnerHTML={{ __html: removeSpaceFromString(ele.text) }}></div></li>)
                      return (<li className={`${fontFamilyCheck(masterDropdown?.questionFontStyle?.options[parseInt(questionPaperFilter?.questionFontStyle)]?.label)}`}><div className={`${fontFamilyCheck(masterDropdown?.questionFontStyle?.options[parseInt(questionPaperFilter?.questionFontStyle)]?.label)}`} dangerouslySetInnerHTML={{ __html: ele.text }}></div></li>)
              })}
            </ul>
                {((printWithAnswer) || viewAnswer) && <div className="solutionSection MCQSolutionSect">
              <div className="solutionSectionBlk">
                <p className="Title">Solution:</p>
                  {QuestionTypeActaualAnswerRender(question?.questionInfo?.questionOptions, "MCQ")}
              </div>
            </div>}
            </>
            }
            {question?.questionInfo?.questionTypeName == "Match The Following" && 
            <>
            <div className="matchFollowingTable">
              {question?.questionInfo?.questionMTFOptions && question?.questionInfo?.questionMTFOptions.map((column: any, index: number) => {
                      return (
                      <>
                      <table>
                          <tr>
                              {/* <th className={`matchFolText m-0 ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)} renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label}`} dangerouslySetInnerHTML={{ __html: removeSpaceFromString(column.columnLabel)}}></th> */}
                              <th className={`matchFolText m-0 ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)} renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label}`} dangerouslySetInnerHTML={{ __html: column.columnLabel}}></th>
                          </tr>
                          {column.details.map((columnDetail: any, index: number) => {
                              // return <tr><td className={`matchFolText m-0 ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)} renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label}`} dangerouslySetInnerHTML={{ __html: removeSpaceFromString(columnDetail?.question)}}></td></tr>
                              return <tr><td className={`matchFolText m-0 ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)} renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label}`} dangerouslySetInnerHTML={{ __html: columnDetail?.question}}></td></tr>
                          })}
                      </table>
                      </>
                      )
              })}
            </div>
            {(printWithAnswer) && <div className="solutionSection MTFSolutionSect">
              <div className="solutionSectionBlk">
                <p className="Title">Solution:</p>
                  {QuestionTypeActaualAnswerRender(question?.questionInfo?.questionMTFOptions, "MTF")}
              </div>
            </div>}
            </>
            }
              {(workbookStyle) && templatePrintEdit && !printWithAnswer && !question?.questionInfo?.metaInfo && workBookStructure(question, "Select Type") }
              {
                workbookStyle && availableModules.includes(20) && question.typeOfLines && !printWithAnswer && !viewAnswer && !question?.questionInfo?.metaInfo &&
                (
                  linesToRender(question)
                )
              }
            </>
          )}
          {question?.questionInfo?.metaInfo?.length > 0 &&
            question?.questionInfo?.metaInfo?.map((metaInfo: any,i:any) => {
              return (
                <>
                  {/* {question?.orOptionConfig?.show && (
                    <div className={`previewTemplateOrCase ${question?.orAlignment == "0" ? "text-start" : question?.orAlignment == "1" ? "text-center" : question?.orAlignment == "2" ? "text-end" : "text-left"}`}
                    style={{fontSize: (parseInt(masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label) + 2)+"px"}}>
                      {question?.orOptionConfig?.text}
                    </div>
                  )} */}
                  <div className="subQuestionCompreBlk">
                    <div className="d-flex gap-2">
                    {/* <p  className={`subQuestionCompreBlkSquence m-0 renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label}`} dangerouslySetInnerHTML={{__html: removeSpaceFromString(metaInfo?.sequenceText) }}/> */}
                    <p  className={`subQuestionCompreBlkSquence m-0 renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label}`} dangerouslySetInnerHTML={{__html: metaInfo?.sequenceText }}/>
                      <p

                        className={`questionSectList m-0 renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label} ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)}`}
                        dangerouslySetInnerHTML={{
                          // __html: removeSpaceFromString(metaInfo?.question),
                          __html: metaInfo?.question,
                        }}
                      />
                    </div>
                    <div className={`subQuestionCompreMarkBlk ${markerrorQnsIds && markerrorQnsIds?.length > 0 && markerrorQnsIds?.includes(question?.id)?"marksError":""}`}>
                    {!templatePrintEdit && metaInfo?.marks ?
                      <span className={`${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)}`} style={{ fontSize: masterDropdown?.marksFontSize?.options[parseInt(questionPaperFilter?.marksFontSize)]?.label + "px" }}>{masterDropdown ? masterDropdown?.marksFormat?.options[parseInt(questionPaperFilter?.marksFormat)]?.label?.replace("1", metaInfo?.marks): metaInfo?.marks}</span>
                      :
                      <div className="editMarkBlk">
                        <TextField
                          value={metaInfo?.marks || ""}
                          placeholder=""
                          onChange={(e:any)=>{ changeMarks(e,question,i) }}
                          label="Marks"
                          variant="outlined"
                          autoComplete="off"
                        />
                      </div>
                    }
                    {/* { metaInfo?.marks ? (!templatePrintEdit ? <span style={{fontSize: masterDropdown?.marksFontSize?.options[parseInt(questionPaperFilter?.marksFontSize)]?.label+"px"}}>{masterDropdown ? masterDropdown?.marksFormat?.options[parseInt(questionPaperFilter?.marksFormat)]?.label?.replace("1", metaInfo?.marks): metaInfo?.marks}</span> : <p className={`sequenceTextEdit ${markerrorQnsIds && markerrorQnsIds?.length > 0 && markerrorQnsIds?.includes(question?.id)?"marksError":""}`} onClick={(event) => {setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({currentQuestion:metaInfo, key:'marks', value: metaInfo?.marks, questionType: metaInfo?.type })}}>{metaInfo?.marks}<span>Marks</span></p>) : ""} */}
                    </div>                   
                  </div>
                  {(printWithAnswer && metaInfo && metaInfo?.questionTypeName == "Subjective") && <div className="solutionSection">
                    <div className="solutionSectionBlk">
                      <p className="Title">Solution:</p>
                      {/* <p dangerouslySetInnerHTML={{__html: removeSpaceFromString(metaInfo?.solution)}} /> */}
                      <p dangerouslySetInnerHTML={{__html: metaInfo?.solution}} />
                    </div>
                  </div>}
                  {(printWithAnswer && metaInfo?.blankMetaInfo) && <div className="solutionSection MCQSolutionSect FIBSolutionSect">
                    <div className="solutionSectionBlk">
                      <p className="Title">Solution:</p>
                        {QuestionTypeActaualAnswerRender(metaInfo?.blankMetaInfo, "FIB")}
                    </div>
                  </div>}
                  {metaInfo?.questionTypeName == "MCQ" &&
                  <>
                  <ul className="subQuestionCompreBlkOptions">
                  {metaInfo?.questionOptions?.length > 0 && metaInfo?.questionOptions.map((options: any) => {                      
                      return (
                        <li className={`m-0 renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label} ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)}`}
                        dangerouslySetInnerHTML={{
                          // __html: removeSpaceFromString(options?.text),
                          __html: options?.text,
                        }} ></li>
                      )
                    })}                     
                  </ul>
                  {(printWithAnswer) && <div className="solutionSection MCQSolutionSect">
                      <div className="solutionSectionBlk">
                        <p className="Title">Solution:</p>
                          {QuestionTypeActaualAnswerRender(metaInfo?.questionOptions, "MCQ")}
                      </div>
                    </div>}
                  </>
                  }
                  {metaInfo?.questionTypeName == "Match The Following" && 
                  <>
                    <div className="matchFollowingTable subQuestionCompreBlkMft">
                      {metaInfo?.questionMTFOptions && metaInfo?.questionMTFOptions.map((column: any, index: number) => {
                              return (
                              <>
                              <table>
                                  <tr>
                                      {/* <th className={`matchFolText m-0 renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label} ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)}`} dangerouslySetInnerHTML={{ __html: removeSpaceFromString(column.columnLabel)}}></th> */}
                                      <th className={`matchFolText m-0 renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label} ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)}`} dangerouslySetInnerHTML={{ __html: column.columnLabel}}></th>
                                  </tr>
                                  {column.details.map((columnDetail: any, index: number) => {
                                      // return <tr><td className={`matchFolText m-0 renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label} ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)}`} dangerouslySetInnerHTML={{ __html: removeSpaceFromString(columnDetail?.question)}}></td></tr>
                                      return <tr><td className={`matchFolText m-0 renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label} ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)}`} dangerouslySetInnerHTML={{ __html: columnDetail?.question}}></td></tr>
                                  })}
                              </table>
                              </>
                              )
                      })}
                    </div>
                    {(printWithAnswer) && <div className="solutionSection MTFSolutionSect">
                      <div className="solutionSectionBlk">
                        <p className="Title">Solution:</p>
                          {QuestionTypeActaualAnswerRender(metaInfo?.questionMTFOptions, "MTF")}
                      </div>
                    </div>}
                    </>
                    }
                    {(workbookStyle) && templatePrintEdit && !printWithAnswer && workBookStructure(question, "Select Type", metaInfo)}
                  {
                    workbookStyle && availableModules.includes(20) && metaInfo.typeOfLines && !printWithAnswer && !viewAnswer &&
                    (
                      linesToRender(metaInfo)
                    )
                  }
                </>
              );
            })}
            {(printWithAnswer && question?.questionInfo?.solution && question?.questionInfo?.questionTypeName == "Subjective") && <div className="solutionSection">
              <div className="solutionSectionBlk">
                <p className="Title">Solution:</p>
                {/* <p dangerouslySetInnerHTML={{__html: removeSpaceFromString(question?.questionInfo?.solution)}} /> */}
                <p dangerouslySetInnerHTML={{__html: question?.questionInfo?.solution}} />
              </div>
            </div>}
        </>
      );
    } else if (question?.type?.replaceAll(/\s/g, "") === "MainQuestion") {
      return (
        <>
          {question?.orOptionConfig?.show && (
            <div className={`previewTemplateOrCase renderFontSize${(parseInt(masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label) + 2)} ${question?.orAlignment == "0" ? "text-start" : question?.orAlignment == "1" ? "text-center" : question?.orAlignment == "2" ? "text-end" : "text-left"}`}>{question?.orOptionConfig?.text}</div>
          )}
          {question?.elementTitle && (
            <div className="mainQuestionBlk">
            <div className="mainQuestionListSect" style={{alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"flex-start"}}>
                {!templatePrintEdit ? <p className={`swquence seq m-0 ${fontFamilyCheck(masterDropdown?.mainQuestionFontStyle?.options[parseInt(questionPaperFilter?.mainQuestionFontStyle)]?.label)} renderFontSize${masterDropdown?.mainQuestionFontSize?.options[parseInt(questionPaperFilter?.mainQuestionFontSize)]?.label}`} dangerouslySetInnerHTML={{ __html: (question?.sequenceText) }} /> : <p onClick={(event) => { setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({ currentQuestion: question, key: 'sequenceText', value: question?.sequenceText, questionType: question?.type }) }} className={`sequenceTextEdit  ${markerrorQnsIds && markerrorQnsIds?.length > 0 && markerrorQnsIds?.includes(question?.id) ? "marksError" : ""} mqText`}><span>{`MQ)`}</span><p className="squenTextHtml" dangerouslySetInnerHTML={{ __html: (question?.sequenceText) }}></p></p>}              
            <div style={{paddingLeft:"8px"}}>
            <p
  className={`questionSect qsnData m-0 renderFontSize${masterDropdown?.mainQuestionFontSize?.options[parseInt(questionPaperFilter?.mainQuestionFontSize)]?.label} ${fontFamilyCheck(masterDropdown?.mainQuestionFontStyle?.options[parseInt(questionPaperFilter?.mainQuestionFontStyle)]?.label)}`}
  dangerouslySetInnerHTML={{ __html:`${(question?.elementTitle)}
      ${question?.instruction ? `<span style="padding-left: 0px;" class="partData partTitle m-0 ${
            question?.partAlignment == "0"
            ? "text-start"
            : question?.partAlignment == "1"
            ? "text-center"
            : "text-end"
      } renderFontSize${(parseInt(masterDropdown?.mainQuestionFontSize.options[parseInt(questionPaperFilter?.mainQuestionFontSize)]?.label) - 3)} ${fontFamilyCheck(masterDropdown?.mainQuestionFontStyle?.options[parseInt(questionPaperFilter?.mainQuestionFontStyle)]?.label)}">(${(question?.instruction)})</span>`:""}`}}/>
               </div>
               </div>
               </div>
              <div className="mainQuestionListMarkSect" style={{ justifyContent: "flex-end" }}>
                {/* {question?.marks ? (!templatePrintEdit ? <span style={{fontSize: masterDropdown?.marksFontSize?.options[parseInt(questionPaperFilter?.marksFontSize)]?.label+"px"}}>{masterDropdown?.marksFormat?.options[parseInt(questionPaperFilter?.marksFormat)]?.label?.replace("1", question?.marks)}</span>: <p className={`sequenceTextEdit ${markerrorQnsIds && markerrorQnsIds?.length > 0 && markerrorQnsIds?.includes(question?.id)?"marksError":""}`} onClick={(event) => {setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({currentQuestion: question, key:'marks', value: question?.marks, questionType: question?.type })}}>{question?.marks}<span>Marks</span></p>):""} */}
                {!templatePrintEdit ? <span className={`${fontFamilyCheck(masterDropdown?.mainQuestionFontStyle?.options[parseInt(questionPaperFilter?.mainQuestionFontStyle)]?.label)}`} style={{fontSize: masterDropdown?.marksFontSize?.options[parseInt(questionPaperFilter?.marksFontSize)]?.label+"px",width:"70px"}}>{masterDropdown?.marksFormat?.options[parseInt(questionPaperFilter?.marksFormat)]?.label?.replace("1", question?.marks)}</span>            
                :
                <div className={`sequenceTextEdit sequenceMarkEdit ${markerrorQnsIds && markerrorQnsIds?.length > 0 && markerrorQnsIds?.includes(question?.id)?"marksError":""}`}>
                <TextField
                value={question?.marks}
                onChange={(event:any) => {
                  handleApplyValueChanges(event.target.value,{currentQuestion: question, key:'marks', value: question?.marks, questionType: question?.type })
                }}
                style={{pointerEvents:'none'}}
                onKeyPress={(event:any) => {
                  const allowedKeys = /[0-9\b\.\b]/;
                  const inputValue = event.target.value + event.key;
                  const maxValue = 100;

                  if (!allowedKeys.test(event.key) || parseFloat(inputValue) > maxValue) {
                    event.preventDefault();
                  }  
            }}
              /><span>Marks</span></div>}
                {templatePrintEdit ? <button>Main Question</button> : "" }
                {/* {templatePrintEdit && availableModules.includes(20) && <span className="workBook-btn-auto" style={{margin:'-1px -39px 6px 1px'}}><DropDownButtonComponent buttonName={''} minWidth="50" buttonOptions={['numberOfLines','englishLine','table','blankBox','borderBox']}  onChangeHandler={(e)=>{ console.log(e); handleLines(question,e,true)}} /> </span> } */}
              </div>
            </div>
          )}
          {(workbookStyle) && templatePrintEdit && workBookStructure(question,"Apply Type for Questions")}    
          {renderQuestions(question?.children || [])}
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <div>{renderQuestions(questionData)}</div>
      {replaceModal && <ReplaceQuestionModal ReqBody={ReqBody} open={replaceModal} handleClose={() => {setReplaceModal(false)}} replaceFilterObj={replaceFilterObj} replace={replace} replaceQp={replaceQp} qpCourses={qpCourses}/>}
      {openPreviewImg && <PreviewModalImage header={''} openPreview={openPreviewImg} setOpenPreview={setOpenPreviewImg} content={imgContent} setContent={setImgContent}  />}
    </>
  )
  
};

export default RecussivePaperGenerator;
