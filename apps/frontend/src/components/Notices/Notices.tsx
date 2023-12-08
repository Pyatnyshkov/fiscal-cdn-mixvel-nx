import clsx from 'clsx'
import styles from './Notices.module.css'

import { selectWsState } from '@store/websocket/selectors'
import { useAppDispatch, useAppSelector } from '@store'
import { reconnect } from '@store/websocket'

import { Notice, NoticeMessages, NoticeStatuses } from '../Notice'

interface Notices {
  className?: string
}

export const Notices: React.FC<Notices> = ({ className }) => {
  const dispatch = useAppDispatch();
  const wsState = useAppSelector(selectWsState);
  const wsStatus = () => {
    if (wsState.connected) return NoticeStatuses.available;
    if (wsState.connecting) return NoticeStatuses.waiting;
    if (wsState.connectError) return NoticeStatuses.failed;
    return NoticeStatuses.unavailable;
  }
  return (
    <div className={clsx(styles.root, className)}>
      <Notice
        status={wsStatus()}
        message={NoticeMessages.subscriptionChecks}
        className={styles.noticeMargin}
        timer={wsState.secondsToNextAttempt}
        reload={() => dispatch(reconnect())}
      />
      <Notice
        status={NoticeStatuses.waiting}
        message={NoticeMessages.productDirectory}
        className={styles.noticeMargin}
      />
      <Notice status={NoticeStatuses.failed} message={NoticeMessages.fiscalRegistrar} />
    </div>
  )
}
