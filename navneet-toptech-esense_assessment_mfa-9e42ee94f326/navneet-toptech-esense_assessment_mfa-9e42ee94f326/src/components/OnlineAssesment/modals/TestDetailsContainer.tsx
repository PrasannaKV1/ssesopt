import React, { useEffect, useState } from 'react'
import {
    TextField,
    Box,
} from "@mui/material";

import styles from "../../OnlineAssesment/style/duplicateTestModal.module.css";
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import DropdownWithCheckbox from '../../SharedComponents/DropdownWithCheckbox/DropdownWithCheckbox';
import { useForm, FormProvider, Controller } from "react-hook-form";
import { getAllStudentListApi, } from '../../../Api/QuestionTypePaper';
import InputFieldComponentForForm from '../../SharedComponents/FormFieldComponents/InputFieldComponent';
import { alphanumericNameRegex, getLocalStorageDataBasedOnKey } from '../../../constants/helper';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getDuplicatePaper } from '../../../Api/OnlineAssements';

import { State } from '../../../types/assessment';
import { useDispatch } from 'react-redux';
import { Loader, onlineDuplicateNewPaper, onlineDuplicateStudentList } from '../../../redux/actions/onlineAssement';
import moment from 'moment';
import { SnackbarEventActions } from '../../../redux/actions/snackbarEvent';
import dayjs from 'dayjs';

type TestDetailsContainerType = {
    handleTestModalClose: () => void
    section: any
    selectedQuestion: any
    setTestDetailsTab?: any
    setAssignTestTab?: any
};

const TestDetailsContainer = (props: TestDetailsContainerType) => {
    const { handleTestModalClose, section, selectedQuestion, setAssignTestTab, setTestDetailsTab } = props

    const dispatch = useDispatch()
    const stateDetails = JSON.parse(
        getLocalStorageDataBasedOnKey("state") as string
    ) as State;

    const [selStartDate, setSelStartDate] = useState<any>(new Date());
    const [selDueDate, setSelDueDate] = useState<any>();
    const [error, setError] = useState<string | null>(null);
    const [isToday, setIsToday] = useState(true);
    const [minDueTime, setMinDueTime] = useState(dayjs().startOf('day'));
    const [initialValues, setInitialValues] = useState<any>({
        nameOfExamination: '',
        sectionId: [],
    })
    const methods = useForm<any>({
        defaultValues: initialValues,
        mode: "onBlur",
        reValidateMode: "onChange"
    });



    const changeHandler = async (e: any, data: string) => {
        switch (data as string) {
            case 'examName':
                methods.reset({
                    ...methods?.getValues(),
                    nameOfExamination: e
                });
                break
            case 'section':
                methods.reset({
                    ...methods?.getValues(),
                    sectionId: e
                });
                break;
            case 'startTime':
                methods.reset({
                    ...methods?.getValues(),
                    startTime: e
                });
                break;
            case 'dueTime':
                methods.reset({
                    ...methods?.getValues(),
                    dueTime: e
                });
        }
    }

    const formatDate = (isoDate: any) => {
        const date = new Date(isoDate);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        return formattedDate.replace(/\//g, '-'); // Replace slashes with dashes
    };

    const formatTime = (isoDateTime: any) => {
        const date = new Date(isoDateTime);

        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedHours = hours < 10 ? '0' + hours : hours;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
        return formattedTime;
    };

    let postObj = {
        name: methods?.getValues('nameOfExamination'),
        sections: methods?.getValues('sectionId'),
        startDate: formatDate(selStartDate),
        dueDate: formatDate(selDueDate),
        questionPaperID: selectedQuestion?.id,
        startTime: formatTime(methods?.getValues('startTime')),
        dueTime: formatTime(methods?.getValues('dueTime'))
    }

    const handleCreateNewQp = async () => {
        const classIDs = section?.filter((el: any) => postObj?.sections.includes(el?.sectionid))?.map((data: any) => data?.classid);
        try {
            const obj = {
                "name": postObj?.name,
                "questionPaperID": postObj?.questionPaperID,
                "startDate": postObj?.startDate,
                "endDate": postObj?.dueDate,
                "startTime": postObj?.startTime,
                "endTime": postObj?.dueTime,
                "sectionIds": classIDs,
                "academicYearID": stateDetails?.currentAcademic?.acadamicId
            }
            dispatch((Loader(true)))
            const response = await getDuplicatePaper(obj)
            if (response && response?.result?.responseCode === 0) {
                dispatch(onlineDuplicateNewPaper(response?.data))
                if (response?.data && response?.data?.paperId) {
                    const courseIds = selectedQuestion?.questionPaperCourseDetails.map((course: { courseID: any; }) => course.courseID) || [];
                    const apiPayload = {
                        "staffId": stateDetails.login.userData.userRefId,
                        "courseId": courseIds,
                        "sectionId": classIDs,
                        "gradeId": [selectedQuestion?.gradeID],
                        "qpId": response?.data?.paperId,
                        "qpTypeId": 1,
                        "isStudentCourse": true
                    }

                    const studentList = await getAllStudentListApi(apiPayload);
                    setTestDetailsTab(false)
                    setAssignTestTab(true)
                    if (studentList?.data && studentList?.data.length > 0) {

                        const uniqueClassNames = Array.from(
                            new Set(studentList?.data?.map((item: any) => item?.className) || [])
                        );

                        const isSingleClass = uniqueClassNames.length === 1;
                        const getClassOrder = (className: string): number => {
                            return uniqueClassNames.indexOf(className);
                        };
                        const sortedData = studentList?.data?.sort((a: any, b: any) => {
                            const rollNumberA = parseInt(a?.rollNumber, 10);
                            const rollNumberB = parseInt(b?.rollNumber, 10);

                            if (isSingleClass) {
                                return rollNumberA - rollNumberB;
                            } else {
                                const classOrderA = getClassOrder(a?.className || "");
                                const classOrderB = getClassOrder(b?.className || "");

                                const adjustedOrderA = classOrderA === -1 ? uniqueClassNames.length : classOrderA;
                                const adjustedOrderB = classOrderB === -1 ? uniqueClassNames.length : classOrderB;

                                if (adjustedOrderA !== adjustedOrderB) {
                                    return adjustedOrderA - adjustedOrderB;
                                }

                                return rollNumberA - rollNumberB;
                            }
                        });
                        dispatch(onlineDuplicateStudentList(sortedData))
                    }
                }
            }
            if (response && response?.response?.status === 400) {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: `${response?.response?.data?.responseDescription}`,
                }));
            }
        } catch (error) {
            console.error("something went wrong")
        }
        dispatch((Loader(false)))
    }

    useEffect(() => {
        const todayFormatted = formatDate(new Date());
        const startDateFormatted = postObj?.startDate;

        if (startDateFormatted === todayFormatted) {
            setIsToday(true);
        } else {
            setIsToday(false);
        }

        if (formatDate(selStartDate) > formatDate(selDueDate)) {
            setError("The due date should not be greater than the start date.")

        } else {
            setError(null)
        }
    }, [postObj?.startDate, postObj?.dueDate]);

    useEffect(() => {
        const date1 = dayjs(selStartDate);
        const date2 = dayjs(selDueDate);
        const dateOnly1 = date1.startOf('day');
        const dateOnly2 = date2.startOf('day');
        if (dateOnly1.isSame(dateOnly2, 'day')) {
            const startTime = methods.getValues("startTime");
            if (startTime) {
                setMinDueTime(dayjs(startTime).add(selectedQuestion?.time, 'minute').startOf('minute'));
            }
        } else {
            setMinDueTime(dayjs().startOf('day'));
        }
    }, [selStartDate, selDueDate, methods.getValues("startTime")])
    const minTime = isToday
        ? dayjs().add(10, 'minute') // Adds 10 minutes to current time
        : undefined;

    return (
        <FormProvider {...methods} >
        <div className={styles.gmat}>
            <div className={styles.inputBarParent}>
                    <Box sx={{ width: "320px" }}>

                        <InputFieldComponentForForm registerName={'nameOfExamination'} inputType={"text"} label={"Test Name"} required={true} onChange={(e: any) => { changeHandler(e.target.value, 'examName') }} inputSize={"Large"} variant={""} maxLength={50} pattern={alphanumericNameRegex} />
                    </Box>
                    <Box sx={{ width: "320px" }}>
                        <DropdownWithCheckbox registerName="sectionId" required={true} value={methods?.getValues('sectionId')} variant={'fill'} selectedValue={''} clickHandler={(e: any) => { changeHandler(e, 'section') }} selectLabel={'Section'} disabled={!methods?.getValues("nameOfExamination")} selectList={section} mandatory={true} showableLabel={"section"} showableData={"sectionid"} menuHeader={"Select Section"} />
                    </Box>
            </div>
            <div className={styles.inputBarGroup}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name="assignDate"
                            control={methods.control}
                            rules={{ required: true, }}
                            defaultValue={moment(new Date(), "YYYY-MM-DD")}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    label="Select Start Date*"
                                    inputFormat={"ddd D MMM, YYYY"}
                                    onChange={(newValue) => { field.onChange(newValue); setSelStartDate(newValue); }}
                                    minDate={moment(new Date(), "YYYY-MM-DD")}
                                    maxDate={moment(stateDetails.currentAcademic?.endDate, "YYYY-MM-DD")}
                                    renderInput={(params) => <TextField {...params} style={{ backgroundColor: "#f4f6f9", width: "320px" }} />}
                                    disabled={false}
                                />
                            )}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name="startTime"
                            control={methods.control}
                            defaultValue={null}

                            render={({ field }) => (
                                <TimePicker
                                    label="Start Time*"
                                    inputFormat={"h:mm a"}
                                    {...field}
                                    disabled={!(methods.getValues("sectionId")?.length > 0)}
                                    value={field.value || null}
                                    minTime={minTime}
                                    onChange={(newValue) => changeHandler(newValue, "startTime")}
                                    renderInput={(params) => (
                                        <TextField
                                            style={{ backgroundColor: "#f4f6f9", width: "320px" }}
                                            {...params}
                                            inputProps={{
                                                ...params.inputProps,
                                                //placeholder: "HH:MM pm"
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />
                    </LocalizationProvider>
            </div>
            <div className={styles.inputBarContainer}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name="dueDate"
                            control={methods.control}
                            defaultValue={null}
                            rules={{ required: true, }}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    label="Select Due Date *"
                                    inputFormat={"ddd D MMM, YYYY"}
                                    disabled={!methods.getValues("startTime")}
                                    minDate={selStartDate}
                                    // maxDate={moment(stateDetails.currentAcademic?.endDate, "YYYY-MM-DD")}
                                    renderInput={(params) => <TextField {...params} style={{ backgroundColor: "#f4f6f9", width: "320px" }} />}
                                    onChange={(newValue) => { field.onChange(newValue); setSelDueDate(newValue); }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name="dueTime"
                            control={methods.control}
                            defaultValue={null}
                            render={({ field }) => (
                                <TimePicker
                                    label="Due Time*"
                                    inputFormat={"h:mm a"}
                                    {...field}
                                    disabled={!selDueDate}
                                    value={field.value || null}
                                    minTime={minDueTime}
                                    onChange={(newValue) => changeHandler(newValue, "dueTime")}
                                    renderInput={(params) => (
                                        <TextField
                                            style={{ backgroundColor: "#f4f6f9", width: "320px" }}
                                            {...params}
                                            inputProps={{
                                                ...params.inputProps,
                                                //placeholder: "HH:MM pm"
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />
                    </LocalizationProvider>
            </div>
            <span style={{ color: "red" }}>
                {error}
            </span>
            <div className={styles.buttonsContainer}>
                <ButtonComponent
                    icon={''}
                    image={""}
                    textColor="#FFFFFF"
                    backgroundColor="#01B58A"
                        disabled={!methods?.getValues("dueTime")}
                    buttonSize="Medium"
                    type="contained"
                    label={"Continue"}
                    minWidth="200"
                        onClick={() => { handleCreateNewQp() }}
                />
                <ButtonComponent
                    icon={''}
                    image={""}
                    textColor="#1B1C1E"
                    backgroundColor="#01B58A"
                    disabled={false}
                    buttonSize="Medium"
                    type="outlined"
                    label={"Cancel"}
                    minWidth="200"
                    onClick={handleTestModalClose}
                />
            </div>
        </div>
        </FormProvider>
    )
}

export default TestDetailsContainer