// d:/kaaya eco resort/client/src/components/admin/RoomManager.jsx
import { useState, useEffect } from 'react'
import { Plus, Edit2, ToggleLeft, ToggleRight, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api.js'
import { formatPrice, ROOM_TYPE_LABELS } from '../../utils/helpers.js'
import Spinner from '../common/Spinner.jsx'

const ROOM_TYPES = ['FAMILY_ROOM', 'FAMILY_CHALET', 'STANDARD_CHALET']
const DEFAULT_FORM = {
  name: '', slug: '', type: 'STANDARD_CHALET', description: '', longDescription: '',
  pricePerNight: '', maxAdults: '', maxChildren: '0', bedCount: '1',
  amenities: '', featured: false, active: true,
}

export default function RoomManager() {
  const [rooms,    setRooms]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState(null)
  const [form,     setForm]     = useState(DEFAULT_FORM)
  const [saving,   setSaving]   = useState(false)
  const [isNew,    setIsNew]    = useState(false)

  useEffect(() => {
    api.get('/rooms').then(({ data }) => setRooms(data.rooms)).catch(() => toast.error('Failed to load rooms')).finally(() => setLoading(false))
  }, [])

  const startEdit = (room) => {
    setEditing(room.id)
    setIsNew(false)
    setForm({
      name:            room.name,
      slug:            room.slug,
      type:            room.type,
      description:     room.description,
      longDescription: room.longDescription || '',
      pricePerNight:   String(room.pricePerNight),
      maxAdults:       String(room.maxAdults),
      maxChildren:     String(room.maxChildren),
      bedCount:        String(room.bedCount),
      amenities:       (room.amenities || []).join(', '),
      featured:        room.featured,
      active:          room.active !== false,
    })
  }

  const startNew = () => {
    setEditing('new')
    setIsNew(true)
    setForm(DEFAULT_FORM)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.pricePerNight || !form.maxAdults) {
      toast.error('Name, price, and max adults are required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        pricePerNight: Number(form.pricePerNight),
        maxAdults:     Number(form.maxAdults),
        maxChildren:   Number(form.maxChildren),
        bedCount:      Number(form.bedCount),
        amenities:     form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      }

      if (isNew) {
        const { data } = await api.post('/admin/rooms', payload)
        setRooms((prev) => [...prev, data.room])
        toast.success('Room created')
      } else {
        const { data } = await api.put(`/admin/rooms/${editing}`, payload)
        setRooms((prev) => prev.map((r) => r.id === editing ? { ...r, ...data.room } : r))
        toast.success('Room updated')
      }
      setEditing(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save room')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (id, currentActive) => {
    try {
      await api.put(`/admin/rooms/${id}`, { active: !currentActive })
      setRooms((prev) => prev.map((r) => r.id === id ? { ...r, active: !currentActive } : r))
      toast.success(`Room ${!currentActive ? 'activated' : 'deactivated'}`)
    } catch {
      toast.error('Failed to update room')
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={startNew} className="btn-primary py-2 px-4 text-xs gap-1.5">
          <Plus size={14} /> Add Room
        </button>
      </div>

      {/* Inline edit form */}
      {editing && (
        <form onSubmit={handleSave} className="bg-stone border border-sage/20 rounded-sm p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-timber text-lg font-semibold">{isNew ? 'New Room' : 'Edit Room'}</p>
            <button type="button" onClick={() => setEditing(null)}><X size={18} className="text-timber/50 hover:text-timber" /></button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block font-sans text-xs text-timber/50 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input-base" required />
            </div>
            <div>
              <label className="block font-sans text-xs text-timber/50 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="input-base" placeholder="auto-generated" />
            </div>
            <div>
              <label className="block font-sans text-xs text-timber/50 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} className="input-base">
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{ROOM_TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-sans text-xs text-timber/50 mb-1">Price / night (LKR) *</label>
              <input type="number" value={form.pricePerNight} onChange={(e) => setForm((p) => ({ ...p, pricePerNight: e.target.value }))} className="input-base" required min="0" />
            </div>
            <div>
              <label className="block font-sans text-xs text-timber/50 mb-1">Max Adults *</label>
              <input type="number" value={form.maxAdults} onChange={(e) => setForm((p) => ({ ...p, maxAdults: e.target.value }))} className="input-base" required min="1" />
            </div>
            <div>
              <label className="block font-sans text-xs text-timber/50 mb-1">Max Children</label>
              <input type="number" value={form.maxChildren} onChange={(e) => setForm((p) => ({ ...p, maxChildren: e.target.value }))} className="input-base" min="0" />
            </div>
            <div>
              <label className="block font-sans text-xs text-timber/50 mb-1">Bed Count</label>
              <input type="number" value={form.bedCount} onChange={(e) => setForm((p) => ({ ...p, bedCount: e.target.value }))} className="input-base" min="1" />
            </div>
            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} className="accent-sand" />
                <span className="font-sans text-sm text-timber">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} className="accent-sand" />
                <span className="font-sans text-sm text-timber">Active</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs text-timber/50 mb-1">Short Description</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} className="input-base resize-none" />
          </div>

          <div>
            <label className="block font-sans text-xs text-timber/50 mb-1">Amenities (comma-separated)</label>
            <input type="text" value={form.amenities} onChange={(e) => setForm((p) => ({ ...p, amenities: e.target.value }))} className="input-base" placeholder="Air conditioning, Wi-Fi, Hot water" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary py-2 px-5 text-xs gap-2 disabled:opacity-60">
              {saving ? <Spinner size="sm" color="white" /> : <Save size={13} />}
              {saving ? 'Saving…' : 'Save Room'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="btn-outline py-2 px-5 text-xs">Cancel</button>
          </div>
        </form>
      )}

      {/* Rooms list */}
      <div className="space-y-3">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white border border-sage/20 rounded-sm p-5 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge bg-forest/10 text-forest text-[10px]">{ROOM_TYPE_LABELS[room.type]}</span>
                {room.featured && <span className="badge bg-sand/20 text-timber text-[10px]">Featured</span>}
                {!room.active && <span className="badge bg-gray-100 text-gray-500 text-[10px]">Inactive</span>}
              </div>
              <p className="font-sans font-semibold text-timber text-sm">{room.name}</p>
              <p className="font-display text-forest text-lg font-semibold">{formatPrice(room.pricePerNight)}<span className="font-sans text-xs text-timber/40 font-normal">/night</span></p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleActive(room.id, room.active)}
                className={`p-2 rounded-sm transition-colors ${room.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                title={room.active ? 'Deactivate' : 'Activate'}
              >
                {room.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
              </button>
              <button onClick={() => startEdit(room)} className="p-2 text-timber/50 hover:text-sand transition-colors" aria-label="Edit room">
                <Edit2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
