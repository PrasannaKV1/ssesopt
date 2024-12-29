import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LiveProgressReportingImg from "../../assets/images/staticimages/liveProgressReporting.png"
import goBack from '../../assets/images/goBack.svg';

const LiveProgressReporting = () => {
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
            <img className='w-100' src={LiveProgressReportingImg} />
        </div>
    );
};

export default LiveProgressReporting;