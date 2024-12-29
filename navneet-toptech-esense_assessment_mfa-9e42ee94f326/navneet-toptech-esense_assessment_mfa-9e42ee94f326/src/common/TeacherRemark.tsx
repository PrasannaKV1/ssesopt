import React from 'react';
import { TextField } from "@mui/material";

interface TeacherRemarkProps {
  value: string;
  onChange?: (value: string) => void; // Make onChange optional
  isEditMode: boolean
}

const TeacherRemark: React.FC<TeacherRemarkProps> = ({ value, onChange, isEditMode }) => {
  const handleTextChange = (e: any) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="remark-text-field">
      Teacher's Remark
      <TextField
        id="outlined-multiline-static"
        multiline
        rows={4}
        inputProps={{ 
          maxLength: 500,
          style: {
            fontWeight: 500, // Apply bold text
            fontSize: '1rem', // Adjust font size as needed
            color: 'rgba(0, 0, 0, 0.87)', // Dark color
          },
        }}
        value={value}
        onChange={handleTextChange}
        disabled={!isEditMode} // Disable TextField if value is present
      />
    </div>
  );
}

export default TeacherRemark;
