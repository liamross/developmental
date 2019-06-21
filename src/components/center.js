import React from 'react';
import style from './center.module.scss';

function Center({children}) {
  return <div className={style.center}>{children}</div>;
}

export default Center;
