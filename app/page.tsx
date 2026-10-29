
"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("studyflow-tasks");
      if (saved) setTasks(JSON.parse(saved));
    } catch {
      console.error("Could not load saved tasks.");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("studyflow-tasks", JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      subject: subject.trim() || "General",
      dueDate,
      priority,
      completed: false,
    };

    setTasks((current) => [newTask, ...current]);
    setTitle("");
    setSubject("");
    setDueDate("");
    setPriority("Medium");
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function deleteTask(id: number) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const remainingCount = tasks.length - completedCount;
  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <a href="#" className="flex items-center gap-3 text-xl font-extrabold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              S
            </span>
            StudyFlow
          </a>
          <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            My planner
          </span>
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <section className="mb-8">
          <p className="font-semibold text-indigo-600">YOUR STUDENT WORKSPACE</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            Your tasks, under control.
          </h1>
          <p className="mt-3 text-slate-600">
            Add your assignments, track deadlines, and make progress every day.
          </p>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total tasks</p>
            <p className="mt-2 text-3xl font-bold">{tasks.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Still to do</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {remainingCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {completedCount}
            </p>
          </div>
        </section>

        <section className="grid items-start gap-8 lg:grid-cols-[360px_1fr]">
          <form
            onSubmit={addTask}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold">Add a task</h2>
            <p className="mt-1 text-sm text-slate-500">
              What do you need to finish?
            </p>

            <label className="mt-5 block text-sm font-semibold">
              Assignment name *
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Statistics activity"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500"
              />
            </label>

            <label className="mt-4 block text-sm font-semibold">
              Subject
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="e.g. Mathematics"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500"
              />
            </label>

            <label className="mt-4 block text-sm font-semibold">
              Deadline
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500"
              />
            </label>

            <label className="mt-4 block text-sm font-semibold">
              Priority
              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as Task["priority"])
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-indigo-500"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              + Add task
            </button>
          </form>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">My assignments</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Keep moving, one task at a time.
                </p>
              </div>
              <select
                aria-label="Filter tasks"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option>All</option>
                <option>Active</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {progress}% complete
            </p>

            <div className="mt-5 space-y-3">
              {!loaded ? (
                <p className="py-10 text-center text-slate-500">
                  Loading your tasks...
                </p>
              ) : visibleTasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
                  <p className="text-3xl">📝</p>
                  <p className="mt-3 font-semibold">No tasks here yet</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Add your first assignment using the form.
                  </p>
                </div>
              ) : (
                visibleTasks.map((task) => (
                  <article
                    key={task.id}
                    className={`rounded-xl border p-4 ${
                      task.completed
                        ? "border-emerald-100 bg-emerald-50/50"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        aria-label={`Mark ${task.title} as completed`}
                        className="mt-1 h-5 w-5 accent-indigo-600"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`break-words font-semibold ${
                            task.completed
                              ? "text-slate-400 line-through"
                              : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {task.subject}
                          {task.dueDate ? ` · Due ${task.dueDate}` : ""}
                        </p>
                        <span
                          className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            task.priority === "High"
                              ? "bg-rose-100 text-rose-700"
                              : task.priority === "Medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {task.priority} priority
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        aria-label={`Delete ${task.title}`}
                        className="rounded-lg px-2 py-1 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>

        <footer className="py-10 text-center text-sm text-slate-500">
          StudyFlow · Your goals. Your time. Your flow.
        </footer>
      </div>
    </main>
  );
}
