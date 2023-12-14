import clsx from 'clsx'
import styles from './ChequeForm.module.css'

import { useAppDispatch, useAppSelector } from '@store'

import { Input } from '@components/UI/Input'
import { Select } from '@components/UI/Select'

import { selectAppTaxationSystem } from '@store/app/selectors'
import { ChequeTypeSelectOptions } from '@consts'

import { convertToSelectOptions } from '@utils/convertToSelectOptions'
import { updateDocumentCheque } from '@store/documentCheque/thunks'
import { selectDocumentChequeValues } from '@store/documentCheque/selectors'

export const ChequeForm = () => {
  const taxationSystem = useAppSelector(selectAppTaxationSystem)
  const documentChequeValues = useAppSelector(selectDocumentChequeValues)
  console.log('taxationSystem', taxationSystem)

  const TaxationSystemsSelectOptions = convertToSelectOptions(taxationSystem)

  console.log('TaxationSystemsSelectOptions', TaxationSystemsSelectOptions)
  console.log('ChequeTypeSelectOptions', ChequeTypeSelectOptions)

  const dispatch = useAppDispatch()

  const handleUpdateCheque = (value: string, name: string) => {
    dispatch(updateDocumentCheque(value, name))
  }

  return (
    <div className={styles.root}>
      <Select
        label={'Кассовый чек'}
        options={ChequeTypeSelectOptions}
        defaultValue={documentChequeValues.chequeType}
        onChange={(option) => handleUpdateCheque(option?.value || '', 'chequeType')}
        className={styles.marginBottom}
        classNameLabel={styles.widthLabel}
      />
      <div className={clsx(styles.row, styles.marginBottom)}>
        <Input
          value={documentChequeValues.taxPayerName}
          name="taxPayerName"
          label="Организация"
          labelDesc="полное наименование"
          className={styles.marginRight}
          classNameLabel={styles.widthLabel}
          onChange={(value, name) => handleUpdateCheque(value, name)}
        />
        <Input
          value={documentChequeValues.taxPayerTin}
          name="taxPayerTin"
          label="ИНН"
          classNameInput={styles.widthInputSmall}
          classNameLabel={styles.widthLabelSmall}
          onChange={(value, name) => handleUpdateCheque(value, name)}
        />
      </div>
      <div className={clsx(styles.row, styles.marginBottom)}>
        <Input
          value={documentChequeValues.cashierName}
          name="cashierName"
          label="ФИО кассира"
          className={styles.marginRight}
          classNameLabel={styles.widthLabel}
          onChange={(value, name) => handleUpdateCheque(value, name)}
        />
        <Input
          value={documentChequeValues.cashierTin}
          name="cashierTin"
          label="ИНН"
          classNameInput={styles.widthInputSmall}
          classNameLabel={styles.widthLabelSmall}
          onChange={(value, name) => handleUpdateCheque(value, name)}
        />
      </div>
      <Input
        value={documentChequeValues.pointOfSettlementAddress}
        name="pointOfSettlementAddress"
        label="Адрес точки"
        labelDesc="продажи"
        className={clsx(styles.marginBottom, styles.widthFull)}
        classNameInput={styles.widthFull}
        classNameLabel={styles.widthLabel}
        onChange={(value, name) => handleUpdateCheque(value, name)}
      />

      <Select
        label={'Система налогооблажения'}
        options={TaxationSystemsSelectOptions}
        defaultValue={documentChequeValues.taxationSystem}
        onChange={(option) => handleUpdateCheque(option?.value || '', 'taxationSystem')}
        className={styles.marginBottom}
        classNameLabel={styles.widthLabel}
      />

      {/* // <Select
      //   name="number"
      //   label="Система налогообложения"
      //   className={styles.marginBottom}
      //   classNameLabel={styles.widthLabel}
      // /> */}
      <div className={clsx(styles.row, styles.marginBottom)}>
        <Input
          value={documentChequeValues.customerEmail}
          name="customerEmail"
          label="E-mail клиента"
          className={styles.marginRight}
          classNameLabel={styles.widthLabel}
          onChange={(value, name) => handleUpdateCheque(value, name)}
        />
        <Input
          value={documentChequeValues.customerPhone}
          name="customerPhone"
          label="Тел"
          classNameInput={styles.widthInputSmall}
          classNameLabel={styles.widthLabelSmall}
          onChange={(value, name) => handleUpdateCheque(value, name)}
        />
      </div>
      <Input
        value={documentChequeValues.referenceNumber}
        name="referenceNumber"
        label="Номер документа основания"
        className={clsx(styles.widthFull, styles.marginBottom)}
        classNameInput={styles.widthFull}
        classNameLabel={styles.widthLabel}
        onChange={(value, name) => handleUpdateCheque(value, name)}
      />
    </div>
  )
}
