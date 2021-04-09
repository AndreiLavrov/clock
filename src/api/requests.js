export const getAlarmsListReq = async () => {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/medlabmg/developers-tests/master/frontend/alarm.json`);
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

export const getTimezonesListReq = async () => {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/dmfilipenko/timezones.json/master/timezones.json`);
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}
