import { Component, type ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Lỗi giao diện đã được chặn lại:', error);
  }

  handleReset = () => {
    try {
      // Xóa dữ liệu cục bộ có thể đã bị hỏng, gây ra lỗi liên tục
      localStorage.clear();
    } catch {
      // bỏ qua nếu không truy cập được localStorage
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white border border-slate-100 rounded-2xl shadow-lg p-8 text-center space-y-4">
            <span className="text-5xl">⚠️</span>
            <h1 className="text-xl font-bold text-[#1a3c6e]">Đã có lỗi xảy ra</h1>
            <p className="text-sm text-slate-500">
              Giao diện gặp sự cố tạm thời. Vui lòng nhấn nút dưới đây để tải lại trang.
            </p>
            <button
              onClick={this.handleReset}
              className="bg-[#1a3c6e] hover:bg-[#c9a227] text-white font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer"
            >
              Tải Lại Trang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
