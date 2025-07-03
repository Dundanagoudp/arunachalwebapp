// import React, { Suspense } from 'react';
// import Archive from "@/components/(public)/archive/archive";

// function ArchiveClientWrapper() {
//   'use client';
//   return <Archive />;
// }

// export default function Archivepage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <ArchiveClientWrapper />
//     </Suspense>
//   );
// } 

'use client'; 

import React, { Suspense } from 'react';
import Archive from "@/components/(public)/archive/archive";

function ArchiveClientWrapper() {
  return <Archive />;
}

export default function ArchivePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArchiveClientWrapper />
    </Suspense>
  );
}
