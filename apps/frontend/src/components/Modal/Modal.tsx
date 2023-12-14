import { createPortal } from 'react-dom'
import { PropsWithChildren, useState } from 'react'

import styles from './Modal.module.css'

interface Modal {
  onClickOverlay: () => void
}

export const Modal: React.FC<PropsWithChildren<Modal>> = ({ onClickOverlay, children }) => {
  return createPortal(
    <div className={styles.root}>
      <div className={styles.modal}>{children}</div>
      <div className={styles.overlay} onClick={() => onClickOverlay()}></div>
    </div>,
    document.body
  )
}
