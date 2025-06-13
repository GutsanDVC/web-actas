import React, { useState } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

const CLIENT_ID = 'REEMPLAZAR_CON_TU_CLIENT_ID.apps.googleusercontent.com';

interface Topic {
  title: string;
  description: string;
}

interface Payload {
  recipients: string[];
  subject: string;
  date: string;
  next_meeting: string;
  participants: string[];
  topics: Topic[];
  sender: string;
  access_token: string;
}

export default function App() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({
    recipients: '',
    subject: '',
    date: '',
    next_meeting: '',
    participants: '',
    topicTitle: '',
    topicDescription: '',
  });

  const handleAuth = () => {
    if (!window.google || token) return;
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'https://mail.google.com/ https://www.googleapis.com/auth/userinfo.email',
      callback: (response: any) => {
        setToken(response.access_token);
        if (response.id_token) {
          const payload = JSON.parse(atob(response.id_token.split('.')[1]));
          setEmail(payload.email);
        }
      },
    });
    client.requestAccessToken();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) {
      alert('Autenticación requerida');
      return;
    }
    const payload: Payload = {
      recipients: form.recipients.split(',').map(r => r.trim()).filter(Boolean),
      subject: form.subject,
      date: form.date,
      next_meeting: form.next_meeting,
      participants: form.participants.split(',').map(p => p.trim()).filter(Boolean),
      topics: [{ title: form.topicTitle, description: form.topicDescription }],
      sender: email,
      access_token: token,
    };
    const res = await fetch('http://localhost:8001/send-acta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    alert(JSON.stringify(data));
  };

  return (
    <div>
      <h1>Enviar Acta por Gmail</h1>
      {token ? (
        <p>Autenticado como {email}</p>
      ) : (
        <button onClick={handleAuth}>Autenticarse con Google</button>
      )}
      <form onSubmit={handleSubmit}>
        <input
          name="recipients"
          placeholder="destinatario1@example.com,destinatario2@example.com"
          value={form.recipients}
          onChange={handleChange}
        />
        <input
          name="subject"
          placeholder="Asunto"
          value={form.subject}
          onChange={handleChange}
        />
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <input name="next_meeting" type="date" value={form.next_meeting} onChange={handleChange} />
        <input
          name="participants"
          placeholder="Juan,Pablo"
          value={form.participants}
          onChange={handleChange}
        />
        <input
          name="topicTitle"
          placeholder="Título del tópico"
          value={form.topicTitle}
          onChange={handleChange}
        />
        <textarea
          name="topicDescription"
          placeholder="Descripción del tópico"
          value={form.topicDescription}
          onChange={handleChange}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
