import React from 'react';
import PropTypes from 'prop-types';

import styles from './TimezonesSelect.module.scss';

const TimezonesSelect = ({ timezonesList, selectTimezone }) => {
  return (
    <select
      className={styles.timezonesList}
      onChange={selectTimezone}
    >
      <option selected disabled>- Choose a timezone -</option>

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
  )
}

TimezonesSelect.propTypes = {
  timezonesList: PropTypes.array.isRequired,
  selectTimezone: PropTypes.func.isRequired,
};

export default TimezonesSelect;
