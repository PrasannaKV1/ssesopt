import React, { useState } from 'react';
import { Modal, Typography } from '@mui/material';
import './ModalQuestion.css'
import CloseIcon from '@mui/icons-material/Close';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import InputFieldComponent from '../../SharedComponents/InputFieldComponent/InputFieldComponent';
interface ModalQuestionProps { }
type Props = {
    open: boolean
    onClose: () => void;
    title:string;
    subDescription:string;
    type:string;
    onDone:(data:any)=> void;
    totalLength?:any
}
const ModalQuestion: React.FC<Props> = ({ open, onClose,title, subDescription, type, onDone,totalLength   }) => {
    const [errorMessage,setErrorMessage]=useState(false)
    const [inputValue,setInputValue] = useState<string | number | null>(null);

    const handleInput=(e:any)=>{
        if(e.target.value > totalLength){
            setErrorMessage(true)
            return
        }
        setErrorMessage(false)
        setInputValue(Number(e.target.value))
    }
   
    return (
        <div style={{ width: "auto", height: "auto" }}>
            <Modal
                className="deleteModalPopover"
                open={open} onClose={onClose}
            >
                <div className='modalPopUpContainer'>
                    <div className='childContainer'>
                        <div>
                            <p className='random'>{title}</p>
                            <p className='EnterQuestion'>{subDescription}</p>
                        </div>
                        <div>
                            <CloseIcon onClick={onClose} style={{ marginBottom: "48px", cursor: "pointer" }} />
                        </div>
                    </div>
                    <div>
                        <InputFieldComponent label={'Enter Number*'} required={false} inputType={"tel"} onChange={handleInput} inputSize={"Medium"} variant={""} maxLength={2}/>
                            {errorMessage && <span style={{color:'red'}} >Please select a number in the range  of 1 to {totalLength}</span>}
                    </div>
                    <div className='printButton'>
                        <ButtonComponent type="contained" buttonSize="Medium" label="Done" onClick={() => !errorMessage && onDone(inputValue)}
                            textColor="#FFFFFF" minWidth="208" backgroundColor="#01B58A" disabled={!inputValue || errorMessage}
                        />
                        <ButtonComponent type="outlined" buttonSize="Medium" label="Cancel" onClick={onClose}
                            textColor="black" minWidth="208" backgroundColor="#01B58A"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ModalQuestion;
