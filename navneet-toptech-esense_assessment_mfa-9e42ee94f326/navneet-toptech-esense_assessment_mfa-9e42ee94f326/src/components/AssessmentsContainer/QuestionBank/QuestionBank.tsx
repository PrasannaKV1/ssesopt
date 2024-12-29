import React, { useState,useEffect } from 'react';
import styles from "./Questionbank.module.css"
import QuestionTable from './QuestionTable/QuestionTable';
import InputFieldComponent from '../../SharedComponents/InputFieldComponent/InputFieldComponent';
import InformativeIconComponent from "../../SharedComponents/InformativeIconComponent/InformativeIconComponent";
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import SwitchComponent from '../../SharedComponents/SwitchComponent/SwitchComponent';
import AddIcon from '@mui/icons-material/Add';
import { Question } from '../../../interface/filters';
import { useNavigate } from 'react-router-dom';
import EmptyScreen from '../../SharedComponents/EmptyScreen/EmptyScreen';

interface Props{
    questionData:Question[],
    accessFilter:(e:any,type:string)=>void,
    getAllQuestionswithFilter?:any,
    setPageNumber?: any ;
    pageCount?:number;
    pageNumber?:any;
    toggle:boolean;
    qbListHistoryHandler?:()=>void;
    allFilters:any;
}

const QuestionBank :React.FC<Props>= ({qbListHistoryHandler,questionData,accessFilter,getAllQuestionswithFilter,setPageNumber,pageCount,pageNumber,toggle,allFilters}) => {
    let history = useNavigate();
    const tooltipText = "<b>Private</b>: Only you can see the private questions <br><b>Public</b>: Other subject teachers of the same subject can see public questions(They cannot be edited or deleted)"
    const [searchKey, setSearchKey] = useState("")
    const [checked, setChecked] = useState(false)

    const handleChange =(event:any)=>{
        setSearchKey(event.target.value);
        setPageNumber(1)
    }

    const handleButtonClick = () => {
        history("/assess/createnewquestion");
    }
    const handleSwitchChange = (switchStatus: any) => {
        accessFilter(switchStatus ? "true" : "false" ,"isPublic")
    }
    const getApiSearch = ()=>{
       if(searchKey.length>2 || searchKey.length===0){
        accessFilter(searchKey,"text")
       }
    }

    useEffect(() => {
        const timer = setTimeout(() => getApiSearch(), 500)
        return () => {
            clearTimeout(timer)
        }
    }, [searchKey])

    useEffect(()=>{
        setChecked(toggle)
    },[toggle])  

    const [key,setKey]=useState(Math.random())
    useEffect(()=>{
        if(localStorage.hasOwnProperty('qbList_history') ){
        const {
            text="",
            isPublic=false,
        }= JSON.parse(localStorage.getItem("qbList_history") || "{}")
        setChecked( isPublic === 'false' ? false :true)
        accessFilter(isPublic === 'false'  ?  "false" :"true","isPublic")
        setSearchKey(text)
        setKey(Math.random())     
    } 
    },[])
    return (
            <>    
                <div className={styles.questionBankHeadSect}>
                    <div>
                        <InputFieldComponent key={key} defaultval={searchKey} label={'Search Question Bank'} required={false} inputType={"text"} onChange={(e:any)=>{handleChange(e)}} inputSize={"Medium"} variant={"searchIcon"}/>
                    </div>
                    <div className={styles.questionBankHeadSectRIght}>
                        <div className='d-flex' style={{gap: "5px"}}>
                            <InformativeIconComponent color="#F6BC0C" label="" title={tooltipText} />
                            <SwitchComponent onChangeSwitch={handleSwitchChange}  checked={checked} disabled={false} beforeLabel={'Private'} afterLabel={'Public'} />
                        </div>                    
                        <div className='ms-3'>
                            <ButtonComponent icon={<AddIcon/>} image={""} textColor ="" backgroundColor="#01B58A" disabled={false} buttonSize="Medium" type="contained" onClick={handleButtonClick} label="Create New Question" minWidth="200" />
                        </div>

                    </div>
                </div>
                {questionData?.length > 0 ?
                    <QuestionTable qbListHistoryHandler={qbListHistoryHandler} questionData={questionData} searchKey={searchKey} getAllQuestionswithFilter={getAllQuestionswithFilter} setPageNumber={setPageNumber} pageCount={pageCount} pageNumber={pageNumber} accessFilter={accessFilter} allFilters={allFilters}/>
                    :
                    <div className='NodataFoundGrid'>No match found</div>
                } 
            </>
    );
};

export default QuestionBank;