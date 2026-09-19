'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Lock, User, Key, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Name Update Form
  const [name, setName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Change Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setProfile(data);
          setName(data.name || '');
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setProfile(data.user);
      toast.success('Admin name updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Error updating profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please enter current and new password');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');

      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Error changing password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-stone-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-stone-600" />
        <p className="text-sm">Loading admin settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Admin Profile & Security Settings</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Manage your administrator account credentials and authentication security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card className="bg-white border-stone-200 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-stone-100 text-stone-800">
                <User className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-stone-900">Admin Profile</CardTitle>
                <CardDescription className="text-xs text-stone-500">
                  Account identity & permissions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Display Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Admin Name"
                  className="bg-stone-50/50 border-stone-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Email Address (Read-only)</label>
                <Input
                  value={profile?.email || ''}
                  disabled
                  className="bg-stone-100 text-stone-600 border-stone-200 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Role</label>
                <div className="p-2.5 rounded-md bg-stone-50 border border-stone-200 text-xs flex items-center justify-between">
                  <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px]">
                    {profile?.role || 'Superadmin'}
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Full Access
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold h-9"
              >
                {isUpdatingProfile ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Update Profile Name'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Card */}
        <Card className="bg-white border-stone-200 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-stone-100 text-stone-800">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-stone-900">Change Password</CardTitle>
                <CardDescription className="text-xs text-stone-500">
                  Secured with bcrypt encryption
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Current Password</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-stone-50/50 border-stone-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">New Password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="bg-stone-50/50 border-stone-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Confirm New Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="bg-stone-50/50 border-stone-300 text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold h-9"
              >
                {isChangingPassword ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Change Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
