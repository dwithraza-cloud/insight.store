import React, { useMemo, useState } from 'react';
import { User, Package, Heart, ShoppingBag, MapPin, ShieldCheck, LogOut, Plus, Trash2, Home, Mail, Phone } from 'lucide-react';
import { AuthUser } from '../services/authService';
import { Order } from '../types';

interface CustomerAccountScreenProps {
  user: AuthUser;
  orders: Order[];
  cartCount: number;
  wishlistCount: number;
  onLogout: () => void;
  onExploreShop: () => void;
}

interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  province: string;
  postalCode: string;
  landmark?: string;
  isDefault?: boolean;
}

export const CustomerAccountScreen: React.FC<CustomerAccountScreenProps> = ({
  user,
  orders,
  cartCount,
  wishlistCount,
  onLogout,
  onExploreShop,
}) => {
  const storageKey = `insight.account.addresses.v1.${user.id}`;
  const [tab, setTab] = useState<'dashboard' | 'orders' | 'addresses' | 'profile' | 'security'>('dashboard');
  const [addresses, setAddresses] = useState<Address[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<Omit<Address, 'id'>>({
    fullName: user.fullName || '',
    phone: user.phone || '',
    address: '',
    area: '',
    city: '',
    province: '',
    postalCode: '',
    landmark: '',
    isDefault: addresses.length === 0,
  });

  const saveAddresses = (next: Address[]) => {
    setAddresses(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const addAddress = () => {
    if (!addressForm.fullName || !addressForm.phone || !addressForm.address || !addressForm.city || !addressForm.province) return;
    let next = [...addresses];
    if (addressForm.isDefault) next = next.map((a) => ({ ...a, isDefault: false }));
    next.push({ ...addressForm, id: Date.now().toString() });
    saveAddresses(next);
    setShowAddressForm(false);
    setAddressForm({ fullName: user.fullName || '', phone: user.phone || '', address: '', area: '', city: '', province: '', postalCode: '', landmark: '', isDefault: false });
  };

  const delivered = useMemo(() => orders.filter((o) => o.status === 'Delivered').length, [orders]);

  const tabs = [
    ['dashboard', 'Dashboard', Home],
    ['orders', 'My Orders', Package],
    ['addresses', 'Saved Addresses', MapPin],
    ['profile', 'Profile', User],
    ['security', 'Security', ShieldCheck],
  ] as const;

  return (
    <section className="bg-slate-50 min-h-[72vh] py-8 sm:py-10">
      <div className="wrap">
        <div className="rounded-3xl bg-gradient-to-r from-[#052f8e] to-[#0b63d8] text-white p-6 sm:p-8 mb-6 shadow-lg shadow-blue-900/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-[.16em]">Customer Account</p>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">Welcome back, {user.fullName?.split(' ')[0] || user.email?.split('@')[0] || 'Customer'}</h1>
              <p className="text-sm text-blue-100 mt-2">{user.email || user.phone}</p>
            </div>
            <button onClick={onLogout} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-sm font-bold hover:bg-white/20">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          <aside className="bg-white border border-slate-200 rounded-2xl p-3 h-fit shadow-sm">
            {tabs.map(([key, label, Icon]) => (
              <button key={key} onClick={() => setTab(key)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-left transition ${tab === key ? 'bg-blue-50 text-[#073faf]' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </aside>

          <div>
            {tab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    ['Orders', orders.length, Package],
                    ['Wishlist', wishlistCount, Heart],
                    ['Cart', cartCount, ShoppingBag],
                    ['Addresses', addresses.length, MapPin],
                  ].map(([label, value, Icon]) => (
                    <div key={String(label)} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#073faf] flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></div>
                      <div className="text-2xl font-black text-slate-900">{String(value)}</div>
                      <div className="text-xs font-semibold text-slate-500 mt-1">{String(label)}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-black text-lg text-slate-900">Account overview</h2>
                  <p className="text-sm text-slate-500 mt-2">You have {orders.length} order{orders.length === 1 ? '' : 's'}, including {delivered} delivered order{delivered === 1 ? '' : 's'}.</p>
                  {orders.length === 0 && <button onClick={onExploreShop} className="mt-5 rounded-xl bg-[#073faf] text-white px-5 py-3 text-sm font-bold">Start shopping</button>}
                </div>
              </div>
            )}

            {tab === 'orders' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-lg text-slate-900 mb-5">My Orders</h2>
                {orders.length === 0 ? <p className="text-sm text-slate-500">No orders yet.</p> : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div><div className="font-black text-sm text-slate-900">{order.id}</div><div className="text-xs text-slate-500 mt-1">{order.date} · {order.items.length} item{order.items.length === 1 ? '' : 's'}</div></div>
                        <div className="sm:text-right"><div className="text-xs font-bold text-[#073faf]">{order.status}</div><div className="font-black text-sm mt-1">PKR {order.total.toLocaleString()}</div></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'addresses' && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-black text-lg text-slate-900">Saved Addresses</h2>
                    <button onClick={() => setShowAddressForm(!showAddressForm)} className="inline-flex items-center gap-2 rounded-xl bg-[#073faf] text-white px-4 py-2.5 text-xs font-bold"><Plus className="w-4 h-4" /> Add address</button>
                  </div>
                  {showAddressForm && (
                    <div className="grid sm:grid-cols-2 gap-3 mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      {[
                        ['fullName','Full name'],['phone','Phone'],['address','Address line'],['area','Area'],['city','City'],['province','Province'],['postalCode','Postal code'],['landmark','Landmark (optional)']
                      ].map(([key,label]) => (
                        <label key={key} className={key === 'address' ? 'sm:col-span-2' : ''}><span className="text-xs font-bold text-slate-600">{label}</span><input value={(addressForm as any)[key] || ''} onChange={(e) => setAddressForm({ ...addressForm, [key]: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#073faf]" /></label>
                      ))}
                      <label className="sm:col-span-2 flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={Boolean(addressForm.isDefault)} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} /> Set as default address</label>
                      <div className="sm:col-span-2"><button onClick={addAddress} className="rounded-lg bg-[#073faf] text-white px-4 py-2.5 text-xs font-bold">Save address</button></div>
                    </div>
                  )}
                </div>
                {addresses.map((address) => (
                  <div key={address.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2"><span className="font-black text-sm">{address.fullName}</span>{address.isDefault && <span className="text-[10px] font-bold rounded-full bg-blue-50 text-[#073faf] px-2 py-0.5">Default</span>}</div>
                        <p className="text-sm text-slate-500 mt-2">{address.address}{address.area ? `, ${address.area}` : ''}</p>
                        <p className="text-sm text-slate-500">{address.city}, {address.province} {address.postalCode}</p>
                        <p className="text-xs text-slate-400 mt-1">{address.phone}</p>
                      </div>
                      <button onClick={() => saveAddresses(addresses.filter((a) => a.id !== address.id))} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'profile' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-lg text-slate-900 mb-5">Profile</h2>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><User className="w-4 h-4 text-[#073faf] mb-2" /><div className="text-xs text-slate-400">Full name</div><div className="font-bold mt-1">{user.fullName || 'Not provided'}</div></div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><Mail className="w-4 h-4 text-[#073faf] mb-2" /><div className="text-xs text-slate-400">Email</div><div className="font-bold mt-1 break-all">{user.email || 'Not connected'}</div></div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><Phone className="w-4 h-4 text-[#073faf] mb-2" /><div className="text-xs text-slate-400">Phone</div><div className="font-bold mt-1">{user.phone || 'Not connected'}</div></div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><ShieldCheck className="w-4 h-4 text-[#073faf] mb-2" /><div className="text-xs text-slate-400">Member since</div><div className="font-bold mt-1">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Current account'}</div></div>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-lg text-slate-900">Security</h2>
                <p className="text-sm text-slate-500 mt-2">Passwords and verification are handled by the configured authentication provider. Sensitive credentials are never stored in the storefront code.</p>
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Your account session is isolated from other customers.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
