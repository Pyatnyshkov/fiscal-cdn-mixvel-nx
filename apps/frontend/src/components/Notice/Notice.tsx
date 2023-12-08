import clsx from 'clsx'
import styles from './Notice.module.css'
import { NoticeMessages, NoticeStatuses } from './const'

interface Notice {
  status: NoticeStatuses
  message: NoticeMessages
  className?: string
  reload?: () => void
  timer?: number
}

type headerStatuses = {
  [Key in NoticeStatuses]: string
}

const headerStatuses: headerStatuses = {
  [NoticeStatuses.available]: 'Доступно',
  [NoticeStatuses.waiting]: 'Ожидание',
  [NoticeStatuses.failed]: 'Сбой',
  [NoticeStatuses.unavailable]: 'Недоступно',
}

export const Notice: React.FC<Notice> = ({ status, message, className, reload, timer }) => {
  return (
    <div
      className={clsx(
        styles.root,
        {
          [styles.statusAvailable]: status === NoticeStatuses.available,
          [styles.statusWaiting]: status === NoticeStatuses.waiting,
          [styles.statusFailed]: status === NoticeStatuses.failed,
          [styles.statusUnavailable]: status === NoticeStatuses.unavailable,
        },
        className
      )}
    >
      <div className={styles.header}>
        <div className={styles.status}>{headerStatuses[status]}</div>
        {timer ? <div className={styles.timer}>{timer} сек.</div> : null}
        <div className={styles.reload} onClick={reload}></div>
      </div>
      <div className={styles.message}>{message}</div>
    </div>
  )
}
