import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  User,
} from 'lucide-react';

// Replace this with your actual backend URL or keep it dynamic
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const SecuritySettings= () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveChanges = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert('Please fill in all fields.');
    }
    if (newPassword !== confirmPassword) {
      return alert('New passwords do not match.');
    }
    if (newPassword.length < 8) {
      return alert('Password must be at least 8 characters.');
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_URL}/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update password.');
      alert(data.message || 'Password updated!');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_URL}/deactivate`, {
        method: 'POST',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to deactivate account.');
      alert(data.message || 'Account deactivated.');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

//   const handleDelete = async () => {
//     const confirmDelete = window.confirm(
//       'Are you sure you want to delete your account? This action is irreversible.'
//     );
//     if (!confirmDelete) return;

//     try {
//       setIsLoading(true);
//       const response = await fetch(`${BACKEND_URL}/delete`, {
//         method: 'DELETE',
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'Failed to delete account.');
//       alert(data.message || 'Account deleted permanently.');
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

  return (
    <div className="p-8 max-w-xl mx-auto text-left">
      <h1 className="text-3xl font-bold mb-6">Security settings</h1>

      <div className="flex items-center gap-4 mb-6">
        <User className="w-10 h-10 text-gray-500" />
        <div>
          <p className="text-lg font-semibold">Roshan Karki</p>
          <p className="text-sm text-gray-600">karkiroshan061@gmail.com</p>
        </div>
      </div>

      {/* Password Section */}
      <div className="space-y-4 mb-8">
        {/* Current Password */}
        <div>
          <label className="block font-medium mb-1">Current password *</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded pl-10"
              placeholder="Enter current password"
            />
            <Lock className="absolute left-2 top-2.5 text-gray-400" />
            {showCurrent ? (
              <EyeOff
                className="absolute right-2 top-2.5 cursor-pointer"
                onClick={() => setShowCurrent(!showCurrent)}
              />
            ) : (
              <Eye
                className="absolute right-2 top-2.5 cursor-pointer"
                onClick={() => setShowCurrent(!showCurrent)}
              />
            )}
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block font-medium mb-1">New password *</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded pl-10"
              placeholder="Create a strong password"
            />
            <Lock className="absolute left-2 top-2.5 text-gray-400" />
            {showNew ? (
              <EyeOff
                className="absolute right-2 top-2.5 cursor-pointer"
                onClick={() => setShowNew(!showNew)}
              />
            ) : (
              <Eye
                className="absolute right-2 top-2.5 cursor-pointer"
                onClick={() => setShowNew(!showNew)}
              />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters.</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block font-medium mb-1">New Password Confirmation *</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded pl-10"
              placeholder="Re-type new password"
            />
            <Lock className="absolute left-2 top-2.5 text-gray-400" />
            {showConfirm ? (
              <EyeOff
                className="absolute right-2 top-2.5 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              />
            ) : (
              <Eye
                className="absolute right-2 top-2.5 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              />
            )}
          </div>
        </div>

        <button
          className="bg-purple-600 text-white py-2 px-4 rounded disabled:opacity-50"
          onClick={handleSaveChanges}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <hr className="my-8" />

      {/* Deactivate Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Deactivate account</h2>
        <p className="text-sm text-gray-600 mb-3">
          You can temporarily deactivate your account. Your data will remain safe, and you can reactivate it anytime.
        </p>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded disabled:opacity-50"
          onClick={handleDeactivate}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Deactivate account'}
        </button>
      </div>

      <hr className="my-8" />

      {/* Delete Section */}
      {/* <div>
        <h2 className="text-xl font-semibold mb-1">Delete account</h2>
        <p className="text-sm text-gray-600 mb-3">
          This action is irreversible. All your data will be permanently deleted.
        </p>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded disabled:opacity-50"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? 'Deleting...' : 'Delete account'}
        </button>
      </div> */}
    </div>
  );
}

export default SecuritySettings;