import React, { useState } from 'react';

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

export default function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
    const [email, setEmail] = useState('admin@mdhome.com');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'mdhome2026') {
            onLoginSuccess();
            onClose();
        } else {
            setError('Sai mật khẩu!');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl space-y-4 w-96">
                <h2 className="text-2xl font-bold text-[#1a3c6e]">ĐĂNG NHẬP ADMIN</h2>
                {error && <p className="text-red-500">{error}</p>}
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-3 rounded-lg font-sans font-semibold text-slate-700" placeholder="Mật khẩu (Gợi ý: mdhome2026)" required />
                <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-[#1a3c6e] text-white p-3 rounded-lg font-bold">Đăng Nhập</button>
                    <button type="button" onClick={onClose} className="flex-1 bg-gray-200 p-3 rounded-lg font-bold">Hủy</button>
                </div>
            </form>
        </div>
    );
}
