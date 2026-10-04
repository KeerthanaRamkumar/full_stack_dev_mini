import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PenLine,
  Bookmark,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  Menu,
  X,
  Sparkles,
  Check,
  Loader2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, quickLogin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [testAccountsOpen, setTestAccountsOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleQuickSwitch = async (role: 'admin' | 'author' | 'user') => {
    setSwitchingRole(role);
    try {
      await quickLogin(role);
      setTestAccountsOpen(false);
      setMenuOpen(false);
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'author') {
        navigate('/author/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err: any) {
      console.error('Quick switch error:', err);
    } finally {
      setSwitchingRole(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand Wordmark (Single text element in editorial serif) */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="font-serif text-2xl font-bold tracking-tight text-stone-900 hover:text-stone-700 transition-colors whitespace-nowrap"
            >
              Ink & Quill
            </Link>
          </div>

          {/* Zone 2: Primary Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <Link to="/" className="hover:text-stone-900 transition-colors">
              Home
            </Link>
            <Link to="/blogs" className="hover:text-stone-900 transition-colors">
              Articles
            </Link>
            <Link to="/categories" className="hover:text-stone-900 transition-colors">
              Categories
            </Link>
            <Link to="/bookmarks" className="hover:text-stone-900 transition-colors">
              Bookmarks
            </Link>
            <Link to="/mern-architecture" className="hover:text-stone-900 transition-colors">
              MERN Guide
            </Link>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Demo Logins Helper */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setTestAccountsOpen(!testAccountsOpen)}
                className={`px-2.5 py-1.5 text-xs font-medium border rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  user
                    ? 'border-stone-400 bg-stone-100 text-stone-900 font-semibold'
                    : 'border-stone-300 text-stone-700 hover:text-stone-900 hover:border-stone-400'
                }`}
                title="Quickly test with Admin or Author credentials"
              >
                {switchingRole ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-700" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-stone-600" />
                )}
                <span>
                  {user ? `Active: ${user.name.split(' ')[0]} (${user.role})` : 'Test Logins'}
                </span>
              </button>

              {testAccountsOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white border border-stone-200 rounded-xl shadow-xl p-3 z-50 text-xs"
                  onMouseLeave={() => setTestAccountsOpen(false)}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                    <p className="font-semibold text-stone-900 font-serif">Instant Test Switcher</p>
                    <span className="text-[10px] text-stone-400 font-mono">1-Click Auth</span>
                  </div>

                  <div className="space-y-1">
                    {/* Admin option */}
                    <button
                      type="button"
                      disabled={switchingRole !== null}
                      onClick={() => handleQuickSwitch('admin')}
                      className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between ${
                        user?.email === 'admin@example.com'
                          ? 'bg-stone-100 border border-stone-300'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-purple-700" /> Eleanor Vance
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-purple-50 text-purple-700 rounded font-normal">
                            Admin
                          </span>
                        </span>
                        <span className="text-[11px] text-stone-500 mt-0.5">admin@example.com</span>
                      </div>
                      {user?.email === 'admin@example.com' && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>

                    {/* Author option */}
                    <button
                      type="button"
                      disabled={switchingRole !== null}
                      onClick={() => handleQuickSwitch('author')}
                      className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between ${
                        user?.email === 'author@example.com'
                          ? 'bg-stone-100 border border-stone-300'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                          <UserIcon className="w-3.5 h-3.5 text-stone-700" /> Julian Thorne
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded font-normal">
                            Author
                          </span>
                        </span>
                        <span className="text-[11px] text-stone-500 mt-0.5">author@example.com</span>
                      </div>
                      {user?.email === 'author@example.com' && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>

                    {/* Reader option */}
                    <button
                      type="button"
                      disabled={switchingRole !== null}
                      onClick={() => handleQuickSwitch('user')}
                      className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between ${
                        user?.email === 'user@example.com'
                          ? 'bg-stone-100 border border-stone-300'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                          <UserIcon className="w-3.5 h-3.5 text-stone-700" /> Keerthana R.
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded font-normal">
                            Reader
                          </span>
                        </span>
                        <span className="text-[11px] text-stone-500 mt-0.5">user@example.com</span>
                      </div>
                      {user?.email === 'user@example.com' && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  </div>

                  {user && (
                    <div className="pt-2 mt-2 border-t border-stone-100 flex justify-end">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="text-[11px] text-rose-600 hover:underline"
                      >
                        Sign out of current account
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Write Blog Button */}
            <Link
              to="/create-blog"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-stone-900 bg-white border border-stone-300 rounded-md hover:bg-stone-50 hover:border-stone-400 transition-colors whitespace-nowrap shadow-xs"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Write</span>
            </Link>

            {/* User Profile / Top Profile Image Area */}
            {user ? (
              <div className="relative pl-2 border-l border-stone-300/80">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white/90 hover:bg-white border border-stone-300/90 shadow-2xs transition-all focus:outline-none group"
                  aria-label="User profile menu"
                >
                  <div className="relative">
                    <img
                      src={user.profileImage || '/uploads/reader_avatar_portrait_1791096597464.jpg'}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/uploads/reader_avatar_portrait_1791096597464.jpg';
                      }}
                      className="w-8 h-8 rounded-full object-cover border border-stone-300 ring-2 ring-stone-900/10 group-hover:ring-stone-900/20"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-stone-900 leading-tight group-hover:text-stone-700">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-stone-100 flex items-center gap-3">
                      <img
                        src={user.profileImage || '/uploads/reader_avatar_portrait_1791096597464.jpg'}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                        <span className="inline-block mt-0.5 text-[10px] uppercase tracking-wider text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded font-mono font-medium">
                          Role: {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                        <span>Profile & Settings</span>
                      </Link>

                      <Link
                        to="/author/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-stone-500" />
                        <span>Author Dashboard</span>
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-900 font-semibold hover:bg-stone-50 transition-colors"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <Link
                        to="/bookmarks"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-stone-500" />
                        <span>My Bookmarks</span>
                      </Link>
                    </div>

                    <div className="border-t border-stone-100 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Top Profile Image in Guest / Unauthenticated State */
              <div className="flex items-center gap-2.5 pl-2 border-l border-stone-300/80">
                <Link
                  to="/login"
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white/90 hover:bg-white border border-stone-300/90 shadow-2xs transition-all group"
                  title="Reader Profile - Click to Sign In"
                >
                  <img
                    src="/uploads/reader_avatar_portrait_1791096597464.jpg"
                    alt="Reader profile avatar"
                    className="w-8 h-8 rounded-full object-cover border border-stone-300"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-stone-900 leading-tight group-hover:text-stone-700">
                      Reader Profile
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      Sign In
                    </span>
                  </div>
                </Link>

                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/create-blog"
              className="p-2 text-stone-700 hover:text-stone-900"
              aria-label="Write Article"
            >
              <PenLine className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#FAF8F5] px-4 pt-2 pb-5 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-stone-700">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="px-2 py-1.5 rounded hover:bg-stone-100"
            >
              Home
            </Link>
            <Link
              to="/blogs"
              onClick={() => setMenuOpen(false)}
              className="px-2 py-1.5 rounded hover:bg-stone-100"
            >
              Articles
            </Link>
            <Link
              to="/categories"
              onClick={() => setMenuOpen(false)}
              className="px-2 py-1.5 rounded hover:bg-stone-100"
            >
              Categories
            </Link>
            <Link
              to="/bookmarks"
              onClick={() => setMenuOpen(false)}
              className="px-2 py-1.5 rounded hover:bg-stone-100"
            >
              Bookmarks
            </Link>
            <Link
              to="/mern-architecture"
              onClick={() => setMenuOpen(false)}
              className="px-2 py-1.5 rounded hover:bg-stone-100"
            >
              MERN Stack Guide
            </Link>
          </div>

          {/* Mobile Test Logins Section */}
          <div className="border-t border-stone-200 pt-3">
            <p className="text-xs font-semibold text-stone-800 mb-2 px-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-stone-600" />
              <span>Instant Test Switcher:</span>
            </p>
            <div className="grid grid-cols-3 gap-1.5 px-2 mb-3">
              <button
                type="button"
                onClick={() => handleQuickSwitch('admin')}
                className="py-1.5 px-2 bg-white border border-stone-200 text-stone-800 rounded text-[11px] font-medium text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickSwitch('author')}
                className="py-1.5 px-2 bg-white border border-stone-200 text-stone-800 rounded text-[11px] font-medium text-center"
              >
                Author
              </button>
              <button
                type="button"
                onClick={() => handleQuickSwitch('user')}
                className="py-1.5 px-2 bg-white border border-stone-200 text-stone-800 rounded text-[11px] font-medium text-center"
              >
                Reader
              </button>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-stone-100/80 rounded-xl">
                  <img
                    src={user.profileImage || '/uploads/reader_avatar_portrait_1791096597464.jpg'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-300"
                  />
                  <div>
                    <p className="text-xs font-bold text-stone-900">{user.name}</p>
                    <p className="text-[10px] text-stone-500 uppercase font-mono">Role: {user.role}</p>
                  </div>
                </div>
                <Link
                  to="/author/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-2 py-1.5 text-xs text-stone-700 rounded hover:bg-stone-100"
                >
                  Author Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-2 py-1.5 text-xs font-semibold text-stone-900 rounded hover:bg-stone-100"
                  >
                    Admin Console
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-2 py-1.5 text-xs text-stone-700 rounded hover:bg-stone-100"
                >
                  Profile & Settings
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-rose-600 rounded hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2 text-xs font-medium text-stone-700 border border-stone-300 rounded"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2 text-xs font-medium text-white bg-stone-900 rounded"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
