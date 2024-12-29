import React, { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxButtonControl, CoreButton, InputField, ThemeProvider } from '@esense/wrapper';
import { AlertColor, Box, TextField } from '@mui/material';
import {
  AssessQuestionPaperBox,
  CreateOnlineQuestionPaperBlock,
  CreateOnlineQuestionPaperRoot,
  OnlineQuestionPaperPreviewthemeConfig,
  PaperInputStyled,
} from './CreateOnlineQuestionPaperPreviewStyle';
import SectionMultiSelect from './SectionMultiSelect/SectionMultiSelect';
import SelectComponentForSet from '../../SharedComponents/SelectComponentForSet/SelectComponentForSet';
import DateSelection from './DateSelection/DateSelection';
import AutoCompleteWithChip from './AutoCompleteWithChip/AutoCompleteWithChip';
import RectangleQsnPaper from '../../../assets/images/RectangleQsnPaper.png';
import goBack from '../../../assets/images/goBack.svg';
import {
  getGradeSectionListApi,
  studentAttendanceByCourse,
  submitStudentAllocation,
} from '../../../Api/OnlineQuestionPaper';
import { getLocalStorageDataBasedOnKey } from '../../../constants/helper';
import { State } from '../../../types/assessment';
import { changeDateFormat, changeTimeFormat } from './ConstCreateOnlineQuestionPaperPreview';
import { useNavigate } from 'react-router';
import { QuestionPaperViewApi } from '../../../Api/QuestionTypePaper';

const schema = yup
  .object({
    questionPaperDescription: yup.string().required('Qusetion paper is required'),
    assignSections: yup
      .array()
      .of(yup.string())
      .min(1, 'Please select at least one section')
      .required('Section is required'),
    allocationDate: yup.date().typeError('Invalid date').required('Date is required'),
    allocationTime: yup.date().typeError('Invalid Time').required('Time is required'),
    assessmentFinishDate: yup
      .date()
      .typeError('Invalid date')
      .required('Date is required')
      .min(yup.ref('allocationDate'), 'End date should be after or equal to the start date'),
    assessmentFinishTime: yup
      .date()
      .typeError('Invalid Time')
      .required('Time is required')
      .when('assessmentFinishDate', (assessmentFinishDate: Date | null, schema: any) => {
        return assessmentFinishDate && schema.min(yup.ref('allocationTime'));
      }),
    lateSubmissionAllowed: yup.boolean(),
  })
  .required();

interface CreateOnlineQuestionPaperPreviewProps {
  classesId: string;
  courseId: string;
  staffId: string;
  dataList: any;
  handleDone: () => void;
  setSpinnerStatus: (spinnerStatus: boolean) => void;
  setSnackBar: (show: boolean) => void
  setSnackBarText: (text: string) => void
  setSnackBarSeverity: (severity: AlertColor) => void
}

const CreateOnlineQuestionPaperPreview: React.FC<CreateOnlineQuestionPaperPreviewProps> = (
  CreateOnlineQuestionPaperPreviewProps,
) => {
  const { classesId, courseId, staffId, handleDone, dataList, setSpinnerStatus, setSnackBar, setSnackBarText, setSnackBarSeverity } = CreateOnlineQuestionPaperPreviewProps;
  let history = useNavigate();

  const [islateSubmissionAllowedFlag, setIslateSubmissionAllowedFlag] = useState(false);
  const [studentSectionList, setStudentSectionList] = useState([]);
  const [studentListBySection, setStudentListBySection] = useState([]);
  const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;
  const { userRefId } = stateDetails.login.userData;
  const [coursesID,setCourseID]=useState()

  const useFormMethods = useForm({
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormMethods;
 
  const getPreviewQuestions = useCallback(async () => {
    const res:any = await QuestionPaperViewApi(dataList.id, false);
    if (res?.data) {
      setCourseID(res.data.courses[0].courseID)
    }
  },[]);
  useEffect(()=>{
    getPreviewQuestions()
  },[])

  const onSubmit = useCallback(
    async (data: unknown | any) => {
      setSpinnerStatus(true)
      const requestData = data;
      requestData['allocationDate'] &&
        (requestData['allocationDate'] = changeDateFormat(requestData['allocationDate']));
      requestData['allocationTime'] &&
        (requestData['allocationTime'] = changeTimeFormat(requestData['allocationTime']));
      requestData['assessmentFinishDate'] &&
        (requestData['assessmentFinishDate'] = changeDateFormat(requestData['assessmentFinishDate']));
      requestData['assessmentFinishTime'] &&
        (requestData['assessmentFinishTime'] = changeTimeFormat(requestData['assessmentFinishTime']));

      if (requestData?.assignSections) {
        const filteredArrayObj = studentListBySection
          .filter(function (studentListItem: any) {
            return (
              requestData.excludeStudents.filter(function (excludeStudentItem: any) {
                return excludeStudentItem.studentId == studentListItem.studentId;
              }).length == 0
            );
          })
          ?.map((item: any) => {
            return { studentId: item.studentId };
          });

        const allocationInfo = requestData?.assignSections.map((item: any) => {
          return {
            sectionId: item,
            studentInfo: filteredArrayObj,
          };
        });
        requestData.allocationInfo = allocationInfo;
        delete requestData.assignSections;
        delete requestData.excludeStudents;
      }

      // add extra information from parent section
      requestData.type = dataList.questionPaperTypeID;
      requestData.questionPaperDuration = dataList.time;
      requestData.questionPaperID = dataList.id;
      requestData.gradeID = dataList.gradeID;
      requestData.questionPaperMaxAttempts = 1000;
      requestData.questionMaxAttempts = 1000;
      const res = await submitStudentAllocation(requestData);
      if(res.status === 200){
        setSnackBar(true)
        setSnackBarSeverity('success')
        setSnackBarText('Successfully assigned question paper')
        handleDone()
      } else if (res.status === 400){
        setSnackBar(true)
        setSnackBarSeverity('error')
        setSnackBarText(res.data.responseDescription)
      }
      setSpinnerStatus(false)
    },
    [dataList.gradeID, dataList.id, dataList.questionPaperTypeID, dataList.time, studentListBySection],
  );

  const onCheckboxHandle = (event: any) => {
    setValue('lateSubmissionAllowed', event?.target?.checked, { shouldValidate: true });
    setIslateSubmissionAllowedFlag(!event.target.checked);
  };

  const loadSectionInfo = useCallback(async () => {
    //TODO: make dynamic `userId`
    const response = await getGradeSectionListApi(userRefId);
    // const response = await getGradeSectionListApi(2);
    if (response.classDetails) {
      const uniqueClassDetails = response.classDetails.filter((classDetail: any, index: any, self: any) => {
        return (
          index === self.findIndex((otherClassDetail: any) => otherClassDetail.sectionid === classDetail.sectionid)
        );
      });
      setStudentSectionList(uniqueClassDetails);
    }
  }, [userRefId]);

  const loadStudentAttendanceByCourse = useCallback(
    async (params = null) => {
      //TODO: make dynamic `courseId` by parent component
      const getSelectedSection = getValues('assignSections');
      const data = { staffId: userRefId, courseId: coursesID, classIds: getSelectedSection };
      if (getSelectedSection) {
        const response = await studentAttendanceByCourse(params, data);
        setStudentListBySection(response);
      }
    },
    [coursesID, getValues, userRefId],
  );

  useEffect(() => {
    loadSectionInfo();
    loadStudentAttendanceByCourse();
  }, [loadSectionInfo, loadStudentAttendanceByCourse]);

  return (
    <ThemeProvider theme={OnlineQuestionPaperPreviewthemeConfig}>
      <CreateOnlineQuestionPaperRoot>
        <div className='contentBlock'>
        <h1>Create Online Assessment Question Paper</h1>
        <h3>Assign this assessment to students form them to attempt it online or print it.</h3>
        <CreateOnlineQuestionPaperBlock>
          <div className='headerBlock'>
            <div className='title'>Assign this assessment to students form them to attempt it</div>
            {/* <Box className='numberSetSelectBoxStyling'>
              <SelectComponentForSet />
            </Box> */}
          </div>
          <FormProvider {...useFormMethods}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
              <AssessQuestionPaperBox>
                <div className='boxLeft'>
                  <div className='MarksTime'>
                    <span>Total Marks: {dataList.marks}</span>
                    <span>Total time: {dataList.time} mins</span>
                  </div>
                  <div className='PaperThumbnail'>
                    <img src={RectangleQsnPaper} alt='' />
                  </div>
                </div>
                <div className='boxRight'>
                  <div className='formControl'>
                    <label className='labelStyled'> How do you want to remember this qusetion paper?*</label>
                    <Controller
                      name='questionPaperDescription'
                      control={control}
                      defaultValue={getValues('questionPaperDescription')}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          placeholder='Start typing here...'
                          error={Boolean(errors[`questionPaperDescription`])}
                          helperText={errors[`questionPaperDescription`]?.message as string}
                          size='small'
                          sx={{ ...PaperInputStyled }}
                        />
                      )}
                    />
                  </div>
                  <label className='labelStyled'>Assign this assessment to sections:</label>
                  <SectionMultiSelect
                    dropDownSelectValues={studentSectionList}
                    loadStudentAttendanceByCourse={loadStudentAttendanceByCourse}
                  />
                  <DateSelection
                    controlDate={'allocationDate'}
                    controlTime={'allocationTime'}
                    controlDateLabel={'Assign On'}
                    controlTimeLabel={'Time'}
                  />
                  <DateSelection
                    controlDate={'assessmentFinishDate'}
                    controlTime={'assessmentFinishTime'}
                    controlDateLabel={'Due on'}
                    controlTimeLabel={'Time'}
                  />
                  <Controller
                    name='lateSubmissionAllowed'
                    control={control}
                    render={({ field }) => (
                      <CheckboxButtonControl
                        rounded={true}
                        label={'Allow student to submit even after the last date'}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          field.onChange(event);
                          onCheckboxHandle(event);
                        }}
                        className='allowLastDate'
                      />
                    )}
                  />
                  <AutoCompleteWithChip
                    controlName={'excludeStudents'}
                    options={studentListBySection}
                    label={'Excluding the following students:'}
                  />
                </div>
              </AssessQuestionPaperBox>
              <div className='autoSelectFooter'>
                <div className='autoSelectFooterLeft' onClick={handleDone}>
                  <h4 className='cursorPointer mt-2'>
                    <img src={goBack} alt='Img' />
                    Go Back
                  </h4>
                </div>
                <div className='autoSelectFooterRight'>
                  <CoreButton size='medium' variant='outlined' onClick={handleDone}>
                    Exit
                  </CoreButton>
                  <CoreButton type='submit' size='medium' variant='contained'>
                    Finish
                  </CoreButton>
                </div>
              </div>
            </form>
          </FormProvider>
          </CreateOnlineQuestionPaperBlock>
          </div>
      </CreateOnlineQuestionPaperRoot>
    </ThemeProvider>
  );
};

export default CreateOnlineQuestionPaperPreview;
