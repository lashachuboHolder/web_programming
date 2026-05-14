import { useState, useEffect, useMemo, useRef } from 'react';
import './UserTable.css';

const STATUSES = ['Open', 'Paid', 'Inactive', 'Due'];
const ROWS_OPTIONS = [5, 10, 15, 20, 30, 40, 50];

function StatusBadge({ status }) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{status}</span>;
}

function SortIcon({ active, dir }) {
  return (
    <span className={`sort-icon ${active ? 'sort-icon--active' : ''}`}>
      {active ? (dir === 'asc' ? '↑' : '↓') : '⇅'}
    </span>
  );
}

function Checkbox({ checked, indeterminate, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      className="cb"
      checked={checked}
      onChange={onChange}
      onClick={e => e.stopPropagation()}
    />
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function UserTable() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(r => r.json())
      .then(data => { setAllUsers(data); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return allUsers;
    return allUsers.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.company.name.toLowerCase().includes(q)
    );
  }, [allUsers, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortKey === 'name') {
        return sortDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortKey === 'company') {
        return sortDir === 'asc'
          ? a.company.name.localeCompare(b.company.name)
          : b.company.name.localeCompare(a.company.name);
      }
      return sortDir === 'asc' ? a.id - b.id : b.id - a.id;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const pageData = sorted.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  }

  function toggleRow(id, e) {
    e.stopPropagation();
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const allOnPageChecked = pageData.length > 0 && pageData.every(u => selected.has(u.id));
  const someOnPageChecked = pageData.some(u => selected.has(u.id));

  function toggleAll() {
    setSelected(prev => {
      const next = new Set(prev);
      if (allOnPageChecked) pageData.forEach(u => next.delete(u.id));
      else pageData.forEach(u => next.add(u.id));
      return next;
    });
  }

  function deleteSelected() {
    setAllUsers(prev => prev.filter(u => !selected.has(u.id)));
    setSelected(new Set());
    setPage(1);
  }

  const rangeStart = sorted.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1;
  const rangeEnd = Math.min(safePage * rowsPerPage, sorted.length);

  return (
    <div className="card">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          {selected.size > 0 ? (
            <>
              <span className="selected-label">{selected.size} selected</span>
              <button className="btn-icon-delete" onClick={deleteSelected} title="Delete selected">
                <TrashIcon />
              </button>
            </>
          ) : (
            <div className="search-box">
              <SearchIcon />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, email, or company…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          )}
        </div>
        <button className="btn-add">
          <PlusIcon /> Add customer
        </button>
      </div>

      {/* Sort pills */}
      <div className="sort-bar">
        <span className="sort-label">Sort by:</span>
        {[
          { key: 'id', label: '#' },
          { key: 'name', label: 'Name' },
          { key: 'company', label: 'Company' },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`sort-pill ${sortKey === key ? 'sort-pill--active' : ''}`}
            onClick={() => toggleSort(key)}
          >
            {label} <SortIcon active={sortKey === key} dir={sortDir} />
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th className="th-check">
                <Checkbox
                  checked={allOnPageChecked}
                  indeterminate={someOnPageChecked && !allOnPageChecked}
                  onChange={toggleAll}
                />
              </th>
              <th className="th-num"># <SortIcon active={sortKey === 'id'} dir={sortDir} /></th>
              <th className="th-name" onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
                NAME <SortIcon active={sortKey === 'name'} dir={sortDir} />
              </th>
              <th className="th-desc">DESCRIPTION</th>
              <th className="th-status">STATUS</th>
              <th className="th-email">EMAIL</th>
              <th className="th-company" onClick={() => toggleSort('company')} style={{ cursor: 'pointer' }}>
                COMPANY <SortIcon active={sortKey === 'company'} dir={sortDir} />
              </th>
              <th className="th-city">CITY</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="td-empty">Loading users…</td></tr>
            ) : pageData.length === 0 ? (
              <tr><td colSpan={8} className="td-empty">No users found</td></tr>
            ) : pageData.map((user, i) => {
              const rowNum = (safePage - 1) * rowsPerPage + i + 1;
              const status = STATUSES[(user.id - 1) % STATUSES.length];
              const isSel = selected.has(user.id);
              return (
                <tr
                  key={user.id}
                  className={`tr-data ${isSel ? 'tr-selected' : ''}`}
                  onClick={e => toggleRow(user.id, e)}
                >
                  <td className="td-check">
                    <Checkbox checked={isSel} onChange={e => toggleRow(user.id, e)} />
                  </td>
                  <td className="td-num">{rowNum}</td>
                  <td className="td-name">
                    <span className="name-main">{user.name}</span>
                    <span className="name-sub">{user.phone}</span>
                  </td>
                  <td className="td-desc">
                    <span className="desc-clip">{user.company.catchPhrase}</span>
                  </td>
                  <td className="td-status">
                    <StatusBadge status={status} />
                  </td>
                  <td className="td-email">{user.email}</td>
                  <td className="td-company">
                    <span className="name-main">{user.company.name}</span>
                    <span className="name-sub">{user.company.bs}</span>
                  </td>
                  <td className="td-city">{user.address.city}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="footer">
        <span className="range-info">
          {rangeStart}–{rangeEnd} of {sorted.length}
        </span>

        <div className="rows-picker" onClick={e => e.stopPropagation()}>
          <span className="rows-label">Rows per page: {rowsPerPage}</span>
          <button
            className="rows-chevron"
            onClick={() => setShowRowsMenu(v => !v)}
            aria-label="Choose rows per page"
          >
            ▾
          </button>
          {showRowsMenu && (
            <>
              <div className="backdrop" onClick={() => setShowRowsMenu(false)} />
              <ul className="rows-menu">
                {ROWS_OPTIONS.map(n => (
                  <li
                    key={n}
                    className={`rows-option ${rowsPerPage === n ? 'rows-option--active' : ''}`}
                    onClick={() => { setRowsPerPage(n); setPage(1); setShowRowsMenu(false); }}
                  >
                    {n}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="page-nav">
          <button
            className="page-btn"
            disabled={safePage === 1}
            onClick={() => setPage(p => p - 1)}
            aria-label="Previous page"
          >
            ‹
          </button>
          <span className="page-label">{safePage}/{totalPages}</span>
          <button
            className="page-btn"
            disabled={safePage >= totalPages}
            onClick={() => setPage(p => p + 1)}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
