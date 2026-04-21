// d:/kaaya eco resort/client/src/components/admin/GalleryUploader.jsx
import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, RefreshCw, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api.js'
import Spinner from '../common/Spinner.jsx'

const CATEGORIES = ['accommodation', 'wildlife', 'lake', 'dining', 'activities', 'general']

export default function GalleryUploader() {
  const [images,      setImages]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [uploading,   setUploading]   = useState(false)
  const [deleting,    setDeleting]    = useState(null)
  const [showForm,    setShowForm]    = useState(false)
  const [form,        setForm]        = useState({ url: '', publicId: '', category: 'general', caption: '' })
  const fileRef = useRef(null)

  const fetchImages = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/gallery')
      setImages(data.images)
    } catch {
      toast.error('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchImages() }, [])

  const handleAddManual = async (e) => {
    e.preventDefault()
    if (!form.url || !form.publicId) { toast.error('URL and Public ID are required'); return }
    setUploading(true)
    try {
      const { data } = await api.post('/admin/gallery', form)
      setImages((prev) => [data.image, ...prev])
      setForm({ url: '', publicId: '', category: 'general', caption: '' })
      setShowForm(false)
      toast.success('Image added to gallery')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add image')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this image from the gallery?')) return
    setDeleting(id)
    try {
      await api.delete(`/admin/gallery/${id}`)
      setImages((prev) => prev.filter((img) => img.id !== id))
      toast.success('Image removed')
    } catch {
      toast.error('Failed to remove image')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-sans text-sm text-timber/60">{images.length} images in gallery</p>
        <div className="flex items-center gap-3">
          <button onClick={fetchImages} className="p-2 text-timber/50 hover:text-timber" aria-label="Refresh">
            <RefreshCw size={15} />
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary py-2 px-4 text-xs gap-1.5"
          >
            <Plus size={14} /> Add Image
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAddManual} className="bg-stone border border-sage/20 rounded-sm p-6 mb-6 space-y-4">
          <p className="font-sans text-xs uppercase tracking-wider text-timber/50 font-semibold">Add Cloudinary Image</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs text-timber/50 mb-1">Cloudinary URL *</label>
              <input type="url" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                placeholder="https://res.cloudinary.com/..." className="input-base" required />
            </div>
            <div>
              <label className="block font-sans text-xs text-timber/50 mb-1">Public ID *</label>
              <input type="text" value={form.publicId} onChange={(e) => setForm((p) => ({ ...p, publicId: e.target.value }))}
                placeholder="kaaya/gallery/image_name" className="input-base" required />
            </div>
            <div>
              <label className="block font-sans text-xs text-timber/50 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="input-base">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-sans text-xs text-timber/50 mb-1">Caption</label>
              <input type="text" value={form.caption} onChange={(e) => setForm((p) => ({ ...p, caption: e.target.value }))}
                placeholder="Image description" className="input-base" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={uploading} className="btn-primary py-2 px-5 text-xs gap-2 disabled:opacity-60">
              {uploading ? <Spinner size="sm" color="white" /> : <Upload size={13} />}
              {uploading ? 'Adding…' : 'Add to Gallery'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline py-2 px-5 text-xs">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-sage/30 rounded-sm">
          <Upload size={28} className="text-sage/50 mx-auto mb-3" />
          <p className="font-sans text-timber/40 text-sm">No images yet. Add your first image above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative rounded-sm overflow-hidden bg-sage/10 aspect-square">
              <img src={img.url} alt={img.caption || 'Gallery'} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-timber/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                <span className="font-sans text-stone text-xs text-center leading-tight">{img.caption || img.category}</span>
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={deleting === img.id}
                  className="p-2 bg-terra/80 hover:bg-terra rounded-sm text-stone transition-colors disabled:opacity-50"
                  aria-label="Delete image"
                >
                  {deleting === img.id ? <Spinner size="sm" color="white" /> : <Trash2 size={14} />}
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-timber/60 to-transparent p-2">
                <span className="badge bg-forest/60 text-stone/80 text-[9px]">{img.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
