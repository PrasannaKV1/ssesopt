import React, { FC, } from 'react'
import styles from './FooterComponent.module.css';
import goBack from "../../../assets/images/goBack.svg"
import ButtonComponent from '../../ButtonComponent/ButtonComponent';
import { Button, Grid, Typography } from '@mui/material';

type Props = {
    disabled?: boolean;
    type: any;
    label: string;
    textColor: string;
    buttonSize: any;
    icon?: any;
    image?: any;
    backgroundColor?: string
    minWidth: string
    onClick: () => void;
    status?: string;
    firstlabel?: string;
    secondlabel?: string;
    isGrid: boolean;
    label1?: boolean;
    label2?: boolean;
}


const FooterComponent: FC<Props> = ({ label1, label2, label, type, icon, disabled, backgroundColor, onClick, textColor, firstlabel, secondlabel, buttonSize, image, minWidth, status, isGrid }) => {


    const handleClick = () => {
        console.log("clicked")
    }
    const handleButtonClick = () => {
        console.log('clicked')
    }
    return (


        <div className={styles.tableFooter} >
            {isGrid ?

                (<Grid item xs container direction="column"  >
                    <Grid item xs>
                        <Typography variant="body2" >
                            {firstlabel}
                        </Typography>
                        <Typography variant="body2" >
                            {secondlabel}
                        </Typography>
                    </Grid>
                </Grid>) : (
                    <div className={styles.assessmentContainerCreatSect}>
                        <h4 className='cursorPointer'><img src={goBack} />Go Back</h4>
                    </div>)}

            <div className=' d-flex justify-content-end ' style={{ gap: "20px" }}>
                {label1 ?
                    <ButtonComponent icon={""} image={""} textColor="#01B58A" backgroundColor=" " disabled={false} buttonSize="small" type="" onClick={handleButtonClick} label="Preview template" minWidth="106" /> : null}
                {label2 ? <ButtonComponent icon={""} image={""} textColor="#01B58A" backgroundColor=" " disabled={false} buttonSize="small" type="" onClick={handleButtonClick} label="view Curriculum" minWidth="106" /> : null}

                <ButtonComponent icon={""} image={""} textColor="#1B1C1E" backgroundColor="#9A9A9A" disabled={false} buttonSize="Medium" type="outlined" onClick={handleButtonClick} label="Exit" minWidth="106" />
                <Button
                    className={`${styles.buttonCompStyling} ${disabled ? "disableWrapper" : ""}`}
                    style={{ "background": `${type == "contained" ? backgroundColor : ""}`, "height": (buttonSize === "Large" ? "50px" : buttonSize === "Medium" ? "40px" : ""), "minWidth": minWidth + "px" }}
                    variant={type ? type : ''}
                    startIcon={icon ? icon : ''}
                    type={status === "submit" ? "submit" : "button"}
                    sx={{
                        textTransform: "none",
                        borderRadius: "8px",
                        color: (textColor),
                        borderColor: (type == "outlined" ? backgroundColor : " "),
                        ":hover": {
                            backgroundColor: ((type === "outlined" || type == "transparent") ? "transparent" : backgroundColor),
                            color: "",
                            borderColor: ((type === "outlined" || type == "conatined") ? backgroundColor : "transparent")
                        }
                    }}
                    onClick={handleClick}
                >
                    {image && <img className='me-2' width="18px" src={image} />} {label}
                </Button>
            </div>
        </div>


    );
}
export default FooterComponent;




