import React from 'react';
import style from './center.module.scss';

export default function Center({children}) {
  return <div className={style.center}>{children}</div>;
}
