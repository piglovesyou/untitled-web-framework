export default function toBase64(str: string) {
  const buffer = Buffer.from(str);
  return buffer.toString('base64');
}
