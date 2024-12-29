import React, { FC } from "react";
import Button from "@mui/material/Button";
import styles from "./ButtonComponent.module.css";
import { Tooltip } from "@mui/material";
type Props = {
  disabled?: boolean;
  type: any;
  label: string;
  textColor: string;
  buttonSize: any;
  icon?: any;
  image?: any;
  backgroundColor?: string;
  minWidth: string;
  onClick?: any;
  status?: string;
  addRow?: Boolean;
  endIcon?: any;
  btnToolTipText?: string;
  hideBorder?: boolean;
  width?: string;
  marginTop?: string;
};
const ButtonComponent: FC<Props> = ({
  label,
  type,
  icon,
  disabled,
  backgroundColor,
  onClick,
  textColor,
  buttonSize,
  image,
  minWidth,
  status,
  addRow,
  endIcon,
  btnToolTipText,
  hideBorder,
  width,
  marginTop,
}) => {
  const handleClick = (event: any) => {
    onClick && onClick(event);
  };
  return (
    <Tooltip title={btnToolTipText} placement="top">
      <Button
        className={`${styles.buttonCompStyling} btnCompStyle ${
          disabled ? "disableWrapper" : ""
        }`}
        style={{
          background: `${type == "contained" ? backgroundColor : ""}`,
          height:
            buttonSize === "Large"
              ? "50px"
              : buttonSize === "Medium"
              ? "40px"
              : "30px",
          minWidth: minWidth + "px",
          padding: `${addRow && "6px"}`,
          borderWidth: `${hideBorder ? "0px" : "1px"}`,
          color: `${textColor}`,
        }}
        variant={type ? type : ""}
        startIcon={icon ? icon : ""}
        endIcon={endIcon ? endIcon : ""}
        type={status === "submit" ? "submit" : "button"}
        sx={{
          textTransform: "none",
          borderRadius: "8px",
          color: textColor,
          width: width ? width : "auto",
          marginTop: marginTop ? marginTop : "auto",
          borderColor:
            type == "outlined" && !disabled
              ? backgroundColor
              : type == "outlined" && icon == "" && image == ""
              ? backgroundColor
              : "transparent",
          ":hover": {
            backgroundColor:
              type === "outlined" || type == "transparent"
                ? "transparent"
                : backgroundColor,
            color: "",
            borderColor:
              type === "outlined" || type == "conatined"
                ? backgroundColor
                : "transparent",
          },
        }}
        onClick={(event) => {
          handleClick(event);
        }}
      >
        {image && <img className="me-2" width="18px" src={image} />} {label}
      </Button>
    </Tooltip>
  );
};
export default ButtonComponent;
