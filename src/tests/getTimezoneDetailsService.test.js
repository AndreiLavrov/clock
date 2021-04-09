import getTimezoneDetails from '../utils/getTimezoneDetailsService';

test('getTimezoneDetails only with hours works', () => {
  expect(getTimezoneDetails(1)).toEqual({
    chosenTimezoneHour: 1,
    chosenTimezoneMinute: 0,
  });
});

test('getTimezoneDetails with minutes works', () => {
  expect(getTimezoneDetails(1.5)).toEqual({
    chosenTimezoneHour: 1,
    chosenTimezoneMinute: 30,
  });
});
