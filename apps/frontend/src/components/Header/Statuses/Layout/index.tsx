import styles from './index.module.css';

/* eslint-disable-next-line */
export interface StatusLayoutProps {
  status: 'fullfilled' | 'fetching' | 'rejected';
  timelimit?: number;
  elem: 'cheques' | 'subjects' | 'registrator';
}

interface IObjectKeys {
  [key: string]: string;
}

export function StatusLayout({ status, timelimit, elem }: StatusLayoutProps) {
  const statusMap: IObjectKeys = {
    fullfilled: 'Доступно',
    fetching: 'Ожидание',
    rejected: 'Сбой',
  };
  const elemMap: IObjectKeys = {
    cheques: 'Подписка на чеки',
    subjects: 'Справочник товаров',
    registrator: 'Фискальный регистратор',
  };
  const handleClick = () => {
    if (elem === 'subjects') {
      console.log('add guide');
    }
  };
  const reload = () => {
    console.log('reload status')
  }
  return (
    <div className={`${styles['container']} ${styles[status]} ${styles[elem]}`}>
      <div className={styles['header']}>
        {statusMap[status]}
        <div className={styles['header-control']}>
          {timelimit ? (
            <span className={styles['timelimit']}>{timelimit} сек.</span>
          ) : null}
          {status !== 'fullfilled' ? (
            <button
              type="button"
              className={styles['update']}
              onClick={reload}
            ></button>
          ) : null}
        </div>
      </div>
      <div
        className={`${styles['body']} ${styles[elem]}`}
        onClick={handleClick}
      >
        {elemMap[elem]}
      </div>
    </div>
  );
}

export default StatusLayout;
