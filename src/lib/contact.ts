export type ContactMessage = { name: string; email: string; phone: string; message: string };
export function composeEmail(values: ContactMessage) {
  const subject = `Konsultasi Equipment - ${values.name.trim().replace(/[\r\n]+/g, " ")}`;
  const body = `Nama: ${values.name.trim()}\nEmail: ${values.email.trim()}\nTelepon: ${values.phone.trim()}\n\n${values.message.trim()}`;
  return `mailto:marketing@liftco.co.id?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
