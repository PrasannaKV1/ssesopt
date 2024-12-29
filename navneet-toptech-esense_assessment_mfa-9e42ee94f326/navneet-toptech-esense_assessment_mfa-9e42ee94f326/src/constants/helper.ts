import axios from "axios";
import fileDownload from "js-file-download";
import { State } from '../types/assessment';

export const routeList = {
    dashboard: 1,
    calendar: 2,
    curriculum: 3,
    school: 4,
    contentLibrary: 5,
    reports: 6,
    users: 7,
    myClasses: 8,
    notification: 9,
    noticeBoard: 10,
    whiteBoard: 11,
    myProfile: 12,
    supportTickets: 13,
    offlineSetup: 14,
    admissionManagement: 15,
    feeManagement: 16,
    templateManagement: 17,
    advanceFeeManagement: 27,
    online:29,
  offline: 30,
  chapterChallenge: 32,
  };
  
export const getLocalStorageDataBasedOnKey = (key: string) => {
    return localStorage.getItem(key);
  };

  export const accessRights = () => {
    const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;
    const authToken = localStorage.getItem('auth_token');
    const availableModules = parseJwt(authToken!)?.data?.availableModules ?? [];
  
    if (stateDetails.login.userData.UserRoleID === 1 && !availableModules.includes(routeList.feeManagement)) {
      // eslint-disable-next-line no-restricted-globals
      location.href = '/noaccess';
    }
  };

  export const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      );
  
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };
  export const examTableCount = 8;
  export const htmlTagRegex = /<\/?[^>]+(>|$)/g;
  export const removeNbpsRegex = /\&nbsp;/g;

  export const noUploadsRegisterNames = [
    "data.0.0.text",
    "data.0.1.text",
    "data.0.2.text",
    "data.1.0.text",
    "data.1.1.text",
    "data.1.2.text",
    "data.2.0.text",
    "data.2.1.text",
    "data.2.2.text",
    "data.3.0.text",
    "data.3.1.text",
    "data.3.2.text",
    "data.4.0.text",
    "data.4.1.text",
    "data.4.2.text",
    "data.5.0.text",
    "data.5.1.text",
    "data.5.2.text",
    "data.6.0.text",
    "data.6.1.text",
    "data.6.2.text",
    "data.7.0.text",
    "data.7.1.text",
    "data.7.2.text",
    "data.8.0.text",
    "data.8.1.text",
    "data.8.2.text",
    "data.9.0.text",
    "data.9.1.text",
    "data.9.2.text",
    "questionOptions[0].text",
    "questionOptions[1].text",
    "questionOptions[2].text",
    "questionOptions[3].text",
    "questionOptions[4].text",
    "questionOptions[5].text",
    "blankMetaInfo.1.text",
    "blankMetaInfo.2.text",
    "blankMetaInfo.3.text",
  ];
  
  export const numericRegex = /^[0-9]{1,3}$/
  export const alphanumericSplRegex = /^[\w\s\-\&\(\)\:\,\.]{1,50}$/
  export const alphanumericNameRegex = /^[a-zA-Z0-9-_&():,.%@ ]{0,50}$/;
export const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

  export const compareArrays = (a:any, b:any) => {
    if (a.length !== b.length) return false
    else {
      // Comparing each element of your array
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false
        }
      }
      return true
    }
  }
  export const removeHtmlTag = /<(.|\n)*?>/g;

  export const handleFileDownload = (url: string, filename: string) => {
    axios.get(url, {
      responseType: 'blob',
    })
    .then((res:any) => {
      fileDownload(res.data, filename)
    })
  }

  export const MODULE_ID = 17;

// export const removeSpaceFromString = (characters: string) => {
//   return characters?.replace(/<br\s*\/?>/gi, "");
// }  

export const  updateArrayObj = (arrayA:any, arrayB:any, keyToUpdate:string) => {
  if(arrayA?.length > 0){
    return arrayA?.map((itemA:any) => {
      const itemB = arrayB?.find((item:any) => item.sectionTypeKey === itemA.sectionTypeKey);
      if (itemB) {
        return {
          ...itemA,
          sectionDetails: {
            ...itemA.sectionDetails,
            sectionFields: itemA.sectionDetails.sectionFields.map((fieldA:any, index:number) => {
              const fieldB = itemB.sectionDetails.sectionFields[index];
              if (fieldB) {
                return {
                  ...fieldA,
                  [keyToUpdate]: fieldB[keyToUpdate]
                };
              }
              return fieldA;
            })
          }
        };
      }
      return itemA;
    });
  }else{
    return arrayB
  }
}

export const retainDataHandler=(options:any,selectionKey:string,localstorageKey:string,storageName:string,title?:string)=>{
  let outputArray:any =[];
const storedData = localStorage.getItem(storageName);
if (storedData) {
  const dataObj = JSON.parse(storedData);
  if (dataObj.hasOwnProperty(localstorageKey)) {
   const individualData=dataObj[localstorageKey];
   if(typeof(individualData) === 'string'){
     outputArray =individualData.split(',').filter((element:any) => element.trim() !== '').map((ele:any) => Number(ele));
   }else if (typeof(individualData) === 'object'){
    outputArray=individualData
   }
   if(outputArray.length >0){
    if(localstorageKey !== "questionTypeId"){
      return options?.filter((x:any)=>outputArray.includes(x?.[selectionKey]))?.map((x:any) => x?.[selectionKey])
    }else if(localstorageKey === "questionTypeId" && typeof(individualData)!== 'string'){
       return options?.filter((x:any)=>outputArray.includes(x?.[selectionKey]))
    }else if(localstorageKey === "questionTypeId" && !title){
      let position:any= [];
      outputArray?.forEach((ele:any) => {
        const index = options?.findIndex((item:any) => item?.[selectionKey] === ele);
        if (index !== -1) {
          position.push(index);
        }
      });
      return position??[]
    }
   }else{
    return []
   }
  }
}}

// Function to compare year, month, and day
export const areDatesEqual = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const areDateGreater = (date1: Date, date2: Date): boolean => {
  const isGreater =
    date1.getFullYear() > date2.getFullYear() ||
    (date1.getFullYear() === date2.getFullYear() && date1.getMonth() > date2.getMonth()) ||
    (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() > date2.getDate());
  return isGreater;
}

export const resetLocalStorage=(list:any[],storageName:string,data?:any)=>{
  const storedData = localStorage.getItem(storageName);
  if (storedData) {
  const dataObj = JSON.parse(storedData);
  if(list.length>0){
    list.map((ele:any)=>{
      if (dataObj.hasOwnProperty(ele)) {
        if(ele === "pgNo"){
          dataObj[ele] = 1;
        }else if (ele === "isPublic"){
          dataObj[ele] = data||"false"
        }else if(ele === "questionTypeId"){
          dataObj[ele] =  "0"
        }else{
          dataObj[ele] = "";
        }
      }
    })
    localStorage.setItem(storageName, JSON.stringify(dataObj));
  }
}
}

export const transformGradeToClass = (grade: string, rollNo?: string, setName?: string): string => {
  const gradeMatch = grade?.match(/Grade (\d+) - ([A-Z])/);
  if (grade) {
    let result = `${grade}  | Roll No. ${rollNo}`;
    if (setName) {
      const setNameMatch = setName.match(/\(Set (\d+)\)/);
      if (setNameMatch) {
        const setNumber = setNameMatch[1];
        result += ` | Set : ${setNumber}`;
      }
    }
    return result;
  }
  return grade;
};

export const pageSize = 500

export const studentTooltip = {
  answeredCorrectly: "AnsweredCorrectly",
  answeredWrong: "AnsweredWrong",
  skipped: "SkippedBy",
  attempted: "Attempted",
  option: "option",
}
export const addNumberOfLinesToQuestions = (template: any, numberOfLines: any, type: any, questionInfo?: any, metaInfo?: any) => {
  if (template?.templateBuilderInfo && template?.templateBuilderInfo?.templateParts) {
    const parts = template.templateBuilderInfo.templateParts;    
    const updatePart = findPartByTypeAndId(parts, questionInfo.type, questionInfo.id, metaInfo);
    if (updatePart) {
      updateNumberOfLines([updatePart], numberOfLines, type, questionInfo, metaInfo);
      const parentPartId = metaInfo ? questionInfo.id : updatePart.id;
      setParentNumberOfLinesToNull(parts, parentPartId, parts, metaInfo);
    }
  }
};

const setParentNumberOfLinesToNull = (parts: any, targetId: any, template:any, metaInfo?:any) => {
  for (let i = 0; i < parts?.length; i++) {
    if (metaInfo && parts[i].questionInfo?.metaInfo) {
      parts[i].typeOfLines = null;        
    }
    if (parts[i]?.children) {
      const childIndex = parts[i].children.findIndex((child: any) => child.id === targetId);
      if (childIndex !== -1) {
        parts[i].typeOfLines = null;
        setParentNumberOfLinesToNull(template, parts[i]?.id,template);
      }       
      setParentNumberOfLinesToNull(parts[i].children, targetId,template);
    }
  }
};

const findPartByTypeAndId: any = (parts: any, targetType: any, targetId: any, metaInfo?: any) => {
  for (let i = 0; i < parts?.length; i++) {
    if (parts[i].type === targetType && parts[i].id === targetId) {
      if (metaInfo && parts[i].questionInfo?.metaInfo) {
        const matchedMetaInfo = parts[i].questionInfo.metaInfo.find((info: any) => info.id === metaInfo.id);
        if (matchedMetaInfo) {
          return matchedMetaInfo;
        }
      }
      return parts[i];
    }
    // Recursively search through children if they exist
    if (parts[i]?.children) {
      const found = findPartByTypeAndId(parts[i].children, targetType, targetId, metaInfo);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

export const updateNumberOfLines = (parts: any, numberOfLines: any, questionType: any, questionInfo: any, metaInfo?: any) => {
  if(metaInfo){
    parts[0]['typeOfLines']= numberOfLines?.hasOwnProperty('Clear Selection') ? null : numberOfLines;
  }
  else {
    for (let i = 0; i < parts?.length; i++) {
      if (parts[i].type === questionType) {
        if (typeof numberOfLines === 'object') {
          parts[i]['typeOfLines'] = numberOfLines?.hasOwnProperty('Clear Selection') ? null : numberOfLines;
        } else {
          parts[i].numberOfLines = numberOfLines;
        }

        if (parts[i].questionInfo?.metaInfo) {
          parts[i].questionInfo.metaInfo.forEach((meta: any) => {
              meta.typeOfLines = numberOfLines?.hasOwnProperty('Clear Selection') ? null : numberOfLines;
          });
        }
      }

      if (parts[i].children) {
        updateNumberOfLines(parts[i].children, numberOfLines, questionType, questionInfo, metaInfo);
        parts[i]['typeOfLines']= numberOfLines?.hasOwnProperty('Clear Selection') ? null : numberOfLines;;
      }
    }
  }
};

const authToken = localStorage.getItem('auth_token');
export const availableModules = parseJwt(authToken!)?.data?.availableModules ?? [];


export const getImage = (text: any, questionImageDetails: any) => {
  let updatedText = text;
  questionImageDetails?.forEach((imageDetail: any) => {
    updatedText = updatedText?.replace(
      `{{${imageDetail.key}}}`,
      `<span class="listImageTag" onclick="handleClick('${imageDetail?.src}')">${imageDetail?.tag} ${' '}</span>`
    );
  });
  return updatedText;
}

export const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

export const istypeOflinesPresent = (template: any, type: any) => {
  if (template?.templateBuilderInfo && template?.templateBuilderInfo?.templateParts) {
    const parts = template.templateBuilderInfo.templateParts;
    return typeOflinesPresent(parts, type); 
  }
  return false; 
};

export const typeOflinesPresent = (parts: any, questionType: any): boolean => {
  for (let i = 0; i < parts?.length; i++) {
    if (parts[i].type === questionType) {
      if (parts[i].typeOfLines && Object.keys(parts[i].typeOfLines).length > 0) {
        return true; 
      } else {
        return false; 
      }
    }
    if (parts[i]?.children) {
      const result = typeOflinesPresent(parts[i].children, questionType); 
      if (result !== undefined) {
        return result;
      }
    }
  }
  return false;
};
export const typeOflines:any = [ 'Clear Selection', 'Blank', 'Solid Line(s)', '2 Lines', '3 Lines', '4 Lines', '5 Lines', 'Box(s)', 'Rectangle(s)' ]
export const numberOfLinesCount = Array.from({ length: 30 }, (_, i) => i + 1);

export const getLineCountForMarks = (marks:number) => {
  if (marks >= 1 && marks <= 2) return 2;
  if (marks >= 3 && marks <= 4) return 6;
  if (marks >= 5 && marks <= 9) return 10;
  if (marks >= 10 && marks <= 15) return 15;
  if (marks >= 15 && marks <= 20) return 20;
  if (marks > 20) return 30;
  return 0; 
};
export const findFirstQuestionBorderType = (parts: any): any => {
  let result = null;
  for (const part of parts) {
    if (part.type === "Question" && part.typeOfLines) {
      const firstLineType = Object.keys(part.typeOfLines)[0];
      if (firstLineType && part.typeOfLines[firstLineType]) {
        result = part.typeOfLines[firstLineType].borderType;
      }
      break;
    }

    if (part.children && part.children.length > 0) {
      result = findFirstQuestionBorderType(part.children);
      if (result !== null) break;
  }
  return result;
};
}