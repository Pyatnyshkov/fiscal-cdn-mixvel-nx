import Cheques from './Cheques';
import Subjects from './Subjects';
import Registrator from './Registrator';

import styles from './index.module.css';

/* eslint-disable-next-line */
export interface StatusesProps {}

export function Statuses(props: StatusesProps) {
  return (
    <div className={styles['container']}>
      <Cheques />
      <Subjects />
      <Registrator />
    </div>
  );
}

export default Statuses;