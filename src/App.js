import React, {Component} from 'react';

import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alarmsList: [],
      timezoneOffset: 0,
    };

    this.timeout = 0;
  }

  componentDidMount() {
    this.setInitialTimezoneOffset();

    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.radius = this.canvas.height / 2;
    this.ctx.translate(this.radius, this.radius);
    this.radius = this.radius * 0.90;
    this.timeout = setInterval(this.drawClock, 1000);

    this.setAlarmsList();
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  // TODO: should add shouldComponentUpdate.

  setInitialTimezoneOffset = () => {
    let now = new Date();
    const timezoneOffset = - (now.getTimezoneOffset() / 60);

    this.setState({ timezoneOffset });
  }

  setTimezoneOffset = (data) => {
    this.setState({ timezoneOffset: data });
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

  modifyTimeFormat = (timeString) => {
    let timeStringArr = timeString.split(':');

    timeStringArr = timeStringArr.map(item => {
      // TODO: check if there is "-" in the start.
      // if (item. === 1) {
      //   item = `0${item}`;
      // }

      if (item.length === 1) {
        item = `0${item}`;
      }

      if (item.length > 2) {
        item = item.slice(0, 2);
      }

      return item;
    });

    if (timeStringArr.length === 2) {
      timeStringArr.push('00');
    }
    timeString = timeStringArr.join(':');

    return timeString;
  }

  // currentTime === `00.00.00`
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
    const { timezoneOffset } = this.state;
    let now = new Date();
    const currentTimezoneOffset = now.getTimezoneOffset() / 60;

    now.setHours(now.getHours() + currentTimezoneOffset + timezoneOffset);

    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    this.tryShowAlarmAlert(`${hour}.${minute}.${second}`);

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

  render() {

    return (
      <div className="App">
        <canvas
          id="canvas" width="400" height="400"
          style={{'backgroundColor': '#333'}}>
        </canvas>

        <button onClick={() => this.setTimezoneOffset(1)}>Change timezone</button>
      </div>
    );
  }
}

export default App;
