import { BoxProps } from '@mui/material';
import { useEffect } from 'react';

type PageProps = BoxProps;

const Page = ({ children, title = '' }: PageProps) => {
  useEffect(() => {
    document.title = `${title} | Bench`;
  });
  return <>{children}</>;
};

export default Page;
