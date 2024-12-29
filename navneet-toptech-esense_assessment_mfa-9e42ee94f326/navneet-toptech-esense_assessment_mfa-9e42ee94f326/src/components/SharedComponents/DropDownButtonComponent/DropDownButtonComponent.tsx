import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useState } from 'react';
import "./DropDownButtonComponent.css"
interface Props {
    buttonName: string;
    minWidth: string;
    buttonOptions:any;
    onChangeHandler:(field: number)=>void;
    disabled?:boolean;
    validateQns?:()=>(any[])
    setValidatePopup?:(e:any)=>void
}

const DropDownButtonComponent: React.FC<Props> = ({ setValidatePopup,validateQns,buttonName, minWidth, buttonOptions,onChangeHandler,disabled}) => {
    const [open, setOpen] = useState(false);
    const anchorRef = React.useRef<any>(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    // const handleClick = () => {
    //     console.info(`You clicked ${buttonOptions[selectedIndex]}`);
    // };

    const handleMenuItemClick = (event: any, index: any) => {
        onChangeHandler(buttonOptions[index])
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        if(validateQns){
          const res =validateQns()
          if(res?.length == 0){
            setOpen((prevOpen) => !prevOpen);
            setValidatePopup && setValidatePopup(false)
          }else if(res?.length >0){
           setValidatePopup && setValidatePopup(true)
          }
        }else{
            setOpen((prevOpen) => !prevOpen);
        }
    };

    const handleClose = (event: any) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <ButtonGroup className='dropDownButtonComp' style={{minWidth: minWidth}} variant="contained" ref={anchorRef} aria-label="split button" disabled={disabled}>
                <Button>{buttonName}</Button>
                <Button
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                    <KeyboardArrowDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                sx={{
                    zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {buttonOptions?.map((option:any, index:any) => (
                                        <MenuItem
                                            key={option}
                                            disabled={disabled}
                                            selected={index === selectedIndex}
                                            onClick={(event) => handleMenuItemClick(event, index)}
                                        >
                                            {option?.label ?? option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
};

export default DropDownButtonComponent;