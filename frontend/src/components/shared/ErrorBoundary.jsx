// ============================================
// CashierNova — Error Boundary Component
// Menangkap error di komponen anak dan tampilkan fallback
// ============================================

import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error ke console (bisa diganti dengan error reporting service)
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback jika disediakan
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-danger" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-sm text-text-secondary dark:text-gray-400 max-w-md mb-6">
            {this.props.message || 'Komponen ini mengalami error. Silakan coba lagi atau muat ulang halaman.'}
          </p>
          <button
            onClick={this.handleReset}
            className="btn-primary flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
