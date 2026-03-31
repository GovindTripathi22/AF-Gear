"use client";

import { useState, useEffect } from "react";
import { updateContent } from "./actions";
import {
  Loader2,
  Save,
  Type,
  BarChart3,
  Image as ImageIcon,
  Link2,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

type HeroContent = {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
};

type StatsContent = {
  happyCustomers: string;
  projectsComplete: string;
  citiesCovered: string;
  energyInstalled: string;
};

function InputField({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
        {Icon && <Icon className="w-3.5 h-3.5 text-indigo-500" />}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[48px] bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder:text-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
      />
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  onSave,
  loading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
  onSave: () => void;
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100 flex-shrink-0">
          <Icon className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide truncate">
            {title}
          </h3>
          <p className="text-[11px] text-gray-400 hidden sm:block">
            {description}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 sm:px-6 py-5 space-y-4">{children}</div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 sm:px-6 py-3 bg-gray-50/50 gap-3">
        <p className="text-[10px] text-gray-400 hidden sm:block">
          Changes are saved to the database and reflected on the live site.
        </p>
        <button
          onClick={onSave}
          disabled={loading}
          className="rounded-lg bg-indigo-600 text-white px-4 sm:px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-all duration-200 min-h-[44px] w-full sm:w-auto justify-center"
        >
          {loading ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span className="sm:inline">Save</span>
        </button>
      </div>
    </div>
  );
}

export default function ContentPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [hero, setHero] = useState<HeroContent>({
    title: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
    backgroundImage: "",
  });
  const [stats, setStats] = useState<StatsContent>({
    happyCustomers: "",
    projectsComplete: "",
    citiesCovered: "",
    energyInstalled: "",
  });

  useEffect(() => {
    async function loadContent() {
      try {
        const [heroResult, statsResult] = await Promise.all([
          supabase
            .from("site_content")
            .select("content")
            .eq("key", "homepage_hero")
            .single(),
          supabase
            .from("site_content")
            .select("content")
            .eq("key", "statistics")
            .single(),
        ]);

        if (heroResult.data?.content) {
          setHero((prev) => ({ ...prev, ...heroResult.data.content }));
        }
        if (statsResult.data?.content) {
          setStats((prev) => ({ ...prev, ...statsResult.data.content }));
        }
      } catch (e) {
        console.error("Error loading content:", e);
      } finally {
        setFetching(false);
      }
    }
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (
    section: string,
    data: Record<string, unknown>
  ) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("section", section);
    formData.append("content", JSON.stringify(data));
    const result = await updateContent(null, formData);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      const sectionName = section.replace(/_/g, " ");
      toast.success(`${sectionName} updated successfully!`);
      setLastSaved(new Date().toLocaleTimeString());
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            Loading Content
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Content Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Update your website&apos;s content sections.
          </p>
        </div>
        {lastSaved && (
          <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 self-start">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Last saved at {lastSaved}
          </div>
        )}
      </div>

      {/* Hero Section */}
      <SectionCard
        icon={ImageIcon}
        title="Homepage Hero"
        description="Banner text, call-to-action, and background image."
        onSave={() => handleSave("homepage_hero", hero)}
        loading={loading}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Title"
            icon={Type}
            value={hero.title}
            onChange={(v) => setHero({ ...hero, title: v })}
            placeholder="Main headline"
          />
          <InputField
            label="Subtitle"
            icon={FileText}
            value={hero.subtitle}
            onChange={(v) => setHero({ ...hero, subtitle: v })}
            placeholder="Supporting text"
          />
          <InputField
            label="CTA Button Text"
            icon={Type}
            value={hero.ctaText}
            onChange={(v) => setHero({ ...hero, ctaText: v })}
            placeholder="e.g. Shop Collection"
          />
          <InputField
            label="CTA Link"
            icon={Link2}
            value={hero.ctaLink}
            onChange={(v) => setHero({ ...hero, ctaLink: v })}
            placeholder="e.g. /#shop"
          />
          <div className="sm:col-span-2">
            <InputField
              label="Background Image URL"
              icon={ImageIcon}
              value={hero.backgroundImage}
              onChange={(v) => setHero({ ...hero, backgroundImage: v })}
              placeholder="/assets/homepage-hero.png"
            />
            <p className="mt-2 text-xs text-gray-400 italic">For best results and CDN caching, upload your image to Supabase Storage and paste the URL here.</p>
          </div>
        </div>

        {/* Live Preview */}
        {(hero.title || hero.subtitle) && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">
              Preview
            </p>
            {hero.title && (
              <h3 className="text-white font-bold text-lg">{hero.title}</h3>
            )}
            {hero.subtitle && (
              <p className="text-gray-400 text-sm mt-1">{hero.subtitle}</p>
            )}
            {hero.ctaText && (
              <span className="inline-block mt-2 bg-green-500 text-black text-xs font-bold px-3 py-1.5 rounded">
                {hero.ctaText}
              </span>
            )}
          </div>
        )}
      </SectionCard>

      {/* Stats Section */}
      <SectionCard
        icon={BarChart3}
        title="Statistics"
        description="Numbers displayed on the website."
        onSave={() => handleSave("statistics", stats)}
        loading={loading}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Happy Customers"
            value={stats.happyCustomers}
            onChange={(v) => setStats({ ...stats, happyCustomers: v })}
            placeholder="e.g. 500+"
          />
          <InputField
            label="Projects Complete"
            value={stats.projectsComplete}
            onChange={(v) => setStats({ ...stats, projectsComplete: v })}
            placeholder="e.g. 200+"
          />
          <InputField
            label="Cities Covered"
            value={stats.citiesCovered}
            onChange={(v) => setStats({ ...stats, citiesCovered: v })}
            placeholder="e.g. 30+"
          />
          <InputField
            label="Energy Installed"
            value={stats.energyInstalled}
            onChange={(v) => setStats({ ...stats, energyInstalled: v })}
            placeholder="e.g. 1000+ kW"
          />
        </div>
      </SectionCard>
    </div>
  );
}
