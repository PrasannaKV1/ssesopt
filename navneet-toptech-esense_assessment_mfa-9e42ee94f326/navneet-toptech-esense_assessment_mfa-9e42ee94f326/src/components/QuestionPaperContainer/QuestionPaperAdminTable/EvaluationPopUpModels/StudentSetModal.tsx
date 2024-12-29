import "./StudentSetListModal.css";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Checkbox, Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Grid, InputLabel, Select, FormControl, MenuItem, SelectChangeEvent, IconButton, TextField, Alert } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import ButtonComponent from '../../../SharedComponents/ButtonComponent/ButtonComponent';
import AvtarSection from '../TemplateCreation/AvtarSection';
import { GredbookStudentList } from '../../../../interface/assesment-interface';
import { DOWNPOLYGON, UPPOLYGON } from "../Utils/EvaluationAssets";
import { assignEditSets, assignSets, getAllStudentListApi, getAllStudentListApi1, getStudentList } from '../../../../Api/QuestionTypePaper';
import { SnackbarEventActions } from "../../../../redux/actions/snackbarEvent";
import { useDispatch, useSelector } from "react-redux";
import { getLocalStorageDataBasedOnKey } from "@esense/wrapper";
import { State } from "../../../../types/assessment";
import { RootStore } from "../../../../redux/store";
import { qPaperStudentEventActions, qStudentListEventActions, updateQpDetails } from "../../../../redux/actions/assesmentQListEvent";
import MultiSelectComponentforFilters from "../../../SharedComponents/MultiSelectComponent/MultiSelectComponentNew";
import Spinner from "../../../SharedComponents/Spinner";
import Avatar from "@mui/material/Avatar";

interface Set {
    name: string;
    setId: any;
}

interface Store {
    questionPaperID: number;
    allocateSets: { setId: number; studentIDs: number[] }[];
}

interface StudentSetListModalPropsInterface {
    handleCloseModal: () => void;
    studentOfSet?: boolean;
    sections?: any
    selectedQuestion?: any
    sectionFilter: any
    isEditable?: any
}

const alertStyle = {
    backgroundColor: 'rgba(246, 188, 12, 0.1)', marginLeft: "10px", marginRight: "10px", borderRadius: "8px",
}

const defaultSets = [
    { setId: 0, name: 'All sets' }, // Default option
    // {setId : 1 , name : "Selecct Set "}
];

const StudentSetListModal = (props: StudentSetListModalPropsInterface) => {
    const { handleCloseModal, studentOfSet, sections, selectedQuestion, sectionFilter, isEditable } = props;
    const dispatch = useDispatch();
    const setMap = useSelector((state: RootStore) => state?.qMenuEvent?.setsmapped);
    const qPaperStudentList = useSelector((state: RootStore) => state?.qMenuEvent?.qPaperStudent);

    const [open, setOpen] = useState(true);
    const [selected, setSelected] = useState<number[]>([]); // Array of selected student indices
    const [selectAll, setSelectAll] = useState(false); // Whether all checkboxes are selected
    const [sortDetails, setSortDetails] = useState<any>({
        sortColName: 'firstName',
        sortColOrder: 'Asc',
    });
    const [students, setStudents] = useState<any[]>([]);
    const [backUpList, setBackUpList] = useState<any[]>([]);
    const [searchStudentQuery, setSearchStudentQuery] = useState<string | undefined>();
    const [searchTimeout, setSearchTimeout] = useState<number | null | any>(null);
    const [selectedSection, setSelectedSection] = useState<string>('0');
    const [sectionType, setSectionType] = useState<any[]>([]);
    const [selectedSet, setSelectedSet] = useState('All sets'); // State for selected set
    const initialSelectedSet = Object.keys(setMap).map(key => setMap[key] ? key : 'NA').join(',');
    const [sets, setSets] = useState<Set[]>([]);
    const [filtedSets, setFiltedSets] = useState(defaultSets || []);
    const [individualSets, setIndividualSets] = useState(Array(students.length).fill(''));
    const [payload, setPayload] = useState<any[]>([]); // State variable to hold the payload
    const [store, setStore] = useState<Store>({
        questionPaperID: 0,
        allocateSets: []
    });

    const [allFilters, setAllFilters] = useState({
        isSetsAllocations: ""
    });
    const [isDoneEnable, setIsDoneEnable] = useState<boolean>(false);
    const [isSaveEnable, setIsSaveEnable] = useState<boolean>(false);
    const [isMultiselectDropDown, setIsMultiselectDropDown] = useState<boolean>(false);
    const [setsOptions, setSetsOptions] = useState<Set[]>([]);
    const [publishedStudent, setPublishedStudent] = useState<any[]>([])
    const [spinnerStatus, setSpinnerStatus] = useState(false);

    const stateDetails = JSON.parse(
        getLocalStorageDataBasedOnKey("state") as string
    ) as State;
    // Handle checkbox change for selecting/deselecting all students
    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        setSelectAll(checked);
        setSelected(checked ? fetchFilteredStudent.map((i: any) => i.studentId) : []);
    };

    // Handle individual checkbox change
    const handleIndividualCheckboxChange = (index: number, studentId: number) => {
        const newSelected = selected.includes(studentId)
            ? selected.filter(i => i !== studentId)
            : [...selected, studentId];
        setSelected(newSelected);
        setSelectAll(newSelected.length === students.length);
    };

    const handleSetChange = (event: any) => {
        setSelectedSet(event.target.value); // Update selected set when changed
    };

    const handleIndividualSetChange = (studentId: number, event: any, setId: number | string | undefined) => {
        const newSet = event.target.value as string;
        let currentSetId: number | undefined;

        // Find the currentSetId based on the newSet value
        sets.forEach((item) => {
            if (item.name === newSet) {
                currentSetId = item.setId;
            }
        });

        // Set setId to undefined if currentSetId is 1
        if (currentSetId === 1) {
            currentSetId = undefined;
        }

        // Update students state
        const updatedStudents = students.map((item) =>
            item.studentId === studentId ? { ...item, setId: currentSetId } : item
        );
        setStudents(updatedStudents);

        if (!isEditable) {
            // Non-editable mode: Update store.allocateSets
            if (currentSetId !== undefined) {
                // Check if studentId already exists in any existing set
                let movedStudentIds: number[] = [];

                const updatedAllocateSets = store.allocateSets.map((set) => {
                    if (set.studentIDs.includes(studentId)) {
                        movedStudentIds = [...movedStudentIds, studentId];
                        return {
                            ...set,
                            studentIDs: set.studentIDs.filter((id) => id !== studentId)
                        };
                    }
                    return set;
                });

                // Add new allocate set or update existing set
                const existingSetIndex = updatedAllocateSets.findIndex((set) => set.setId === currentSetId);

                if (existingSetIndex !== -1) {
                    const existingStudentIds = new Set(updatedAllocateSets[existingSetIndex].studentIDs);
                    existingStudentIds.add(studentId);
                    updatedAllocateSets[existingSetIndex] = {
                        ...updatedAllocateSets[existingSetIndex],
                        studentIDs: Array.from(existingStudentIds)
                    };
                } else {
                    updatedAllocateSets.push({
                        setId: currentSetId,
                        studentIDs: [studentId]
                    });
                }

                // Update store with updated allocateSets
                setStore({
                    ...store,
                    questionPaperID: selectedQuestion?.id,
                    allocateSets: updatedAllocateSets.filter((set) => set.studentIDs.length > 0) // Filter out empty sets
                });
            }
        } else {
            // Editable mode: Update payload
            if (!isSaveEnable) {
                setIsSaveEnable(true);
            }

            if (setId !== undefined) {
                // Remove studentId from other sets in payload
                const updatedPayload = payload.map((item) => ({
                    ...item,
                    studentIds: item.studentIds.filter((id: number) => id !== studentId)
                }));

                // Find index of existing payload entry or add new entry
                const payloadIndex = updatedPayload.findIndex((item) => item.questionPaperSetId === currentSetId);
                if (payloadIndex !== -1) {
                    const existingStudentIds = new Set(updatedPayload[payloadIndex].studentIds);
                    existingStudentIds.add(studentId);
                    updatedPayload[payloadIndex] = {
                        ...updatedPayload[payloadIndex],
                        studentIds: Array.from(existingStudentIds)
                    };
                } else {
                    updatedPayload.push({
                        questionPaperId: selectedQuestion?.id,
                        questionPaperSetId: currentSetId!,
                        studentIds: [studentId]
                    });
                }

                // Update payload state
                setPayload(updatedPayload);
            }
        }
    };

    // Function to toggle sorting of table columns
    const sortToggle = (colName: any) => {
        const sortColOrder = sortDetails.sortColOrder === 'Asc' ? 'Desc' : 'Asc';
        const sortedStudents = [...students].sort((a, b) => {
            if (colName === 'rollNumber') {
                const rollNumberA = parseInt(a[colName], 10);
                const rollNumberB = parseInt(b[colName], 10);
                return sortColOrder === 'Asc' ? rollNumberA - rollNumberB : rollNumberB - rollNumberA;
            } else if (colName === 'firstName') {
                return sortColOrder === 'Asc' ? a[colName].localeCompare(b[colName]) : b[colName].localeCompare(a[colName]);
            } else {
                if (a[colName] < b[colName]) return sortColOrder === 'Asc' ? -1 : 1;
                if (a[colName] > b[colName]) return sortColOrder === 'Asc' ? 1 : -1;
                return 0;
            }
        });
        setSortDetails({ sortColName: colName, sortColOrder });
        setStudents(sortedStudents);
    };

    const handleStudentSearch = (event: any) => {
        handleStudentNameSearch(event?.target?.value);
    };

    // Function to get class name for sorting indicator
    const getClassName = (key: keyof GredbookStudentList) => {
        return key === sortDetails.sortColName ? (sortDetails.sortColOrder === 'Asc' ? 'activeUpArrow' : 'activeDownArrow') : '';
    };

    // Function to handle student name and roll number search
    const handleStudentNameSearch = useCallback((value: string) => {
        clearTimeout(searchTimeout); // Clear the previous timeout
        const timeout = setTimeout(() => {
            setSearchStudentQuery(value); // Update search query after the delay
        }, 300); // 300 milliseconds delay
        setSearchTimeout(timeout); // Save the new timeout
    }, [searchStudentQuery]);

    const fetchFilteredStudent = useMemo(() => {
        let result = [...students]; // Create a copy to avoid mutating the original array

        // Filter by selected set
        const setDetails = filtedSets.find((item) => item?.name === selectedSet);

        if (setDetails && setDetails?.setId !== 0) {
            const { setId } = setDetails;
            result = result.filter((student) => student?.setId == setId);
        }

        // Filter by selected section
        if (selectedSection !== '0') {
            result = result.filter((student) => student?.classId == selectedSection);
        }

        // Filter by search query
        if (searchStudentQuery) {
            const query = searchStudentQuery.toLowerCase();
            result = result.filter((student) => (
                student?.firstName?.toLowerCase().includes(query) ||
                student?.rollNumber?.toString().startsWith(query)
            ));
        }

        return result;
    }, [searchStudentQuery, selectedSection, students, selectedSet]);

    const handleSectionChange = (event: any) => {
        const section = event?.target?.value;
        if (section) {
            setSelectedSection(section);
        }
    }

    const setNameToId: { [key: string]: number } = {};

    selectedQuestion?.questionPaperSetsInfo.forEach((set: any) => {
        const setNameMatch = set.name.match(/\(Set (\d+)\)/);
        if (setNameMatch && setNameMatch[1]) {
            const setName = `Set ${setNameMatch[1]}`;
            setNameToId[setName] = set.id;
        }
    });

    const fetchStudentList = async (item: any) => {
        try {
            const gradeIds = item.gradeID ? [item.gradeID] : [];
            const courseIds = item?.questionPaperCourseDetails.map((course: { courseID: any; }) => course.courseID) || [];
            const sectionIds = item?.questionPaperClassDetails.map((section: { classId: any; }) => section.classId) || [];
            const extractSetNumber = (name: string): number | null => {
                const match = name.match(/\(Set (\d+)\)/);
                return match ? parseInt(match[1], 10) : null;
            };

            const setIds = item?.questionPaperSetsInfo ? item.questionPaperSetsInfo.map((item: any) => ({
                id: item?.id,
                setName: item?.name,
                setNumber: extractSetNumber(item?.name)
            })).filter((item: any) => item?.setNumber !== null) : [];
            const setNum = setIds?.map((item: any) => item?.setNumber)
            const setIds2 = item?.questionPaperSetsInfo ? item.questionPaperSetsInfo.map((set: { id: any; }) => set.id) : [];

            const qpId = item?.id;
            const qpTypeId = item?.questionPaperTypeID
            const apiPayload = {
                "staffId": stateDetails.login.userData.userRefId || 1,
                "courseId": courseIds || [],
                "sectionId": sectionIds || [],
                "gradeId": gradeIds || [],
                "qpId": qpId,
                "qpTypeId": qpTypeId,
                "isStudentCourse": true,
                "setId": setIds2 || ""
            };

            // const res = await getAllStudentListApi(apiPayload);
            const response = await getAllStudentListApi1(apiPayload);

            if (response?.result?.responseDescription === "Success" && !response?.data) {
                dispatch(qStudentListEventActions([]));
                dispatch(qPaperStudentEventActions({ qId: qpId, data: [] }));
                dispatch(updateQpDetails({ qpParer: qpId, key: "isSetsAllocated", updatePayload: true }));
                dispatch(updateQpDetails({ qpParer: selectedQuestion?.id, key: "isSetsAllocated", updatePayload: true }));

            }
            if (response?.result?.responseDescription === "Success" && response?.data) {
                const sortedData = response?.data?.sort((a: any, b: any) => {
                    const rollNumberA = parseInt(a?.rollNumber, 10);
                    const rollNumberB = parseInt(b?.rollNumber, 10);
                    // Use numeric comparison
                    return rollNumberA - rollNumberB;
                });

                // dispatch(sectionFilterEventActions({ section: sortedData?.[0]?.sectionId }))
                dispatch(qStudentListEventActions(sortedData));
                dispatch(qPaperStudentEventActions({ qId: qpId, data: sortedData }));
                dispatch(updateQpDetails({ qpParer: qpId, key: "isSetsAllocated", updatePayload: true }));
                dispatch(updateQpDetails({ qpParer: selectedQuestion?.id, key: "isSetsAllocated", updatePayload: true }));
            }
        } catch (error) {
            console.error(error);
        }
    };
    let controller = new AbortController();
    const setInfoMap = selectedQuestion?.questionPaperSetsInfo.reduce((map: any, set: any) => {
        map[set.id] = set.setSequenceID;
        return map;
    }, {});

    const entries = payload.map(item => {
        const setSequenceID = setInfoMap[item.questionPaperSetId];
        const studentCount = item.studentIds.length;
        return { setSequenceID, studentCount };
    });
    entries.sort((a, b) => a.setSequenceID - b.setSequenceID);

    const messageParts = entries.map(entry => `Set${entry.setSequenceID} - ${entry.studentCount}`);
    const snackbarMessage = `${messageParts.join(', ')} Students have been assigned successfully`;
    const updateSetDetails = async () => {
        setSpinnerStatus(true);
        try {
            if (controller) {
                controller.abort();
            }
            controller = new AbortController();
            const signal = controller.signal;
            let response;
            if (isEditable) {
                // Assuming assignEditSets returns a promise resolving to an object with a `result` property
                response = await assignEditSets(payload, signal);
            } else {
                if (store?.questionPaperID !== 0) {
                    // Assuming assignSets returns a promise resolving to an object with a `result` property
                    response = await assignSets(store, signal);
                }
            }

            // Check if response has result and result.responseDescription is "Success"
            if (response?.result?.responseDescription === "Success") {
                // Update student list based on isEditable flag
                if (selectedQuestion) {
                    await fetchStudentList(selectedQuestion);
                }

                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "success",
                    snackbarMessage: `${snackbarMessage}\n`,
                }));

                handleCloseModal();
                setPayload([]);
                setStore({
                    questionPaperID: 0,
                    allocateSets: []
                });
                setIsDoneEnable(false);
                setIsSaveEnable(false);
            } else {
                // If response.result.responseDescription is not "Success"
                let errorMessage = response?.response?.data?.responseDescription || "Failed to assign sets.";
                dispatch(SnackbarEventActions({
                    snackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: errorMessage,
                }));
            }
        } catch (error) {
            console.error(error);
            dispatch(SnackbarEventActions({
                snackbarOpen: true,
                snackbarType: "error",
                snackbarMessage: "Error while updating sets.",
            }));
        }
        setSpinnerStatus(false);
    }

    const handeAssignsetToAll = (data: number[], filter: string) => {
        let updatedStudentList = selected;
        updatedStudentList = updatedStudentList.filter(item => !publishedStudent.includes(item));
        switch (filter) {
            case 'updateAllSet':
                let currentSetId = data.length ? data[0] : undefined;
                let setsFilter: string = '';
                data.forEach((ele: number) => {
                    setsFilter += `${ele},`;
                });

                setAllFilters((prev: any) => {
                    const updatedFilters = { isSetsAllocations: setsFilter.slice(0, -1) };
                    return updatedFilters;
                });

                // TODO : for the initial assign the Students
                if (store.allocateSets.length && currentSetId !== undefined && !isEditable) {
                    const setIdString = typeof currentSetId === 'number' ? currentSetId.toString() : currentSetId;
                    let updatedAllocateSets: any = [...store.allocateSets];

                    // Iterate through each selected studentId
                    updatedStudentList.forEach((studentId: number) => {
                        // Find the index of the set containing currentSetId
                        const existingSetIndex = updatedAllocateSets.findIndex((set: any) => set.setId === setIdString);

                        if (existingSetIndex !== -1) {
                            // Check if studentId already exists in the existing set
                            if (!updatedAllocateSets[existingSetIndex].studentIDs.includes(studentId)) {
                                // Add the studentId to the existing set
                                updatedAllocateSets[existingSetIndex].studentIDs.push(studentId);
                            }
                        } else {
                            // Create a new allocate set with studentId
                            updatedAllocateSets.push({
                                setId: setIdString,
                                studentIDs: [studentId]
                            });
                        }

                        // Remove the studentId from other sets if it exists
                        updatedAllocateSets = updatedAllocateSets.map((set: any) => {
                            if (set.setId !== setIdString && set.studentIDs.includes(studentId)) {
                                return {
                                    ...set,
                                    studentIDs: set.studentIDs.filter((id: number) => id !== studentId)
                                };
                            }
                            return set;
                        });
                    });

                    // Remove duplicates from studentIDs and filter out empty sets
                    updatedAllocateSets = updatedAllocateSets.map((set: any) => ({
                        ...set,
                        studentIDs: Array.from(new Set(set.studentIDs)) // Use Set to ensure unique studentIDs
                    })).filter((set: any) => set.studentIDs.length > 0);

                    // Update store with updated allocateSets
                    setStore({
                        ...store,
                        questionPaperID: selectedQuestion?.id,
                        allocateSets: updatedAllocateSets
                    });
                }

                // TODO : for edit students 
                if (isEditable && currentSetId !== undefined) {
                    const setIdString = typeof currentSetId === 'number' ? currentSetId.toString() : currentSetId;
                    let updatedAllocateSets: any = payload;
                    let foundMatchingSet = false;

                    updatedAllocateSets.forEach((items: any) => {
                        if (items && items.questionPaperSetId === currentSetId) {
                            // Update items.studentIds when questionPaperSetId matches currentSetId
                            let concatedArray = [...items.studentIds, ...updatedStudentList];
                            items.studentIds = [...new Set(concatedArray)];
                            foundMatchingSet = true;
                        } else if (items && items.questionPaperSetId !== currentSetId) {
                            // Filter out selected from items.studentIds when questionPaperSetId does not match currentSetId
                            items.studentIds = items.studentIds.filter((id: any) => !updatedStudentList.includes(id));
                        }
                    });

                    // If no matching item was found, create a new object and push it
                    if (!foundMatchingSet) {
                        // Check if any item already exists with the same questionPaperSetId
                        const existingItemIndex = updatedAllocateSets.findIndex((item: any) => item.questionPaperSetId === currentSetId);

                        if (existingItemIndex !== -1) {
                            // Update existing item if found
                            let existingItem = updatedAllocateSets[existingItemIndex];
                            let concatedArray = [...existingItem.studentIds, ...updatedStudentList];
                            existingItem.studentIds = [...new Set(concatedArray)];
                        } else {
                            // Otherwise, push a new object
                            updatedAllocateSets.push({
                                questionPaperId: selectedQuestion?.id,
                                questionPaperSetId: currentSetId!,
                                studentIds: [...updatedStudentList]
                            });
                        }
                    }

                    if (updatedAllocateSets && updatedAllocateSets.length > 0) {
                        setPayload(updatedAllocateSets);
                    }
                }

                if (isEditable && !isSaveEnable) {
                    setIsSaveEnable(true);
                }
                break;
        }
    };

    // Fetch student list from API on component mount
    useEffect(() => {
        const fetchStudentListApi = async () => {
            try {
                const gradeIds = selectedQuestion.gradeID ? [selectedQuestion.gradeID] : [];
                const courseIds = selectedQuestion?.questionPaperCourseDetails.map((course: { courseID: any; }) => course.courseID) || [];
                const sectionIds = selectedQuestion?.questionPaperClassDetails.map((section: { classId: any; }) => section.classId) || [];
                const qpId = selectedQuestion?.id;
                const qpTypeId = selectedQuestion?.questionPaperTypeID

                const extractSetNumber = (name: string): number | null => {
                    const match = name.match(/\(Set (\d+)\)/);
                    return match ? parseInt(match[1], 10) : null;
                };
                const setIds2 = selectedQuestion?.questionPaperSetsInfo ? selectedQuestion.questionPaperSetsInfo.map((set: { id: any; }) => set.id) : [];
                const setIds = selectedQuestion?.questionPaperSetsInfo ? selectedQuestion.questionPaperSetsInfo.map((item: any) => ({
                    id: item?.id,
                    setName: item?.name,
                    setNumber: extractSetNumber(item?.name)
                })).filter((item: any) => item?.setNumber !== null) : [];
                const setNum = setIds?.map((item: any) => item?.setNumber)
                let response;

                if (isEditable) {
                    const apiPayload1 = {
                        "qpId": qpId,
                        "setId": setIds2 || ""
                    };
                    response = await getAllStudentListApi1(apiPayload1);
                    const filteredPublishList = response?.data?.filter((item: any) => item.status === "Publish").map((item: any) => item?.studentId)
                    setPublishedStudent(filteredPublishList)
                } else {
                    const apiPayload2 = {
                        "staffId": stateDetails.login.userData.userRefId || 1,
                        "courseId": courseIds || [],
                        "sectionId": sectionIds || [],
                        "gradeId": gradeIds || [],
                        "qpId": qpId,
                        "qpTypeId": qpTypeId,
                        "isStudentCourse": true,
                    };
                    response = await getAllStudentListApi(apiPayload2);
                }

                if (response?.data) {
                    const filteredData = selectedSection
                        ? response.data.filter((student: any) => student?.sectionId == selectedSection)
                        : response.data;

                    setStudents(response?.data || []);
                    setBackUpList(response?.data || []);
                }
            } catch (error) {
                console.error("Error fetching student list:", error);
            }
        };

        fetchStudentListApi();
    }, []);

    useEffect(() => {
        const payload = selectedQuestion?.questionPaperSetsInfo || [];

        // Map through payload and extract name and setId
        const updatedSets = payload.map((item: any, index: number) => {
            const setName = item.name.replace(/ \(.*\)$/, ''); // Remove "(...)" part from name
            const setId = item?.id;
            return { name: `Set ${item?.setSequenceID}`, setId: setId || null };
        });
        const defaultSetForSets = { setId: "1", name: "Select Sets" };
        const finalSets = [defaultSetForSets, ...updatedSets];

        // Add default set at the beginning for setFiltedSets
        const defaultSetForFiltered = { setId: 0, name: 'All sets' };

        setSets(finalSets);
        setFiltedSets([defaultSetForFiltered, ...updatedSets]);
    }, []);

    useEffect(() => {
        if (selectedSet) {
            setIndividualSets(students.reduce((acc, student) => {
                acc[student.studentId] = selectedSet;
                return acc;
            }, {}));
        }
    }, [selectedSet, students]);

    useEffect(() => {
        if (selectedQuestion && selectedQuestion?.questionPaperClassDetails) {
            //const sectionDetails = selectedQuestion?.questionPaperSectionDetails || [];
            const classDetails = selectedQuestion?.questionPaperClassDetails?.map((el: any) => {
                return {
                    sectionID: el?.classId,
                    sectionName: el?.className
                }
            }) || [];
            // Add default section at the beginning
            const defaultSection = {
                sectionID: 0,
                sectionName: "All"
            };
            setSectionType([defaultSection, ...classDetails]);
        } else {
            // If no selectedQuestion or no section details, still set the default section
            setSectionType([{
                sectionID: 0,
                sectionName: "All"
            }]);
        }
    }, [selectedQuestion]);

    useEffect(() => {
        if (allFilters?.isSetsAllocations !== "") {
            let updatedStudentList = selected;
            updatedStudentList = updatedStudentList?.filter(item => !publishedStudent?.includes(item));
            const updatedStudents = students.map((student) => {
                if (updatedStudentList?.includes(student?.studentId)) {
                    return {
                        ...student,
                        setId: allFilters?.isSetsAllocations // Assuming allFilters?.isSetsAllocations is of type number
                    };
                }
                return student;
            });

            setStudents(updatedStudents);

            const existingSetIndex = store.allocateSets.findIndex((set: any) => set.setId === allFilters?.isSetsAllocations);

            if (existingSetIndex === -1) {
                const newAllocateSet = {
                    setId: allFilters?.isSetsAllocations as unknown as number,
                    studentIDs: [...selected]
                };

                setStore({
                    ...store,
                    questionPaperID: selectedQuestion?.id,
                    allocateSets: [...store.allocateSets, newAllocateSet]
                });
            }
            setAllFilters({ ...allFilters, isSetsAllocations: "" });
            setIsMultiselectDropDown(false);
            setSelected([]);
            setSelectAll(false);
        }
    }, [allFilters]);

    /**
     *  This is for done button enable / or desable 
     */
    useEffect(() => {
        if (!isEditable && students && students.length > 0) {
            const allIdsNotNull = students.every(student => student.setId !== undefined && student.setId !== null);
            setIsDoneEnable(allIdsNotNull);
        }
    }, [students, isEditable]);

    useEffect(() => {
        if (selectAll) {
            setIsMultiselectDropDown(false);
        }

        if (!selectAll && selected && selected.length === 0) {
            setIsMultiselectDropDown(false);
        }

        if (selectAll) {
            setIsMultiselectDropDown(true);
        }

        if (!selectAll && selected && selected.length > 0) {
            setIsMultiselectDropDown(true);
        }
    }, [selectAll, selected])

    useEffect(() => {
        if (selected.length) {
            setSelectAll(false)
            setSelected([])
            setSelectedSet(selectedSet)
        }
    }, [selectedSection, selectedSet])

    useEffect(() => {
        if (sets && sets.length > 1) {
            let optionsOfSets = sets;
            optionsOfSets = optionsOfSets.filter(setValue => setValue?.setId != "1");
            setSetsOptions(optionsOfSets);
        }
    }, [sets])

    return (
        <React.Fragment>
            {spinnerStatus && <Spinner />}
            <Modal
                open={open}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="student-set-container qpCustomFontPopup assement-q-modal">
                    <div className='student-set-main-div'>
                        <div className='set-header-div'>
                            <div className='header-left-side'>
                                Student List
                                <span className='header-span' style={{color:"#9A9A9A"}}>
                                    Select students to assign sets
                                </span>
                            </div>
                            <div className='header-right-side'>
                                <p className='m-0 close-icon' onClick={handleCloseModal}><ClearIcon /></p>
                            </div>
                        </div>
                        {/* <div style={{ display: "flex" }}> */}
                        <Grid container xs={12} spacing={2} pt={2} pb={2} pr={2} ml={0} mr={0} width="100%" className="bg-color-white">
                            <Grid item xs={4} style={{ paddingTop: '8px', }} className="evaluate_searchField">
                                <TextField id="search-for-student"
                                    name="SearchForStudent"
                                    variant="outlined"
                                    sx={{ width: "100%" }}
                                    onChange={handleStudentSearch}
                                    placeholder="Search for Student"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <SearchIcon />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4} style={{ paddingTop: '8px', }} className="evaluate_searchField">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-autowidth-label">Section</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="sectionID"
                                        value={selectedSection}
                                        onChange={handleSectionChange}
                                        label="Section"
                                        disabled={false}
                                        fullWidth
                                        MenuProps={{className:"SectionMenuForStdList"}}
                                    >
                                        {sectionType && sectionType?.map((section) => (
                                            <MenuItem key={section?.sectionID} value={String(section?.sectionID)}>
                                                {String(section?.sectionID) === '0' ? section?.sectionName : `${section?.sectionName}`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4} style={{ paddingTop: '8px', }} className="evaluate_searchField">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-autowidth-label">Set</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="sectionID"
                                        value={selectedSet}
                                        onChange={handleSetChange}
                                        label="Set"
                                        fullWidth
                                        MenuProps={{className:"SectionMenuForStdList"}}
                                    >
                                        {filtedSets?.length && filtedSets.map((set) => (
                                            <MenuItem key={set.setId} value={set.name} >
                                                {set.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {/* </div> */}

                        <div className='set-main-inner-div'>
                            {/* Alert Message */}
                            {isEditable && <Alert variant="outlined" sx={alertStyle} className="alert-div" severity="warning">
                                Updating the student set will delete the entered marks. Please click "save" and re-upload the marks.
                            </Alert>}
                            <TableContainer sx={{ height: "calc(100vh - 386px)", overflowY: "auto", maxHeight: "386px" }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <Checkbox checked={selectAll} disabled={fetchFilteredStudent.length === 0} onChange={handleCheckBoxChange} />
                                            </TableCell>
                                            <TableCell style={{ cursor: 'pointer' }}>
                                                <div className='tableHeadArrowSect' style={{color:"#9A9A9A"}}>
                                                    <span
                                                        className={`resrTableSortArrow questionPaperArrow ${getClassName('firstName')}`}
                                                        onClick={() => sortToggle('firstName')}
                                                    >
                                                        STUDENTS
                                                        <div>
                                                            <img width='10px' alt='' src={UPPOLYGON} />
                                                            <img width='10px' alt='' src={DOWNPOLYGON} />
                                                        </div>
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell style={{ cursor: 'pointer' }}>
                                                <div className='tableHeadArrowSect' style={{color:"#9A9A9A"}}>
                                                    <span
                                                        className={`resrTableSortArrow questionPaperArrow ${getClassName('rollNumber')}`}
                                                        onClick={() => sortToggle('rollNumber')}
                                                    >
                                                        ROLL NO
                                                        <div>
                                                            <img width='10px' alt='' src={UPPOLYGON} />
                                                            <img width='10px' alt='' src={DOWNPOLYGON} />
                                                        </div>
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell style={{ cursor: 'pointer', textAlign: "center", width: "20%" }}>
                                                <div style={{color:"#9A9A9A"}}>
                                                    <span>ASSIGN SET</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody sx={{ background: "#fff" }}>
                                        {fetchFilteredStudent.length > 0 ? (
                                            fetchFilteredStudent.map((student, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selected.includes(student.studentId)}
                                                            disabled={publishedStudent?.includes(student.studentId)}
                                                            onChange={() => handleIndividualCheckboxChange(index, student.studentId)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="table-name-avatars">
                                                            <Avatar src={isEditable ? student.studentProfileImg : student?.photo} />
                                                            {/* <AvtarSection
                                                                firstName={student?.firstName}
                                                                lastName={student?.lastName}
                                                                profile={isEditable ? student.studentProfileImg : student?.photo}
                                                            /> */}
                                                            <div className="table-name-avatars-title">
                                                                <div>{`${student?.firstName} ${student?.lastName || ''}`}</div>
                                                                {student?.className}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{student?.rollNumber}</TableCell>
                                                    <TableCell style={{ textAlign: "center" }}>
                                                        <Select
                                                            value={setMap[student?.setId] || "Select Sets"}
                                                            onChange={(event) => handleIndividualSetChange(student.studentId, event, student.setId)}
                                                            fullWidth
                                                            disabled={selected.includes(student.studentId) || publishedStudent?.includes(student.studentId)}
                                                            MenuProps={{className:"SectionMenuForStdList"}}
                                                        >
                                                            {sets.map((set) => (
                                                                <MenuItem key={set.setId} disabled={set.setId == "1"} value={set.name}>
                                                                    {set.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} style={{ textAlign: 'center' }}>No match found!</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                    <div className='set-footer-div'>
                        {!isMultiselectDropDown && (
                            <div style={{ fontWeight: "700", display: "flex", alignItems: "center" }}>
                                {fetchFilteredStudent.filter(student => student.setId === undefined).length} Students unassigned
                            </div>
                        )}
                        {!isMultiselectDropDown && <div style={{ display: "flex", gap: "24px" }}>
                            <ButtonComponent icon={''} image={""} textColor="#1B1C1E" backgroundColor="#01B58A" disabled={false} buttonSize="Medium" type="outlined" label="Cancel" minWidth="150" onClick={handleCloseModal} />
                            <ButtonComponent icon={''} image={""} textColor="#FFFFFF" backgroundColor=" #01B58A" disabled={isEditable ? !isSaveEnable : !isDoneEnable || spinnerStatus} buttonSize="Medium" type="contained" label={isEditable ? "Save" : "Done"} minWidth="150" onClick={updateSetDetails} />
                        </div>}
                        {/* TODO this is Drop Down for selection */}
                        {isMultiselectDropDown && <React.Fragment><div className="dummy-class"></div><div className='selQuesPaperFilter'>
                            <MultiSelectComponentforFilters
                                lsName={''}
                                options={setsOptions}
                                onChange={(e: any) => {
                                    handeAssignsetToAll(e, 'updateAllSet');
                                }}
                                disable={false}
                                multiType={'Multi1'}
                                addableFiled='Assign set to selected students'
                                showableField='name'
                                selectableField='setId'
                                values={allFilters.isSetsAllocations}
                                isFirstDisable={true}
                            />
                        </div>
                        </React.Fragment>}
                    </div>

                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default StudentSetListModal;