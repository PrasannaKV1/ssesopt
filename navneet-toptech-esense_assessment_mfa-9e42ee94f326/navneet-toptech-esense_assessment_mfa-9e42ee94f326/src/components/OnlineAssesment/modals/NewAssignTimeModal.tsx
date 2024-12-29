import React, { useEffect, useState } from "react";
import { Typography, Modal, Button, TextField } from "@mui/material";
import { LocalizationProvider, TimePicker, DatePicker } from '@mui/x-date-pickers';
import { useForm, FormProvider, Controller } from "react-hook-form";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDispatch, useSelector } from "react-redux";
import dayjs from 'dayjs';
import moment from "moment";


import closeIcon from "../../../assets/images/closeIcon.svg";
import '../style/NewAssignTimeModal.css';
import ButtonComponent from "../../SharedComponents/ButtonComponent/ButtonComponent";
import { RootStore } from "../../../redux/store";
import { DonePutApi } from "../../../Api/QuestionTypePaper";
import { SnackbarEventActions } from "../../../redux/actions/snackbarEvent";
import { getLocalStorageDataBasedOnKey } from "../../../constants/helper";
import { State } from "../../../types/assessment";
interface Props {
    open: boolean;
    onClose: () => void;
    selectedQuestion?: any
    questionPaperID?: any
}
const NewAssignTimeModal: React.FC<Props> = ({ open, onClose, selectedQuestion, questionPaperID }) => {
    const duplicatePaperInfo = useSelector((state: RootStore) => state.onlineAssesmentMenuEvent?.qpDuplicatePaper)
    const stateDetails = JSON.parse(
        getLocalStorageDataBasedOnKey("state") as string
    ) as State;

    const createDefaultTime = (timeString: any) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        return dayjs().set('hour', hours).set('minute', minutes).set('second', 0).set('millisecond', 0);
    };


    function convertDateWithMoment(dateString: any) {
        const parsedDate = moment(dateString, "Do MMMM, YYYY");

        return parsedDate.format("YYYY-MM-DD");
    }
    function convertTimeWithMoment(timeString: any) {
        const parsedTime = moment(timeString, "h:mm A");
        return parsedTime.format("HH:mm:ss");
    }
    const defaultDueTime = selectedQuestion ? createDefaultTime(convertTimeWithMoment(selectedQuestion?.endTime)) : createDefaultTime(duplicatePaperInfo?.data?.endTime);
    const defaultStartTime = selectedQuestion ? createDefaultTime(convertTimeWithMoment(selectedQuestion?.startTime)) : createDefaultTime(duplicatePaperInfo?.data?.startTime);

    const [initialValues, setInitialValues] = useState<any>({
        nameOfExamination: '',
        sectionId: [],
        assignDate: new Date(selectedQuestion ? convertDateWithMoment(selectedQuestion?.startDate) : duplicatePaperInfo?.data?.startDate),
        dueDate: new Date(selectedQuestion ? convertDateWithMoment(selectedQuestion?.endDate) : duplicatePaperInfo?.data?.endDate),
        dueTime: defaultDueTime,
        startTime: defaultStartTime
    })
    const [selStartDate, setSelStartDate] = useState<any>();
    const [selDueDate, setSelDueDate] = useState<any>();
    const [minDueTime, setMinDueTime] = useState(dayjs().startOf('day'));
    const [isToday, setIsToday] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isStartTimePassed, setIsStartTimePassed] = useState(false);
    const [isStartDatePassed, setIsStartDatePassed] = useState(false);
    const [isEndTimePassed, setIsEndTimePassed] = useState(false);
    const [isEndTimePassedText, setIsEndTimePassedText] = useState(false);
    const [isEndDatePassed, setIsEndDatePassed] = useState(false);

    const dispatch = useDispatch()
    const methods = useForm<any>({
        defaultValues: initialValues,
        mode: "onBlur",
        reValidateMode: "onChange"
    });


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
    const formatDate = (isoDate: any) => {
        const date = new Date(isoDate);

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
        const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
        return formattedDate;
    };

    const formatDate2 = (isoDate: any) => {
        const date = new Date(isoDate);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        return formattedDate.replace(/\//g, '-'); // Replace slashes with dashes
    };
    const changeHandler = async (e: any, data: string) => {
        switch (data as string) {
            case 'startTime':
                methods.reset({
                    ...methods?.getValues(),
                    startTime: e
                });
                setIsStartTimePassed(false)
                break;
            case 'dueTime':
                methods.reset({
                    ...methods?.getValues(),
                    dueTime: e
                });
                setIsEndTimePassed(false)
                break;
        }
    }

    function convertTo12HourFormat(time24: any) {
        const [hours24, minutes] = time24.split(':').map(Number);
        const ampm = hours24 >= 12 ? 'PM' : 'AM';
        const hours12 = hours24 % 12 || 12;
        const time12 = `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        return time12;
    }

    let postObj = {
        startDate: formatDate2(selStartDate),
        dueDate: formatDate2(selDueDate),
        questionPaperID: selectedQuestion?.id,
        startTime: formatTime(methods?.getValues('startTime')),
        dueTime: formatTime(methods?.getValues('dueTime'))
    }


    const qpMainData = selectedQuestion ? selectedQuestion : duplicatePaperInfo?.data

    const handleAssignClick = async () => {
        try {
            const qpID = selectedQuestion ? questionPaperID : duplicatePaperInfo?.paperId
            const body = {
                "questionPaperFontTemplate": qpMainData?.questionPaperFontTemplate,
                "generatedQuestionPaper": qpMainData?.generatedQuestionPaper,
                "generationModeID": qpMainData?.generationModeID,
                "academicYearID": qpMainData?.academicYearID,
                "name": qpMainData?.name,
                "gradeID": qpMainData?.gradeID,
                "templateID": qpMainData?.templateID,
                "questionPaperTypeID": qpMainData?.questionPaperTypeID,
                "examTypeID": qpMainData?.examTypeID,
                "totalMarks": qpMainData?.totalMarks,
                "courses": qpMainData?.courses,
                "sections": qpMainData?.sections,
                "themes": qpMainData?.themes,
                "chapters": qpMainData?.chapters,
                "topics": qpMainData?.topics,
                "statusID": qpMainData?.statusID,
                "totalTime": qpMainData?.totalTime,
                "statusName": qpMainData?.statusName,
                "printConfig": qpMainData?.printConfig,
                "isEdit": true,
                "startTime": postObj?.startTime != '' ? postObj?.startTime : isStartTimePassed ? postObj?.startTime : convertTo12HourFormat(qpMainData?.startTime),
                "endTime": postObj?.dueTime != '' ? postObj?.dueTime : isStartTimePassed ? postObj?.dueTime : convertTo12HourFormat(qpMainData?.endTime),
                "startDate": postObj?.startDate != 'Invalid Date' ? postObj?.startDate : isStartDatePassed ? postObj?.startDate : formatDate(selectedQuestion ? convertDateWithMoment(qpMainData?.startDate) : qpMainData?.startDate),
                "endDate": postObj?.dueDate != 'Invalid Date' ? postObj?.dueDate : isEndDatePassed ? postObj?.dueDate : formatDate(selectedQuestion ? convertDateWithMoment(qpMainData?.endDate) : qpMainData?.endDate),
            }
            const response = await DonePutApi(qpID, body)
            if (response?.result?.responseCode === 0 || response?.result?.responseDescription == "Success") {
                onClose()
            }
            else {
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: response?.response?.data?.responseDescription,
                }));
            }
        } catch (error) {

            console.error(error);
        }
    }


    useEffect(() => {
        const todayFormatted = formatDate2(new Date());
        const startDateFormatted = postObj?.startDate;

        if (startDateFormatted === todayFormatted) {
            setIsToday(true);
        } else {
            setIsToday(false);
        }

        if (formatDate2(selStartDate) > formatDate2(selDueDate)) {
            setError("The due date should not be greater than the start date.")

        } else {
            setError(null)
        }
    }, [postObj?.startDate, postObj?.dueDate]);

    useEffect(() => {
        if (dayjs(selStartDate).isSame(dayjs(selDueDate))) {
            const startTime = methods.getValues("startTime");
            if (startTime) {
                setMinDueTime(dayjs(startTime).add(selectedQuestion ? selectedQuestion?.totalTime : duplicatePaperInfo?.data?.totalTime, 'minute').startOf('minute'));
            }
        } else {
            setMinDueTime(dayjs().startOf('day'));
        }
    }, [selStartDate, selDueDate, methods.getValues("startTime")])
    useEffect(() => {
        const startTimeStr = selectedQuestion ? convertTimeWithMoment(selectedQuestion?.startTime) : duplicatePaperInfo?.data?.startTime
        if (startTimeStr) {
            const now = new Date();
            const [hours, minutes, seconds] = startTimeStr.split(':').map(Number);
            const apiTime = new Date(now.toDateString());
            apiTime.setHours(hours, minutes, seconds, 0);
            setIsStartTimePassed(now > apiTime);
            setIsToday(true)
        }

        const startDateStr = selectedQuestion ? convertDateWithMoment(selectedQuestion?.startDate) : duplicatePaperInfo?.data?.startDate
        if (startDateStr) {
            const startDate = new Date(startDateStr);
            const now = new Date();
            const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (nowOnly > startDateOnly) {
                setIsStartDatePassed(true);
            }
        }

        const endTimeStr = selectedQuestion ? convertTimeWithMoment(selectedQuestion?.endTime) : duplicatePaperInfo?.data?.endTime
        if (endTimeStr) {
            const now = new Date();
            const [hours, minutes, seconds] = endTimeStr.split(':').map(Number);
            const apiTime = new Date(now.toDateString());
            apiTime.setHours(hours, minutes, seconds, 0);
            setIsEndTimePassed(now > apiTime);
            setIsEndTimePassedText(now > apiTime)
        }

        const endDateStr = selectedQuestion ? convertDateWithMoment(selectedQuestion?.endDate) : duplicatePaperInfo?.data?.endDate
        if (endDateStr) {
            const endDate = new Date(endDateStr);
            const now = new Date();
            const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (nowOnly > endDateOnly) {
                setIsEndDatePassed(true);
            }
        }


    }, [])
    const minTime = isToday
        ? dayjs().add(10, 'minute') // Adds 10 minutes to current time
        : undefined;

    return (
        <FormProvider {...methods}>
            <Modal
                className="assignModalPopover"
                open={open} onClose={onClose}
            >
                <div className="assignModalPopoverBody">
                    <div className="assignModalPopoverBodyPadd">
                        <div className="closeDeleteIcon" onClick={onClose}>
                            <img src={closeIcon} style={{ width: "16px" }} />
                        </div>
                        <div className="text-center">
                            <Typography variant="h2" className="w-100 assignModalHead">
                                Enter New {isStartTimePassed ? 'Start Time' : 'Start Time'}{(isEndTimePassedText) ? ` and` : ''}{isEndTimePassedText ? ' End Time' : ''}
                            </Typography>
                        </div>

                        <div className="assignModalDesc text-center" >
                            Enter the new {isStartTimePassed ? 'Start Time' : 'Start Time'}{(isEndTimePassedText) ? ` and` : ''}{isEndTimePassedText ? ' End Time' : ''}. {isStartTimePassed ? 'Start Time' : 'Start Time'}{(isEndTimePassedText) ? ` and` : ''}{isEndTimePassedText ? ' End Time' : ''} already passed
                        </div>
                        <div className="assign-date-time-div">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Controller
                                    name="assignDate"
                                    control={methods.control}
                                    rules={{ required: true, }}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            className={isStartDatePassed ? "textfield-withBorder" :"textfield-withoutBorder"}

                                            label="Select Start Date*"
                                            inputFormat={"ddd D MMM, YYYY"}
                                            onChange={(newValue) => { field.onChange(newValue); setSelStartDate(newValue); setIsStartDatePassed(false) }}
                                            minDate={moment(new Date(), "YYYY-MM-DD")}
                                            maxDate={moment(stateDetails?.currentAcademic?.endDate, "YYYY-MM-DD")}
                                            renderInput={(params) => <TextField {...params} style={{ backgroundColor: "#f4f6f9", width: "252px" }} />}

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
                                        className={isStartTimePassed ? "textfield-withBorder" :"textfield-withoutBorder"}

                                        {...field}
                                        value={field.value || null}
                                        minTime={minTime}
                                        onChange={(newValue) => changeHandler(newValue, "startTime")}
                                        renderInput={(params) => (
                                            <TextField
                                                style={{ backgroundColor: "#f4f6f9", width: "252px"}}
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

                        <div className="due-date-time-div">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Controller
                                    name="dueDate"
                                    control={methods.control}
                                    defaultValue={null}
                                    rules={{ required: true, }}
                                    render={({ field }) => (
                                        <DatePicker
                                        className={isEndDatePassed ? "textfield-withBorder" :"textfield-withoutBorder"}

                                            {...field}
                                            label="Select Due Date *"
                                            inputFormat={"ddd D MMM, YYYY"}
                                            // disabled={!methods.getValues("assignDate")}
                                            minDate={moment(selStartDate?.$d, "YYYY-MM-DD")}
                                            maxDate={moment(stateDetails?.currentAcademic?.endDate, "YYYY-MM-DD")}
                                            renderInput={(params) => <TextField {...params} style={{ backgroundColor: "#f4f6f9", width: "252px" }} />}
                                            onChange={(newValue) => { field.onChange(newValue); setSelDueDate(newValue); setIsEndDatePassed(false) }}
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
                                        className={isEndTimePassed ? "textfield-withBorder" :"textfield-withoutBorder"}

                                            {...field}
                                            // disabled={!methods.getValues("startTime")}
                                            value={field.value || null}
                                            minTime={minDueTime}
                                            onChange={(newValue) => changeHandler(newValue, "dueTime")}
                                            renderInput={(params) => (
                                                <TextField
                                                    style={{ backgroundColor: "#f4f6f9", width: "252px"}}
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
                        <div className="assignModalActionBtn">
                            <ButtonComponent icon={""} image={""} textColor="#fff" backgroundColor="#01B58A"
                                disabled={
                                    isStartTimePassed || isEndDatePassed || isEndTimePassed || isStartDatePassed
                                }
                                buttonSize="Large" type="contained" onClick={handleAssignClick} label={"Assign"} minWidth="247" />
                            <ButtonComponent icon={""} image={""} textColor="#1B1C1E" backgroundColor={"#9A9A9A"} disabled={false} buttonSize="Large" type="outlined" onClick={onClose} label={"Cancel"} minWidth="247" />
                        </div>
                    </div>
                </div>
            </Modal>
        </FormProvider>
    );
};

export default NewAssignTimeModal;
