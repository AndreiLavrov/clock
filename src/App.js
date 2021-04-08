import React, {Component} from 'react';

import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alarmsList: [],
      timezonesList: [],
      chosenTimezone: null,
    };

    this.timeout = 0;
  }

  componentDidMount() {
    this.setChosenTimezone();

    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.radius = this.canvas.height / 2;
    this.ctx.translate(this.radius, this.radius);
    this.radius = this.radius * 0.90;
    this.timeout = setInterval(this.drawClock, 1000);

    this.setTimezonesList();
    this.setAlarmsList();
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  // TODO: should add shouldComponentUpdate.

  setChosenTimezone = () => {
    let now = new Date();
    const chosenTimezone = -(now.getTimezoneOffset() / 60);

    this.setState({chosenTimezone});
  }


  setAlarmsList = () => {
    const response = this.getAlarmsListReq();
    response.then(alarmsList => {
      alarmsList = alarmsList.map(item => (
        {
          ...item,
          time: this.modifyTimeFormat(item.time),
        }));
      this.setState({alarmsList});
    });
  }

  getAlarmsListReq = async () => {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/medlabmg/developers-tests/master/frontend/alarm.json`);

      return await response.json();
    } catch (err) {
      // here could be error listener
      console.error(err);
    }
  }

  setTimezonesList = () => {
    const response = this.getTimezonesListReq();
    response.then(timezonesList => {
      this.setState({timezonesList});
    });
  }

  getTimezonesListReq = async () => {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/dmfilipenko/timezones.json/master/timezones.json`);

      return await response.json();
    } catch (err) {
      // here could be error listener
      console.error(err);
    }
  }

  modifyTimeFormat = (timeString) => {
    let timeStringArr = timeString.split(':');
    const hoursStr = timeStringArr[0] ? timeStringArr[0].slice(0, 2) : '00';
    const minutesStr = timeStringArr[1] ? timeStringArr[1].slice(0, 2) : '00';
    const secStr = timeStringArr[2] ? timeStringArr[2].slice(0, 2) : '00';

    let now = new Date();
    now.setHours(hoursStr, minutesStr, secStr);

    let hours = String(now.getHours());
    if (hours.length === 1) hours = `0${hours}`;
    let minutes = String(now.getMinutes());
    if (minutes.length === 1) minutes = `0${minutes}`;
    let sec = String(now.getSeconds());
    if (sec.length === 1) sec = `0${sec}`;

    return `${hours}:${minutes}:${sec}`;
  }

  // currentTime === `00:00:00`
  tryShowAlarmAlert = (currentTime) => {
    const {alarmsList} = this.state;

    if (!alarmsList) return;
    const currentAlarms = alarmsList.filter(item => item.active && item.time === currentTime)
    if (currentAlarms.length > 0) currentAlarms.forEach(currentAlarm => alert(currentAlarm?.message));
  }

  drawClock = () => {
    this.drawFace(this.ctx, this.radius);
    this.drawNumbers(this.ctx, this.radius);
    this.drawTime(this.ctx, this.radius);
  }

  drawFace = (ctx, radius) => {
    let grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
  }

  drawNumbers(ctx, radius) {
    let ang;
    let num;
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (num = 1; num < 13; num++) {
      ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-ang);
    }
  }

  drawTime(ctx, radius) {
    const {chosenTimezone} = this.state;
    // if (chosenTimezone === null) {}

    let now = new Date();
    const currentTimezoneOffset = now.getTimezoneOffset() / 60;

    // TODO: should optimize.
    if (Number.isInteger(chosenTimezone)) {
      now.setHours(now.getHours() + currentTimezoneOffset + chosenTimezone);
    } else {

      const hours = Number(String(chosenTimezone).split('.')[0]);
      let minutesAsFractionalNumberStr = String(chosenTimezone).split('.')[1].slice(0, 2);
      if (minutesAsFractionalNumberStr.length < 2) minutesAsFractionalNumberStr += '0';
      const minutes = (Number(minutesAsFractionalNumberStr) / 100) * 60;

      now.setHours((now.getHours() + currentTimezoneOffset + hours), (now.getMinutes() + minutes));
    }

    let hour = String(now.getHours());
    if (hour.length === 1) hour = `0${hour}`;
    let minute = String(now.getMinutes());
    if (minute.length === 1) minute = `0${minute}`;
    let second = String(now.getSeconds());
    if (second.length === 1) second = `0${second}`;

    this.tryShowAlarmAlert(`${hour}:${minute}:${second}`);

    //hour
    hour = hour % 12;
    hour = (hour * Math.PI / 6) +
      (minute * Math.PI / (6 * 60)) +
      (second * Math.PI / (360 * 60));
    this.drawHand(ctx, hour, radius * 0.5, radius * 0.07);
    //minute
    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    this.drawHand(ctx, minute, radius * 0.8, radius * 0.07);
    // second
    second = (second * Math.PI / 30);
    this.drawHand(ctx, second, radius * 0.9, radius * 0.02);
  }

  drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }

  selectTimezone = (ev) => {
    const {value} = ev.target;

    this.setState({
      chosenTimezone: Number(value),
    })
  }

  render() {

    const {
      timezonesList,
      chosenTimezone,
    } = this.state;

    return (
      <div className="App">
        <canvas
          id="canvas" width="400" height="400"
          style={{'backgroundColor': '#333'}}>
        </canvas>

        <select
          name="timezonesList"
          id="timezonesList"
          value={chosenTimezone || '- Choose a timezone -'}
          className="timezonesList"
          onChange={(ev) => this.selectTimezone(ev)}
        >
          {timezonesList &&
          timezonesList.map((option, index) => (
            <option
              key={index}
              value={option.offset}
            >
              {`${option.text}, offset: ${option.offset}`}
            </option>
          ))}
        </select>


      </div>
    );
  }
}

export default App;
