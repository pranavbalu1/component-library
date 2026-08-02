import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthGalleryShowcase } from '@/components/showcase/Auth';
import { ComponentShowcase } from '@/components/showcase/ComponentShowcase';
import { NavbarShowcase } from '@/components/showcase/NavbarShowcase';
import { ListShowcase } from '@/components/showcase/ListShowcase';
import { MetricCardShowcase } from '@/components/showcase/MetricCardShowcase';
import { ChartsShowcase } from '@/components/showcase/ChartsShowcase';
import { CardListShowcase } from '@/components/showcase/CardListShowcase';
import { FormShowcase } from '@/components/showcase/FormShowcase';
import {
  LayoutGrid,
  Navigation,
  List,
  Activity,
  BarChart2,
  Home,
  CreditCard,
  Sparkles,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const showcases = [
  {
    path: '/auth',
    label: 'Auth Pages',
    icon: Sparkles,
    component: AuthGalleryShowcase,
  },
  {
    path: '/components',
    label: 'Components',
    icon: LayoutGrid,
    component: ComponentShowcase,
  },
  {
    path: '/navbars',
    label: 'Navbars',
    icon: Navigation,
    component: NavbarShowcase,
  },
  { path: '/lists', label: 'Lists', icon: List, component: ListShowcase },
  {
    path: '/metrics',
    label: 'Metric Cards',
    icon: Activity,
    component: MetricCardShowcase,
  },
  {
    path: '/charts',
    label: 'Charts',
    icon: BarChart2,
    component: ChartsShowcase,
  },
  {
    path: '/cards',
    label: 'Card Deck',
    icon: CreditCard,
    component: CardListShowcase,
  },
  {
    path: '/forms',
    label: 'Forms',
    icon: Code2,
    component: FormShowcase,
  },
];

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-4">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6ff4b]/10 border border-[#e6ff4b]/20 text-[#e6ff4b] text-xs font-semibold">
          <Sparkles className="size-3.5" />
          <span>Crafted by Kyougen</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Component Showcase
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl">
          Select a component preview below to explore interactive UI demos built
          by Kyougen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {showcases.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="group p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-[#e6ff4b]/50 hover:bg-zinc-800/80 transition-all flex flex-col justify-between h-36"
            >
              <div className="size-10 rounded-xl bg-zinc-800 group-hover:bg-[#e6ff4b] text-zinc-300 group-hover:text-black flex items-center justify-center transition-colors">
                <Icon className="size-5" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-base">
                  {item.label}
                </span>
                <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  View →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-800/80 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Brand Header */}
          <Link to="/" className="flex items-center gap-3 px-2 pt-2 group">
            <div className="size-9 rounded-xl bg-[#e6ff4b] flex items-center justify-center font-black text-black text-base shadow-lg group-hover:scale-105 transition-transform">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-white tracking-tight leading-tight">
                Kyougen UI
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                Component Library
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              to="/"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                location.pathname === '/'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900',
              )}
            >
              <Home className="size-4" />
              <span>Overview</span>
            </Link>

            <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Showcases
            </div>

            {showcases.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-[#e6ff4b] text-black shadow-md font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900',
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Author Footer Badge */}
        <div className="pt-6 border-t border-zinc-900 px-2">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Code2 className="size-4 text-[#e6ff4b]" />
            <span>
              Built by{' '}
              <strong className="text-zinc-300 font-semibold">Kyougen</strong>
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-zinc-800/80 px-6 md:px-8 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="font-mono text-zinc-500">library /</span>
            <span className="text-white font-medium capitalize">
              {location.pathname === '/'
                ? 'Overview'
                : location.pathname.replace('/', '')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
              by <span className="text-[#e6ff4b] font-semibold">kyougen</span>
            </span>
          </div>
        </header>

        {/* View Router */}
        <div className="p-6 md:p-8 flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthGalleryShowcase />} />
            <Route path="/components" element={<ComponentShowcase />} />
            <Route path="/navbars" element={<NavbarShowcase />} />
            <Route path="/lists" element={<ListShowcase />} />
            <Route path="/metrics" element={<MetricCardShowcase />} />
            <Route path="/charts" element={<ChartsShowcase />} />
            <Route path="/cards" element={<CardListShowcase />} />
            <Route path="/forms" element={<FormShowcase />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
