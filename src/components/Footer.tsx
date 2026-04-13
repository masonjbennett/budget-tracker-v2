"use client";

export default function Footer() {
  return (
    <footer className="mt-16 pt-6 border-t border-border text-center">
      <p className="text-[0.82rem] text-dim">
        <a href="https://masonjbennett.com" target="_blank" rel="noopener noreferrer" className="text-accent font-medium hover:underline">
          Mason Bennett
        </a>
        {" · "}Next.js + FastAPI{" · "}
        <a href="https://github.com/masonjbennett/budget-tracker-v2" target="_blank" rel="noopener noreferrer" className="text-dim hover:text-accent">
          GitHub
        </a>
      </p>
    </footer>
  );
}
