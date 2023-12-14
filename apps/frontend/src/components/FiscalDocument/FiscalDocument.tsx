import { Modal } from '@components/Modal'
import styles from './FiscalDocument.module.css'
import { useAppSelector } from '@store'
import { selectDocumentView } from '@store/app/selectors'
import { useState } from 'react'
import { selectIssueResult } from '@store/document/selectors'

export const FiscalDocument = () => {
  const { registrationNumber, factoryNumber } = useAppSelector(selectDocumentView)
  const issueResult = useAppSelector(selectIssueResult)
  const [isModal, setIsModal] = useState(true)

  if (!issueResult) {
    return
  }

  if (!isModal) {
    return
  }

  return (
    <Modal onClickOverlay={() => setIsModal(false)}>
      <div className={styles.root}>
        <div className={styles.title}>Фискальный документ кассового чека</div>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td rowSpan={2}>Устройство</td>
              <td>
                <div>Регистрационный номер устройства пробившего чек</div>
              </td>
              <td>{registrationNumber}</td>
            </tr>
            <tr>
              <td>
                <div>Заводской номер фискального накопителя</div>
              </td>
              <td>{factoryNumber}</td>
            </tr>
            <tr>
              <td>Дата и время:</td>
              <td colSpan={2}>{issueResult.document.dateTime}</td>
            </tr>
            <tr>
              <td>
                <div>Номер фискального документа</div>
              </td>
              <td colSpan={2}>{issueResult.document.fiscalNumber}</td>
            </tr>
            <tr>
              <td>
                <div>Фискальный признак документа</div>
              </td>
              <td colSpan={2}>{issueResult.document.fiscalSignature}</td>
            </tr>
            <tr>
              <td>№ смены:</td>
              <td colSpan={2}>{issueResult.document.cheque.shift.number}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  )
}
