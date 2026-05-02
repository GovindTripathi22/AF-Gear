'use client'

import { useState, useTransition } from 'react'
import { type Category } from '@/services/categoryService'
import { saveCategory, deleteCategory } from '@/app/(admin)/admin/categories/actions'
import { toast } from 'sonner'
import {
    Plus, Trash2, Edit3, X, Check, GripVertical,
    Tag, Image as ImageIcon, Link as LinkIcon, AlignLeft, Hash, Palette,
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

const slugify = (s: string) =>
    s.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

// ── Sub-components ────────────────────────────────────────────────────────────

interface FieldProps {
    label: string
    icon?: React.ReactNode
    children: React.ReactNode
    hint?: string
}
function Field({ label, icon, children, hint }: FieldProps) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                {icon}
                {label}
            </label>
            {children}
            {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
        </div>
    )
}

const inputClass =
    'block w-full rounded-lg border border-gray-300 py-2 px-3 text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors'

// ── Category Form (modal) ─────────────────────────────────────────────────────

interface CategoryFormProps {
    initial?: Category
    onClose: () => void
    onSaved: (c: Category) => void
}

function CategoryForm({ initial, onClose, onSaved }: CategoryFormProps) {
    const [name, setName]       = useState(initial?.name     || '')
    const [slug, setSlug]       = useState(initial?.slug     || '')
    const [tagline, setTagline] = useState(initial?.tagline  || '')
    const [subtitle, setSubt]   = useState(initial?.subtitle || '')
    const [crest, setCrest]     = useState(initial?.crest    || '')
    const [image, setImage]     = useState(initial?.image    || '')
    const [accent, setAccent]   = useState(initial?.accent   || '')
    const [order, setOrder]     = useState(String(initial?.order ?? 99))
    const [pending, startT]     = useTransition()

    const handleNameChange = (v: string) => {
        setName(v)
        if (!initial) setSlug(slugify(v))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        startT(async () => {
            const res = await saveCategory(fd)
            if ((res as any).error) {
                toast.error((res as any).error)
            } else {
                toast.success(initial ? 'Category updated!' : 'Category created!')
                onSaved({
                    id: initial?.id || slug || slugify(name),
                    name, slug: slug || slugify(name), tagline, subtitle, crest, image, accent,
                    order: parseInt(order, 10),
                })
            }
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-lg font-bold text-gray-900">
                        {initial ? 'Edit Category' : 'Add Category'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input type="hidden" name="id" value={initial?.id || ''} />

                    <Field label="Category Name" icon={<Tag className="w-3 h-3" />}>
                        <input
                            name="name"
                            value={name}
                            onChange={e => handleNameChange(e.target.value)}
                            placeholder="e.g. Pub Jerseys"
                            required
                            className={inputClass}
                        />
                    </Field>

                    <Field label="URL Slug" icon={<LinkIcon className="w-3 h-3" />}
                        hint="Used in the URL: /collections/pub-jerseys">
                        <input
                            name="slug"
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                            placeholder="pub-jerseys"
                            required
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Tagline" icon={<Hash className="w-3 h-3" />}
                        hint="Shown in large text on the collection page (e.g. SOCIAL GEAR)">
                        <input
                            name="tagline"
                            value={tagline}
                            onChange={e => setTagline(e.target.value)}
                            placeholder="SOCIAL GEAR"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Subtitle" icon={<AlignLeft className="w-3 h-3" />}
                        hint="Short description shown below the title">
                        <input
                            name="subtitle"
                            value={subtitle}
                            onChange={e => setSubt(e.target.value)}
                            placeholder="Social gear for your local community"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Crest Image URL" icon={<ImageIcon className="w-3 h-3" />}
                        hint="Path to crest image (e.g. /assets/limerick_crest_final.png)">
                        <input
                            name="crest"
                            value={crest}
                            onChange={e => setCrest(e.target.value)}
                            placeholder="/assets/my_crest.png"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Card Image URL" icon={<ImageIcon className="w-3 h-3" />}
                        hint="Image shown on the homepage collection card">
                        <input
                            name="image"
                            value={image}
                            onChange={e => setImage(e.target.value)}
                            placeholder="/assets/my_collection.jpg"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Accent Colour" icon={<Palette className="w-3 h-3" />}
                        hint="Optional hex colour for the card accent (e.g. #4ade80)">
                        <div className="flex items-center gap-2">
                            <input
                                name="accent"
                                value={accent}
                                onChange={e => setAccent(e.target.value)}
                                placeholder="#4ade80"
                                className={`${inputClass} flex-1`}
                            />
                            {accent && (
                                <span
                                    className="w-9 h-9 rounded-lg border border-gray-300 flex-shrink-0"
                                    style={{ background: accent }}
                                />
                            )}
                        </div>
                    </Field>

                    <Field label="Display Order" icon={<GripVertical className="w-3 h-3" />}
                        hint="Lower numbers appear first">
                        <input
                            name="order"
                            type="number"
                            value={order}
                            onChange={e => setOrder(e.target.value)}
                            min={1}
                            className={`${inputClass} max-w-[120px]`}
                        />
                    </Field>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={pending}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg disabled:opacity-50 flex items-center gap-2 transition-colors shadow-sm"
                        >
                            {pending ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                            {initial ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ── Category Card ─────────────────────────────────────────────────────────────

interface CategoryCardProps {
    cat: Category
    onEdit: () => void
    onDelete: () => void
}
function CategoryCard({ cat, onEdit, onDelete }: CategoryCardProps) {
    return (
        <div className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all">
            <GripVertical className="w-5 h-5 text-gray-300 flex-shrink-0" />

            {/* Colour dot / crest preview */}
            {cat.crest ? (
                <img
                    src={cat.crest}
                    alt=""
                    className="w-10 h-10 object-contain rounded flex-shrink-0 bg-gray-50 border border-gray-100 p-0.5"
                />
            ) : (
                <div
                    className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-lg font-black"
                    style={{ background: cat.accent || '#6366f1' }}
                >
                    {cat.name.charAt(0).toUpperCase()}
                </div>
            )}

            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{cat.name}</p>
                <p className="text-[11px] text-gray-400 font-mono">/collections/{cat.slug}</p>
                {cat.tagline && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mt-0.5">{cat.tagline}</p>
                )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="hidden sm:inline text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded uppercase tracking-wider">
                    #{cat.order ?? '—'}
                </span>
                <button
                    onClick={onEdit}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
    const [categories, setCategories] = useState<Category[]>(initialCategories)
    const [showForm, setShowForm]     = useState(false)
    const [editing, setEditing]       = useState<Category | undefined>(undefined)
    const [, startT]                  = useTransition()

    const openCreate = () => { setEditing(undefined); setShowForm(true) }
    const openEdit   = (c: Category) => { setEditing(c); setShowForm(true) }
    const closeForm  = () => { setShowForm(false); setEditing(undefined) }

    const handleSaved = (cat: Category) => {
        setCategories(prev => {
            const idx = prev.findIndex(c => c.id === cat.id)
            if (idx >= 0) return prev.map((c, i) => i === idx ? cat : c)
            return [...prev, cat]
        })
        closeForm()
    }

    const handleDelete = (id: string) => {
        if (!confirm('Delete this category? Products assigned to it will not be deleted.')) return
        startT(async () => {
            const res = await deleteCategory(id)
            if ((res as any).error) {
                toast.error((res as any).error)
            } else {
                toast.success('Category deleted')
                setCategories(prev => prev.filter(c => c.id !== id))
            }
        })
    }

    const sorted = [...categories].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

    return (
        <>
            {/* List */}
            <div className="space-y-3">
                {/* Add button */}
                <button
                    onClick={openCreate}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-indigo-300 text-indigo-600 font-semibold text-sm rounded-xl py-3 hover:bg-indigo-50 hover:border-indigo-400 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add New Category
                </button>

                {sorted.map(cat => (
                    <CategoryCard
                        key={cat.id}
                        cat={cat}
                        onEdit={() => openEdit(cat)}
                        onDelete={() => handleDelete(cat.id)}
                    />
                ))}

                {sorted.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No categories yet</p>
                        <p className="text-sm">Add your first category above.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showForm && (
                <CategoryForm
                    initial={editing}
                    onClose={closeForm}
                    onSaved={handleSaved}
                />
            )}
        </>
    )
}
