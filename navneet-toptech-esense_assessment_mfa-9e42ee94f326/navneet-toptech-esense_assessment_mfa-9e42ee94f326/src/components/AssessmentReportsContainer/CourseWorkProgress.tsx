import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import courseWorkProgressImg from "../../assets/images/staticimages/courseWorkProgress.png"
import goBack from '../../assets/images/goBack.svg';


const CourseWorkProgress = () => {
    let navigate = useNavigate();
    let location = useLocation();
    const goBackFn = () =>{
        let data = {allocationGroupId:allocationGroupId};
        navigate("/assess/assessmentReports/showReports",{state:data});
    }    
    const allocationGroupId = location?.state?.allocationGroupId;
    return (
        <div className='courseWorkProgress'>
            <h4 className='cursorPointer' onClick={() => { goBackFn() }}><img src={goBack} />Go Back</h4>
            <img className='w-100' src={courseWorkProgressImg} />
        </div>
    );
};

export default CourseWorkProgress;