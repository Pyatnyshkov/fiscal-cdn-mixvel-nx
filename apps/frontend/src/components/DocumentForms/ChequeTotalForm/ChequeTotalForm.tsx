import { Input } from '../../UI/Input'

import styles from './ChequeTotalForm.module.css'

import { useAppDispatch, useAppSelector } from '@store'
import { selectSendButtonVisible } from '@store/document/selectors'
import { Button } from '@components/UI/Button'

import { selectDocumentChequeValues } from '@store/documentCheque/selectors'
import { fetchIssueDocumentCheque } from '@store/document/thunks'
import { updateDocumentCheque } from '@store/documentCheque/thunks'

export const ChequeTotalForm = () => {
  const documentChequeValues = useAppSelector(selectDocumentChequeValues)
  const sendButtonVisible = useAppSelector(selectSendButtonVisible)

  const dispatch = useAppDispatch()

  const handleUpdateCheque = (value: string, name: string) => {
    dispatch(updateDocumentCheque(value, name))
  }

  const handleSubmit = () => {
    dispatch(fetchIssueDocumentCheque)
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>Итого:</div>
      <div className={styles.form}>
        <Input
          value={documentChequeValues.electronicAmount}
          name="electronicAmount"
          label="Электронно"
          className={styles.inputMarginButton}
          classNameInput={styles.inputWidth}
          classNameLabel={styles.inputWidthLabel}
          onChange={(value, name) => handleUpdateCheque(value, name)}
        />
        <Input
          value={documentChequeValues.cashAmount}
          name="cashAmount"
          label="Наличные"
          className={styles.inputMarginButton}
          classNameInput={styles.inputWidth}
          classNameLabel={styles.inputWidthLabel}
          onChange={(value, name) => handleUpdateCheque(value, name)}
        />
        <Input
          value={documentChequeValues.considerationAmount}
          name="considerationAmount"
          label="Встречное предоставление"
          labelDesc="мена и аналогичн."
          className={styles.inputMarginButton}
          classNameInput={styles.inputWidth}
          classNameLabel={styles.inputWidthLabel}
          onChange={(value, name) => handleUpdateCheque(value, name)}
        />
        <Input
          value={documentChequeValues.electronicMaskedCardPAN}
          name="electronicMaskedCardPAN"
          label="Номер карты"
          labelDesc="маскированный"
          className={styles.inputMarginButton}
          classNameInput={styles.inputWidth}
          classNameLabel={styles.inputWidthLabel}
          onChange={(value, name) => handleUpdateCheque(value, name)}
        />
        <div className={styles.row}>
          <Input
            value={documentChequeValues.copies}
            name="copies"
            label="Чек"
            labelDesc="экземпляры"
            classNameInput={styles.inputWidthSmall}
            classNameLabel={styles.inputWidthLabel}
            onChange={(value, name) => handleUpdateCheque(value, name)}
          />
          <div className={styles.original}>Оригинал чека без копий</div>
        </div>
        <div className={styles.footer}>
          {sendButtonVisible ? <Button text="Сформировать" onClick={handleSubmit} /> : null}
        </div>
      </div>
    </div>
  )
}
