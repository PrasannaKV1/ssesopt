import React from 'react';
import  "./ButtonPopupComponent.css"
import auto from "../../../assets/images/Auto_generation.png"
import Popover from '@mui/material/Popover';

type props = {
    btnPopObj: any,
    anchorPoint:any,
    setAnchorElCreatePopup:any,
    clickHandler:any,
    onClose:()=> void,
    origin?:boolean
  }

const ButtonPopupComponent: React.FC<props> = ({ btnPopObj, anchorPoint,setAnchorElCreatePopup, clickHandler,origin }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(anchorPoint);
    const handleClose = () => {
    setAnchorEl(null);
    setAnchorElCreatePopup(null)
    };    
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    React.useEffect(() => {
    setAnchorEl(anchorPoint)
    }, [anchorPoint])
    return (
        <>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                className={`buttonPopupAction ${origin ? "buttonPopupActionEmpty":""}`}
                anchorOrigin={{
                    vertical: origin ? 'top' : 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: origin ? 'bottom' : 'top',
                    horizontal: 'left',
                  }}
                >
                <ul>
                    {btnPopObj?.map((btnList:any, index:number) => {
                        return(
                            <>
                            <li className={btnList.disable ? "disableWrapper":""} onClick={() => clickHandler(index)}>
                                <img src={btnList.icon}/> 
                                <div className="buttonPopupActionContent">
                                    <h4>{btnList.headerContent}</h4>
                                    <p>{btnList.desciption}</p>
                                </div>
                            </li>
                            </>
                        )
                    })}
                    
                </ul>
                </Popover>
            
        </>
    );
};

export default ButtonPopupComponent;