import clsx from 'clsx'
import styles from './Notices.module.css'

import { selectWsState } from '@store/websocket/selectors'
import { useAppDispatch, useAppSelector } from '@store'
import { reconnect } from '@store/websocket'
import { API } from '@services/API'

import { Notice, NoticeMessages, NoticeStatuses, NoticeViewVariant } from '../Notice'
import { selectNetwork, selectWebEndpoint } from '@store/network/selectors'
import { selectApp } from '@store/app/selectors'
import { selectAppSubjects, selectAppSubjectsGUID } from '@store/appSubjects/selectors'

interface Notices {
  className?: string
}

export const Notices: React.FC<Notices> = ({ className }) => {
  const dispatch = useAppDispatch()
  const wsState = useAppSelector(selectWsState)
  const subjectsGUID = useAppSelector(selectAppSubjectsGUID)
  const webEndpoint = useAppSelector(selectWebEndpoint)

  const wsStatus = () => {
    if (wsState.connected) return NoticeStatuses.available
    if (wsState.connecting) return NoticeStatuses.waiting
    if (wsState.connectError) return NoticeStatuses.failed
    return NoticeStatuses.unavailable
  }
  const network = useAppSelector(selectNetwork)
  const app = useAppSelector(selectApp)
  const appSubjects = useAppSelector(selectAppSubjects)

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

  const subjectsLocationHref = (guid: string) => {
    return webEndpoint.replace('$guid$', guid)
  }

  return (
    <div className={clsx(styles.root, className)}>
      <Notice
        status={wsStatus()}
        message={NoticeMessages.subscriptionChecks}
        className={styles.noticeMargin}
        timer={wsState.secondsToNextAttempt}
        reload={() => dispatch(reconnect())}
        view={NoticeViewVariant.left}
      />
      <Notice
        href={subjectsLocationHref(subjectsGUID)}
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
        view={NoticeViewVariant.right}
        reload={() => {
          API.single.post(network.deviceStatusSOAPEndpoint, app.instructions.deviceRouting)
        }}
      />
    </div>
  )
}
