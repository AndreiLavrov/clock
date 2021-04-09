import addZerosService from './addZerosService';

const modifyTimeFormat = (timeString) => {
  let timeStringArr = timeString.split(':');
  const hoursStr = timeStringArr[0] ? timeStringArr[0].slice(0, 2) : '00';
  const minutesStr = timeStringArr[1] ? timeStringArr[1].slice(0, 2) : '00';
  const secStr = timeStringArr[2] ? timeStringArr[2].slice(0, 2) : '00';

  let now = new Date();
  now.setHours(hoursStr, minutesStr, secStr);

  const {
    hours,
    minutes,
    sec,
  } = addZerosService(now);
  return `${hours}:${minutes}:${sec}`;
}

export default modifyTimeFormat;
