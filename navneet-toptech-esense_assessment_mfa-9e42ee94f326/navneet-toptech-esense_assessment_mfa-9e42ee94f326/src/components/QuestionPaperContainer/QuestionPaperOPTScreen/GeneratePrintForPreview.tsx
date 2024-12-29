import * as React from 'react';
import Box from '@mui/material/Box';
import GenerateLoaderCircle from "../../../assets/images/generateLoaderCircle.png";
import Modal from '@mui/material/Modal';
import "./QuestionPaperAutoGenerate.css"

type props = {
    open: boolean,
    handleClose:  () => void,
    generateText:string
}

const GeneratePrintForPreview : React.FC<props> = ({open,handleClose,generateText}) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
   
    const handleSelectChange = (values: string[]) => {
        setSelectedValues(values);
    };
     const handlechange = () => {};
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className='generateLoaderSect'>
                    <div className='generateLoaderSectFlex'>
                        <img src={GenerateLoaderCircle} />
                        <p>{generateText}</p>
                    </div>
                        
                </div>
            </Modal>
        </>
    );

}
   


export default GeneratePrintForPreview;