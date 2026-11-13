'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getAuth, onAuthStateChanged, reload, sendEmailVerification, signOut } from 'firebase/auth';
import {
  ArrowUpRight,
  Building2,
  Eye,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { app } from '@/app/lib/firebaseClient';

function Metric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-sm font-medium">{label}</span>
        <Icon className="h-5 w-5 text-blue-700" />
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value.toLocaleString()}</p>
    </div>
  );
}

function listingAgentKey(listing) {
  if (listing.agentId) return `id:${listing.agentId}`;
  const name = (listing.agentName || '').trim().toLowerCase();
  return name ? `name:${name}` : 'unknown';
}

export default function SuperAdminPage() {
  const [user, setUser] = useState(undefined);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [accountSearch, setAccountSearch] = useState('');
  const [listingSearch, setListingSearch] = useState('');
  const [listingAgentFilter, setListingAgentFilter] = useState('');
  const [listingAvailabilityFilter, setListingAvailabilityFilter] = useState('');
  const [listingVisibilityFilter, setListingVisibilityFilter] = useState('');
  const [listingPlacementFilter, setListingPlacementFilter] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [, setVerificationRefresh] = useState(0);
  const auth = getAuth(app);

  useEffect(() => onAuthStateChanged(auth, setUser), [auth]);

  const requestOverview = useCallback(async () => {
    if (!user) return;
    if (!user.emailVerified) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/super-admin/overview', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load the site overview.');
      setOverview(data);
    } catch (requestError) {
      setOverview(null);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      setLoading(false);
      setOverview(null);
      return;
    }
    requestOverview();
  }, [user, requestOverview]);

  const changeStatus = async (endpoint, payload, key) => {
    setBusy(key);
    setError('');
    try {
      const token = await user.getIdToken();
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The change could not be saved.');
      await requestOverview();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy('');
    }
  };

  const visibleAccounts = useMemo(() => {
    const search = accountSearch.trim().toLowerCase();
    return (overview?.users || [])
      .filter((account) => `${account.name} ${account.email} ${account.uid}`.toLowerCase().includes(search))
      .sort((a, b) => (a.email || a.uid).localeCompare(b.email || b.uid));
  }, [overview, accountSearch]);

  const visibleListings = useMemo(() => {
    const search = listingSearch.trim().toLowerCase();
    return (overview?.listings || [])
      .filter((listing) => `${listing.title} ${listing.agentName} ${listing.slug}`.toLowerCase().includes(search))
      .filter((listing) => !listingAgentFilter || listingAgentKey(listing) === listingAgentFilter)
      .filter((listing) => !listingAvailabilityFilter ||
        (listingAvailabilityFilter === 'available') === listing.isAvailable)
      .filter((listing) => !listingVisibilityFilter ||
        (listingVisibilityFilter === 'suspended') === listing.isSuspended)
      .filter((listing) => !listingPlacementFilter ||
        (listingPlacementFilter === 'promoted') === listing.isPromoted)
      .sort((a, b) => Number(b.isPromoted) - Number(a.isPromoted) || Number(b.visitCount) - Number(a.visitCount));
  }, [overview, listingSearch, listingAgentFilter, listingAvailabilityFilter, listingVisibilityFilter, listingPlacementFilter]);

  const listingAgents = useMemo(() => {
    const usersById = new Map((overview?.users || []).map((account) => [account.uid, account]));
    const agentsByKey = new Map();
    for (const listing of overview?.listings || []) {
      const key = listingAgentKey(listing);
      const account = usersById.get(listing.agentId);
      const name = listing.agentName || account?.name || account?.email || 'Unknown agent';
      const detail = account?.email && account.email !== name
        ? account.email
        : listing.agentId && !account?.email ? listing.agentId.slice(0, 8) : '';
      const label = detail ? `${name} · ${detail}` : name;
      if (!agentsByKey.has(key)) agentsByKey.set(key, { key, label, count: 0 });
      agentsByKey.get(key).count += 1;
    }
    return [...agentsByKey.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [overview]);

  const listings = overview?.listings || [];
  const accounts = overview?.users || [];
  const traffic = overview?.traffic || { pageViews: 0, previousHomepageVisits: 0, days: [] };
  const maxDailyViews = Math.max(1, ...traffic.days.map((day) => day.views));

  if (user === undefined || (user && loading && !overview)) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">Loading site overview...</main>;
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
        <ShieldCheck className="h-10 w-10 text-blue-700" />
        <h1 className="text-2xl font-bold text-slate-900">Super admin sign in</h1>
        <p className="text-slate-600">Sign in with the approved super admin account to continue.</p>
        <Link href="/admin/login?next=/super-admin" className="rounded-2xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">Sign in</Link>
      </main>
    );
  }

  if (!user.emailVerified) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center text-slate-900">
        <ShieldCheck className="h-10 w-10 text-blue-700" />
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="max-w-md text-slate-600">Super admin access requires a verified Firebase sign-in email. Open the verification link sent to {user.email}, then check again.</p>
        {verificationMessage && <p role="status" className="text-sm text-blue-700">{verificationMessage}</p>}
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" className="rounded-xl bg-blue-700 px-4 py-2 font-semibold text-white" onClick={async () => {
            try {
              await sendEmailVerification(user);
              setVerificationMessage('Verification email sent.');
            } catch (sendError) {
              setVerificationMessage(sendError.message);
            }
          }}>Send verification email</button>
          <button type="button" className="rounded-xl border border-slate-300 px-4 py-2 font-semibold" onClick={async () => {
            try {
              await reload(user);
              await user.getIdToken(true);
              setVerificationRefresh((current) => current + 1);
              if (user.emailVerified) await requestOverview();
              else setVerificationMessage('Your email is not verified yet. Check your inbox and try again.');
            } catch (reloadError) {
              setVerificationMessage(reloadError.message);
            }
          }}>I have verified my email</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800"><ShieldCheck className="h-4 w-4" /> Super admin</span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Website overview</h1>
            <p className="mt-2 text-slate-600">Review traffic, accounts, and listings across Room Finders.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={requestOverview} disabled={loading} className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-60"><RefreshCw className="h-4 w-4" />Refresh</button>
            <Link href="/" className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100">View website</Link>
            <button type="button" onClick={() => signOut(auth)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"><LogOut className="h-4 w-4" />Sign out</button>
          </div>
        </header>

        {error && <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {overview && (
          <>
            <section aria-label="Site totals" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <Metric label="Public page views" value={traffic.pageViews} icon={Eye} />
              <Metric label="Accounts" value={accounts.length} icon={Users} />
              <Metric label="Listings" value={listings.length} icon={Building2} />
              <Metric label="Suspended listings" value={listings.filter((item) => item.isSuspended).length} icon={ShieldCheck} />
              <Metric label="Visible promoted" value={listings.filter((item) => item.isPromoted && !item.isSuspended).length} icon={Star} />
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-bold">Traffic over the last 14 days</h2>
                <p className="mt-1 text-sm text-slate-500">Public page views, including repeat visits. Tracking starts when this dashboard is deployed.</p>
                <div className="mt-6 flex h-48 items-end gap-1.5 sm:gap-3">
                  {traffic.days.map((day) => (
                    <div key={day.day} className="flex min-w-0 flex-1 flex-col items-center gap-2" title={`${day.day}: ${day.views} views`}>
                      <div className="flex h-36 w-full items-end rounded-lg bg-blue-50">
                        <div className="w-full rounded-lg bg-blue-700" style={{ height: `${Math.max(day.views ? 6 : 0, (day.views / maxDailyViews) * 100)}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-500">{day.day.slice(5)}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-500">Earlier homepage visits: {traffic.previousHomepageVisits.toLocaleString()} (tracked separately).</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-bold">Most viewed listings</h2>
                <div className="mt-4 space-y-3">
                  {[...listings].sort((a, b) => b.visitCount - a.visitCount).slice(0, 5).map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0">
                      {listing.isSuspended ? <span className="truncate font-medium text-slate-600">{listing.title} (suspended)</span> : <Link href={`/apartments/${listing.slug}`} className="truncate font-medium text-blue-800 hover:underline" target="_blank">{listing.title}</Link>}
                      <span className="shrink-0 text-sm text-slate-600">{listing.visitCount.toLocaleString()} views</span>
                    </div>
                  ))}
                  {!listings.length && <p className="text-sm text-slate-500">No listings yet.</p>}
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h2 className="text-xl font-bold">Accounts</h2><p className="mt-1 text-sm text-slate-500">Disabling an account blocks sign-in. Existing listings stay visible until you change them separately.</p></div>
                <input aria-label="Search accounts" value={accountSearch} onChange={(event) => setAccountSearch(event.target.value)} placeholder="Search accounts" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm sm:w-64" />
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500"><tr><th className="py-3 pr-4">Account</th><th className="py-3 pr-4">Last sign-in</th><th className="py-3 pr-4">Listings</th><th className="py-3 pr-4">Status</th><th className="py-3">Action</th></tr></thead>
                  <tbody>
                    {visibleAccounts.map((account) => (
                      <tr key={account.uid} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 pr-4"><p className="font-medium">{account.name || account.email || 'Unnamed account'}</p><p className="text-xs text-slate-500">{account.email || account.uid}</p></td>
                        <td className="py-3 pr-4 text-slate-600">{account.lastSignInAt ? new Date(account.lastSignInAt).toLocaleDateString() : 'Never'}</td>
                        <td className="py-3 pr-4">{listings.filter((listing) => listing.agentId === account.uid).length}</td>
                        <td className="py-3 pr-4"><span className={account.disabled ? 'font-semibold text-red-700' : 'font-semibold text-emerald-700'}>{account.disabled ? 'Disabled' : 'Active'}</span></td>
                        <td className="py-3"><button type="button" disabled={busy === `account:${account.uid}` || account.uid === overview.currentUser.uid} onClick={() => {
                          const action = account.disabled ? 'Enable' : 'Disable';
                          if (window.confirm(`${action} ${account.email || account.name || 'this account'}?`)) {
                            changeStatus(`/api/super-admin/accounts/${encodeURIComponent(account.uid)}`, { disabled: !account.disabled }, `account:${account.uid}`);
                          }
                        }} className="rounded-xl border border-slate-300 px-3 py-2 font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">{busy === `account:${account.uid}` ? 'Saving...' : account.disabled ? 'Enable' : 'Disable'}</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!visibleAccounts.length && <p className="py-6 text-center text-sm text-slate-500">No matching accounts.</p>}
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div>
                <div><h2 className="text-xl font-bold">All listings</h2><p className="mt-1 text-sm text-slate-500">See views and clicks on each WhatsApp option. Contact Agent opens the enquiry form; Quick WhatsApp opens WhatsApp directly.</p><p className="mt-1 text-sm text-slate-500">Suspended listings are hidden from public pages until restored. Promoted listings appear first in Featured listings.</p></div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <label className="text-sm font-medium text-slate-700">
                  Search listings
                  <input
                    value={listingSearch}
                    onChange={(event) => setListingSearch(event.target.value)}
                    placeholder="Title or agent"
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Agent
                  <select
                    value={listingAgentFilter}
                    onChange={(event) => setListingAgentFilter(event.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-normal"
                  >
                    <option value="">All agents</option>
                    {listingAgents.map((agent) => (
                      <option key={agent.key} value={agent.key}>
                        {agent.label} ({agent.count})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Availability
                  <select
                    value={listingAvailabilityFilter}
                    onChange={(event) => setListingAvailabilityFilter(event.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-normal"
                  >
                    <option value="">Any availability</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Visibility
                  <select
                    value={listingVisibilityFilter}
                    onChange={(event) => setListingVisibilityFilter(event.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-normal"
                  >
                    <option value="">Any visibility</option>
                    <option value="visible">Visible</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Placement
                  <select
                    value={listingPlacementFilter}
                    onChange={(event) => setListingPlacementFilter(event.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-normal"
                  >
                    <option value="">Any placement</option>
                    <option value="promoted">Promoted</option>
                    <option value="standard">Standard</option>
                  </select>
                </label>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
                <span>Showing {visibleListings.length} of {listings.length} listings</span>
                {(listingSearch || listingAgentFilter || listingAvailabilityFilter || listingVisibilityFilter || listingPlacementFilter) && (
                  <button
                    type="button"
                    onClick={() => {
                      setListingSearch('');
                      setListingAgentFilter('');
                      setListingAvailabilityFilter('');
                      setListingVisibilityFilter('');
                      setListingPlacementFilter('');
                    }}
                    className="font-medium text-blue-700 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[1260px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500"><tr><th className="py-3 pr-4">Listing</th><th className="py-3 pr-4">Agent</th><th className="py-3 pr-4">Views</th><th className="py-3 pr-4">Contact Agent clicks</th><th className="py-3 pr-4">Quick WhatsApp clicks</th><th className="py-3 pr-4">Availability</th><th className="py-3 pr-4">Visibility</th><th className="py-3 pr-4">Placement</th><th className="py-3">Actions</th></tr></thead>
                  <tbody>
                    {visibleListings.map((listing) => (
                      <tr key={listing.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 pr-4">{listing.isSuspended ? <span className="font-medium text-slate-900">{listing.title}</span> : <Link href={`/apartments/${listing.slug}`} target="_blank" className="inline-flex items-center gap-1 font-medium text-blue-800 hover:underline">{listing.title}<ArrowUpRight className="h-3.5 w-3.5" /></Link>}</td>
                        <td className="py-3 pr-4 text-slate-600">{listing.agentName || 'Unknown'}</td>
                        <td className="py-3 pr-4">{listing.visitCount.toLocaleString()}</td>
                        <td className="py-3 pr-4">{listing.contactClick.toLocaleString()}</td>
                        <td className="py-3 pr-4">{listing.quickWhatsappClick.toLocaleString()}</td>
                        <td className="py-3 pr-4">{listing.isAvailable ? 'Available' : 'Unavailable'}</td>
                        <td className="py-3 pr-4"><span className={listing.isSuspended ? 'font-semibold text-red-700' : 'font-semibold text-emerald-700'}>{listing.isSuspended ? 'Suspended' : 'Visible'}</span></td>
                        <td className="py-3 pr-4">{listing.isPromoted ? <span className="font-semibold text-blue-700">{listing.isSuspended ? 'Promoted (hidden)' : 'Promoted'}</span> : 'Standard'}</td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" disabled={busy.startsWith(`listing:${listing.id}:`) || (listing.isSuspended && !listing.isPromoted)} onClick={() => changeStatus(`/api/super-admin/listings/${encodeURIComponent(listing.id)}`, { promoted: !listing.isPromoted }, `listing:${listing.id}:boost`)} className="rounded-xl border border-blue-300 px-3 py-2 font-medium text-blue-800 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50">{busy === `listing:${listing.id}:boost` ? 'Saving...' : listing.isPromoted ? 'Remove boost' : 'Boost listing'}</button>
                            <button type="button" disabled={busy.startsWith(`listing:${listing.id}:`)} onClick={() => {
                              if (listing.isSuspended || window.confirm(`Suspend ${listing.title}? It will disappear from public listing pages until restored.`)) {
                                changeStatus(`/api/super-admin/listings/${encodeURIComponent(listing.id)}`, { suspended: !listing.isSuspended }, `listing:${listing.id}:suspend`);
                              }
                            }} className={listing.isSuspended ? 'rounded-xl border border-emerald-300 px-3 py-2 font-medium text-emerald-800 hover:bg-emerald-50 disabled:opacity-50' : 'rounded-xl border border-red-300 px-3 py-2 font-medium text-red-800 hover:bg-red-50 disabled:opacity-50'}>{busy === `listing:${listing.id}:suspend` ? 'Saving...' : listing.isSuspended ? 'Restore listing' : 'Suspend listing'}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!visibleListings.length && <p className="py-6 text-center text-sm text-slate-500">No matching listings.</p>}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
