import { useAppSelector } from '@store'
import { selectAppError } from '@store/app/selectors'

import styles from './Error.module.css'

export const ShiftError = () => {
	const { type, code, description } = useAppSelector(selectAppError)
	return !description ? null : (
		<div className={styles.container}>
			<div className={styles.point}></div>
			{description}
		</div>
	)
}
