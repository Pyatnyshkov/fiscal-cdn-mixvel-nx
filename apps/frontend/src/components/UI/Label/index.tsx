import styles from './index.module.css';

/* eslint-disable-next-line */
export interface LabelProps {
  label: string;
  value?: string;
  name: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: string;
}

export function Label({ label, value = '', name, handleChange, size = 'm' }: LabelProps) {
  return (
    <label className={styles['container']}>
      <div className={styles['label']}>{label}</div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        className={`${styles['value']} ${value ? styles['has_data'] : null} ${styles[size]}`}
      />
    </label>
  );
}

export default Label;
