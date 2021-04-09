import React, { PureComponent } from 'react';

import styles from './App.module.scss';
import Clock from '../clock/Clock';
import TimezonesSelect from '../timezonesSelect/TimezonesSelect';
import {
  getAlarmsListReq,
  getTimezonesListReq,
} from '../../api/requests';
import modifyTimeFormat from '../../utils/modifyTimeFormatService';
import addZerosService from '../../utils/addZerosService';
import getTimezoneDetails from '../../utils/getTimezoneDetailsService';

class App extends PureComponent {
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
    this.setCurrentTimezone();
    this.setClocksVariables();
    this.setTimezonesList();
    this.setAlarmsList();
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  setClocksVariables = () => {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    const halfOfHeight = this.canvas.height / 2;
    this.ctx.translate(halfOfHeight, halfOfHeight);
    this.radius = halfOfHeight * 0.90;
    this.timeout = setInterval(this.drawClock, 1000);
  }

  setCurrentTimezone = () => {
    const now = new Date();
    const currentTimezoneOffset = now.getTimezoneOffset() / 60;
    const chosenTimezone = currentTimezoneOffset * -1;

    const {
      chosenTimezoneHour,
      chosenTimezoneMinute,
    } = getTimezoneDetails(chosenTimezone);

    this.setState({
      chosenTimezone,
      currentTimezoneOffset,
      chosenTimezoneHour,
      chosenTimezoneMinute
    });
  }

  selectTimezone = (ev) => {
    if (!ev) return;

    const {value} = ev.target;
    const chosenTimezone = Number(value);

    const {
      chosenTimezoneHour,
      chosenTimezoneMinute,
    } = getTimezoneDetails(chosenTimezone);

    this.setState({
      chosenTimezone,
      chosenTimezoneHour,
      chosenTimezoneMinute,
    })
  }

  setAlarmsList = async () => {
    const response = await getAlarmsListReq();
    const alarmsList = response.map(item => (
      {
        ...item,
        time: modifyTimeFormat(item.time),
      })
    );

    this.setState({alarmsList});
  }

  setTimezonesList = async () => {
    const timezonesList = await getTimezonesListReq();
    this.setState({timezonesList});
  }

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

  drawTime(ctx, radius) {
    const {
      chosenTimezone,
      currentTimezoneOffset,
      chosenTimezoneHour,
      chosenTimezoneMinute,
    } = this.state;

    const now = new Date();

    if (Number.isInteger(chosenTimezone)) {
      now.setHours(now.getHours() + currentTimezoneOffset + chosenTimezone);
    } else {
      now.setHours((now.getHours() + currentTimezoneOffset + chosenTimezoneHour), (now.getMinutes() + chosenTimezoneMinute));
    }

    let {
      hours: hour,
      minutes: minute,
      sec: second,
    } = addZerosService(now);

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

    const {
      timezonesList,
    } = this.state;

    return (
      <div className={styles.App}>
        <Clock/>
        <TimezonesSelect
          timezonesList={timezonesList}
          selectTimezone={this.selectTimezone}
        />
      </div>
    );
  }
}

export default App;
