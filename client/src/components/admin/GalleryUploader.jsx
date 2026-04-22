// d:/kaaya eco resort/client/src/components/admin/GalleryUploader.jsx
import { useState, useEffect } from 'react'
import { Upload, Trash2, RefreshCw, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api.js'
import Spinner from '../common/Spinner.jsx'

const CATEGORIES = ['accommodation', 'wildlife', 'lake', 'dining', 'activities', 'general']

export default function GalleryUploader() {
  const [images,    setImages]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting,  setDeleting]  = useState(null)
  const [showForm,  setShowForm]  = useState(false)
  const [form,      setForm]      = useState({ url: '', publicId: '', category: 'general', caption: '' })

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

  const handleAdd = async (e) => {
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
      <div className="flex items-center justify-between mb-5">
        <p className="font-sans text-sm text-timber/50">{images.length} image{images.length !== 1 ? 's' : ''} in gallery</p>
        <div className="flex items-center gap-2">
          <button onClick={fetchImages} className="p-2 text-timber/40 hover:text-timber rounded-md hover:bg-white transition-colors" title="Refresh">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2 px-4 text-xs gap-1.5">
            {showForm ? <X size={13} /> : <Plus size={13} />}
            {showForm ? 'Cancel' : 'Add Image'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-sage/20 rounded-lg p-5 mb-5">
          <p className="font-sans text-xs uppercase tracking-wider text-timber/40 font-semibold mb-4">Add Cloudinary Image</p>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs font-medium text-timber/50 mb-1.5">Cloudinary URL <span className="text-terra">*</span></label>
                <input type="url" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                  placeholder="https://res.cloudinary.com/..." className="input-base" required />
              </div>
              <div>
                <label className="block font-sans text-xs font-medium text-timber/50 mb-1.5">Public ID <span className="text-terra">*</span></label>
                <input type="text" value={form.publicId} onChange={(e) => setForm((p) => ({ ...p, publicId: e.target.value }))}
                  placeholder="kaaya/gallery/image_name" className="input-base" required />
              </div>
              <div>
                <label className="block font-sans text-xs font-medium text-timber/50 mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="input-base">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-sans text-xs font-medium text-timber/50 mb-1.5">Caption</label>
                <input type="text" value={form.caption} onChange={(e) => setForm((p) => ({ ...p, caption: e.target.value }))}
                  placeholder="Image description" className="input-base" />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={uploading} className="btn-primary py-2 px-5 text-xs gap-2 disabled:opacity-60">
                {uploading ? <Spinner size="sm" color="white" /> : <Upload size={13} />}
                {uploading ? 'Adding…' : 'Add to Gallery'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline py-2 px-5 text-xs">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-sage/30 rounded-lg bg-white">
          <Upload size={28} className="text-sage/40 mx-auto mb-3" />
          <p className="font-sans text-timber/40 text-sm">No images yet. Add your first image above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {images.map((img) => (
            <div key={img.id} className="group relative rounded-lg overflow-hidden bg-sage/10 aspect-square border border-sage/20">
              <img src={img.url} alt={img.caption || 'Gallery'} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-timber/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                {img.caption && (
                  <p className="font-sans text-white text-[10px] text-center leading-tight line-clamp-2">{img.caption}</p>
                )}
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={deleting === img.id}
                  className="p-2 bg-terra/80 hover:bg-terra rounded-md text-white transition-colors disabled:opacity-50"
                >
                  {deleting === img.id ? <Spinner size="sm" color="white" /> : <Trash2 size={13} />}
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-forest/60 text-white/80 text-[9px] font-medium">{img.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
