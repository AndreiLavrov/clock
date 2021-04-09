const getTimezoneDetails = (chosenTimezone) => {
  if (Number.isInteger(chosenTimezone)) {
    return {
      chosenTimezoneHour: chosenTimezone,
      chosenTimezoneMinute: 0,
    }
  }

  const chosenTimezoneHour = Number(String(chosenTimezone).split('.')[0]);
  let minutesAsFractionalNumberStr = String(chosenTimezone).split('.')[1].slice(0, 2);
  if (minutesAsFractionalNumberStr.length < 2) minutesAsFractionalNumberStr += '0';
  let chosenTimezoneMinute = (Number(minutesAsFractionalNumberStr) / 100) * 60;
  if (chosenTimezone < 0) chosenTimezoneMinute *= -1;

  return {
    chosenTimezoneHour,
    chosenTimezoneMinute,
  }
}

export default getTimezoneDetails;
