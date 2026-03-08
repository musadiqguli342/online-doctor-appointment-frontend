

import { Suspense } from "react";
import BookAppointmentClient from "../BookAppointmentClient/page";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
      <BookAppointmentClient />
    </Suspense>
  );
}



