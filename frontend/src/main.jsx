import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const initialZones = [
  {
    name: "SLOT 1",
    className: "slot-one",
    spaces: [
      ["C01", "available"], ["C02", "available"],
      ["C03", "available"], ["C04", "available"],
      ["C05", "available"], ["C06", "available"],
      ["C07", "available"], ["C08", "available"],
      ["C09", "available"], ["C10", "available"]
    ]
  },
  {
    name: "SLOT 2",
    className: "slot-two",
    spaces: [
      ["B01", "available"], ["B02", "available"],
      ["B03", "available"], ["B04", "available"],
      ["B05", "available"], ["B06", "available"],
      ["B07", "available"], ["B08", "available"],
      ["B09", "available"], ["B10", "available"]
    ]
  },
  {
    name: "SLOT 3",
    className: "slot-three",
    spaces: [
      ["C01", "available"], ["C02", "available"],
      ["C03", "available"], ["C04", "available"],
      ["C05", "available"],
      ["C06", "available"], ["C07", "available"],
      ["C08", "available"], ["C09", "available"],
      ["C10", "available"]
    ]
  }
];

const statusLabel = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved"
};

function Icon({ children }) {
  return <span className="icon">{children}</span>;
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [zones, setZones] = useState(initialZones);
  const [selected, setSelected] = useState(null);

  const stats = useMemo(() => {
    const spaces = zones.flatMap(z => z.spaces);
    return {
      total: spaces.length,
      available: spaces.filter(s => s[1] === "available").length,
      occupied: spaces.filter(s => s[1] === "occupied").length,
      reserved: spaces.filter(s => s[1] === "reserved").length
    };
  }, [zones]);

  const changeStatus = (zoneIndex, spaceIndex) => {
    setZones(current => current.map((zone, zi) => {
      if (zi !== zoneIndex) return zone;
      return {
        ...zone,
        spaces: zone.spaces.map((space, si) => {
          if (si !== spaceIndex) return space;
          const next = { available: "occupied", occupied: "reserved", reserved: "available" };
          return [space[0], next[space[1]]];
        })
      };
    }));
  };

  const navItems = [
    ["Dashboard", "▦"],
    ["Parking Slots", "♙"],
    ["Vehicle entry", "▣"],
    ["Reports", "▤"],
    ["Settings", "⚙"]
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div>SMART PARKING</div>
          <span>MANAGEMENT SYSTEM</span>
        </div>

        <nav>
          {navItems.map(([label, icon]) => (
            <button
              key={label}
              className={activePage === label ? "nav-item active" : "nav-item"}
              onClick={() => setActivePage(label)}
            >
              <Icon>{icon}</Icon>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <h1>{activePage === "Dashboard" ? "SMART PARKING MANAGEMENT" : activePage.toUpperCase()}</h1>
          <div className="system-status">
            <span className="online-dot"></span>
            SYSTEM READY
            <strong>♟ &nbsp; ADMIN</strong>
          </div>
        </header>

        {activePage !== "Dashboard" ? (
          <section className="placeholder">
            <div className="placeholder-card">
              <div className="placeholder-icon">{navItems.find(x => x[0] === activePage)?.[1]}</div>
              <h2>{activePage}</h2>
              <p>This section is ready to connect to your backend/API.</p>
              <button className="back-btn" onClick={() => setActivePage("Dashboard")}>Back to Dashboard</button>
            </div>
          </section>
        ) : (
          <>
            <section className="stats">
              <Stat icon="P" title="Total Slots" value={stats.total} />
              <Stat icon="" title="Available" value={stats.available} color="green" />
              <Stat icon="" title="Occupied" value={stats.occupied} color="red" />
              <Stat icon="" title="Reserved" value={stats.reserved} color="purple" />
              <Stat icon="▣" title="Vehicles Today" value="0" />
            </section>

            <section className="parking-card">
              <div className="library-title">LIBRARY</div>

              <div className="parking-layout">
                {zones.map((zone, zoneIndex) => (
                  <div key={zone.name} className={`zone ${zone.className}`}>
                    <h3>{zone.name}</h3>
                    <div className="space-grid">
                      {zone.spaces.map(([id, status], spaceIndex) => (
                        <button
                          key={`${zone.name}-${spaceIndex}`}
                          className={`space ${status}`}
                          title={`${id} — ${statusLabel[status]}`}
                          onClick={() => {
                            setSelected({ zoneIndex, spaceIndex, id, status });
                            changeStatus(zoneIndex, spaceIndex);
                          }}
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="legend">
                <span><i className="legend-dot available"></i>Available</span>
                <span><i className="legend-dot occupied"></i>Occupied</span>
                <span><i className="legend-dot reserved"></i>Reserved</span>
              </div>
            </section>

            {selected && (
              <div className="toast">
                <b>{selected.id}</b> changed from {statusLabel[selected.status]}.
                <button onClick={() => setSelected(null)}>×</button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ icon, title, value, color = "" }) {
  return (
    <div className="stat">
      <div className={`stat-icon ${color}`}>{icon || <span />}</div>
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
