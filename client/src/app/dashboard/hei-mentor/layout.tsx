// src/app/dashboard/hei-mentor/layout.tsx

import React from 'react';

interface HEIMentorLayoutProps {
  children: React.ReactNode;
}

export default function HEIMentorLayout({ children }: HEIMentorLayoutProps) {
  // The main dashboard layout handles the sidebar and header
  // This layout just provides any HEI mentor specific context if needed
  return (
    <>
      {children}
    </>
  );
}
