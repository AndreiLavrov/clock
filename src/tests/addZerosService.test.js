import addZerosService from '../utils/addZerosService';

test('date string work', () => {
  const getRes = () => {
    const now = new Date('December 17, 1995 03:24:00');
    let {
      hours,
      minutes,
      sec,
    } = addZerosService(now);

    return `${hours}:${minutes}:${sec}`;
  }
  expect(getRes()).toEqual('03:24:00');
});

test('date string shows correct date', () => {
  const getRes = () => {
    const now = new Date(2020, 4, 10, 12, 5, 0);
    let {
      hours,
      minutes,
      sec,
    } = addZerosService(now);

    return `${hours}:${minutes}:${sec}`;
  }

  expect(getRes()).toEqual('12:05:00');
});
