import clsx from 'clsx'
import { Button } from '../../Button'
import { Input } from '../../Input'

import styles from './ShiftDocumentForm.module.css'
import { useAppSelector } from '@store'
import { selectDocumentView } from '@store/app/selectors'

export const ShiftDocumentForm = () => {
  const { shiftNumber, registrationNumber, factoryNumber, fiscalStorageFactoryNumber } =
    useAppSelector(selectDocumentView)

  return (
    <div className={styles.root}>
      <Input
        name="shiftNumber"
        value={shiftNumber}
        label="Номер смены"
        disabled
        className={styles.marginBottom}
      />
      <Input
        name="registrationNumber"
        value={registrationNumber}
        label="Регистрационный номер ККМ"
        disabled
        className={styles.marginBottom}
      />
      <Input
        name="factoryNumber"
        value={factoryNumber}
        label="Заводской номер ККМ"
        disabled
        className={styles.marginBottom}
      />
      <Input
        name="fiscalStorageFactoryNumber"
        value={fiscalStorageFactoryNumber}
        label="Номер фискального накопителя"
        disabled
        className={styles.marginBottom}
      />
      <div className={styles.buttons}>
        <div className={styles.label}>Х-Отчет</div>
        <Button text="Cоздать" className={clsx(styles.width, styles.marginRight)} />
        <Button text="Печать" className={styles.width} />
      </div>
    </div>
  )
}