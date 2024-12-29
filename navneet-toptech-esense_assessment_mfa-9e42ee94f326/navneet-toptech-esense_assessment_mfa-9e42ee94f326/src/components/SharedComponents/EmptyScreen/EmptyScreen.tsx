import React, { FC, } from 'react'
import AssessEmptyImage from "../../../assets/images/assessEmptyImage.png";
import styles from "./EmptyScreen.module.css";
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { CSSProperties } from 'react';
import ButtonPopupComponent from '../ButtonPopupComponent/ButtonPopupComponent';

type Props = {
    emptyBtnTxt?: string;
    title: string,
    desc: string,
    onClickBtn?: () => void,
    btnDisable?:boolean,
    style?:CSSProperties,
    createButtonActionObj?:any,
    buttonPopupHandler?:any,
    emptyBtnTxtWithoutIcon?: any
    
}
const EmptyScreen: FC<Props> = ({ emptyBtnTxt, title, desc, style, onClickBtn, btnDisable, createButtonActionObj, buttonPopupHandler, emptyBtnTxtWithoutIcon }) => {
    // let history = useNavigate();
    const [anchorElCreatePopup, setAnchorElCreatePopup] = React.useState<HTMLButtonElement | null>(null);
    const handleButtonClick = (e:any) => {
        !createButtonActionObj && onClickBtn && onClickBtn();
        createButtonActionObj && setAnchorElCreatePopup(e.currentTarget)
    }

    return (
        <div className={`${styles.emptySectionScroll} emptyScreen`}  style={style}>
            <div className={styles.emptySection}>
                <img src={AssessEmptyImage} />
                <h2>{title}</h2>
                <h4>{desc}</h4>
                <div className='mt-3'>
                    <div className="position-relative">
                    {emptyBtnTxt && <ButtonComponent icon={<AddIcon />} image={""} textColor="" backgroundColor="#01B58A" disabled={btnDisable} buttonSize="Medium" type="contained" onClick={handleButtonClick} label={emptyBtnTxt} minWidth="" />}
                        {emptyBtnTxtWithoutIcon && <ButtonComponent image={""} textColor="" backgroundColor="#01B58A" disabled={btnDisable} buttonSize="Medium" type="contained" onClick={handleButtonClick} label={emptyBtnTxtWithoutIcon} minWidth="" />}
                    <ButtonPopupComponent btnPopObj={createButtonActionObj} anchorPoint={anchorElCreatePopup} setAnchorElCreatePopup={setAnchorElCreatePopup} clickHandler={(data: any) => { buttonPopupHandler(data,createButtonActionObj); }} onClose={() => { }} origin={true}/>
                    </div>
                </div>
                
            </div>
        </div>
        
    );
};

export default EmptyScreen;