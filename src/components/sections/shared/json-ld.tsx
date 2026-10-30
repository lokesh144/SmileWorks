/**
 * Renders structured data. `<` is escaped so content can never close the
 * script element early.
 */
export function JsonLd({ data, nonce }: { data: Record<string, unknown>; nonce?: string }) {
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
