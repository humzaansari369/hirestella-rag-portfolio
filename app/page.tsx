import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-6 py-12 md:px-24">
      <div className="max-w-3xl mx-auto space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Humza Ansari</h1>
          <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">Aspiring Data Analyst & Data Science Student</p>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Motivated Data Science student at Reena Mehta College with strong foundational knowledge in Python, SQL, R, and data visualization. 
            Test the RAG assistant in the bottom right to ask questions directly about my CV and projects!
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight border-b pb-2 border-zinc-200 dark:border-zinc-800">Featured Projects</h2>
          <div className="grid gap-6">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
              <h3 className="text-lg font-semibold">SnapText OCR + Text Data Analysis</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                End-to-end Python pipeline for optical character recognition, text extraction, preprocessing, and analytical reporting.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
              <h3 className="text-lg font-semibold">4-in-1 Multifunctional Robot Prototype</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Arduino-based multi-mode robot with custom Android Bluetooth/Voice control app, presented at the 20th Aavishkar Inter-Collegiate Research Convention.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight border-b pb-2 border-zinc-200 dark:border-zinc-800">Get in Touch</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Email: <a href="mailto:Humzaansari204@gmail.com" className="text-blue-600 underline">Humzaansari204@gmail.com</a> | Phone: +91-7039693386
          </p>
        </section>
      </div>

      <ChatWidget />
    </main>
  );
}