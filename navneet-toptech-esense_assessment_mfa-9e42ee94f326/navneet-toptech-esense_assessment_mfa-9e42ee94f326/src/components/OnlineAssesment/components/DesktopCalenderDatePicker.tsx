import "../style/dateSelector.css"
import {
  addDays, endOfDay, startOfDay, startOfYear, startOfMonth, endOfMonth,
  endOfYear,
  addMonths,
  addYears,
  startOfWeek,
  endOfWeek,
  isSameDay,
  addWeeks,
} from "date-fns";
import { useState } from "react";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Button, TextField } from "@mui/material";
import dayjs from "dayjs";

import { Popover } from "@material-ui/core";
import { calculateDateRangeFromTwoDates, getDayMonthYearDateFormat } from "../utils/dateConverter";

type Props = {
  onClose?: any;
  setDate?: any;
  state: any;
  setState: any;
  selectedDateRange?: any;
  anchorEl?: any;
  teacherAppoiDate?: boolean;
  setTeacherAppoiDate?: any
  anchorPosition?: any;
  className?: any
  mixMaxDate?: any
  setLabelValue?: any
  selectedOption?: any
}


const DesktopCalenderDatePicker: React.FC<Props> = ({ onClose, state, setDate, setState, selectedDateRange, anchorEl, teacherAppoiDate, setTeacherAppoiDate, anchorPosition, className, mixMaxDate, setLabelValue, selectedOption }) => {
  const [isCustomColor, setIsCustomColor] = useState(false)
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  const convertDate = (dateStr: any) => {
    const [day, month, year] = dateStr?.split('-');
    return `${year}-${month}-${day}`;
  }


  const handleClearfilter = () => {
    setState([
      {
        startDate: selectedOption == "1" ? new Date() : mixMaxDate[0]?.minStartDate,
        endDate: selectedOption == "1" ? new Date() : mixMaxDate[0]?.minEndDate,
        key: "selection",
      },
    ]);
    setDate([]);
    setSelectedRange(null);
    setLabelValue("All")
  };
  const applyDatefilterHandle = () => {
    let startDate;
    let endDate;

    if (state) {
      if (state?.[0]?.startDate) {
        startDate = getDayMonthYearDateFormat(state?.[0]?.startDate);
        startDate = convertDate(startDate);
        if (state?.[0]?.endDate && !isNaN(state?.[0]?.endDate.getTime())) {
          endDate = getDayMonthYearDateFormat(state?.[0]?.endDate);
          endDate = convertDate(endDate);
        } else {
          endDate = startDate;
        }
      } else {
        startDate = null;
        endDate = null;
      }

      setDate([startDate, endDate]);
      selectedDateRange(selectedRange || "");
      onClose();
    } else {
      startDate = null;
      endDate = null;
      setDate([startDate, endDate]);
      selectedDateRange(null);
      onClose();
    }
  };
  const today = new Date()
  const staticRanges: any = [
    {
      label: "Today",
      range: () => ({
        startDate: new Date(),
        endDate: new Date()
      }),
      isSelected(range: any) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      },
    },
    {
      label: "Yesterday",
      range: () => ({
        startDate: startOfDay(addDays(new Date(), -1)),
        endDate: endOfDay(addDays(new Date(), -1)),
      }),
      isSelected(range: any) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      },
    },
    {
      label: "This Week",
      range: () => ({
        startDate: startOfWeek(new Date()),
        endDate: endOfWeek(new Date()),
      }),
      isSelected(range: any) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      },
    },
    {
      label: "Last Week",
      range: () => ({
        startDate: startOfWeek(addWeeks(new Date(), -1)),
        endDate: endOfWeek(addWeeks(new Date(), -1)),
      }),
      isSelected(range: any) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      },
    },
    {
      label: "This Month",
      range: () => ({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      }),
      isSelected(range: any) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      },
    },
    {
      label: "Last Month",
      range: () => ({
        startDate: startOfMonth(addMonths(new Date(), -1)),
        endDate: endOfMonth(addMonths(new Date(), -1)),
      }),
      isSelected(range: any) {
        const definedRange = this.range();
        return (
          isSameDay(range.startDate, definedRange.startDate) &&
          isSameDay(range.endDate, definedRange.endDate)
        );
      },
    },

    {
      label: "Custom",
      range: () => ({
        startDate: null,
        endDate: null,
      }),
      isSelected(range: any) {
        return (
          range.startDate === null && range.endDate === null
        );
      },
    },

  ];

  const handleDateChange = (ranges: any) => {
    if (ranges?.selection) {
      if (selectedRange === "Custom" && ranges.selection.startDate === ranges.selection.endDate) {
        const selectedDate = ranges.selection.startDate;
        setState([
          {
            startDate: selectedDate,
            endDate: selectedDate,
            key: "selection",
          },
        ]);
      } else {
        setState([ranges.selection]);
      }
      setIsCustomColor(false);
    } else {
      setIsCustomColor(false);
    }

    if (ranges.selection?.startDate !== ranges.selection?.endDate) {
      const result = calculateDateRangeFromTwoDates(ranges);
      if (result) {
        setSelectedRange(result.text);
        setLabelValue(result.text)
        if (result.text === "Custom") {
          setIsCustomColor(true);
        }
      }
    }
  };





  return (
    <div className="popover-mui-container">
      <Popover className={className || ''} open={teacherAppoiDate || false} anchorEl={anchorEl} onClose={() => setTeacherAppoiDate && setTeacherAppoiDate(false)}>
        <div className={isCustomColor ? "CustomDatePicker DatePickerStyling" : "DatePickerStyling "} id="DatePickerId">
          <DateRangePicker
            onChange={(item: any) => handleDateChange(item)}
            moveRangeOnFirstSelection={true}
            months={2}
            ranges={state}
            showDateDisplay={false}
            direction="horizontal"
            staticRanges={staticRanges}
            rangeColors={["#4df7d8"]}
            color="#01B58A"
            dateDisplayFormat="dd/MM/yyyy"
            showMonthArrow={true}
            fixedHeight={true}
            weekStartsOn={1}
            weekdayDisplayFormat={'EEEEE'}
            monthDisplayFormat={'MMMM yyyy'}
            minDate={mixMaxDate[0]?.minStartDate}
            maxDate={mixMaxDate[0]?.minEndDate}
          />
          <div className="date-container">
            <div className="input-btn-div">
              <div className="field-div">
                <div className="datePickerInputField" style={{ display: "flex", gap: "20px" }}>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    value={
                      state[0]?.startDate
                        ? dayjs(state[0].startDate).format('DD/MM/YYYY')
                        : ''
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    error={!state[0]?.startDate}
                    helperText={!state[0]?.startDate ? '' : undefined}
                  />
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    value={
                      state[0]?.endDate && !isNaN(state[0]?.endDate.getTime())
                        ? dayjs(state[0].endDate).format('DD/MM/YYYY')
                        : ''
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    error={!state[0]?.endDate && state[0]?.startDate !== state[0]?.endDate}
                    helperText={!state[0]?.endDate ? '' : undefined}
                  />

                </div>

                <div className="date-btn-div" style={{ display: "flex", gap: "20px" }}>
                  <Button variant="contained" onClick={applyDatefilterHandle}>Apply</Button>
                  <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </div>
              </div>
              <div className="clearSectionBtnBox mt-2">
                <Button variant="outlined" onClick={handleClearfilter}>Clear Selection</Button>
              </div>
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
}
export default DesktopCalenderDatePicker;