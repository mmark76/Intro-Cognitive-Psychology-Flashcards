import { NavLink, Outlet } from "react-router-dom";
import { OfflineStatus } from "./OfflineStatus";

const navigation = [
  ["/", "Αρχική"],
  ["/chapters", "Κεφάλαια"],
  ["/flashcards", "Flashcards"],
  ["/review", "Επανάληψη"],
  ["/quiz", "Quiz"],
  ["/progress", "Πρόοδος"],
  ["/study-materials", "Υλικό για μελέτη"],
] as const;

const footerNavigation = [
  ["/legal/license", "License"],
  ["/legal/privacy", "Privacy"],
  ["/legal/analytics", "Analytics choices"],
  ["/legal/copyright", "Copyright protected"],
] as const;

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Introduction to Cognitive Psychology</p>
          <h1>Γνωστική Ψυχολογία</h1>
        </div>
        <OfflineStatus />
      </header>
      <nav className="primary-nav" aria-label="Κύρια πλοήγηση">
        {navigation.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === "/"}>
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="page-container">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>© 2026 Markellos Markides. All rights reserved.</p>
        <nav className="footer-meta" aria-label="Legal information">
          {footerNavigation.map(([to, label]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
      </footer>
    </div>
  );
}
