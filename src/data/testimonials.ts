/**
 * Client testimonials. Only add entries that are genuine, attributable and
 * published with the client's written permission. The testimonial section
 * stays hidden while this list is empty.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  organization: string;
  /** Must be true — confirms the quote is real and approved for publication. */
  verified: true;
  permissionConfirmedOn: string;
};

export const testimonials: ReadonlyArray<Testimonial> = [];
