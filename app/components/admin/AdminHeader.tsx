"use client";

import { useSession } from "next-auth/react";
import { Search, User as UserIcon, X, Package, ShoppingBag, Users, FileText, Tag, Layers, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type SearchResult = {
  type: "product" | "order" | "user" | "post" | "category" | "tag";
  id: string | number;
  title: string;
  subtitle?: string;
  href: string;
};

const typeConfig: Record<string, { icon: any; label: string; color: string }> = {
  product: { icon: Package, label: "Sản phẩm", color: "text-teal-600 bg-teal-50" },
  order: { icon: ShoppingBag, label: "Đơn hàng", color: "text-blue-600 bg-blue-50" },
  user: { icon: Users, label: "Người dùng", color: "text-purple-600 bg-purple-50" },
  post: { icon: FileText, label: "Bài viết", color: "text-orange-600 bg-orange-50" },
  category: { icon: Layers, label: "Danh mục", color: "text-emerald-600 bg-emerald-50" },
  tag: { icon: Tag, label: "Tag", color: "text-pink-600 bg-pink-50" },
};

export default function AdminHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const q = encodeURIComponent(query);
        const [productsRes, ordersRes, usersRes, postsRes, categoriesRes, tagsRes] = await Promise.all([
          fetch(`/api/admin/products?search=${q}&limit=3`),
          fetch(`/api/admin/orders?search=${q}&limit=3`),
          fetch(`/api/admin/users?search=${q}&limit=3`),
          fetch(`/api/admin/posts?search=${q}&limit=3`),
          fetch(`/api/admin/categories?search=${q}&limit=3`),
          fetch(`/api/admin/tags?search=${q}&limit=3`),
        ]);

        const all: SearchResult[] = [];

        if (productsRes.ok) {
          const d = await productsRes.json();
          (d.products || []).forEach((p: any) =>
            all.push({ type: "product", id: p.id, title: p.name, subtitle: `${p.price?.toLocaleString("vi-VN")}₫`, href: `/admin/products/${p.id}/edit` })
          );
        }
        if (ordersRes.ok) {
          const d = await ordersRes.json();
          (d.orders || []).forEach((o: any) =>
            all.push({ type: "order", id: o.id, title: o.orderNumber, subtitle: o.status, href: `/admin/orders` })
          );
        }
        if (usersRes.ok) {
          const d = await usersRes.json();
          (d.users || []).forEach((u: any) =>
            all.push({ type: "user", id: u.id, title: u.name || u.email, subtitle: u.role, href: `/admin/users` })
          );
        }
        if (postsRes.ok) {
          const d = await postsRes.json();
          (d.posts || []).forEach((p: any) =>
            all.push({ type: "post", id: p.id, title: p.title, subtitle: p.isPublished ? "Published" : "Draft", href: `/admin/posts/${p.id}` })
          );
        }
        if (categoriesRes.ok) {
          const d = await categoriesRes.json();
          (d.categories || []).forEach((c: any) =>
            all.push({ type: "category", id: c.id, title: c.name, subtitle: `${c._count?.products || 0} sản phẩm`, href: `/admin/categories` })
          );
        }
        if (tagsRes.ok) {
          const d = await tagsRes.json();
          (d.tags || []).forEach((t: any) =>
            all.push({ type: "tag", id: t.id, title: t.name, href: `/admin/tags` })
          );
        }

        setResults(all);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-20 sticky top-0 shadow-sm">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1" ref={containerRef}>
        <div className="relative w-96">
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm nhanh (Ctrl+K)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          {query && (
            <button onClick={() => { setQuery(""); setResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}

          {/* Dropdown Results */}
          {open && query.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-[420px] overflow-y-auto z-50">
              {loading ? (
                <div className="p-6 text-center">
                  <Loader2 className="animate-spin text-teal-600 mx-auto" size={24} />
                  <p className="text-xs text-gray-400 mt-2 font-medium">Đang tìm kiếm...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-6 text-center">
                  <Search className="text-gray-200 mx-auto mb-2" size={32} />
                  <p className="text-sm text-gray-400 font-bold">Không tìm thấy kết quả</p>
                  <p className="text-xs text-gray-300 mt-1">Thử từ khóa khác</p>
                </div>
              ) : (
                <div className="py-2">
                  {results.map((r, i) => {
                    const cfg = typeConfig[r.type];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={`${r.type}-${r.id}-${i}`}
                        onClick={() => handleSelect(r.href)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className={`p-2 rounded-md ${cfg.color}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{r.title}</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                            {cfg.label} {r.subtitle && `· ${r.subtitle}`}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                  <div className="border-t border-gray-100 px-4 py-2">
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center">
                      {results.length} kết quả · ESC để đóng
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-900">{(session?.user as any)?.name || "Admin User"}</p>
          <p className="text-xs text-teal-600 font-medium">{(session?.user as any)?.role || "ADMIN"}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 border-2 border-teal-200 overflow-hidden">
          {session?.user?.image ? (
            <Image src={session.user.image} alt="Avatar" width={40} height={40} className="object-cover" />
          ) : (
            <UserIcon size={20} />
          )}
        </div>
      </div>
    </header>
  );
}
