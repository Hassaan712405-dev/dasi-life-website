'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  Search,
  Loader2,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  Archive,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  getAllContactMessages,
  updateMessageStatus,
  deleteContactMessage,
  type ContactMessage,
} from '@/services/contact/contactService';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  read: 'bg-yellow-100 text-yellow-700',
  replied: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-700',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  read: 'Read',
  replied: 'Replied',
  archived: 'Archived',
};

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    const data = await getAllContactMessages();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleStatusChange = async (
    id: string,
    status: ContactMessage['status']
  ) => {
    setUpdating(true);
    const result = await updateMessageStatus(id, status);
    if (result.success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selected?.id === id) {
        setSelected({ ...selected, status });
      }
    }
    setUpdating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    setUpdating(true);
    const result = await deleteContactMessage(id);
    if (result.success) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    }
    setUpdating(false);
  };

  const filtered = messages.filter((m) => {
    const matchesFilter = filter === 'all' || m.status === filter;
    const matchesSearch =
      search === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: messages.length,
    new: messages.filter((m) => m.status === 'new').length,
    read: messages.filter((m) => m.status === 'read').length,
    replied: messages.filter((m) => m.status === 'replied').length,
    archived: messages.filter((m) => m.status === 'archived').length,
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-brand-green mb-2">
          Contact Messages
        </h1>
        <p className="text-sm text-brand-text-muted">
          Customer inquiries from the contact form.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(['all', 'new', 'read', 'replied', 'archived'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
              filter === tab
                ? 'bg-brand-green text-white'
                : 'bg-white border border-gray-200 text-brand-text-muted hover:border-brand-green'
            }`}
          >
            {STATUS_LABELS[tab] || 'All'} ({counts[tab]})
          </button>
        ))}
      </div>

      <div className="relative mb-5">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or message..."
          className="w-full bg-white border border-gray-200 rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5">
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin text-brand-green" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Mail size={40} className="text-brand-text-muted mx-auto mb-3" />
              <p className="text-sm text-brand-text-muted">
                No messages found.
              </p>
            </div>
          ) : (
            filtered.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  setSelected(msg);
                  if (msg.status === 'new') {
                    handleStatusChange(msg.id, 'read');
                  }
                }}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                  selected?.id === msg.id
                    ? 'border-brand-green ring-2 ring-brand-green/20'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-brand-text-dark truncate">
                      {msg.name}
                    </p>
                    <p className="text-xs text-brand-text-muted truncate">
                      {msg.email}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                      STATUS_COLORS[msg.status]
                    }`}
                  >
                    {STATUS_LABELS[msg.status]}
                  </span>
                </div>
                {msg.subject && (
                  <p className="text-xs font-medium text-brand-green mb-1">
                    {msg.subject}
                  </p>
                )}
                <p className="text-xs text-brand-text-muted line-clamp-2 mb-2">
                  {msg.message}
                </p>
                <p className="text-[10px] text-brand-text-muted">
                  {new Date(msg.created_at).toLocaleString('en-PK')}
                </p>
              </motion.div>
            ))
          )}
        </div>

        <div className="lg:sticky lg:top-6 h-fit">
          {selected ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-heading font-semibold text-lg text-brand-green">
                  Message Details
                </h2>
                <button
                  onClick={() => handleDelete(selected.id)}
                  disabled={updating}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-[10px] text-brand-text-muted uppercase tracking-wide mb-1">
                    From
                  </p>
                  <p className="text-sm font-semibold text-brand-text-dark">
                    {selected.name}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-brand-text-muted uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Mail size={10} />
                    Email
                  </p>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-sm text-brand-green hover:underline"
                  >
                    {selected.email}
                  </a>
                </div>

                {selected.phone && (
                  <div>
                    <p className="text-[10px] text-brand-text-muted uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Phone size={10} />
                      Phone
                    </p>
                    <a
                      href={`tel:${selected.phone}`}
                      className="text-sm text-brand-green hover:underline"
                    >
                      {selected.phone}
                    </a>
                  </div>
                )}

                {selected.subject && (
                  <div>
                    <p className="text-[10px] text-brand-text-muted uppercase tracking-wide mb-1">
                      Subject
                    </p>
                    <p className="text-sm text-brand-text-dark">
                      {selected.subject}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-[10px] text-brand-text-muted uppercase tracking-wide mb-1">
                    Message
                  </p>
                  <p className="text-sm text-brand-text-dark leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-brand-text-muted uppercase tracking-wide mb-1">
                    Received
                  </p>
                  <p className="text-xs text-brand-text-muted">
                    {new Date(selected.created_at).toLocaleString('en-PK')}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-[10px] text-brand-text-muted uppercase tracking-wide mb-2">
                  Change Status
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange(selected.id, 'new')}
                    disabled={updating}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    <AlertCircle size={12} />
                    New
                  </button>
                  <button
                    onClick={() => handleStatusChange(selected.id, 'read')}
                    disabled={updating}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-md text-xs font-medium hover:bg-yellow-100 transition-colors disabled:opacity-50"
                  >
                    <Eye size={12} />
                    Read
                  </button>
                  <button
                    onClick={() => handleStatusChange(selected.id, 'replied')}
                    disabled={updating}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-md text-xs font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 size={12} />
                    Replied
                  </button>
                  <button
                    onClick={() => handleStatusChange(selected.id, 'archived')}
                    disabled={updating}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <Archive size={12} />
                    Archived
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${
                    selected.subject || 'Your inquiry'
                  }`}
                  className="block w-full text-center bg-brand-green hover:bg-black text-white font-medium py-2.5 rounded-md transition-colors text-sm"
                >
                  Reply via Email
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Clock size={32} className="text-brand-text-muted mx-auto mb-3" />
              <p className="text-sm text-brand-text-muted">
                Select a message to view details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}