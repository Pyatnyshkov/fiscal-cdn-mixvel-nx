import clsx from 'clsx'
import { Input } from '../../UI/Input'

import styles from './ChequeTotalForm.module.css'

import { useAppDispatch, useAppSelector } from '@store'
import { selectDocumentChequeTotal } from '@store/document/selectors'
import { Button } from '@components/UI/Button'
import { documentSlice, fetchIssueDocumentCheque } from '@store/document'

export const ChequeTotalForm = () => {
  const chequeTotal = useAppSelector(selectDocumentChequeTotal)

  const dispatch = useAppDispatch()

  const onChange = (value: string, name: string) => {
    const copyChequeTotal = { ...chequeTotal }
    //@ts-ignore
    copyChequeTotal[name] = value

    dispatch(documentSlice.actions.updateChequeTotal(copyChequeTotal))
  }

  const handleSubmit = () => {
    dispatch(fetchIssueDocumentCheque)
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>Итого:</div>
      <div className={styles.form}>
        <Input
          value={chequeTotal.electronicAmount}
          name="electronicAmount"
          label="Электронно"
          className={styles.inputMarginButton}
          classNameInput={styles.inputWidth}
          classNameLabel={styles.inputWidthLabel}
          onChange={(value, name) => onChange(value, name)}
        />
        <Input
          value={chequeTotal.cashAmount}
          name="cashAmount"
          label="Наличные"
          className={styles.inputMarginButton}
          classNameInput={styles.inputWidth}
          classNameLabel={styles.inputWidthLabel}
          onChange={(value, name) => onChange(value, name)}
        />
        <Input
          value={chequeTotal.considerationAmount}
          name="considerationAmount"
          label="Встречное предоставление"
          labelDesc="мена и аналогичн."
          className={styles.inputMarginButton}
          classNameInput={styles.inputWidth}
          classNameLabel={styles.inputWidthLabel}
          onChange={(value, name) => onChange(value, name)}
        />
        <Input
          value={chequeTotal.electronicMaskedCardPAN}
          name="electronicMaskedCardPAN"
          label="Номер карты"
          labelDesc="маскированный"
          className={styles.inputMarginButton}
          classNameInput={styles.inputWidth}
          classNameLabel={styles.inputWidthLabel}
          onChange={(value, name) => onChange(value, name)}
        />
        <div className={styles.row}>
          <Input
            value={chequeTotal.copies}
            name="copies"
            label="Чек"
            labelDesc="экземпляры"
            classNameInput={styles.inputWidthSmall}
            classNameLabel={styles.inputWidthLabel}
            onChange={(value, name) => onChange(value, name)}
          />
          <div className={styles.original}>Оригинал чека без копий</div>
        </div>
        <div className={styles.footer}>
          <Button text="Сформировать" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
