import Layout from './Layout';

/* eslint-disable-next-line */
export interface RegistratorStatusProps {}

export function RegistratorStatus(props: RegistratorStatusProps) {
  const status = 'rejected';
  const timelimit = 115;
  const elem = 'registrator';
  return (
    <Layout 
      status={status}
      timelimit={timelimit}
      elem={elem}
    />
  );
}

export default RegistratorStatus;