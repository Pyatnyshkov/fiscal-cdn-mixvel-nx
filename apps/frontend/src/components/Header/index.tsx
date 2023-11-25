import Statuses from './Statuses';
import Label from '../UI/Label';

import styles from './index.module.css';

/* eslint-disable-next-line */
export interface HeaderProps {}

export function Header(props: HeaderProps) {
  const session = true;
  const fio = 'Иванов Иван Иванович';
  const inn = '453845324856';
  const tip = true;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name);
    console.log(e.target.value);
  };
  const handleSession = () => {
    console.log('handle session')
  }
  return (
    <div className={styles['container']}>
      <div className={styles['row']}>
        <div className={styles['session']}>
          {session ? 'Смена открыта' : 'Смена закрыта'}
          <button
            type="button"
            className={styles['session_control']}
            onClick={handleSession}
          >
            {session ? 'Закрыть смену' : 'Открыть смену'}
          </button>
        </div>
        <Statuses />
      </div>
      <div className={styles['row']}>
        <div className={styles['contacts']}>
          <Label
            label="ФИО кассира"
            value={fio}
            name="fio"
            handleChange={handleChange}
            size="m"
          />
          <Label
            label="ИНН"
            value={inn}
            name="inn"
            handleChange={handleChange}
            size="xs"
          />
        </div>
        {tip ? <div className={styles['tip']}>Необходимо закрыть смену</div> : null}
      </div>
    </div>
  );
}

export default Header;
