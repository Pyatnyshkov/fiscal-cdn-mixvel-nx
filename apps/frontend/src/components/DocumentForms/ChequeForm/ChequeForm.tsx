import clsx from 'clsx'
import styles from './ChequeForm.module.css'

import { useAppDispatch, useAppSelector } from '@store'

import { Input } from '@components/UI/Input'
import { Select } from '@components/UI/Select'

import { selectDocumentCheque } from '@store/document/selectors'
import { selectTaxationSystems } from '@store/app/selectors'
import { documentSlice } from '@store/document'
import { ChequeTypeSelectOptions } from '@consts'

export const ChequeForm = () => {
  const taxationSystems = useAppSelector(selectTaxationSystems)
  const cheque = useAppSelector(selectDocumentCheque)

  const dispatch = useAppDispatch()

  const handleChange = (value: string, name: string) => {
    const copyCheque = { ...cheque }

    console.log(value)

    //@ts-ignore

    copyCheque[name] = value

    dispatch(documentSlice.actions.updateCheque(copyCheque))
  }

  const onSubmit = () => {}

  return (
    <div className={styles.root}>
      <Select
        label={'Кассовый чек'}
        options={ChequeTypeSelectOptions}
        defaultValue={cheque.chequeType}
        onChange={(option) => handleChange(option?.value || '', 'chequeType')}
      />
      <div className={clsx(styles.row, styles.marginBottom)}>
        <Input
          value={cheque.taxPayerName}
          name="taxPayerName"
          label="Организация"
          labelDesc="полное наименование"
          className={styles.marginRight}
          classNameLabel={styles.widthLabel}
          onChange={(value, name) => handleChange(value, name)}
        />
        <Input
          value={cheque.taxPayerTin}
          name="taxPayerTin"
          label="ИНН"
          classNameInput={styles.widthInputSmall}
          classNameLabel={styles.widthLabelSmall}
          onChange={(value, name) => handleChange(value, name)}
        />
      </div>
      <div className={clsx(styles.row, styles.marginBottom)}>
        <Input
          value={cheque.cashierName}
          name="cashierName"
          label="ФИО кассира"
          className={styles.marginRight}
          classNameLabel={styles.widthLabel}
          onChange={(value, name) => handleChange(value, name)}
        />
        <Input
          value={cheque.cashierTin}
          name="cashierTin"
          label="ИНН"
          classNameInput={styles.widthInputSmall}
          classNameLabel={styles.widthLabelSmall}
          onChange={(value, name) => handleChange(value, name)}
        />
      </div>
      <Input
        value={cheque.pointOfSettlementAddress}
        name="pointOfSettlementAddress"
        label="Адрес точки"
        labelDesc="продажи"
        className={clsx(styles.marginBottom, styles.widthFull)}
        classNameInput={styles.widthFull}
        classNameLabel={styles.widthLabel}
        onChange={(value, name) => handleChange(value, name)}
      />

      <Select
        label={'Система налогооблажения'}
        options={taxationSystems}
        defaultValue="0"
        onChange={() => {}}
      />

      {/* // <Select
      //   name="number"
      //   label="Система налогообложения"
      //   className={styles.marginBottom}
      //   classNameLabel={styles.widthLabel}
      // /> */}
      <div className={clsx(styles.row, styles.marginBottom)}>
        <Input
          value={cheque.customerEmail}
          name="customerEmail"
          label="E-mail клиента"
          className={styles.marginRight}
          classNameLabel={styles.widthLabel}
          onChange={(value, name) => handleChange(value, name)}
        />
        <Input
          value={cheque.customerPhone}
          name="customerPhone"
          label="Тел"
          classNameInput={styles.widthInputSmall}
          classNameLabel={styles.widthLabelSmall}
          onChange={(value, name) => handleChange(value, name)}
        />
      </div>
      <Input
        value={cheque.referenceNumber}
        name="referenceNumber"
        label="Номер документа основания"
        className={clsx(styles.widthFull, styles.marginBottom)}
        classNameInput={styles.widthFull}
        classNameLabel={styles.widthLabel}
        onChange={(value, name) => handleChange(value, name)}
      />
    </div>
  )
}
