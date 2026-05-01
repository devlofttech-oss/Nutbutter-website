import { useEffect, useState } from 'react'
import { fetchContactMessages, resolveContactMessage } from '../../api/adminApi.js'
import AdminLayout from '../../components/AdminLayout.jsx'
import PageLoader from '../../components/PageLoader.jsx'
import { useToast } from '../../providers/ToastProvider.jsx'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState(null)
  const { showToast } = useToast()

  const load = async () => setMessages(await fetchContactMessages())

  useEffect(() => {
    load()
  }, [])

  return (
    <AdminLayout title="Contact Messages">
      {!messages ? <PageLoader message="Loading messages..." /> : (
        <section className="space-y-4">
          {messages.map((message) => (
            <article key={message.id} className="rounded-xl border border-outline-variant bg-white/50 p-5">
              <div className="flex justify-between gap-4 mb-3">
                <div>
                  <h2 className="font-serif text-xl text-primary">{message.name}</h2>
                  <p className="text-sm text-on-surface-variant">{message.email}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.16em] text-secondary">{message.status}</span>
              </div>
              <p className="text-on-surface-variant leading-7">{message.message}</p>
              {message.status !== 'resolved' && (
                <button className="mt-4 text-primary font-semibold" type="button" onClick={async () => { await resolveContactMessage(message.id); await load(); showToast('Message resolved') }}>Mark resolved</button>
              )}
            </article>
          ))}
          {messages.length === 0 && <div className="rounded-xl border border-outline-variant bg-surface-container-low p-10 text-center text-on-surface-variant">No messages yet.</div>}
        </section>
      )}
    </AdminLayout>
  )
}
