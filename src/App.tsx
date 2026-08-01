import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ComponentShowcase } from '@/components/showcase/ComponentShowcase';
import { NavbarShowcase } from '@/components/showcase/NavbarShowcase';
import { ListShowcase } from '@/components/showcase/ListShowcase';
import { MetricCardShowcase } from '@/components/showcase/MetricCardShowcase';
import { ChartsShowcase } from '@/components/showcase/ChartsShowcase';
import { CardListShowcase } from '@/components/showcase/CardListShowcase';
import {
  LayoutGrid,
  Navigation,
  List,
  Activity,
  BarChart2,
  Home,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const showcases = [
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
];

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Component Showcase
        </h1>
        <p className="text-zinc-400">
          Select a component library preview below to explore interactive demos.
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
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-800/80 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 px-2 pt-2">
            <div className="size-8 rounded-xl bg-[#e6ff4b] flex items-center justify-center font-bold text-black text-sm">
              CL
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Design System
            </span>
          </Link>

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
                      ? 'bg-[#e6ff4b] text-black shadow-md'
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
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/components" element={<ComponentShowcase />} />
          <Route path="/navbars" element={<NavbarShowcase />} />
          <Route path="/lists" element={<ListShowcase />} />
          <Route path="/metrics" element={<MetricCardShowcase />} />
          <Route path="/charts" element={<ChartsShowcase />} />
          <Route path="/cards" element={<CardListShowcase />} />
        </Routes>
      </main>
    </div>
  );
}
