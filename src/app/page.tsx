import Link from 'next/link'
import { BookOpen, FolderOpen, Highlighter, Globe } from 'lucide-react'

const features = [
  {
    icon: Globe,
    title: 'Save from anywhere',
    description:
      'Clip articles from any website with our browser extension or share sheet. Your reading list, always in sync.',
  },
  {
    icon: FolderOpen,
    title: 'Organize with folders',
    description:
      'Create folders to categorize your saved articles. Keep everything tidy and easy to find.',
  },
  {
    icon: BookOpen,
    title: 'Read distraction-free',
    description:
      'A clean, customizable reader that strips away clutter. Choose your theme, font size, and reading style.',
  },
  {
    icon: Highlighter,
    title: 'Highlight what matters',
    description:
      'Mark important passages with color-coded highlights. Revisit your key takeaways anytime.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Stash
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero section */}
      <section className="px-6 pt-20 pb-24 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
          Save Now,{' '}
          <span className="text-orange-500">Read Later</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Stash is your personal reading list. Save articles from the web,
          organize them into folders, and read them in a beautiful,
          distraction-free environment.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition shadow-lg shadow-orange-500/25"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features section */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Everything you need to read smarter
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-16 max-w-xl mx-auto">
            Built for readers who want to save, organize, and revisit the best
            content on the web.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
              >
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Stash
            </span>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Save what matters. Read when ready.
          </p>
        </div>
      </footer>
    </div>
  )
}
