import { FC } from 'react';

const Loading: FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-md border-4 border-t-4 border-blue-500" />
    </div>
  );
};
export default Loading;
