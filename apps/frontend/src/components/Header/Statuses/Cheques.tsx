import Layout from './Layout';

/* eslint-disable-next-line */
export interface ChequesStatusProps {}

export function ChequesStatus(props: ChequesStatusProps) {
  const status = 'fullfilled';
  const elem = 'cheques';
  return (
    <Layout 
      status={status}
      elem={elem}
    />
  );
}

export default ChequesStatus;