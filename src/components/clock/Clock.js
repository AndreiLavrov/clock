import React from 'react';

import styles from './Clock.module.scss';

const Clock = () => {
  return (
    <canvas
      id="canvas" width="400" height="400"
      className={styles.clock}
    >
    </canvas>
  )
}

export default Clock;
