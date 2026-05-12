export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container-page py-8 text-sm text-slate-600">
        © {new Date().getFullYear()} Architect Portfolio. All rights reserved.
      </div>
    </footer>
  );
}
