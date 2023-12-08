import { Input } from '../Input'

import styles from './ManualCheckTotal.module.css'
import { Button } from '../Button'

export const ManualCheckTotal = () => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>Итого:</div>
      <div className={styles.form}>
        <Input
          name="kkm"
          label="Электронно"
          className={styles.inputMarginButton}
          classNameInput={styles.inputWidth}
          classNameLabel={styles.inputWidthLabel}
        />
        <Input
          name="kkm"
          label="Наличные"
          className={styles.inputMarginButton}
          classNameInput={styles.inputWidth}
          classNameLabel={styles.inputWidthLabel}
        />
        <Input
          name="kkm"
          label="Встречное предоставление"
          labelDesc="мена и аналогичн."
          className={styles.inputMarginButton}
          classNameInput={styles.inputWidth}
          classNameLabel={styles.inputWidthLabel}
        />
        <Input
          name="kkm"
          label="Номер карты"
          labelDesc="маскированный"
          className={styles.inputMarginButton}
          classNameInput={styles.inputWidth}
          classNameLabel={styles.inputWidthLabel}
        />
        <div className={styles.row}>
          <Input
            name="kkm"
            label="Чек"
            labelDesc="экземпляры"
            classNameInput={styles.inputWidthSmall}
            classNameLabel={styles.inputWidthLabel}
          />
          <div className={styles.original}>Оригинал чека без копий</div>
        </div>
        <div className={styles.footer}>
          <Button text="Сформировать" />
        </div>
      </div>
    </div>
  )
}
