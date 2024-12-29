import moment from 'moment';
  
  //To get date in day-month-year format ie,24-07-2023 .
  export const getDayMonthYearDateFormat = (data: any) => {
    const day = String(data?.getDate()).padStart(2, '0');
    const month = String(data?.getMonth() + 1).padStart(2, '0');
    const year = data?.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }
  
  
  export const calculateDateRangeFromTwoDates = (ranges: any) => {
    const currentDate = new Date();
    const yesterday = moment(currentDate).subtract(1, 'days');
    const beginDate = moment(ranges?.selection?.startDate);
    const endDate: any = moment(ranges?.selection?.endDate);
    const today = moment();
    const currentYear = today.year();
    let text = '';
    let selectedDateDifference;
    let specificTimeSpan = true;
  
    const duration: any = moment.duration(endDate.diff(beginDate));
    const daysDifference = endDate.diff(beginDate, 'days');
  
    if (duration?._data?.months > 0) {
      selectedDateDifference = parseInt(endDate.format('YYYY')) <= currentYear ? 365 : 400;
    } else {
      selectedDateDifference = duration.get('days');
    } 
     if (endDate.isSame(today, 'day') && beginDate.isSame(today, 'day')) {
      text = "Today";
    } else if (endDate.isSame(yesterday, 'day') && beginDate.isSame(yesterday, 'day')) {
      text = "Yesterday";
    } else if (daysDifference === 6) {
      if (endDate.isSame(today, 'week') && beginDate.isSame(today, 'week')) {
        text = 'This Week';
      } else if (
        endDate.isSame(today.clone().subtract(1, 'week'), 'week') &&
        beginDate.isSame(today.clone().subtract(1, 'week'), 'week')
      ) {
        text = 'Last Week';
      } else {
        console.log("Custom log")
        text = 'Custom';
        specificTimeSpan = false;
      }
    }
    else if (daysDifference === 364 || daysDifference === 365) {
      if (endDate.isSame(today, 'year') && beginDate.isSame(today, 'year')) {
        text = 'This Year';
      } else if (
        endDate.isSame(today.clone().subtract(1, 'year'), 'year') &&
        beginDate.isSame(today.clone().subtract(1, 'year'), 'year')
      ) {
        text = 'Last Year';
      } else {
        text = 'Custom';
        specificTimeSpan = false;
      }
    }else if (selectedDateDifference === 30 || selectedDateDifference === 29 || selectedDateDifference=== 28 ) {
       if (endDate.isSame(today, 'month') && beginDate.isSame(today, 'month')) {
         text = 'This Month';
       } else if (
         endDate.isSame(today.clone().subtract(1, 'month'), 'month') &&
         beginDate.isSame(today.clone().subtract(1, 'month'), 'month')
       ) {
         text = 'Last Month';
       }else {
         text = 'Custom';   
         specificTimeSpan = false;
       }
     }
    else {
      if (
        selectedDateDifference !==365 &&
        selectedDateDifference !==30 && selectedDateDifference !==29 &&
        !endDate.isSame(today, 'day') &&
        !endDate.isSame(yesterday, 'day')
      ) {
        text = 'Custom';
        specificTimeSpan = false;
      }
    }
  
    return {
      text,
      specificTimeSpan
    };
  };
  