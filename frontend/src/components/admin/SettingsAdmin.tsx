import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import { Save, RefreshCw } from 'lucide-react';

export const SettingsAdmin = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/settings');
      const obj: any = {};
      res.data.forEach((item: any) => { obj[item.key] = item.value; });
      setSettings(obj);
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await api.put('/api/admin/settings', { key, value: typeof value === 'number' ? value : value });
      }
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white p-4 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <button
          onClick={loadSettings}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="glass rounded-2xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Global Margin (%)
          </label>
          <div className="relative">
            <input
              type="number"
              value={settings.global_margin_percent || 20}
              onChange={(e) => setSettings({ ...settings, global_margin_percent: parseFloat(e.target.value) || 0 })}
              min="0"
              max="100"
              step="0.5"
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
          <p className="text-gray-500 text-xs mt-1">Applied to all services when syncing from provider</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Referral Bonus (%)
          </label>
          <div className="relative">
            <input
              type="number"
              value={settings.referral_percent || 10}
              onChange={(e) => setSettings({ ...settings, referral_percent: parseFloat(e.target.value) || 0 })}
              min="0"
              max="50"
              step="0.5"
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
          <p className="text-gray-500 text-xs mt-1">Percentage of referred user's spend awarded to referrer</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gold text-black py-3 rounded-xl font-medium hover:bg-gold/90 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};
