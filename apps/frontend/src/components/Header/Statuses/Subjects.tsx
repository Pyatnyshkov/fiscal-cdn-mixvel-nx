import Layout from './Layout';

/* eslint-disable-next-line */
export interface SubjectsStatusProps {}

export function SubjectsStatus(props: SubjectsStatusProps) {
  const status = 'fetching';
  const elem = 'subjects';
  return (
    <Layout 
      status={status}
      elem={elem}
    />
  );
}

export default SubjectsStatus;