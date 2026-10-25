import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  ArrowLeft, 
  Pin, 
  Trash2, 
  X, 
  FileText,
  CheckSquare,
  Square,
  ListTodo,
  Tag,
  Copy,
  BarChart2,
  PenTool,
  Eraser,
  Check
} from 'lucide-react';

// --- Types ---
type ContentType = 'note' | 'todo';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Item {
  id: string;
  type: ContentType;
  title: string;
  content: string; // Used for plain text note
  todos: TodoItem[]; // Used for checklists
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  color: string;
  category: string;
  sketch?: string;
}

// Material Design Color Options
const COLOR_OPTIONS = [
  { id: 'default', label: 'Neutral', cardBg: 'bg-black/10', cardBorder: 'border-white/20', iconBg: 'bg-white/10', iconText: 'text-slate-300', dot: 'bg-zinc-400' },
  { id: 'amber', label: 'Warm Amber', cardBg: 'bg-amber-500/10', cardBorder: 'border-amber-400/60', iconBg: 'bg-amber-500/15', iconText: 'text-amber-300', dot: 'bg-amber-500' },
  { id: 'emerald', label: 'Emerald', cardBg: 'bg-emerald-500/10', cardBorder: 'border-emerald-400/60', iconBg: 'bg-emerald-500/15', iconText: 'text-emerald-300', dot: 'bg-emerald-500' },
  { id: 'sky', label: 'Sky Blue', cardBg: 'bg-sky-500/10', cardBorder: 'border-sky-400/60', iconBg: 'bg-sky-500/15', iconText: 'text-sky-300', dot: 'bg-sky-500' },
  { id: 'purple', label: 'Purple', cardBg: 'bg-purple-500/10', cardBorder: 'border-purple-400/60', iconBg: 'bg-purple-500/15', iconText: 'text-purple-300', dot: 'bg-purple-500' },
  { id: 'rose', label: 'Rose Pink', cardBg: 'bg-rose-500/10', cardBorder: 'border-rose-400/60', iconBg: 'bg-rose-500/15', iconText: 'text-rose-300', dot: 'bg-rose-500' },
];

const CATEGORIES = ['All', 'Personal', 'Work', 'Ideas', 'Urgent'];

const INITIAL_ITEMS: Item[] = [];

export default function AndroidNotepad() {
  // Persistence state
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const saved = localStorage.getItem('timeflow_notepad_items_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved items', e);
    }
    return INITIAL_ITEMS;
  });

  // Navigation & UI state
  const [activeCategoryId, setActiveCategoryId] = useState<string>('All');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Active Editor Form State
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<ContentType>('note');
  const [editContent, setEditContent] = useState('');
  const [editTodos, setEditTodos] = useState<TodoItem[]>([]);
  const [editPinned, setEditPinned] = useState(false);
  const [editColor, setEditColor] = useState('default');
  const [editCategory, setEditCategory] = useState('Personal');
  const [editSketch, setEditSketch] = useState<string | undefined>(undefined);
  const [newTodoInput, setNewTodoInput] = useState('');

  // Sync items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('timeflow_notepad_items_v1', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [items]);

  // Allow the main app's "Delete data" action to clear notes
  useEffect(() => {
    const reset = () => {
      setItems([]);
      setActiveItemId(null);
      setActiveCategoryId('All');
      setIsCanvasOpen(false);
      setDeleteConfirmId(null);
      setNewTodoInput('');
      setEditTitle('');
      setEditContent('');
      setEditTodos([]);
      setEditPinned(false);
      setEditColor('default');
      setEditCategory('Personal');
      setEditSketch(undefined);
    };
    window.addEventListener('timerdate-reset-notes', reset);
    return () => window.removeEventListener('timerdate-reset-notes', reset);
  }, []);

  // Open existing Item in editor
  const handleOpenItem = (item: Item) => {
    setActiveItemId(item.id);
    setEditType(item.type);
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditTodos(item.todos || []);
    setEditPinned(item.isPinned);
    setEditColor(item.color || 'default');
    setEditCategory(item.category || 'Personal');
    setEditSketch(item.sketch);
    setNewTodoInput('');
  };

  // Create new Item (Note or To-Do)
  const handleCreateNew = (type: ContentType) => {
    const newItemId = Date.now().toString();
    const newItem: Item = {
      id: newItemId,
      type,
      title: '',
      content: '',
      todos: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false,
      color: 'default',
      category: activeCategoryId === 'All' ? 'Personal' : activeCategoryId
    };

    setItems((prev) => [newItem, ...prev]);
    setActiveItemId(newItemId);
    setEditType(type);
    setEditTitle('');
    setEditContent('');
    setEditTodos(newItem.todos);
    setEditPinned(false);
    setEditColor('default');
    setEditCategory(newItem.category);
    setEditSketch(undefined);
    setNewTodoInput('');

    setTimeout(() => {
      const titleEl = document.getElementById('editor-title-input');
      titleEl?.focus();
    }, 100);
  };

  const handleSaveSketch = (data: string) => {
    const newItem: Item = {
      id: Date.now().toString(),
      type: 'note',
      title: 'Sketch',
      content: '',
      todos: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false,
      color: 'default',
      category: activeCategoryId === 'All' ? 'Personal' : activeCategoryId,
      sketch: data
    };
    setItems((prev) => [newItem, ...prev]);
    setIsCanvasOpen(false);
  };

  // Auto-Save modifications
  useEffect(() => {
    if (!activeItemId) return;

    const timeout = setTimeout(() => {
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === activeItemId) {
            return {
              ...item,
              title: editTitle,
              content: editContent,
              todos: editTodos,
              isPinned: editPinned,
              color: editColor,
              category: editCategory,
              sketch: editSketch,
              updatedAt: Date.now()
            };
          }
          return item;
        })
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [editTitle, editContent, editTodos, editPinned, editColor, editCategory, editSketch, activeItemId]);

  // Back to main list & clean empty entries
  const handleBackToList = () => {
    if (activeItemId) {
      const current = items.find((i) => i.id === activeItemId);
      const isTodoEmpty = editType === 'todo' && editTodos.filter((t) => t.text.trim().length > 0).length === 0;
      const isNoteEmpty = editType === 'note' && !editContent.trim() && !editSketch;

      if (current && !editTitle.trim() && (isTodoEmpty || isNoteEmpty)) {
        setItems((prev) => prev.filter((i) => i.id !== activeItemId));
      }
    }
    setActiveItemId(null);
  };

  // Quick toggle task completed from list view directly
  const handleToggleTodoFromCard = (e: React.MouseEvent, itemId: string, todoId: string) => {
    e.stopPropagation();
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedTodos = item.todos.map((t) =>
            t.id === todoId ? { ...t, completed: !t.completed } : t
          );
          return { ...item, todos: updatedTodos, updatedAt: Date.now() };
        }
        return item;
      })
    );
  };

  // Toggle Pin Status from Card
  const handleTogglePinCard = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const current = items.find((item) => item.id === id);
    if (!current) return;
    const updated = !current.isPinned;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPinned: updated } : item))
    );
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (activeItemId === id) setActiveItemId(null);
    setDeleteConfirmId(null);
  };

  // Copy item content to clipboard
  const handleCopyContent = () => {
    let textToCopy = editTitle ? `${editTitle}\n\n` : '';
    if (editType === 'note') {
      textToCopy += editContent;
    } else {
      textToCopy += editTodos
        .map((t) => `[${t.completed ? 'x' : ' '}] ${t.text}`)
        .join('\n');
    }
    navigator.clipboard.writeText(textToCopy);
  };

  // Todo items management inside editor
  const handleAddTodoItem = () => {
    if (!newTodoInput.trim()) return;
    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: newTodoInput.trim(),
      completed: false
    };
    setEditTodos((prev) => [...prev, newItem]);
    setNewTodoInput('');
  };

  const handleToggleTodoItem = (id: string) => {
    setEditTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleRemoveTodoItem = (id: string) => {
    setEditTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Date Formatter
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Filtered & sorted list
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => activeCategoryId === 'All' || item.category === activeCategoryId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [items, activeCategoryId]);

  const pinnedItems = useMemo(() => filteredItems.filter((i) => i.isPinned), [filteredItems]);
  const otherItems = useMemo(() => filteredItems.filter((i) => !i.isPinned), [filteredItems]);
  const activeColorStyle = COLOR_OPTIONS.find((c) => c.id === editColor) || COLOR_OPTIONS[0];

  return (
    <div className="h-full bg-transparent text-slate-100 flex justify-center font-sans">
      {/* Mobile / Android Shell Frame */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl h-full min-h-0 bg-transparent overflow-hidden flex flex-col relative">
        
        {/* EDITOR TOP BAR */}
        {activeItemId && (
          <header className="sticky top-0 z-20 bg-transparent backdrop-blur-md px-3 py-2.5 flex items-center justify-between border-b border-white/10">
            <button
              onClick={handleBackToList}
              className="p-2 rounded-full hover:bg-white/10 text-slate-200 transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={22} />
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-slate-200">
                {editType === 'note' ? 'Note' : 'Checklist'}
              </span>

              <button
                onClick={() => setEditPinned((pinned) => !pinned)}
                className={`p-2 rounded-full transition-colors ${
                  editPinned ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-white/10 text-slate-300'
                }`}
                title={editPinned ? 'Unpin' : 'Pin'}
              >
                <Pin size={18} className={editPinned ? 'fill-amber-300' : ''} />
              </button>

              <button
                onClick={handleCopyContent}
                className="p-2 rounded-full hover:bg-white/10 text-slate-300"
                title="Copy content"
              >
                <Copy size={18} />
              </button>

              <button
                onClick={() => setDeleteConfirmId(activeItemId)}
                className="p-2 rounded-full hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </header>
        )}

        {/* MAIN BODY AREA */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 custom-scrollbar">
          {!activeItemId ? (
            /* LIST VIEW */
            <div className="space-y-4 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-xs">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryId(cat)}
                    className={`px-3 py-1.5 rounded-xl font-medium border transition-colors flex-shrink-0 ${
                      activeCategoryId === cat
                        ? 'bg-teal-600 text-white border-teal-500'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-300">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    <FileText size={32} className="opacity-60" />
                  </div>
                  <p className="text-base font-semibold text-slate-200">No items yet</p>
                  <p className="text-xs mt-1 text-slate-400 max-w-xs">
                    Tap a button below to create a note, list, or sketch
                  </p>
                </div>
              ) : (
                <>
                  {/* PINNED SECTION */}
                  {pinnedItems.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5 px-1">
                        <Pin size={12} className="rotate-45" />
                        <span>Pinned ({pinnedItems.length})</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {pinnedItems.map((item) => (
                          <ItemCard
                            key={item.id}
                            item={item}
                            formatDate={formatDate}
                            onSelect={() => handleOpenItem(item)}
                            onTogglePin={(e) => handleTogglePinCard(e, item.id)}
                            onToggleTodoFromCard={handleToggleTodoFromCard}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* OTHER ITEMS SECTION */}
                  {otherItems.length > 0 && (
                    <div>
                      {pinnedItems.length > 0 && (
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2 px-1">
                          Others
                        </div>
                      )}
                      <div className="grid grid-cols-1 gap-3">
                        {otherItems.map((item) => (
                          <ItemCard
                            key={item.id}
                            item={item}
                            formatDate={formatDate}
                            onSelect={() => handleOpenItem(item)}
                            onTogglePin={(e) => handleTogglePinCard(e, item.id)}
                            onToggleTodoFromCard={handleToggleTodoFromCard}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* EDITOR VIEW */
            <div className="flex flex-col h-full space-y-4 pt-1 pb-6">
              {/* Color & Category Customization Bar */}
              <div className={`flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl border text-xs ${activeColorStyle.cardBg} ${activeColorStyle.cardBorder}`}>
                {/* Color Dots */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-300 mr-1">Color</span>
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setEditColor(c.id)}
                      className={`w-5 h-5 rounded-full ${c.dot} transition-transform ${
                        editColor === c.id ? 'scale-125 ring-2 ring-white/90' : 'hover:scale-110 opacity-70'
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>

                {/* Category Select */}
                <div className="flex items-center gap-1">
                  <Tag size={12} className="text-slate-300" />
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="bg-transparent text-slate-200 font-medium outline-none text-xs cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat} className="bg-zinc-800 text-zinc-100">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title Input */}
              <input
                id="editor-title-input"
                type="text"
                placeholder={editType === 'note' ? 'Note Title' : 'Checklist Title'}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-transparent text-xl font-bold text-slate-100 placeholder-slate-500 border-none outline-none py-1"
              />

              {/* CONTENT EDITOR FOR NOTES */}
              {editType === 'note' ? (
                <div className="flex flex-col flex-1 gap-3">
                  {editSketch && (
                    <div className="relative rounded-2xl overflow-hidden bg-white border border-white/20">
                      <img src={editSketch} alt="Sketch" className="w-full max-h-64 object-contain" />
                      <button
                        onClick={() => setEditSketch(undefined)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                        title="Remove sketch"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <textarea
                    placeholder="Write down your thoughts, markdown notes, ideas..."
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full flex-1 bg-transparent text-sm leading-relaxed text-slate-100 placeholder-slate-500 border-none outline-none resize-none min-h-[38vh]"
                  />
                </div>
              ) : (
                /* CONTENT EDITOR FOR CHECKLIST / TO-DO */
                <div className="space-y-3 flex-1">
                  {/* Progress Header */}
                  {editTodos.length > 0 && (
                    <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart2 size={16} className="text-teal-300" />
                        <span className="text-xs font-semibold text-teal-200">
                          {editTodos.filter((t) => t.completed).length} of {editTodos.length} Completed
                        </span>
                      </div>
                      <div className="w-24 bg-teal-950 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-400 h-full transition-all duration-300"
                          style={{
                            width: `${(editTodos.filter((t) => t.completed).length / editTodos.length) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Add New Todo Input */}
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
                    <Plus size={18} className="text-slate-300" />
                    <input
                      type="text"
                      placeholder="Add new list item..."
                      value={newTodoInput}
                      onChange={(e) => setNewTodoInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddTodoItem();
                      }}
                      className="w-full bg-transparent border-none outline-none text-sm text-slate-100 placeholder-slate-500"
                    />
                    <button
                      onClick={handleAddTodoItem}
                      className="px-3 py-1 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-500 transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {/* Checklist Items list */}
                  <div className="space-y-2">
                    {editTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white/5 border border-white/10 transition-colors"
                      >
                        <button
                          onClick={() => handleToggleTodoItem(todo.id)}
                          className="flex items-center gap-3 text-left flex-1"
                        >
                          <div className={`p-0.5 rounded-lg transition-colors ${todo.completed ? 'text-teal-400' : 'text-slate-400'}`}>
                            {todo.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>
                          <span
                            className={`text-sm transition-all ${
                              todo.completed
                                ? 'line-through text-slate-500'
                                : 'text-slate-100'
                            }`}
                          >
                            {todo.text}
                          </span>
                        </button>

                        <button
                          onClick={() => handleRemoveTodoItem(todo.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM ACTION DOCK */}
        {!activeItemId && (
          <div className="sticky bottom-0 z-30 px-3 pb-3 pt-2">
            <div className="flex items-center justify-center gap-1.5 rounded-full bg-[#20232b]/95 border border-white/10 px-2 py-2 backdrop-blur-md">
              <button
                onClick={() => handleCreateNew('note')}
                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-full bg-teal-600 text-white text-[11px] font-bold hover:bg-teal-500 active:scale-95 transition-all"
              >
                <Plus size={15} />
                <span>New Note</span>
              </button>

              <button
                onClick={() => handleCreateNew('todo')}
                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-full bg-white/10 text-slate-200 text-[11px] font-bold hover:bg-white/15 active:scale-95 transition-all"
              >
                <ListTodo size={15} />
                <span>New List</span>
              </button>

              <button
                onClick={() => setIsCanvasOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-full bg-white/10 text-slate-200 text-[11px] font-bold hover:bg-white/15 active:scale-95 transition-all"
              >
                <PenTool size={15} />
                <span>Canvas</span>
              </button>
            </div>
          </div>
        )}

        {/* SKETCH CANVAS MODAL */}
        {isCanvasOpen && (
          <SketchCanvas
            onClose={() => setIsCanvasOpen(false)}
            onSave={handleSaveSketch}
          />
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteConfirmId && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1a1b20] rounded-2xl max-w-xs w-full p-5 border border-white/10 space-y-4 animate-scaleUp">
              <h3 className="text-base font-bold text-slate-100">
                Delete Item?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to delete this note or checklist? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteItem(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- SUBCOMPONENT: ITEM CARD ---
interface ItemCardProps {
  item: Item;
  formatDate: (ts: number) => string;
  onSelect: () => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onToggleTodoFromCard: (e: React.MouseEvent, itemId: string, todoId: string) => void;
}

function ItemCard({
  item,
  formatDate,
  onSelect,
  onTogglePin,
  onToggleTodoFromCard
}: ItemCardProps) {
  const colorStyle = COLOR_OPTIONS.find((c) => c.id === item.color) || COLOR_OPTIONS[0];

  const completedCount = item.todos ? item.todos.filter((t) => t.completed).length : 0;
  const totalCount = item.todos ? item.todos.length : 0;

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl p-3.5 transition-all duration-200 cursor-pointer border hover:-translate-y-0.5 ${colorStyle.cardBg} ${colorStyle.cardBorder} flex flex-col justify-between`}
    >
      <div>
        {/* Top Header line of Card */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className={`p-1.5 rounded-lg flex-shrink-0 ${colorStyle.iconBg} ${colorStyle.iconText}`}>
              {item.type === 'note' ? <FileText size={13} /> : <ListTodo size={13} />}
            </span>
            <h3 className="font-bold text-sm text-slate-100 truncate">
              {item.title.trim() ? item.title : 'Untitled'}
            </h3>
          </div>

          <button
            onClick={onTogglePin}
            className={`p-1 rounded-lg hover:bg-white/10 text-slate-400 ${
              item.isPinned ? 'text-amber-300' : ''
            }`}
          >
            <Pin size={14} className={item.isPinned ? 'fill-amber-300' : ''} />
          </button>
        </div>

        {/* Content Snippet */}
        {item.type === 'note' ? (
          item.sketch ? (
            <img
              src={item.sketch}
              alt="Sketch"
              className="w-full h-28 object-contain rounded-xl bg-white mb-2.5 border border-white/15"
            />
          ) : (
            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed whitespace-pre-line mb-2.5">
              {item.content.trim() ? item.content : 'No content...'}
            </p>
          )
        ) : (
          /* Checklist preview */
          <div className="space-y-1.5 mb-2.5">
            {item.todos.slice(0, 3).map((todo) => (
              <div
                key={todo.id}
                onClick={(e) => onToggleTodoFromCard(e, item.id, todo.id)}
                className="flex items-center gap-2 text-xs text-slate-300 hover:opacity-80"
              >
                <span className={todo.completed ? 'text-teal-300' : 'text-slate-500'}>
                  {todo.completed ? <CheckSquare size={13} /> : <Square size={13} />}
                </span>
                <span className={`truncate ${todo.completed ? 'line-through text-slate-500' : ''}`}>
                  {todo.text}
                </span>
              </div>
            ))}
            {totalCount > 3 && (
              <span className="text-[10px] text-slate-500 pl-5">
                +{totalCount - 3} more items
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2.5 border-t border-white/10">
        <span>{formatDate(item.updatedAt)}</span>
        
        {item.type === 'todo' && totalCount > 0 ? (
          <span className="font-medium text-teal-300">
            {completedCount}/{totalCount} Done
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-medium">
            {item.category}
          </span>
        )}
      </div>
    </div>
  );
}
// --- SUBCOMPONENT: SKETCH CANVAS ---
interface SketchCanvasProps {
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

const SKETCH_COLORS = ['#111827', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
const STROKE_SIZES = [4, 8, 16];

function SketchCanvas({ onClose, onSave }: SketchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState('#111827');
  const [strokeWidth, setStrokeWidth] = useState(8);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    canvas.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const point = getPoint(e);
    lastPointRef.current = point;

    ctx.beginPath();
    ctx.arc(point.x, point.y, (tool === 'eraser' ? 20 : strokeWidth) / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.fill();
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const last = lastPointRef.current;
    if (!canvas || !ctx || !last) return;

    const point = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? 20 : strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPointRef.current = point;
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    lastPointRef.current = null;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL('image/png'));
  };

  return (
    <div className="absolute inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="w-full max-w-lg bg-[#20232b] border border-white/10 rounded-2xl p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <p className="text-sm font-bold text-white">Sketch</p>
            <p className="text-[10px] text-slate-400">Draw something with your finger or mouse</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
            title="Close canvas"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            width={1000}
            height={700}
            className="w-full h-auto touch-none cursor-crosshair"
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {SKETCH_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setTool('pen');
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  color === c && tool === 'pen' ? 'border-white scale-110' : 'border-white/20'
                }`}
                style={{ backgroundColor: c }}
                title="Pen color"
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            {STROKE_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setStrokeWidth(size)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                  strokeWidth === size ? 'bg-teal-600 text-white' : 'bg-white/10 text-slate-300'
                }`}
                title={`${size}px`}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-lg transition-colors ${
                tool === 'pen' ? 'bg-teal-600 text-white' : 'bg-white/10 text-slate-300'
              }`}
              title="Pen"
            >
              <PenTool size={16} />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-lg transition-colors ${
                tool === 'eraser' ? 'bg-teal-600 text-white' : 'bg-white/10 text-slate-300'
              }`}
              title="Eraser"
            >
              <Eraser size={16} />
            </button>
            <button
              onClick={clearCanvas}
              className="p-2 rounded-lg bg-white/10 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
              title="Clear canvas"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-1.5 transition-colors"
          >
            <Check size={14} />
            Save Sketch
          </button>
        </div>
      </div>
    </div>
  );
}
