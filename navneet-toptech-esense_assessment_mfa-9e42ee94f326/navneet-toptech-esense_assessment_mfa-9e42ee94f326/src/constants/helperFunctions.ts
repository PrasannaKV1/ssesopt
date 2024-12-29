import cloneDeep from 'lodash.clonedeep';
import moment from 'moment';

export const removeUploadsFromText = (text: string) => {
  var pattern = /{{uploads\/erp\/assess\/questions\/images\/[\w-]+\/[\w-]+\/[\w-]+\.\w+}}/g;
  text = text.replaceAll(pattern, "");
  const imgpattern = /<img[^>]*>/g;
  text = text.replaceAll(imgpattern, "");
  return text
}

const getQuestionImageData = (data: any) => {
  let questionImages: any = []
  if (data?.questionImages?.length > 0) {
    data?.questionImages?.forEach((questionImage: any) => {
      if (data?.question?.includes(questionImage?.uploadPath)) {
        questionImages.push(questionImage)
      } else if (data?.hint?.includes(questionImage?.uploadPath)) {
        questionImages.push(questionImage)
      } else if (data?.approach?.includes(questionImage?.uploadPath)) {
        questionImages.push(questionImage)
      } else if (data?.solution?.includes(questionImage?.uploadPath)) {
        questionImages.push(questionImage)
      }
    })
  }
  return questionImages
}

const getUpdatedQuestionImages = (data: any = []) => {
  return data?.map((uploads: any)=>{
     return {
           "uploadPath": (uploads?.includes("{") || uploads?.includes("}") || uploads?.includes("|")) ? uploads.split("|")[1] : uploads
       }
   })
 }

const matchUploadsFromText = (text: string) => {
  var pattern = /{{uploads\/erp\/assess\/questions\/images\/[\w-]+\/[\w-]+\/[\w-]+\.\w+}}/g;
  let match: any;
  let textPattern: any
  if (text.includes("<img")) {
    match = text.match(/<img\b[^>]*>/gi)
  }
  if ((text.includes("{") || text.includes("}"))) {
    textPattern = text?.match(pattern);
  }
  return [textPattern, match]
}

export const getuploadPathWithQuestion = (text: string) => {
  let finalImgArray:any=[];
    const [uploadArr,imgArray]: any = matchUploadsFromText(text)
    if(uploadArr?.length > 0){
       finalImgArray.push(getUpdatedQuestionImages(uploadArr))
    } 
    if(imgArray?.length>0){      
        if(text.includes("<img")){
          const match:any = text.match(/<img\b[^>]*>/gi)
          if (match?.length > 0) {
            let questionImg = match?.map((srcValue: any) => {
              const regex = /<img[^>]+alt="([^"]*)"[^>]*>/g;	
              const match = regex.exec(srcValue);	
              if (match && match[1]) {
                text = hintApproachRTEhandler(text)
  
                  const altValue = match[1];	
                  return (altValue);		
              } else {	
                const startIndex = srcValue.indexOf("amazonaws.com") + 14;	
                const endIndex = srcValue.indexOf("X-Amz") - 1;	
                return srcValue?.slice(startIndex, endIndex)	
              }
            })
            const updatedQuestionImg = getUpdatedQuestionImages([
              ...questionImg,
            ]).map((image: { uploadPath: string }) => {
              if (image.uploadPath.endsWith("/")) {
                image.uploadPath = image.uploadPath.slice(0, -1);
              }
              return image;
            });
            finalImgArray.push( updatedQuestionImg  )      
          }       
        }
    }
    return finalImgArray?.length == 0 ? [] : finalImgArray?.flat()
  }

const rearrangeArray = (inputArray: any) => {
  const outputArray: any = [];
  for (const innerArray of inputArray) {
    for (const item of innerArray) {
      outputArray.push(item);
    }
  }
  return outputArray;
}

export const getWholeImageArray = (question: string, approch: string, hint: string, solution: string) => {
  const imageArr: any = []
  question && imageArr.push(getuploadPathWithQuestion(question))
  approch && imageArr.push(getuploadPathWithQuestion(approch))
  hint && imageArr.push(getuploadPathWithQuestion(hint))
  solution && imageArr.push(getuploadPathWithQuestion(solution))
  return rearrangeArray(imageArr.filter((image: any) => image?.length > 0))
}

export const getUpdatedMTFOptions = (data: any) => {
  if (data?.length > 0) {
    return data?.map((options: any) => {
      if (options?.details?.length > 0) {
        options.details = options.details.map((details: any) => {
          let finalImgArray: any = [];
          const [uploadArr, imgArray]:any = matchUploadsFromText(details?.question)
          if (uploadArr?.length > 0) {
            finalImgArray.push(getUpdatedQuestionImages(uploadArr))
          }
          if (imgArray?.length > 0) {            
            if (details?.question?.includes("<img")) {              
              const match = details?.question?.match(/<img\b[^>]*>/gi)
              if (match?.length > 0) {
                let questionImg = match?.map((srcValue: any) => {
                  const regex = /<img[^>]+alt="([^"]*)"[^>]*>/g;	
                    const match = regex.exec(srcValue);	
                  if (match && match[1]) {	
                    details["question"] = hintApproachRTEhandler(details?.question)
  
                      const altValue = match[1];	
                      return (altValue);	
                  }	
                  else {	
                    const startIndex = srcValue.indexOf("amazonaws.com") + 14;	
                    const endIndex = srcValue.indexOf("X-Amz") - 1;	
                    return srcValue?.slice(startIndex, endIndex)	
                  }
                })
                finalImgArray.push(getUpdatedQuestionImages(questionImg))
              }
            }
          }
          details["questionOptionImages"] = finalImgArray?.length == 0 ? [] : finalImgArray?.flat();
          details["questionOptionImages"] = details["questionOptionImages"].map((image: { uploadPath: string; }) => {
            if (image.uploadPath.endsWith("/")) {
              image.uploadPath = image.uploadPath.slice(0, -1);
            }
            return image;
          });
          return details;
        })
        return options
      } else {
        return data;
      }
    });
  } else {
    return data;
  }
  };

export const getUpdatedOptionsCopy = (data: any) => {
  return data?.length > 0 && data?.map((eachData: any) => {
    let finalImgArray: any = [];
    const [matchUploads, imgArray] = matchUploadsFromText(eachData?.text)
    if (matchUploads?.length > 0) {
      finalImgArray.push(getUpdatedQuestionImages(matchUploads))
    }
    if (imgArray?.length > 0) {
      if (eachData?.text.includes("<img")) {
        const match: any = eachData?.text.match(/<img\b[^>]*>/gi)
        if (match?.length > 0) {
          let questionImg = match?.map((srcValue: any) => {
            if (srcValue.indexOf("amazonaws.com") != -1 && srcValue.indexOf("X-Amz") !== -1) {
              const startIndex = srcValue.indexOf("amazonaws.com") + 14;
              const endIndex = srcValue.indexOf("X-Amz") - 1;
              return srcValue?.slice(startIndex, endIndex)
            } else {
              const regex = /<img[^>]+alt="([^"]*)"[^>]*>/g;
              const match = regex.exec(srcValue);
              if (match && match[1]) {
                // question text alteration
                eachData['text'] = hintApproachRTEhandler(eachData?.text)

                const altValue = match[1];
                return (altValue);
              }
            }
          })
          finalImgArray.push(getUpdatedQuestionImages([...questionImg]))
        }
      }
    }
    eachData['questionImages'] = finalImgArray?.length == 0 ? [] : finalImgArray?.flat();
    return eachData;
  })
}

export const getUpdatedOptions = (data:any) => {
  
  return data?.length > 0 && data?.map((eachData:any)=>{
    let finalImgArray: any = [];
    const [matchUploads, imgArray] = matchUploadsFromText(eachData?.text)
    if (matchUploads?.length > 0) {
      finalImgArray.push(getUpdatedQuestionImages(matchUploads))
    }
    if (imgArray?.length > 0) {        
      if (eachData?.text.includes("<img")) {
        const match: any = eachData?.text.match(/<img\b[^>]*>/gi)
        if (match?.length > 0) {
          let questionImg = match?.map((srcValue: any) => {
            const regex = /<img[^>]+alt="([^"]*)"[^>]*>/g;	
              const match = regex.exec(srcValue);	
            if (match && match[1]) {	
              // question text alteration	
              const modifiedText = hintApproachRTEhandler(eachData?.text);
              eachData['text'] = modifiedText;
                const altValue = match[1];	
                return (altValue);		
            } else {		
              const startIndex = srcValue.indexOf("amazonaws.com") + 14;	
              const endIndex = srcValue.indexOf("X-Amz") - 1;	
              return srcValue?.slice(startIndex, endIndex)	
            }
          })
          finalImgArray.push(getUpdatedQuestionImages([...questionImg]))
        }
      }
    }
    return {
      ...eachData, 
      text: eachData['text'],
      questionImages: finalImgArray?.flat().map((image: { uploadPath: string }) => {
        if (image.uploadPath.endsWith("/")) {
          image.uploadPath = image.uploadPath.slice(0, -1);
        }
        return image;
      }) || [],
    };
  });
}

export const hintApproachRTEhandler = (data: any) => {

  if (!data) {
    return "";
  }
  // Create a temporary div element to parse the input as HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = data;
  
  // Find all <img> elements within the temporary div
  const imgElements = tempDiv.querySelectorAll('img');
  
  // Create an array to store the attributes of each <img> element
  const imgAttributes: any = [];
  
  // Iterate through the <img> elements and collect their attributes
  imgElements.forEach(img => {
    if(img.alt && img?.style?.width === 'auto') {
      // If both attributes are there then add span element with alt value
      const span = document.createElement('span');
      span.classList.add('codeCogsEditor')
      if (img.alt.endsWith("/")) {
        img.alt = img.alt.slice(0, -1);
      }
      const alt = img.alt.split("|")
      span.textContent = `{{${alt[1]}}}`;
      span.dataset.latex = img.alt;
      
      // Replace the <img> element with the new element (span)
      img.parentNode?.replaceChild(span, img);
    } else if(img?.style?.width === 'auto'){
      // If only style element is there then add span element with img tag
      const span = document.createElement('span');
      span.classList.add('codeCogsEditor')
  
      // Clone the <img> element
      const imgClone = img.cloneNode(true);
      span.appendChild(imgClone);
  
      // Replace the <img> element with the new <span> element
      img.parentNode?.replaceChild(span, img);
    } else if(img.alt){
      // If only alt is there then replace img tag with alt value
      const textNode = document.createTextNode(`{{${img.alt}}}`);
    
      // Replace the <img> element with the text node
      img.parentNode?.replaceChild(textNode, img);
    }
    const attributes: any = {};
    Array.from(img.attributes).forEach(attr => {
      attributes[attr.name] = attr.value;
    });
    imgAttributes.push(attributes);
  });
  return tempDiv.innerHTML
  }

export const arrangingDataWithQuestionType = (data: any, filter: string) => {
  switch (filter) {
    case "Subjective":
      return {
        "question": hintApproachRTEhandler(data.question),
        "questionTextWithoutImages": removeUploadsFromText(data.question),
        "questionImages": getQuestionImageData(data),
        "questionLevelId": data.questionLevelId,
        "questionObjectiveId": data.questionObjectiveId,
        "questionTypeMasterId": data.questionTypeMasterId,
        "completionTime": data.completionTime,
        "version": data.version,
        "isPublic": data.isPublic,
        "conceptNo": data.conceptNo,
        "conceptName": data.conceptName,
        "marks": data.marks,
        "hint": hintApproachRTEhandler(data.hint) || "",
        "solution": hintApproachRTEhandler(data.solution),
        "approach": hintApproachRTEhandler(data.approach),
        "gradeId": data.gradeId,
        "themeId": data.themeId,
        "chapterId": data.chapterId,
        "topicId": data.topicId,
        "subjectId": data.subjectId,
        "questionErrorTypes": data.questionErrorTypes
      }
    case "MCQ":
      return {
        "question": hintApproachRTEhandler(data.question),
        "questionTextWithoutImages": removeUploadsFromText(data.question),
        "questionImages": getQuestionImageData(data),
        "questionLevelId": data.questionLevelId,
        "questionObjectiveId": data.questionObjectiveId,
        "questionTypeMasterId": data.questionTypeMasterId,
        "completionTime": data.completionTime,
        "version": data.version,
        "isPublic": data.isPublic,
        "conceptNo": data.conceptNo,
        "conceptName": data.conceptName,
        "marks": data.marks,
        "hint": hintApproachRTEhandler(data.hint),
        "solution": data.solution,
        "approach": hintApproachRTEhandler(data.approach),
        "gradeId": data.gradeId,
        "noOfOptions": data.noOfOptions,
        "themeId": data.themeId,
        "chapterId": data.chapterId,
        "topicId": data.topicId,
        "subjectId": data.subjectId,
        "questionErrorTypes": data.questionErrorTypes,
        "questionOptions": getUpdatedOptions(data.questionOptions)
      }
    case "Fill in the Blanks":
      return {
        "question": hintApproachRTEhandler(data.question),
        "questionTextWithoutImages": removeUploadsFromText(data.question),
        "questionImages": getQuestionImageData(data),
        "questionObjectiveId": data.questionObjectiveId,
        "questionLevelId": data.questionLevelId,
        "questionTypeMasterId": data.questionTypeMasterId,
        "completionTime": data.completionTime,
        "isPublic": data.isPublic,
        "conceptNo": data.conceptNo,
        "conceptName": data.conceptName,
        "marks": data.marks,
        "hint": hintApproachRTEhandler(data.hint),
        "solution": data.solution,
        "approach": hintApproachRTEhandler(data.approach),
        "syllabusId": data.syllabusId,
        "themeId": data.themeId,
        "chapterId": data.chapterId,
        "topicId": data.topicId,
        "subjectId": data.subjectId,
        "questionErrorTypes": data.questionErrorTypes,
        "gradeId": data.gradeId,
        "isBlanks": true,
        "blankMetaInfo": getUpdatedOptions(data.blankMetaInfo)
      }
    case "Match The following":
      return {
        "question": hintApproachRTEhandler(data.question),
        "questionTextWithoutImages": removeUploadsFromText(data.question),
        "questionImages": getQuestionImageData(data),
        "questionObjectiveId": data.questionObjectiveId,
        "questionLevelId": data.questionLevelId,
        "questionTypeMasterId": data.questionTypeMasterId,
        "completionTime": data.completionTime,
        "isPublic": data.isPublic,
        "marks": data.marks,
        "hint": hintApproachRTEhandler(data.hint),
        "solution": data.solution,
        "approach": hintApproachRTEhandler(data.approach),
        "topicId": data.topicId,
        "chapterId": data.chapterId,
        "themeId": data.themeId,
        "subjectId": data.subjectId,
        "questionErrorTypes": data.questionErrorTypes,
        "gradeId": data.gradeId,
        "questionMTFOptions": getUpdatedMTFOptions(data.questionMTFOptions)
      }
  }
} 

export  const _arrayBufferToBase64 = ( buffer: any ) => {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}
export function convertToReadableFormat(isoDate:any) {
  // Check if the input is already in the desired format
  if (/^\d{1,2}(st|nd|rd|th) \w+,\s\d{4}$/.test(isoDate)) {
    return isoDate;
  }
  const dateObj = new Date(isoDate);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const year = dateObj.getFullYear();
  const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || [11, 12, 13].includes(day % 100)) ? 0 : day % 10];
  return `${day}${suffix} ${month}, ${year}`;
}

export const calculateDifferenceInMinutes = (assignDate: any, dueDate: any, startTime: any, endTime: any) => {
  const convertedStartDate = moment(assignDate).format("YYYY-MM-DD");
  const convertedEndDate = moment(dueDate).format("YYYY-MM-DD");

  const convertedStartTime = moment(startTime?.$d).format("HH:mm:ss");
  const convertedEndTime = moment(endTime?.$d).format("HH:mm:ss");

  const startDateTime = new Date(`${convertedStartDate}T${convertedStartTime}`);
  const endDateTime = new Date(`${convertedEndDate}T${convertedEndTime}`);

  return (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
};