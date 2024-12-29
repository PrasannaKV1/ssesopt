import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Modal } from '@mui/material';
import closeIcon from '../../../../assets/images/closeIcon.svg';
import deleteIcon from "../../../../assets/images/checkMark.svg";
import ButtonComponent from '../../../SharedComponents/ButtonComponent/ButtonComponent';
import './MarkCompleted.css'
import { assignChapterChallenge, chapterChallenge } from '../../../../Api/OnlineAssements';
import { SnackbarEventActions } from '../../../../redux/actions/snackbarEvent';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from '../../../../redux/store';
import { currentGradeSectionName, onlineAssementQpList, questionPaperID } from '../../../../redux/actions/onlineAssement';
import Spinner from '../../../SharedComponents/Spinner';

interface MarkCompletedProps{
    open: boolean;
    onClose: () => void;
    onAssignData: any;
  questionPaper?: any
  setSelectedQuestion?: any
  setQpList?: any
}

const MarkCompleted: React.FC<MarkCompletedProps> = ({ open, onClose, onAssignData, questionPaper, setSelectedQuestion, setQpList }) => {
    const dispatch = useDispatch();

  const allQpList = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.qpListOnlineAssesment);
  const gradeSection = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.currentFilterName);
  const [spinnerStatus, setSpinnerStatus] = useState(false);
    const handleAssignChapter= async()=>{
      const { chapterSearchFilter, data, lmsAssessData, stateDetails } = onAssignData;
      setSpinnerStatus(true)
      const chaptChallenge = await chapterChallenge({
        "subjectId":parseInt(lmsAssessData ? lmsAssessData?.courseId : chapterSearchFilter?.subjectId),
        "academicYearId": stateDetails?.currentAcademic?.acadamicId,
        "chapterId":parseInt(data?.chapterId),
        "gradeID": parseInt(lmsAssessData ? lmsAssessData?.gradeId : chapterSearchFilter?.gradeId),
        "sectionId": parseInt(lmsAssessData ? lmsAssessData?.classId : chapterSearchFilter?.classId),
        "name": data?.name
    })
      if (chaptChallenge?.result?.responseDescription == "Success") {
        dispatch(questionPaperID(chaptChallenge?.data?.paperId))
          if(onAssignData.lmsAssessData){
              const gradeSectionName = `${onAssignData.lmsAssessData.grade} - ${onAssignData.lmsAssessData.section}` 
              dispatch(currentGradeSectionName(gradeSectionName))
          }
          const response = await assignChapterChallenge(chaptChallenge?.data?.paperId);
          onClose();
          if(response.result.responseCode == 200){
            const AssignUpdate = allQpList.map((item: any) => {
              if (item.curriculumId === questionPaper.curriculumId) {
                return { ...item, isAssigned: true, id: chaptChallenge?.data?.paperId };
              }
              return item;
            });
            const updatedQP = AssignUpdate.filter((item: any) => item?.curriculumId === questionPaper.curriculumId)
            let newUpdateQp = { ...updatedQP[0] };
            if (!newUpdateQp?.id) {
              newUpdateQp["id"] = chaptChallenge?.data?.paperId;
            }
            setSelectedQuestion(newUpdateQp)
            dispatch(onlineAssementQpList(AssignUpdate));
            setQpList(AssignUpdate)
            dispatch(SnackbarEventActions({
                snackbarOpen: true,
                snackbarType: "success",
                snackbarMessage: response.result.responseDescription,
            }));
          }
          else{
            dispatch(SnackbarEventActions({
              snackbarOpen: true,
              snackbarType: "error",
              snackbarMessage: `QP is already assigned to respective students`,
            }));
          }
      }
      if (chaptChallenge?.response && chaptChallenge?.response?.status != 0) {
        onClose();
        dispatch(SnackbarEventActions({
          snackbarOpen: true,
          snackbarType: "error",
          snackbarMessage: chaptChallenge?.response?.data?.responseDescription,
        }));
      }
      setSpinnerStatus(false) 
    }
  return (
    <>
     {spinnerStatus && <Spinner />}
    <Modal
      className="deleteModalPopover"
      open={open} onClose={onClose}
    >
      <div className="deleteModalPopoverBody">
        <div className="deleteModalPopoverBodyPadd">
          <div className="d-flex justify-content-center mb-2">
            <img src={deleteIcon} width="52px" className="text-center" />
          </div>

          <div className="closeDeleteIcon" onClick={onClose}>
            <img src={closeIcon} style={{ width: "16px" }} />
          </div>
          <div className="text-center">
            <Typography variant="h2" className="w-100 deleteModalHead">
              {'Marked as completed'}
            </Typography>
          </div>

          <Typography className="deleteModalDesc text-center" variant="h4">
              {`${onAssignData?.data?.chapterName} is marked as complete for ${gradeSection}.`}
          </Typography>
          <Typography className="deleteModalDesc text-center" variant="h3">
            {'Do you want to assign a Chapter Challenge?'}
          </Typography>

          <div className="deleteModalActionBtn">
            <ButtonComponent disabled={false} buttonSize="Medium" type="contained" label={'Assign Chapter Challenge'} minWidth="200" textColor={''} onClick={handleAssignChapter} />
            <ButtonComponent disabled={false} buttonSize="Medium" type="outlined" onClick={onClose} label={'Cancel'} minWidth="200" textColor={''} />
          </div>
        </div>
      </div>
    </Modal>
  </>
  );
};

export default MarkCompleted;
