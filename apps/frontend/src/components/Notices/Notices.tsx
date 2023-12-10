import clsx from 'clsx'
import styles from './Notices.module.css'

import { selectWsState } from '@store/websocket/selectors'
import { useAppDispatch, useAppSelector } from '@store'
import { reconnect } from '@store/websocket'
import { API } from '@services/API'

import { Notice, NoticeMessages, NoticeStatuses } from '../Notice'

interface Notices {
  className?: string
}

export const Notices: React.FC<Notices> = ({ className }) => {
  const dispatch = useAppDispatch()
  const wsState = useAppSelector(selectWsState)
  const wsStatus = () => {
    if (wsState.connected) return NoticeStatuses.available
    if (wsState.connecting) return NoticeStatuses.waiting
    if (wsState.connectError) return NoticeStatuses.failed
    return NoticeStatuses.unavailable
  }
  const { network, app, appSubjects } = useAppSelector((state) => state)
  const subjectsStatus = () => {
    if (appSubjects.requestStarted) return NoticeStatuses.waiting
    if (appSubjects.loadFailed) return NoticeStatuses.failed
    if (appSubjects.subjectsLoaded) return NoticeStatuses.available
    return NoticeStatuses.unavailable
  }
  const fiscalStatus = () => {
    if (app.deviceRouteStatus.requestStarted) return NoticeStatuses.waiting
    if (app.deviceRouteStatus.fail) return NoticeStatuses.failed
    if (app.deviceRouteStatus.loadFailed) return NoticeStatuses.failed
    if (app.deviceRouteStatus.loaded) return NoticeStatuses.available
    return NoticeStatuses.unavailable
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
        status={subjectsStatus()}
        message={NoticeMessages.productDirectory}
        className={styles.noticeMargin}
        timer={appSubjects.nextReloadSeconds}
        reload={() => {
          API.subjects.post(network.subjectsSOAPEndpoint, app.instructions.deviceRouting)
        }}
      />
      <Notice
        status={fiscalStatus()}
        message={NoticeMessages.fiscalRegistrar}
        timer={app.deviceRouteStatus.nextReloadSeconds}
        reload={() => {
          API.single.post(network.deviceStatusSOAPEndpoint, app.instructions.deviceRouting)
        }}
      />
    </div>
  )
}
