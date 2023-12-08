import clsx from 'clsx'
import { Input } from '../../Input'

import styles from './ChequeForm.module.css'

import { useAppSelector } from '@store'
import { Select } from '@components/Select'
import {
  selectDocumentCashier,
  selectDocumentPointOfSettlementAddress,
  selectDocumentTaxPayer,
} from '@store/document/selectors'
import { selectTaxationSystems } from '@store/app/selectors'

export const ChequeForm = () => {
  const taxationSystems = useAppSelector(selectTaxationSystems)
  const documentTaxPayer = useAppSelector(selectDocumentTaxPayer)
  const documentCashier = useAppSelector(selectDocumentCashier)
  const documentPointOfSettlementAddress = useAppSelector(selectDocumentPointOfSettlementAddress)

  return (
    <div className={styles.root}>
      <Select label={'Кассовый чек'} options={taxationSystems} onChange={() => {}} />
      <div className={clsx(styles.row, styles.marginBottom)}>
        <Input
          value={documentTaxPayer}
          name="kkm"
          label="Организация"
          labelDesc="полное наименование"
          className={styles.marginRight}
          classNameLabel={styles.widthLabel}
        />
        <Input
          name="inn"
          label="ИНН"
          classNameInput={styles.widthInputSmall}
          classNameLabel={styles.widthLabelSmall}
        />
      </div>
      <div className={clsx(styles.row, styles.marginBottom)}>
        <Input
          value={documentCashier}
          name="kkm2"
          label="ФИО кассира"
          className={styles.marginRight}
          classNameLabel={styles.widthLabel}
        />
        <Input
          name="inn"
          label="ИНН"
          classNameInput={styles.widthInputSmall}
          classNameLabel={styles.widthLabelSmall}
        />
      </div>
      <Input
        value={documentPointOfSettlementAddress}
        name="fiscal"
        label="Адрес точки"
        labelDesc="продажи"
        className={clsx(styles.marginBottom, styles.widthFull)}
        classNameInput={styles.widthFull}
        classNameLabel={styles.widthLabel}
      />

      <Select label={'Система налогооблажения'} options={taxationSystems} onChange={() => {}} />

      {/* // <Select
      //   name="number"
      //   label="Система налогообложения"
      //   className={styles.marginBottom}
      //   classNameLabel={styles.widthLabel}
      // /> */}
      <div className={clsx(styles.row, styles.marginBottom)}>
        <Input
          name="kkm2"
          label="E-mail клиента"
          className={styles.marginRight}
          classNameLabel={styles.widthLabel}
        />
        <Input
          name="inn"
          label="Тел"
          classNameInput={styles.widthInputSmall}
          classNameLabel={styles.widthLabelSmall}
        />
      </div>
      <Input
        name="kkm2"
        label="Номер документа основания"
        className={clsx(styles.widthFull, styles.marginBottom)}
        classNameInput={styles.widthFull}
        classNameLabel={styles.widthLabel}
      />
    </div>
  )
}
