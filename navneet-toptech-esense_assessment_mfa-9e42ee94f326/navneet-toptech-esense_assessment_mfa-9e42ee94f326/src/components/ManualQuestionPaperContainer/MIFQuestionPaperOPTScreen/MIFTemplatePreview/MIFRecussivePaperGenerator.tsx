import React, { useEffect, useState } from "react";
import "./MIFQuestionPaperTemplate.css";
import MIFReplaceQuestionModal from "../../MIFReplaceQuestionModal/MIFReplaceQuestionModal";
import { AlertColor, Box, IconButton, Menu, MenuItem, Select, Slider, Stack, TextField, Tooltip, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { mainQuestionBody } from "../../../../constants/generateQPPayload";
import InputFieldComponentForForm from "../../../SharedComponents/FormFieldComponents/InputFieldComponent";
import Toaster from "../../../SharedComponents/Toaster/Toaster";
import AddIcon from "../../../../assets/images/Add.svg"
import DeleteIcon from "../../../../assets/images/delete.svg"
import ReplaceIcon from "../../../../assets/images/Replace.svg"
import MoveDownIcon from "../../../../assets/images/MoveDown.svg"
import MoveUpIcon from "../../../../assets/images/MoveUp.svg"
import ChangeFieldModalPopup from "../../../SharedComponents/ModalPopup/ChangeFieldModalPopup";
import { QuestionType } from "../../../../interface/filters";
import { addNumberOfLinesToQuestions, availableModules, getLineCountForMarks, numberOfLinesCount, typeOflines } from "../../../../constants/helper";
import SelectBoxComponent from "../../../SharedComponents/SelectBoxComponent/SelectBoxForWorkBook";
// import { removeSpaceFromString } from "../../../../constants/helper";
interface Question {
  errorMessage?:string,
  error?: boolean;
  id: number;
  type: "Part" | "Section" | "Question" | "Main Question";
  title?: string;
  mainQuestion?: string;
  question?: string;
  children?: Question[] | Question;
  elementTitle?: any;
  questionInfo?: any;
  orOptionConfig?: any;
  partAlignment?: string;
  marks?: string;
  marksFormat?: string;
  sequenceText?: any;
  orAlignment?:string;
  sectionAlignment?:string
  parentID?:string;
  instruction?:string;
  numberOfLines?:any;
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
  questionIndex:number,
  setSnackBarSeverity: (severity: AlertColor) => void,
  setSnackBarText: (text: string) => void,
  setSnackBar: (show: boolean) => void
  SnackBarSeverity: AlertColor,
  snackBarText: string,
  snackBar: boolean,
  printWithAnswer?:any,
  viewAnswer?:boolean,
  typeOfLine?:string
  workbookStyle?:boolean
  setIsWorksheetEdit?:any
}
interface SelectedTypeItem {
  id: string | null;
  value: string | null;
  count: string | null;
  row: string | null;
  column: string | null;
  space: string | null;
}

enum QuestionActions {
  MOVE_UP = "moveUp",
  MOVE_DOWN = "moveDown",
  REPLACE = "replace",
  DELETE = "delete",
  ADD_MAIN_QUESTION = "addMainQuestion",
}

const MIFRecussivePaperGenerator: React.FC<QuestionPaperProps> = ({
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
 questionIndex,
 ReqBody,
 setSnackBarSeverity,
 setSnackBarText,
 setSnackBar,
 SnackBarSeverity,
 snackBarText,
 snackBar,
 printWithAnswer,
 viewAnswer=false,
 typeOfLine,
 workbookStyle,
 setIsWorksheetEdit
}) => {
  const [replaceModal, setReplaceModal] = useState(false)
  const [replaceFilterObj,setReplaceFilterObj]=useState<any|null>(null)
  const [queActionAnchorEl, setQueActionAnchorEl] = useState<any>();
  const [queActionMenuShow, setQueActionMenuShow] = useState<boolean>(false);
  // const [snackBar, setSnackBar] = useState<boolean>(false);
  // const [snackBarText, setSnackBarText] = useState<string>("");
  // const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("success");
  const [selectedQuestionId, setSelectedQuestinoId] = useState<number>();
  const[deleteQuestionModal,setDeleteQuestionModal]=useState<boolean>(false)
  const[questionType,setQuestionType]=useState<string>("")
  const[tempQuestion,setTempQuestion]=useState<Question | {}>({})
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

  
  const handleQuestionAction = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setQueActionAnchorEl(event.currentTarget);
    setQueActionMenuShow(Boolean(event.currentTarget))
  }

  const handleActionMenuClose = () => {
    setQueActionMenuShow(false);
    setQueActionAnchorEl(null);
  };

  useEffect(() => {
    if(ReqBody?.bodyTemplate?.templateBuilderInfo?.rootType === "Main Question") {
      const templateBuilderInfo = ReqBody.bodyTemplate.templateBuilderInfo
      const newTemplateParts = [...templateBuilderInfo.templateParts];
      templateBuilderInfo.templateParts.forEach((i: any, index: number) => {
        const MinimumValueArr= newTemplateParts[index].children.map((i:any)=>parseInt(i.marks));
        const MinimumValue = Math.min(...MinimumValueArr)          
        const MaximumValue = newTemplateParts[index].children.reduce((acc: any, cur: any) => Number(acc) + Number(cur.marks), 0)
        if(+i.marks >= MinimumValue && +i.marks <= MaximumValue){
          newTemplateParts[index].error = false
          newTemplateParts[index].errorMessage = ''
        } else{
          newTemplateParts[index].error = true
          newTemplateParts[index].errorMessage = `Please enter valid marks between ${MinimumValue} And ${MaximumValue}`
        }
      });
      const newJson = {...ReqBody, bodyTemplate:{ templateBuilderInfo: {...templateBuilderInfo, templateParts: newTemplateParts } }}
      if(JSON.stringify(newJson) !== JSON.stringify(ReqBody)){
        replaceQp(newJson)
      }
    }
  }, [ReqBody?.bodyTemplate?.templateBuilderInfo?.templateParts]);

  
  const changeMarks = (e: React.ChangeEvent<HTMLInputElement>,question:any, type: string,index?: any) => {
    const newValue = e.target.value;
    let MinimumValue:any;
    let MaximumValue:any;

    if(/^\d*\.?\d*$/.test(newValue)) {  
      setIsWorksheetEdit(true);   
      const templateBuilderInfo = ReqBody.bodyTemplate.templateBuilderInfo
      const newTemplateParts = [...templateBuilderInfo.templateParts];
      //updating the marks of children if main question is there
      if(type === "Question" && question?.parentID){
        let parentIndex = newTemplateParts.findIndex((data:any)=>data.id === question?.parentID);
        if(parentIndex !== -1){
          const selectChild = newTemplateParts[parentIndex]?.children.findIndex((data:any)=>data?.id === question.id);
          if(selectChild !==-1){
            newTemplateParts[parentIndex].children[selectChild].marks = newValue 
            const MinimumValueArr= newTemplateParts[parentIndex].children.map((i:any)=>parseInt(i.marks));
            MinimumValue = Math.min(...MinimumValueArr)          
            MaximumValue = newTemplateParts[parentIndex].children.reduce((acc: any, cur: any) => Number(acc) + Number(cur.marks), 0)
            newTemplateParts[parentIndex].marks = newTemplateParts[parentIndex].children.reduce((acc: any, cur: any) => Number(acc) + Number(cur.marks), 0)
            if(+newValue >= MinimumValue && +newValue <= MaximumValue){
              newTemplateParts[parentIndex].error = false
              newTemplateParts[parentIndex].errorMessage = ''
            } else{
              newTemplateParts[parentIndex].error = true
              newTemplateParts[parentIndex].errorMessage = `Please enter valid marks between ${MinimumValue} And ${MaximumValue}`
            }
      // updating the marks if question type is comprehensive
      if( newTemplateParts[parentIndex].children[selectChild].questionInfo.metaInfo && newTemplateParts[parentIndex].children[selectChild].questionInfo.metaInfo.length>0){
        const MetaMinimumValueArr= newTemplateParts[parentIndex].children[selectChild].questionInfo.metaInfo.map((i:any)=>parseInt(i.marks));
        let MetaMinimumValue = Math.min(...MetaMinimumValueArr)          
        let MetaMaximumValue = newTemplateParts[parentIndex].children[selectChild].questionInfo.metaInfo.map((i: any) => parseInt(i.marks)).reduce((acc: number, cur: number) => acc + cur, 0)
        if(+newValue >= MetaMinimumValue && +newValue <= MetaMaximumValue){
          newTemplateParts[parentIndex].children[selectChild].error = false
          newTemplateParts[parentIndex].children[selectChild].errorMessage = ''
        } else{
          newTemplateParts[parentIndex].children[selectChild].error = true
          newTemplateParts[parentIndex].children[selectChild].errorMessage = `Please enter valid marks between ${MetaMinimumValue} And ${MetaMaximumValue}`
        }
      }
          }
        }
      } else if(type === "Main Question"){
        const MinimumValueArr= question?.children.map((i:any)=>parseInt(i.marks));
            MinimumValue = Math.min(...MinimumValueArr)          
            MaximumValue = question.children.reduce((acc: any, cur: any) => Number(acc) + Number(cur.marks), 0)
          if(+newValue >= MinimumValue && +newValue <= MaximumValue){
            newTemplateParts[questionIndex].error = false
            newTemplateParts[questionIndex].errorMessage = ''
          } else{
            newTemplateParts[questionIndex].error = true
            newTemplateParts[questionIndex].errorMessage = `Please enter valid marks between ${MinimumValue} And ${MaximumValue}`
          }
         newTemplateParts[questionIndex].marks = newValue
      }
      // when question is of comprehensive type
      else if(type === "MetaQuestion"){
        if(templateBuilderInfo.rootType === "Question"){
          newTemplateParts[questionIndex].questionInfo.metaInfo[index].marks = newValue
          newTemplateParts[questionIndex].marks = newTemplateParts[questionIndex].questionInfo.metaInfo.map((i: any) => parseInt(i.marks)).reduce((acc: number, cur: number) => acc + cur, 0);
          newTemplateParts[questionIndex].error = false
          newTemplateParts[questionIndex].errorMessage = ''
        }
        else if(templateBuilderInfo.rootType === "Main Question"){
          let quesIndex=newTemplateParts[questionIndex].children.findIndex((data:any)=> data.id ==question.id)
          newTemplateParts[questionIndex].children[quesIndex].questionInfo.metaInfo[index].marks = newValue
          newTemplateParts[questionIndex].children[quesIndex].marks = newTemplateParts[questionIndex].children[quesIndex].questionInfo.metaInfo.map((i: any) => parseInt(i.marks)).reduce((acc: number, cur: number) => acc + cur, 0);
          newTemplateParts[questionIndex].marks = newTemplateParts[questionIndex].children.map((i: any) => parseInt(i.marks)).reduce((acc: number, cur: number) => acc + cur, 0);
          newTemplateParts[questionIndex].children[quesIndex].error = false
          newTemplateParts[questionIndex].children[quesIndex].errorMessage = ''
          newTemplateParts[questionIndex].error = false
          newTemplateParts[questionIndex].errorMessage = ''
        }
      }
      else{
        // when type is question and have no main question
        newTemplateParts[questionIndex].marks = newValue

        // updating the marks for question is of comprehensive type
        if(newTemplateParts[questionIndex].questionInfo.metaInfo && newTemplateParts[questionIndex].questionInfo.metaInfo.length > 0){
          const MinimumValueArr= newTemplateParts[questionIndex].questionInfo.metaInfo.map((i:any)=>parseInt(i.marks));
          MinimumValue = Math.min(...MinimumValueArr)          
          MaximumValue = newTemplateParts[questionIndex].questionInfo.metaInfo.map((i: any) => parseInt(i.marks)).reduce((acc: number, cur: number) => acc + cur, 0)
          if(+newValue >= MinimumValue && +newValue <= MaximumValue){
            newTemplateParts[questionIndex].error = false
            newTemplateParts[questionIndex].errorMessage = ''
          } else{
            newTemplateParts[questionIndex].error = true
            newTemplateParts[questionIndex].errorMessage = `Please enter valid marks between ${MinimumValue} And ${MaximumValue}`
          }
        }
      }
      const newJson = {...ReqBody, bodyTemplate:{ templateBuilderInfo: {...templateBuilderInfo, templateParts: newTemplateParts } }}
      replaceQp(newJson)
    }   
  }

  const fontFamilyCheck = ((fontFamily:string) => {
    return fontFamily == "Arial" ? "previewFontArial" : fontFamily == "Times New Roman" ? "previewFontTimesNewRoman" : fontFamily == "Verdana" ? "previewFontVerdana" : fontFamily == "Helvetica" ? "previewFontHelvetica" : ""
  })

  const QuestionTypeActaualAnswerRender = (QPOptions:any, type:string) => {
    let MTFrenderObject:any = {};
    let FIBrenderArray:Array<string> = [];
      QPOptions?.map((list:any) => {
        if(type == "MTF"){
        list.details.map((QPDetails:any) => {       
          if(QPDetails.row in MTFrenderObject == false){MTFrenderObject[QPDetails.row] = []}
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
                        {/* <td dangerouslySetInnerHTML={{ __html: removeSpaceFromString(MTFrenderRowList.toString().replace('<br />', '<p>'))}} /> */}
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
            <ul className={`subQuestionLisOption subQuestionLisOptionMCQ renderFontSize${masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label}`}>
            {QPOptions.map((MCQList: any, index: number) => {
              return (<li className={`m-0 ${!MCQList?.isCorrect ? "mcqWrong" :""}`}><div dangerouslySetInnerHTML={{ __html: MCQList?.text }}></div></li>)
            })}
          </ul>
          }
          {(type == "FIB") && 
            <ul className="subQuestionLisOption">
            {FIBrenderArray.map((MCQList: any, index: number) => {
              return (<li className={`renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label} m-0`} ><div dangerouslySetInnerHTML={{ __html: MCQList }}></div></li>)
            })}
          </ul>
          }
      </>)
  }

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
    setIsWorksheetEdit(true);
  }
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
            <div className={`previewTemplateOrCase ${question?.orAlignment == "0" ? "text-start" : question?.orAlignment == "1" ? "text-center" : question?.orAlignment == "1" ? "text-end" : "text-center"}`}>
              {question?.orOptionConfig?.text}
            </div>
          )}
          <p
            className={`partTitle m-0 
            ${fontFamilyCheck(masterDropdown?.partTextFontStyle?.options[parseInt(questionPaperFilter?.partTextFontStyle)]?.label)}
            ${
              question?.partAlignment == "0"
                ? "text-start"
                : question?.partAlignment == "1"
                ? "text-center"
                : "text-end"
            } renderFontSize${masterDropdown?.partFontSize.options[parseInt(questionPaperFilter?.partFontSize)]?.label}`}
          >
            {question?.elementTitle}
            {(workbookStyle) && templatePrintEdit && workBookStructure(question,"Apply Type for Section")}    
          </p>
          {question?.instruction && <p className={`partTitle 
          ${fontFamilyCheck(masterDropdown?.partTextFontStyle?.options[parseInt(questionPaperFilter?.partTextFontStyle)]?.label)}
          ${
              question?.partAlignment == "0"
                ? "text-start"
                : question?.partAlignment == "1"
                ? "text-center"
                : "text-end"
            } renderFontSize${(parseInt(masterDropdown?.partFontSize.options[parseInt(questionPaperFilter?.partFontSize)]?.label) - 3)}`} >({question?.instruction})</p>}
          {renderQuestions(question.children || [])}
        </>
      );
    } else if (question?.type === "Section") {
      return (
        <>
          {question?.orOptionConfig?.show && (
            <div className={`previewTemplateOrCase ${question?.orAlignment == "0" ? "text-start" : question?.orAlignment == "1" ? "text-center" : question?.orAlignment == "2" ? "text-end" : "text-center"}`}>
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
            } renderFontSize${masterDropdown?.sectionFontSize?.options[parseInt(questionPaperFilter?.sectionFontSize)]?.label}`}
          >
            {/* {removeSpaceFromString(question?.elementTitle)} */}
          </p>
          {question?.instruction && <p className={`partTitle 
          ${fontFamilyCheck(masterDropdown?.sectionFontStyle?.options[parseInt(questionPaperFilter?.sectionFontStyle)]?.label)}
          ${
              question?.sectionAlignment == "0"
                ? "text-start"
                : question?.sectionAlignment == "1"
                ? "text-center"
                : "text-end"
            } renderFontSize${(parseInt(masterDropdown?.sectionFontSize.options[parseInt(questionPaperFilter?.sectionFontSize)]?.label) - 3)}`} >({question?.instruction})</p>}
          </div>
          {renderQuestions(question?.children || [])}
        </>
      );
    } else if (question.type === "Question") {
      return (
        <>
          {question?.orOptionConfig?.show && (
            <div className={`previewTemplateOrCase ${question?.orAlignment == "0" ? "text-start" : question?.orAlignment == "1" ? "text-center" : question?.orAlignment == "2" ? "text-end" : "text-center"}`}>
              {question?.orOptionConfig?.text}
            </div>
          )}

          {question?.elementTitle && (
            <>
              {/* {question.parentID && ReqBody.bodyTemplate.templateBuilderInfo.templateParts[questionIndex].children.findIndex((el: any) => el.id === question.id) === 0 && (
                <div className="mifMainQuestionBlk">
                    <div className="subQuestionListSect">
                      {!templatePrintEdit
                        ? <p style={{ fontSize: masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label + "px" }} className="m-0">{question?.sequenceText}</p>
                        : <p onClick={(event) => { setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({ currentQuestion: question, key: 'sequenceText', value: question?.sequenceText }) }} className="sequenceTextEdit">
                          <span>{`MQs)`}</span>
                          {question?.sequenceText}
                        </p>
                      }
                      <InputFieldComponentForForm registerName={'mainQuestionHeading'} inputType={"text"}
                        label={"Main Question Heading"} required={true}
                        onChange={(e: any) => { }}
                        className={"mainQuestionHeading"}
                        // onChange={(e: any) =>{ changeHandler(e.target.value, 'examName')}} 
                        inputSize={"largeSize"} variant={""} maxLength={50} />
                    </div>
                    <div className="MIFSubQuestionListMarkSect">
                      {question?.marks
                        ? (!templatePrintEdit
                          ? <span style={{ fontSize: masterDropdown?.marksFontSize?.options[parseInt(questionPaperFilter?.marksFontSize)]?.label + "px" }}>
                            {masterDropdown
                              ? masterDropdown?.marksFormat?.options[parseInt(questionPaperFilter?.marksFormat)]?.label?.replace("1", question?.marks)
                              : question?.marks}
                          </span>
                          : <p className="sequenceTextEdit"
                            onClick={(event) => { setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({ currentQuestion: question, key: 'marks', value: question?.marks }) }}>
                            {question?.marks}
                            <span>Marks</span>
                          </p>
                        )
                        : <p>Heelo</p>}
                      {templatePrintEdit ? <button> Main Question</button> : ""}
                    </div>
                </div>
              )} */}
            <div className="subQuestionBlk">
                <div className="subQuestionListSect">
                {/* {!templatePrintEdit ? <p className={`m-0 renderFontSize${masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label}`} dangerouslySetInnerHTML={{__html: removeSpaceFromString(question?.sequenceText)}}/> : <p onClick={(event) => {setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({currentQuestion:question, key:'sequenceText', value:question?.sequenceText })}} className="sequenceTextEdit"><span>{`Q)`}</span><p className="pTagDangerous" dangerouslySetInnerHTML={{__html: removeSpaceFromString(question?.sequenceText) }}/></p>} */}
                {!templatePrintEdit ? <p className={`m-0 renderFontSize${masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label}`} dangerouslySetInnerHTML={{__html: question?.sequenceText}}/> : <p onClick={(event) => {setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({currentQuestion:question, key:'sequenceText', value:question?.sequenceText })}} className="sequenceTextEdit"><span>{`Q)`}</span><p className="pTagDangerous" dangerouslySetInnerHTML={{__html: question?.sequenceText }}/></p>}
                  <p
                    className={`questionSectList m-0 renderFontSize${masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label} ${fontFamilyCheck(masterDropdown?.questionFontStyle?.options[parseInt(questionPaperFilter?.questionFontStyle)]?.label)}`}
                    dangerouslySetInnerHTML={{
                      // __html: question?.questionInfo?.question ? removeSpaceFromString(question?.questionInfo?.question) : removeSpaceFromString(question?.elementTitle),
                       __html: question?.questionInfo?.question ? question?.questionInfo?.question : question?.elementTitle,
                    }}
                  />
                </div>
                <div className="MIFSubQuestionListMarkSect">
                {/* {question?.marks ? (!templatePrintEdit ? <span style={{fontSize: masterDropdown?.marksFontSize?.options[parseInt(questionPaperFilter?.marksFontSize)]?.label+"px"}}>{masterDropdown ? masterDropdown?.marksFormat?.options[parseInt(questionPaperFilter?.marksFormat)]?.label?.replace("1", question?.marks): question?.marks}</span> : <p className="sequenceTextEdit" onClick={(event) => {setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({currentQuestion:question, key:'marks', value: question?.marks })}}>{question?.marks}<span>Marks</span></p>):<p>Heelo</p>} */}
                { templatePrintEdit ? <Tooltip arrow placement="top" title={question.error && question.errorMessage}>
                 <TextField
                  className={`${question?.questionInfo?.metaInfo?.length > 0 ? 'ComprehensionMainQuestion' : ''}`}
                  value={question?.marks || ""}
                  placeholder=""
                  onChange={(e:React.ChangeEvent<HTMLInputElement>)=>changeMarks(e,question, "Question")}
                  label="Marks"
                  variant="outlined"
                  autoComplete="off" 
                  sx={question.error ? {border: '1px solid red',borderRadius:'9px'} : {}}                                                         
                /></Tooltip> : <span className={`${fontFamilyCheck(masterDropdown?.questionFontStyle?.options[parseInt(questionPaperFilter?.questionFontStyle)]?.label)} renderFontSize${masterDropdown?.marksFontSize?.options[parseInt(questionPaperFilter?.marksFontSize)]?.label}`}>
                {masterDropdown
                  ? masterDropdown?.marksFormat?.options[parseInt(questionPaperFilter?.marksFormat)]?.label?.replace("1", question?.marks)
                  : question?.marks}
              </span> }
                {templatePrintEdit ? <button>Question 
                  <div >
                    <IconButton
                      disableRipple
                      sx={{ p: "5px" }}
                      aria-label="more"
                      aria-haspopup="true"
                      onClick={(e) => {
                        setSelectedQuestinoId(question.id)
                        handleQuestionAction(e)
                      }}
                    >
                      <MoreVertIcon sx={{ marginTop: "-17px", cursor: "pointer" }} />
                    </IconButton>
                  </div>
              </button> : ""}
              {/* { templatePrintEdit && availableModules.includes(20) && <div className="workBook-btn" style={{marginTop:'8px'}}><DropDownButtonComponent buttonName={''} minWidth="50" buttonOptions={[0,1,2,3,4,5,6,7,8,9,10]}  onChangeHandler={(e)=>{handleLines(question,e)}} /> </div> } */}
            </div>
            </div>
              {((printWithAnswer || viewAnswer) && question?.questionInfo?.blankMetaInfo) && <div className="solutionSection MCQSolutionSect FIBSolutionSect">
              <div className="solutionSectionBlk">
                <p className="Title">Solution:</p>
                  {QuestionTypeActaualAnswerRender(question?.questionInfo?.blankMetaInfo, "FIB")}
              </div>
            </div>}
            {question?.questionInfo?.questionTypeName == "MCQ" && 
            <>
            <ul className={`subQuestionLisOption renderFontSize${masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label}`}>
              {question?.questionInfo?.questionOptions && question?.questionInfo?.questionOptions.map((ele: any, index: number) => {
                      // return (<li className={`${fontFamilyCheck(masterDropdown?.questionFontStyle?.options[parseInt(questionPaperFilter?.questionFontStyle)]?.label)}`}><div className={`${fontFamilyCheck(masterDropdown?.questionFontStyle?.options[parseInt(questionPaperFilter?.questionFontStyle)]?.label)}`} dangerouslySetInnerHTML={{ __html: removeSpaceFromString(ele.text) }}></div></li>)
                      return (<li className={`${fontFamilyCheck(masterDropdown?.questionFontStyle?.options[parseInt(questionPaperFilter?.questionFontStyle)]?.label)}`}><div className={`${fontFamilyCheck(masterDropdown?.questionFontStyle?.options[parseInt(questionPaperFilter?.questionFontStyle)]?.label)}`} dangerouslySetInnerHTML={{ __html: ele.text }}></div></li>)
              })}
            </ul>
            {((printWithAnswer) || viewAnswer )&& <div className="solutionSection MCQSolutionSect">
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
                {(printWithAnswer || viewAnswer) && <div className="solutionSection MTFSolutionSect">
              <div className="solutionSectionBlk">
                <p className="Title">Solution:</p>
                  {QuestionTypeActaualAnswerRender(question?.questionInfo?.questionMTFOptions, "MTF")}
              </div>
            </div>}
            </>
            }
           {(workbookStyle) && templatePrintEdit && !printWithAnswer && !viewAnswer && !question?.questionInfo?.metaInfo && workBookStructure(question, "Select Type")}
           {
                workbookStyle && availableModules.includes(20) && question.typeOfLines && !printWithAnswer && !viewAnswer && !question?.questionInfo?.metaInfo &&
                (
                  linesToRender(question)
                )
              }
            </>
          )}
            <Menu
              id={`inner-popover-collection`}
              anchorEl={queActionAnchorEl}
              anchorOrigin={{
                horizontal: "left",
                vertical: "bottom",
              }}
              className="questionActionMenu"
              open={queActionMenuShow && selectedQuestionId === question.id}
              onClose={handleActionMenuClose}
              PaperProps={{}}
            >
              <MenuItem value="replace" className="questionActionMenuBtn" onClick={() => handleQuestionActions(QuestionActions.REPLACE, question)}> <img src={ReplaceIcon}/><span>Replace</span></MenuItem>
              <div className="hr" tabIndex={-1}></div>
              <MenuItem value="delete" className="questionActionMenuBtn" onClick={() => handleQuestionActions(QuestionActions.DELETE, question)}><img src={DeleteIcon}/><span>Delete</span></MenuItem>
              <div className="hr" tabIndex={-1}></div>
              <MenuItem value="moveUp" className="questionActionMenuBtn" onClick={() => handleQuestionActions(QuestionActions.MOVE_UP, question)} disabled={disableQuestionMoveUp(question)}><img src={MoveUpIcon} /><span>Move Up</span></MenuItem>
              <div className="hr" tabIndex={-1}></div>
              <MenuItem value="moveDown" className="questionActionMenuBtn" onClick={() => handleQuestionActions(QuestionActions.MOVE_DOWN, question)} disabled={disableQuestionMoveDown(question)}><img src={MoveDownIcon} /><span>Move Down</span></MenuItem>
              <div className="hr" tabIndex={-1}></div>
              <MenuItem value="addMainQuestion" className="questionActionMenuBtn" onClick={() => handleQuestionActions(QuestionActions.ADD_MAIN_QUESTION, question)}><img src={AddIcon} /><span>Main Question</span></MenuItem>
            </Menu>
          {question?.questionInfo?.metaInfo?.length > 0 &&
            question?.questionInfo?.metaInfo?.map((metaInfo: any,index:any) => {
              return (
                <>
                  {question?.orOptionConfig?.show && (
                    <div className="previewTemplateOrCase">
                      {question?.orOptionConfig?.text}
                    </div>
                  )}
                  <div className="subQuestionCompreBlk">
                  <div className="d-flex gap-2">
                    <p className={`subQuestionCompreBlkSquence m-0 renderFontSize${masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label}`}>{metaInfo?.sequenceText}</p>
                    <p
                      className={`questionSectList m-0 ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)} renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label}`}
                      dangerouslySetInnerHTML={{
                        // __html: removeSpaceFromString(metaInfo?.question),
                        __html: metaInfo?.question,
                      }}
                    />
                  </div>
                  <div className="MIFSubQuestionListMarkSect">
                  {!templatePrintEdit && metaInfo?.marks ?
                    <span className={`${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)} renderFontSize${masterDropdown?.marksFontSize?.options[parseInt(questionPaperFilter?.marksFontSize)]?.label}`}>{masterDropdown ? masterDropdown?.marksFormat?.options[parseInt(questionPaperFilter?.marksFormat)]?.label?.replace("1", metaInfo?.marks): metaInfo?.marks}</span>
                    :<TextField
                      value={metaInfo?.marks || ""}
                      placeholder=""
                      onChange={(e:any)=>changeMarks(e,question, "MetaQuestion",index)}
                      label="Marks"
                      variant="outlined"
                      autoComplete="off"
                    />
                  } 
                  </div>                   
                  </div>
                  {((printWithAnswer || viewAnswer) && metaInfo && metaInfo?.questionTypeName == "Subjective") && <div className="solutionSection">
                    <div className="solutionSectionBlk">
                      <p className="Title">Solution:</p>
                      {/* <p dangerouslySetInnerHTML={{__html: removeSpaceFromString(metaInfo?.solution)}} /> */}
                      <p dangerouslySetInnerHTML={{__html: metaInfo?.solution}} />
                    </div>
                  </div>}
                  {((printWithAnswer || viewAnswer) && metaInfo?.blankMetaInfo) && <div className="solutionSection MCQSolutionSect FIBSolutionSect">
                    <div className="solutionSectionBlk">
                      <p className="Title">Solution:</p>
                        {QuestionTypeActaualAnswerRender(metaInfo?.blankMetaInfo, "FIB")}
                    </div>
                  </div>}
                  {metaInfo?.questionTypeName == "MCQ" &&
                  <>
                  <ul className="MIFSubQuestionCompreBlkOptions">
                  {metaInfo?.questionOptions?.length > 0 && metaInfo?.questionOptions.map((options: any) => {
                      return (
                        <li className={`m-0 ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)} renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label}`}
                        dangerouslySetInnerHTML={{
                          // __html: removeSpaceFromString(options?.text),
                          __html: options?.text,
                        }} ></li>
                      )
                    })}  
                  </ul>
                    {(printWithAnswer || viewAnswer) && <div className="solutionSection MCQSolutionSect">
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
                                      {/* <th className={`matchFolText m-0 ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)} renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label}`} dangerouslySetInnerHTML={{ __html:removeSpaceFromString(column.columnLabel)}}></th> */}
                                      <th className={`matchFolText m-0 ${fontFamilyCheck(masterDropdown?.subQuestionFontStyle?.options[parseInt(questionPaperFilter?.subQuestionFontStyle)]?.label)} renderFontSize${masterDropdown?.subQuestionFontSize?.options[parseInt(questionPaperFilter?.subQuestionFontSize)]?.label}`} dangerouslySetInnerHTML={{ __html:column.columnLabel}}></th>
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
                    {(printWithAnswer || viewAnswer) && <div className="solutionSection MTFSolutionSect">
                      <div className="solutionSectionBlk">
                        <p className="Title">Solution:</p>
                          {QuestionTypeActaualAnswerRender(metaInfo?.questionMTFOptions, "MTF")}
                      </div>
                    </div>}
                    </>
                    }
                  {(workbookStyle) && templatePrintEdit && !printWithAnswer && !viewAnswer && workBookStructure(question, "Select Type", metaInfo)}
                  {
                    workbookStyle && availableModules.includes(20) && metaInfo.typeOfLines && !printWithAnswer && !viewAnswer &&
                    (
                      linesToRender(metaInfo)
                    )
                  }
                </>
              );
            })}
          {((printWithAnswer || viewAnswer) && question?.questionInfo?.solution && question?.questionInfo?.questionTypeName == "Subjective") && <div className="solutionSection">
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
          <div className="mifMainQuestionBlk">
            <div className="subQuestionListSect" style={{alignItems:"center"}}>
              {!templatePrintEdit
                // ? <p className={`m-0 renderFontSize${masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label}`} dangerouslySetInnerHTML={{__html: removeSpaceFromString(question?.sequenceText) }} />
                ? <p className={`m-0 renderFontSize${masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label}`} dangerouslySetInnerHTML={{__html: question?.sequenceText }} />
                : <p onClick={(event) => { setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({ currentQuestion: question, key: 'sequenceText', value: question?.sequenceText }) }} className="sequenceTextEdit">
                  <span>{`MQs)`}</span>
                  {/* <p className="pTagDangerous" dangerouslySetInnerHTML={{__html: removeSpaceFromString(question?.sequenceText)}}/> */}
                  <p className="pTagDangerous" dangerouslySetInnerHTML={{__html: question?.sequenceText}}/>
                </p>
              }
              {!templatePrintEdit
                //  ? <p className={`m-0 pTagDangerous ${fontFamilyCheck(masterDropdown?.mainQuestionFontStyle?.options[parseInt(questionPaperFilter?.mainQuestionFontStyle)]?.label)} renderFontSize${masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label}`} dangerouslySetInnerHTML={{__html: removeSpaceFromString(question?.elementTitle)}} />
                 ? <p className={`m-0 pTagDangerous ${fontFamilyCheck(masterDropdown?.mainQuestionFontStyle?.options[parseInt(questionPaperFilter?.mainQuestionFontStyle)]?.label)} renderFontSize${masterDropdown?.questionFontSize?.options[parseInt(questionPaperFilter?.questionFontSize)]?.label}`} dangerouslySetInnerHTML={{__html: question?.elementTitle}} />
                 : <p onClick={(event) => { setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({ currentQuestion: question, key: 'elementTitle', value: question?.elementTitle }) }} className="mifMainQuestionTextEdit">
                  <div>{`Main Question Heading`}</div>
                  {<p className="pTagDangerous" dangerouslySetInnerHTML={{__html: question.elementTitle?.trim() }}/> ||
                    <div style={{opacity: 0.5}}>Main Question</div>}
                </p>
              }
              {/* {templatePrintEdit && availableModules.includes(20) && <span className="workBook-btn-auto" style={{margin:'-1px -39px 6px 1px'}}><DropDownButtonComponent buttonName={''} minWidth="50" buttonOptions={[0,1,2,3,4,5,6,7,8,9,10]}  onChangeHandler={(e)=>{ console.log(e); handleLines(question,e,true)}} /> </span> } */}
              {question?.instruction && <p className={`partTitle m-0 ${
              question?.partAlignment == "0"
                ? "text-start"
                : question?.partAlignment == "1"
                ? "text-center"
                : "text-end"
            // } renderFontSize${(parseInt(masterDropdown?.mainQuestionFontSize.options[parseInt(questionPaperFilter?.mainQuestionFontSize)]?.label) - 3)}`}>({removeSpaceFromString(question?.instruction)})</p>}
            } renderFontSize${(parseInt(masterDropdown?.mainQuestionFontSize.options[parseInt(questionPaperFilter?.mainQuestionFontSize)]?.label) - 3)}`}>({question?.instruction})</p>}
              {/* <InputFieldComponentForForm registerName={'mainQuestionHeading'} inputType={"text"}
                label={"Main Question Heading"} required={true}
                onChange={(e: any) => { }}
                className={"mainQuestionHeading"}
                // onChange={(e: any) =>{ changeHandler(e.target.value, 'examName')}} 
                inputSize={"largeSize"} variant={""} maxLength={50} /> */}
            </div>
            <div className="MIFSubQuestionListMarkSect">
              {/* {question?.marks
                ? (!templatePrintEdit
                  ? <span style={{ fontSize: masterDropdown?.marksFontSize?.options[parseInt(questionPaperFilter?.marksFontSize)]?.label + "px" }}>
                    {masterDropdown
                      ? masterDropdown?.marksFormat?.options[parseInt(questionPaperFilter?.marksFormat)]?.label?.replace("1", question?.marks)
                      : question?.marks}
                  </span>
                  : <p className="sequenceTextEdit"
                    onClick={(event) => { setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({ currentQuestion: question, key: 'marks', value: question?.marks }) }}>
                    {question?.marks}
                    <span>Marks</span>
                  </p>
                )
                : <p>Heelo</p>} */}
                {templatePrintEdit ? <Tooltip arrow placement="top" title={question.error && question.errorMessage}>
                <TextField
                  value={question?.marks || ""}
                  placeholder=""
                  onChange={(e:React.ChangeEvent<HTMLInputElement>)=>changeMarks(e,question, "Main Question")}
                  style={{pointerEvents:'none'}}
                  label="Marks"
                  variant="outlined"  
                  autoComplete="off"
                  sx={question.error ? {border: '1px solid red',borderRadius:'9px'} : {}}

                />
                </Tooltip> : <span className={`${fontFamilyCheck(masterDropdown?.mainQuestionFontStyle?.options[parseInt(questionPaperFilter?.mainQuestionFontStyle)]?.label)} renderFontSize${masterDropdown?.marksFontSize?.options[parseInt(questionPaperFilter?.marksFontSize)]?.label}`}>
                {masterDropdown
                  ? masterDropdown?.marksFormat?.options[parseInt(questionPaperFilter?.marksFormat)]?.label?.replace("1", question?.marks)
                  : question?.marks}
              </span>}
              {templatePrintEdit ? <button> Main Question
                    <div >
                      <IconButton
                        disableRipple
                        sx={{ p: "5px" }}
                        aria-label="more"
                        aria-haspopup="true"
                        onClick={(e) => {
                          setSelectedQuestinoId(question.id)
                          handleQuestionAction(e)
                        }}
                      >
                        <MoreVertIcon sx={{ marginTop: "-17px", cursor: "pointer" }} />
                      </IconButton>
                    </div>
                  </button> : ""}
            </div>
            <Menu
              id={`inner-popover-collection`}
              anchorEl={queActionAnchorEl}
              anchorOrigin={{
                horizontal: "left",
                vertical: "bottom",
              }}
              className="questionActionMenu"
              open={queActionMenuShow && selectedQuestionId === question.id}
              onClose={handleActionMenuClose}
              PaperProps={{}}
            >
              <MenuItem value="delete" className="questionActionMenuBtn" disabled={disableFirstMainQuestionDelete(question)} onClick={() => handleMainQuestionActions(QuestionActions.DELETE, question)}><img src={DeleteIcon}/><span>Delete</span></MenuItem>
              <div className="hr" tabIndex={-1}></div>
              <MenuItem value="moveUp" className="questionActionMenuBtn" onClick={() => handleMainQuestionActions(QuestionActions.MOVE_UP, question)} disabled={disableMainQuestionUp()}><img src={MoveUpIcon} /><span>Move Up</span></MenuItem>
              <div className="hr" tabIndex={-1}></div>
              <MenuItem value="moveDown" className="questionActionMenuBtn" onClick={() => handleMainQuestionActions(QuestionActions.MOVE_DOWN, question)} disabled={disableMainQuestionDown()}><img src={MoveDownIcon} /><span>Move Down</span></MenuItem>
            </Menu>
          </div>
          {/* {question?.orOptionConfig?.show && (
            <div className={`previewTemplateOrCase ${question?.orAlignment == "0" ? "text-start" : question?.orAlignment == "1" ? "text-center" : question?.orAlignment == "2" ? "text-end" : "text-left"}`}>{question?.orOptionConfig?.text}</div>
          )}
          {question?.elementTitle && (
            <div className="mainQuestionBlk">
            <div className="mainQuestionListSect">
            {!templatePrintEdit ? <p className="swquence m-0" style={{fontSize: masterDropdown?.mainQuestionFontSize?.options[parseInt(questionPaperFilter?.mainQuestionFontSize)]?.label+"px"}}>{question?.sequenceText}</p> : <p onClick={(event) => {setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({currentQuestion: question, key:'sequenceText', value: question?.sequenceText })}} className="sequenceTextEdit mqText"><span>{`MQ)`}</span>{question?.sequenceText}</p>}              
              <p
                className="questionSect m-0"
                style={{fontSize: masterDropdown?.mainQuestionFontSize?.options[parseInt(questionPaperFilter?.mainQuestionFontSize)]?.label+"px"}}
                dangerouslySetInnerHTML={{ __html: question?.elementTitle || "" }}
              />
              </div>
              <div className="MIFMainQuestionListMarkSect">
                {question?.marks ? (!templatePrintEdit ? <span style={{fontSize: masterDropdown?.marksFontSize?.options[parseInt(questionPaperFilter?.marksFontSize)]?.label+"px"}}>{masterDropdown?.marksFormat?.options[parseInt(questionPaperFilter?.marksFormat)]?.label?.replace("1", question?.marks)}</span>: <p className="sequenceTextEdit" onClick={(event) => {setAnchorEl(event.currentTarget); setChangedPopoverValue && setChangedPopoverValue({currentQuestion: question, key:'marks', value: question?.marks})}}>{question?.marks}<span>Marks</span></p>):""}
                {templatePrintEdit ? <button>Main Question</button> : "" }
              </div>
            </div>
          )} */}
          {(workbookStyle) && templatePrintEdit && workBookStructure(question,"Apply Type for Questions")}    
          {renderQuestions(question?.children || [])}
        </>
      );
    } else {
      return null;
    }
  };  
const handleDeletePopUpModal=(status: boolean)=>{
  if(status){
    if (questionType=="question") {
      deleteQuestion(tempQuestion as Question)
      setSnackBarText("Question Deleted Successfully")
    } else if (questionType=="mainQuestion"){
      deleteMainQuestion(tempQuestion as Question)
      setSnackBarText("Main Question Deleted Successfully")
    }
    setDeleteQuestionModal(false)
    setSnackBar(true)
    setSnackBarSeverity('success')
    return
  }
  setDeleteQuestionModal(false)
}

  const getDetails = (question: Question) => {
    // This function is utility/common function to get some details
    // Use this function only if at least one main question is available
    const templateBuilderInfo = {...ReqBody.bodyTemplate.templateBuilderInfo}
    const templateParts = templateBuilderInfo.templateParts
    const mainQuestion = templateParts.find((el:any) => el.id === question.parentID)
    const childQuestions = mainQuestion.children 
    const queIndex = childQuestions.findIndex(((el: any) => el.id === question.id))
    const mainQueIndex = templateParts.findIndex(((el: any) => el?.id === mainQuestion?.id))
    return { templateBuilderInfo, templateParts, queIndex, mainQueIndex, mainQuestion, childQuestions }
  }

  const addMainQuestion = (question: Question) => {
    const templateBuilderInfo = {...ReqBody.bodyTemplate.templateBuilderInfo}
    if (templateBuilderInfo.rootType === "Main Question") {
      const { templateParts, queIndex, mainQueIndex, mainQuestion, childQuestions } = getDetails(question)
      
      // Restrict user to add main question for first question
      if (queIndex === 0) {
        setSnackBar(true);
        setSnackBarSeverity('error');
        setSnackBarText(`Cannot add main question for this question`);
        return
      }

      // Select all the questions from mainQuestion which are after selected question's index and move those to new main question children list
      const questionsToMove = childQuestions.slice(queIndex, childQuestions.length)
      const questionsToPersist = childQuestions.slice(0,queIndex)
      const newId = Date.now()

      // Assign parentID, calculate marks for main question, update id and sequence
      let mainQuestionMarks = 0
      const newChildren = questionsToMove.map((el:any) => {
        mainQuestionMarks += +el.marks
        return {...el, parentID: newId }
      })

      // Insert new main question
      const newMainQuestion = {...mainQuestionBody, children: newChildren, id: newId, marks: mainQuestionMarks, sequenceNo: mainQueIndex + 2, sequenceText: `${mainQueIndex + 2})` }
      templateParts.splice(mainQueIndex + 1, 0, newMainQuestion)
      const newTemplateParts = templateParts.map((el: any) => el.id === mainQuestion.id ? ({...el, marks: questionsToPersist.reduce((acc: any, cur: any) => acc + +cur.marks, 0), children: questionsToPersist }) : el)
      const newJson = {...ReqBody, bodyTemplate:{ templateBuilderInfo: {...templateBuilderInfo, templateParts: newTemplateParts } }}
      replaceQp(newJson)
    } else {
      // Restrict user to add main question for any question other then first question for first time adding main question in question paper
      if (questionIndex !== 0) {
        setSnackBar(true);
        setSnackBarSeverity('error');
        setSnackBarText(`Cannot add main question after question`);
        return
      }

      // Create new main question and move all the questions under that with updated parentID
      const id =  Date.now()
      let marksForMainQuestion = 0 

      // Assign parentID and calculate marks for main question
      const questions = templateBuilderInfo.templateParts.map((que: any) => {
        marksForMainQuestion += +que.marks
        return {...que, parentID: id }
      })
      const newJson = {...ReqBody, bodyTemplate:{templateBuilderInfo: {...templateBuilderInfo, rootType: "Main Question", templateParts: [{...mainQuestionBody, id, elementTitle: "", sequenceNo: "1", sequenceText: "1)", marks: marksForMainQuestion, children: questions }]}}}
      replaceQp(newJson)
    }
  }

  const moveQuestionUp = (question: Question) => {
    const templateBuilderInfo = {...ReqBody.bodyTemplate.templateBuilderInfo}

    // Swap the index of questions if there isn't any main question
    if (templateBuilderInfo.rootType === "Question") {
      const newTemplateParts = [...templateBuilderInfo.templateParts]
      newTemplateParts[questionIndex] = templateBuilderInfo.templateParts[questionIndex - 1]
      newTemplateParts[questionIndex - 1] = templateBuilderInfo.templateParts[questionIndex]
      const newJson = {...ReqBody, bodyTemplate:{templateBuilderInfo: {...templateBuilderInfo, templateParts: newTemplateParts}}}
      replaceQp(newJson)
      return
    }

    const {templateParts, queIndex, mainQueIndex, mainQuestion, childQuestions} = getDetails(question)

    // If user is doing any change within the same main question then question should swap, below 2 conditions will handle that scenario
    
    // Restrict user to move question up if it is first question inside first main question
    if (queIndex === 0 && mainQueIndex === 0) {
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(`Cannot move this question up`);
      return
    }

    // Swap index of questions if user is moving question up within the same main question
    if(queIndex !== 0){
      const newChildQues = [...childQuestions]
      newChildQues[queIndex] = childQuestions[queIndex - 1]
      newChildQues[queIndex - 1] = childQuestions[queIndex]
      const newTemplateParts = templateParts.map((el: any) => el.id === mainQuestion.id ? ({...el, children: newChildQues}) : el)
      const newJson = {...ReqBody, bodyTemplate:{ templateBuilderInfo: {...templateBuilderInfo, templateParts:newTemplateParts } }}
      replaceQp(newJson)
      return
    }

    // If user is trying move question up which is first inside main question then move that question to above main question (As per business requirement just move one question up, don't swap)
    const newQuestionsForCurrentMQ = childQuestions.filter((_: any, index: number) => index !== queIndex)

    // Check if there is at least one question under main question after moving up, if not so then remove the main question
    const prevMainQuestion = templateParts[mainQueIndex - 1]
    const newQuestionsForPrevMQ = [...prevMainQuestion.children, {...childQuestions[queIndex], parentID: prevMainQuestion.id }]
    const newTemplateParts = templateParts.map((el: any) => el.id === mainQuestion.id ? ({... el, children: newQuestionsForCurrentMQ, marks: newQuestionsForCurrentMQ.reduce((acc: any, cur: any) => acc + +cur.marks, 0)}) : el.id ===  prevMainQuestion.id ? ({ ...el, marks: newQuestionsForPrevMQ.reduce((acc: any, cur: any) => acc + +cur.marks, 0), children: newQuestionsForPrevMQ}) : el)
    const newJson = {...ReqBody, bodyTemplate:{ templateBuilderInfo: {...templateBuilderInfo, templateParts: newQuestionsForCurrentMQ.length ? newTemplateParts: newTemplateParts.filter((el: any) => el.id !== mainQuestion.id) } }}
    replaceQp(newJson)
  }

  const moveQuestionDown = (question: Question) => {
    const templateBuilderInfo = {...ReqBody.bodyTemplate.templateBuilderInfo}

    // Swap the index of questions if there isn't any main question
    if (templateBuilderInfo.rootType === "Question") {
      const newTemplateParts = [...templateBuilderInfo.templateParts]
      newTemplateParts[questionIndex] = templateBuilderInfo.templateParts[questionIndex + 1]
      newTemplateParts[questionIndex + 1] = templateBuilderInfo.templateParts[questionIndex]
      const newJson = {...ReqBody, bodyTemplate:{templateBuilderInfo: {...templateBuilderInfo, templateParts: newTemplateParts}}}
      replaceQp(newJson)
      return
    }

    const {templateParts, queIndex, mainQueIndex, mainQuestion, childQuestions} = getDetails(question)

    // If user is doing any change within the same main question then question should swap, below 2 conditions will handle that scenario

    // Restrict user to move question down if it is last question inside last main question
    if (queIndex === childQuestions.length - 1 && mainQueIndex === templateParts.length - 1) {
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(`Cannot move this question down`);
      return
    }
    
    // Swap index of questions if user is moving question down within the same main question
    if(queIndex !== childQuestions.length - 1){
      const newChildQues = [...childQuestions]
      newChildQues[queIndex] = childQuestions[queIndex + 1]
      newChildQues[queIndex + 1] = childQuestions[queIndex]
      const newTemplateParts = templateParts.map((el: any) => el.id === mainQuestion.id ? ({...el, children: newChildQues}) : el)
      const newJson = {...ReqBody, bodyTemplate:{ templateBuilderInfo: {...templateBuilderInfo, templateParts:newTemplateParts } }}
      replaceQp(newJson)
      return
    }

    // If user is trying move question down which is last inside main question then move that question to below main question (As per business requirement just move one question down, don't swap)
    const newQuestionsForCurrentMQ = childQuestions.filter((_: any, index: number) => index !== queIndex)
  
    // Check if there is at least one question under main question after moving down, if not so then remove the main question
    const prevMainQuestion = templateParts[mainQueIndex + 1]
    const newQuestionsForPrevMQ = [{...childQuestions[queIndex], parentID: prevMainQuestion.id }, ...prevMainQuestion.children]
    const newTemplateParts = templateParts.map((el: any) => el.id === mainQuestion.id ? ({... el, children: newQuestionsForCurrentMQ, marks: newQuestionsForCurrentMQ.reduce((acc: any, cur: any) => acc + +cur.marks, 0)}) : el.id ===  prevMainQuestion.id ? ({... el, marks: newQuestionsForPrevMQ.reduce((acc: any, cur: any) => acc + +cur.marks, 0), children:newQuestionsForPrevMQ }) : el)
    const newJson = {...ReqBody, bodyTemplate:{ templateBuilderInfo: {...templateBuilderInfo, templateParts:newQuestionsForCurrentMQ.length ? newTemplateParts : newTemplateParts.filter((el: any) => el.id !== mainQuestion.id) } }}
    replaceQp(newJson)
  }

  const deleteQuestion = (question: Question) => {
    const templateBuilderInfo = {...ReqBody.bodyTemplate.templateBuilderInfo}
    if (templateBuilderInfo.rootType === "Main Question") {
      const {templateParts, mainQuestion, childQuestions} = getDetails(question)

      // If user is trying to delete main question which is having only one question then delete the main question as well
      if(childQuestions?.length === 1){
        const newRootType = templateParts.length === 1 ? "Question" : "Main Question"
        const newTemplateParts = ReqBody.bodyTemplate.templateBuilderInfo.templateParts.filter((el: any) => el.id !== mainQuestion.id )
        const newJson = {...ReqBody, bodyTemplate:{templateBuilderInfo: {...ReqBody.bodyTemplate.templateBuilderInfo, rootType: newRootType, paperLevelIndexSequence: {...templateBuilderInfo.paperLevelIndexSequence, question: newTemplateParts.reduce((acc: number, cur: any) => acc + cur.children.length, 0)}, templateParts: newTemplateParts }}}
        replaceQp(newJson)
        return
      }

      // Delete the question from inside the main question and update the marks of main question
      const newQuestions = mainQuestion.children.filter((el: any) => el.id != question.id)
      mainQuestion.children = newQuestions
      mainQuestion.marks = newQuestions.reduce((acc: any, cur: any) => acc + +cur.marks, 0)
      const newTemplateParts = templateParts.map((el: any) => el.id === mainQuestion.id ? mainQuestion : el)
      const newJson = {...ReqBody, bodyTemplate:{templateBuilderInfo: {...templateBuilderInfo, paperLevelIndexSequence: {...templateBuilderInfo.paperLevelIndexSequence, question: newTemplateParts.reduce((acc: number, cur: any) => acc + cur.children.length, 0)}, templateParts: newTemplateParts }}}
      replaceQp(newJson)
      return
    } 

    // Delete the question from questions list of there isn't any main question
    const newTemplateParts = templateBuilderInfo.templateParts.filter((que: any) => que.id != question.id)
    const newJson = {...ReqBody, bodyTemplate:{templateBuilderInfo: {...templateBuilderInfo, rootType: "Question", paperLevelIndexSequence: {...templateBuilderInfo.paperLevelIndexSequence, question: newTemplateParts.length }, templateParts: newTemplateParts }}}
    replaceQp(newJson)
  }

  const deleteMainQuestion = (mainQuestion: Question) => {
    const templateBuilderInfo = {...ReqBody.bodyTemplate.templateBuilderInfo}
    if (templateBuilderInfo.rootType === "Main Question") { 

      // Restrict user to delete first main question if there are more than one main question
      if (questionIndex === 0 && templateBuilderInfo.templateParts.length > 1) {
        setSnackBar(true);
        setSnackBarSeverity('error');
        setSnackBarText(`Cannot delete first main question`);
        return
      }

      // If there is only one main question then remove main question structure
      if (templateBuilderInfo.templateParts.length === 1) {
        const newJson = {...ReqBody, bodyTemplate:{ templateBuilderInfo: {...templateBuilderInfo, rootType: "Question", templateParts: (mainQuestion.children as Question[]).map((el: any) => ({...el, parentID: null})) } }}
        replaceQp(newJson)
        return
      }

      // If there are more than one main questions then remove current main questions and move all the questions of current main question to previous main question 
      const prevMainQuestion = templateBuilderInfo.templateParts[questionIndex - 1]
      const child = (mainQuestion.children as Question[]).map((el: any) => ({...el, parentID: prevMainQuestion.id}))
      prevMainQuestion.children = [...prevMainQuestion.children, ...child]
      prevMainQuestion.marks = prevMainQuestion.children.reduce((acc: any, cur: any) => acc + +cur.marks, 0)
      const newTemplateParts = templateBuilderInfo.templateParts.filter((el: any) => el.id !== mainQuestion.id)
      const newJson = {...ReqBody, bodyTemplate:{ templateBuilderInfo: {...templateBuilderInfo, templateParts: newTemplateParts } }}
      replaceQp(newJson)
    }
  }

  const moveMainQuestionUp = () => {
    const templateBuilderInfo = {...ReqBody.bodyTemplate.templateBuilderInfo}
    if (templateBuilderInfo.rootType === "Main Question") { 

      // Restricting user to move last main question down and move first main question down is handled by html only
      
      // Move main question with all children question down
      const newTemplateParts = [...templateBuilderInfo.templateParts]
      newTemplateParts[questionIndex] = templateBuilderInfo.templateParts[questionIndex - 1]
      newTemplateParts[questionIndex - 1] = templateBuilderInfo.templateParts[questionIndex]
      const newJson = {...ReqBody, bodyTemplate:{ templateBuilderInfo: {...templateBuilderInfo, templateParts: newTemplateParts } }}
      replaceQp(newJson)
    }
  }

  const moveMainQuestionDown = () => {
    const templateBuilderInfo = {...ReqBody.bodyTemplate.templateBuilderInfo}
    if (templateBuilderInfo.rootType === "Main Question") { 

      // Restricting user to move last main question down and move first main question down is handled by html only
      
      // Move main question with all children question down
      const newTemplateParts = [...templateBuilderInfo.templateParts]
      newTemplateParts[questionIndex] = templateBuilderInfo.templateParts[questionIndex + 1]
      newTemplateParts[questionIndex + 1] = templateBuilderInfo.templateParts[questionIndex]
      const newJson = {...ReqBody, bodyTemplate:{ templateBuilderInfo: {...templateBuilderInfo, templateParts: newTemplateParts } }}
      replaceQp(newJson)
    }
  }

  const disableQuestionMoveUp = (question: Question): boolean => {
    const templateBuilderInfo = ReqBody.bodyTemplate.templateBuilderInfo

    // Check if it's first question and there is no main question
    if (templateBuilderInfo.rootType === "Question" && questionIndex === 0) {
      return true
    }

    // If main question is present check if it's first main question and also first question inside that main question  
    if(templateBuilderInfo.rootType === "Main Question"){
      const mainQuestion = templateBuilderInfo.templateParts.find((el: any) => el.id === question.parentID)
      const mainQuestionIndex = templateBuilderInfo.templateParts.findIndex((el: any) => el.id === question.parentID)
      if (mainQuestionIndex === 0) {
        const queInd = mainQuestion.children.findIndex((el: any) => el.id === question.id)
        if (queInd === 0) {
          return true
        }
      }
    }

    return false
  }
// check if it only one main question then disable delete button
  const disableFirstMainQuestionDelete=(question:Question)=>{
    const templateBuilderInfo = ReqBody.bodyTemplate.templateBuilderInfo    
    if (templateBuilderInfo?.rootType === "Main Question"&& ReqBody?.bodyTemplate?.templateBuilderInfo?.templateParts?.length  > 1 && questionIndex === 0) {
      return true
    }
    else{
      return false
    }
  }

  const disableQuestionMoveDown = (question: Question): boolean => {
    const templateBuilderInfo = ReqBody.bodyTemplate.templateBuilderInfo

    // Check if it's last question and there is no main question
    if (ReqBody.bodyTemplate.templateBuilderInfo.rootType === "Question" && questionIndex === ReqBody.bodyTemplate.templateBuilderInfo.templateParts.length - 1) {
      return true
    }

    // If main question is present check if it's last main question and also last question inside that main question  
    if(templateBuilderInfo.rootType === "Main Question"){
      const mainQuestion = templateBuilderInfo.templateParts.find((el: any) => el.id === question.parentID)
      const mainQuestionIndex = templateBuilderInfo.templateParts.findIndex((el: any) => el.id === question.parentID)
      if (mainQuestionIndex === templateBuilderInfo.templateParts.length - 1) {
        const queInd = mainQuestion.children.findIndex((el: any) => el.id === question.id)
        if (queInd === mainQuestion.children.length - 1) {
          return true
        }
      }
    }

    return false
  }

  const disableMainQuestionUp = () : boolean => {
    if (ReqBody.bodyTemplate.templateBuilderInfo.rootType === "Main Question" && questionIndex === 0) {
      return true
    }
    return false
  }

  const disableMainQuestionDown = () : boolean => {
    // Disable move down for first main question also
    if (ReqBody.bodyTemplate.templateBuilderInfo.rootType === "Main Question" && questionIndex === ReqBody.bodyTemplate.templateBuilderInfo.templateParts.length - 1 || ReqBody.bodyTemplate.templateBuilderInfo.templateParts.length === 1) {
      return true
    }
    return false
  }

  const handleQuestionActions = (actionType: QuestionActions, question: Question) => {
    handleActionMenuClose()
    switch (actionType) {
      case QuestionActions.MOVE_UP:
          moveQuestionUp(question)
        break;
        case QuestionActions.MOVE_DOWN:
          moveQuestionDown(question)
        break;
        case QuestionActions.REPLACE:
          setReplaceFilterObj(question??null)
          setReplaceModal(true)
        break;
        case QuestionActions.DELETE:
          setQuestionType("question")
          setDeleteQuestionModal(true)
          setTempQuestion(question)
        break;
        case QuestionActions.ADD_MAIN_QUESTION:
          addMainQuestion(question)
        break;
      default:
        break;
    }
  }  
  
  const handleMainQuestionActions = (actionType: QuestionActions, question: Question) => {
    handleActionMenuClose()
    switch (actionType) {
      case QuestionActions.MOVE_UP:
        moveMainQuestionUp()
        break;
        case QuestionActions.MOVE_DOWN:
          moveMainQuestionDown()
        break;
        case QuestionActions.DELETE:
          setQuestionType("mainQuestion")
          setDeleteQuestionModal(true)
          setTempQuestion(question)
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div>{renderQuestions(questionData)}</div>
      <Toaster onClose={() => { setSnackBar(false) }} severity={SnackBarSeverity} text={snackBarText} snakeBar={snackBar} />
      {replaceModal && <MIFReplaceQuestionModal ReqBody={ReqBody} open={replaceModal} handleClose={() => {setReplaceModal(false)}} replaceFilterObj={replaceFilterObj} replace={replace} replaceQp={replaceQp} modalType="REPLACE_QUESTION"/>}
      <ChangeFieldModalPopup header={"Are you sure you want to delete?"} open={deleteQuestionModal} clickHandler={handleDeletePopUpModal} label1={"Delete"} label2={"Cancel"} onClose={()=>setDeleteQuestionModal(false)}
       subHeader1={""} subHeader2={""}/>
    </>
  )

};

export default MIFRecussivePaperGenerator;
