import modifyTimeFormat from '../utils/modifyTimeFormatService';

test('modifyTimeFormat works', () => {
  expect(modifyTimeFormat('04:04:00')).toEqual('04:04:00');
});

test('modifyTimeFormat without minutes works', () => {
  expect(modifyTimeFormat('04:04')).toEqual('04:04:00');
});

test('modifyTimeFormat with not correct minutes works', () => {
  expect(modifyTimeFormat('04:60:00')).toEqual('05:00:00');
});

test('modifyTimeFormat with not correct hours works', () => {
  expect(modifyTimeFormat('24:04:00')).toEqual('00:04:00');
});
