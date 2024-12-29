import React, { FC, useEffect, useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Container, Typography, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import "./PreviewModalQuestion.css";
import ButtonComponent from '../../../../SharedComponents/ButtonComponent/ButtonComponent';
import PreviewModalImage from './PreviewImage';
import PreviewContentComponent from '../../../../AssessmentsContainer/CreateNewQuestion/PreviewModalComponent/PreviewContentComponent/PreviewContentComponent';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50% !important',
  height: '600px',
  background: '#FFFFFF',
  borderRadius: '12px',
  p: 4,
}

type Props = {
  header: string;
  openPreview: boolean;
  setOpenPreview: (e: boolean) => void;
  content: string;
  questionType :any,
  setIsPreviewPayload? :any
  isEvaluation?: boolean
};

const PreviewModalQuestion: FC<Props> = ({ header, openPreview, setOpenPreview, content,setIsPreviewPayload ,questionType}) => {
  const [openPreviewImg, setOpenPreviewImg] = useState<boolean>(false);
  const [imgContent, setImgContent] = useState<string>("");

  const handleClose = () => {
    setOpenPreview(false);
    setIsPreviewPayload(null);
  };

  (window as any).handleClick = (key: any, event: any) => {
    setOpenPreviewImg(true)
    setImgContent(key)
};

const getQuestionTitle = (dataList: any) => {
    let str = dataList?.questionText;
    
    if (str.includes("{{") || str.includes("<img")) {
        dataList?.questionImageDetails?.forEach((questionImage: any) => {
            let replaceImageKey = str.replace(`{{${questionImage?.key}}}`, `<span class="listImageTag" onclick="handleClick('${questionImage?.src}')">${questionImage?.tag} ${' '}</span>`) //Replace Image uploadPath with empty string           
            str = replaceImageKey
        });
    }
    return str;
  };

  return (
    <Modal open={openPreview} onClose={handleClose}>
      <Container className='questionPreviewModal imagePreviewModal' sx={style}>
        <div className='alignHeader'>
          <Box style={{ width: '100%' }}>
            <Typography variant='h1' sx={{fontWeight: '600'}} id='modal-modal-title'>{header}</Typography>
          </Box>
          <Box>
            <CloseIcon style={{ cursor: 'pointer', position: 'absolute', right: '20px' }} onClick={handleClose} />
          </Box>
        </div>
        <br />
        <Divider className='divider' />
        <div className='previewQuestion-Scroll'>
          {questionType?.questionTypeName == "Comprehensive" &&
            <div className='d-flex align-items-start mx-0 mt-2 mb-2'>
              <div className="leftsideHeader ">
                Passage/ Extract :
              </div>
              <Box className='rightsideHeader' >
                <div className='questionContent d-flex flex-column justify-content-start'>
                  <span className='questionContent' dangerouslySetInnerHTML={{ __html: questionType?.question.replace("<p><br></p>", "") }}></span>
                </div>
              </Box>
            </div>

          }
          {questionType?.questionTypeName !== "Comprehensive" &&
            <div className='mt-2'>
              <PreviewContentComponent questionType={questionType} comprehensiveTypeStatus={true} comprehensiveTypeIndex={0} isEvaluation={true} /></div>}

          {(questionType?.questionTypeName == "Comprehensive" && questionType?.metaInfo) &&
            <>
              {questionType?.metaInfo.map((section: any, index: number) => {
                return (
                  <>
                    <div className='ComprehensionBorderDash'></div>
                    <PreviewContentComponent comprehensiveTypeStatus={true} comprehensiveTypeIndex={index} questionType={section} isEvaluation={true} />
                  </>
                )

              })}
            </>
          }
        </div>
        <Divider className='divider' />
        <Box className='d-flex justify-content-end mt-4'>
          <ButtonComponent type='outlined' buttonSize='Medium' label='Back' onClick={handleClose} textColor='black' minWidth='150' backgroundColor='#01B58A' />
        </Box>
        {openPreviewImg && <PreviewModalImage header={''} openPreview={openPreviewImg} setOpenPreview={setOpenPreviewImg} content={imgContent} setContent={setImgContent} />}
      </Container>
    </Modal>
  );
};

export default PreviewModalQuestion;
