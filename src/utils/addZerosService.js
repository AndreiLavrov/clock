const addZerosService = (date) => {
  let hours = String(date.getHours());
  if (hours.length === 1) hours = `0${hours}`;
  let minutes = String(date.getMinutes());
  if (minutes.length === 1) minutes = `0${minutes}`;
  let sec = String(date.getSeconds());
  if (sec.length === 1) sec = `0${sec}`;

  // return `${hours}:${minutes}:${sec}`;
  return {
    hours,
    minutes,
    sec,
  };
}

export default addZerosService;
