"use client";
import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { composeEmail } from "@/lib/contact";
export function ContactForm() {
  const [composed, setComposed] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = { name: String(data.get("name") || ""), email: String(data.get("email") || ""), phone: String(data.get("phone") || ""), message: String(data.get("message") || "") };
    if (!values.name.trim() || !values.message.trim()) { event.currentTarget.querySelector<HTMLInputElement>(!values.name.trim() ? "[name=name]" : "[name=message]")?.focus(); return; }
    window.location.href = composeEmail(values); setComposed(true);
  }
  return <form className="contact-form" onSubmit={submit}><h2>Tulis Kebutuhan Anda</h2><p>Form ini membuka draf di aplikasi email Anda. Pesan tidak dikirim atau disimpan oleh situs.</p><label htmlFor="contact-name">Nama <span aria-hidden="true">*</span></label><Input id="contact-name" name="name" placeholder="Nama" autoComplete="name" required maxLength={100} /><label htmlFor="contact-email">Email <span aria-hidden="true">*</span></label><Input id="contact-email" name="email" type="email" placeholder="Email" autoComplete="email" required maxLength={254} /><label htmlFor="contact-phone">Nomor Telepon</label><Input id="contact-phone" name="phone" type="tel" placeholder="Nomor Telepon" autoComplete="tel" maxLength={30} /><label htmlFor="contact-message">Pesan <span aria-hidden="true">*</span></label><textarea id="contact-message" name="message" placeholder="Ceritakan kebutuhan equipment Anda" required maxLength={2000} rows={5} /><Button type="submit" className="solid-button">Buka Draf Email <ArrowRight size={16} /></Button>{composed && <p className="compose-notice" role="status">Kirim pesan dari aplikasi email Anda. Jika tidak terbuka, email langsung ke <a href="mailto:marketing@liftco.co.id">marketing@liftco.co.id</a>.</p>}</form>;
}
