import * as React from 'react'
import { styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import { FormControl, Grid, TextField } from '@mui/material';
import { AccordionFilter, ButtonFilter, MenuTypographyDivider, MenuWithDiver } from './style';
import { ReactComponent as FilterSelectDown } from "../../../src/assets/images/FilterSelectDown.svg";
import "./pointerFilter.css"

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        style={{ border: '1px solid black' }}
        elevation={1}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        minWidth: 180,
        boxShadow: '0px 3px 16px rgba(0, 0, 0, 0.12)',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            fontWeight: '400',
            fontSize: '14px',
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                marginRight: theme.spacing(1.5),
                paddingLeft: '10px',
            },
        },
        '& .MuiList-root': {
            maxHeight: '400px',
        },
    },
}));

type Props = {
    getQueryPoints: (param: string, type: string) => void;
    disable:boolean,
    preSetVal?:any,
    label?:any,
    trigger?:any,
    nullable?:boolean
};

const PointFilter: React.FC<Props> = ({ getQueryPoints,disable,preSetVal,label,trigger,nullable}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [min, setMin] = React.useState<any>(null);
    const [max, setMax] = React.useState<any>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const minFn = (e: any) => {
        let val =  e.target.value
        if(Number(val)>0){
                setMin(val);
        }
        else{
        setMin(null);
        }
        getQueryPoints(val, "min")
    }
    const maxFn = (e: any) => {
        let val =  e.target.value
        if(Number(val)>0){
        setMax(val);
        }else{
            setMax('');
        }
        getQueryPoints(val, "max")
    }
    const diffFn = () => {        
        if (parseInt(min) > parseInt(max)) { 
            setMax(min)
            getQueryPoints(min, "max")
        }
    }
    const allPointsFn = () => {
        setMax(null)
        setMin(null)
        getQueryPoints("", "empty")
        handleClose()
    }

    React.useEffect(()=>{
        if((min?.length|| max?.length) == ""){
            setMax(null)
            setMin(null)
            getQueryPoints("", "empty")            
        }
    },[min, max])

    React.useEffect(()=>{
        setMax(null)
        setMin(null)
        getQueryPoints("", "empty")
    },[])
    React.useEffect(()=>{
        if(nullable){
            setMax(preSetVal?.max || null)
            setMin(preSetVal?.min || null) 
            getQueryPoints(preSetVal?.min, "min")
            getQueryPoints(preSetVal?.max, "max")
        }
        else if(preSetVal){
            setMax(preSetVal?.max)
            setMin(preSetVal?.min) 
            getQueryPoints(preSetVal?.min, "min")
            getQueryPoints(preSetVal?.max, "max")
         }
    },[preSetVal,trigger])
    return (
        <Grid item xs={2} className={`currAppDropFilter ${disable ? "disableWrapper" : ""}`} >
            <FormControl size="small" >
                <ButtonFilter
                    id="demo-customized-button"
                    aria-controls={open ? 'demo-customized-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    variant="contained"
                    disableElevation
                    onClick={handleClick}
                    endIcon={<FilterSelectDown />}
                    data-testid="filterButton"
                >
                    <div className='d-flex'>
                        <span className="filterPreText"> {preSetVal?"Marks": "Showing"}:</span>
                        <span className="filterSelectedText">{min && max ? `Min ${min}- Max ${max}` : (label === "marks" ?"All Marks":'All Points') }</span>
                    </div>
                </ButtonFilter>
                <StyledMenu
                    className="currAppPointsMenuBox"
                    id="demo-customized-menu"
                    MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuWithDiver disableRipple onClick={() => { allPointsFn() }}>{label === "marks"?"All Marks":"All Points"}</MenuWithDiver>
                    <MenuTypographyDivider />
                    <AccordionFilter>
                        <div className='points_input' >
                            <TextField
                                value={min || ''}
                                onChange={(e: any) => { minFn(e) }}
                                label="Min*"
                                variant="outlined"
                                className="schAdminSelctCtr"
                                style={{ width: "50%" }}
                                autoComplete="off" 
                                onBlur={diffFn}  
                                data-testid="min..."                                                            
                            />
                            <TextField
                                value={max || ''}
                                onChange={(e) => {
                                    maxFn(e)                                    
                                }}
                                label="Max*"
                                variant="outlined"
                                className="schAdminSelctCtr"
                                style={{ width: "50%" }}
                                onBlur={diffFn}
                                autoComplete="off" 
                                data-testid="max..."                                                      
                            />
                        </div>
                    </AccordionFilter>
                </StyledMenu>
            </FormControl>
        </Grid>
    )
}

export default PointFilter;