import React, { ReactNode, HTMLAttributes } from 'react';

interface SectionWrapperProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  ...props
}) => (
  <section {...props} className={`py-16 ${props.className || ''}`}>
    {children}
  </section>
);

export default SectionWrapper;
