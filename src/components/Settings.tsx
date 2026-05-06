import React, { useRef } from 'react';
import { Student, AttendanceRecord } from '../types/student';
import { downloadBackup, restoreFromBackup, getStorageInfo } from '../utils/storage';

interface SettingsProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onDataRestored: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  students,
  attendanceRecords,
  onDataRestored,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageInfo = getStorageInfo();

  const handleDownloadBackup = () => {
    downloadBackup();
  };

  const handleRestoreBackup = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const success = restoreFromBackup(content);
        if (success) {
          alert('✅ تم استعادة النسخة الاحتياطية بنجاح! سيتم تحديث الصفحة...');
          onDataRestored();
          window.location.reload();
        } else {
          alert('❌ فشل استعادة النسخة الاحتياطية. تأكد من صحة الملف.');
        }
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">الإعدادات والنسخ الاحتياطي</h2>

      {/* Storage Info */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">معلومات التخزين</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">المساحة المستخدمة:</span>
            <span className="font-bold text-blue-600">
              {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.total)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                storageInfo.percentage > 80
                  ? 'bg-red-500'
                  : storageInfo.percentage > 50
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {storageInfo.percentage.toFixed(1)}% من المساحة مستخدمة
          </p>
        </div>
      </div>

      {/* Data Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">ملخص البيانات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">عدد الطلاب</p>
                <p className="text-2xl font-bold text-gray-800">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">سجلات الحضور</p>
                <p className="text-2xl font-bold text-gray-800">{attendanceRecords.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">النسخ الاحتياطي</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">💾 احفظ بياناتك بانتظام!</p>
              <p>البيانات محفوظة في المتصفح فقط. قم بتحميل نسخة احتياطية لضمان عدم فقدان البيانات عند مسح بيانات المتصفح.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleDownloadBackup}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            تحميل نسخة احتياطية
          </button>

          <button
            onClick={handleRestoreBackup}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            استعادة نسخة احتياطية
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">معلومات مهمة</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>جميع البيانات محفوظة تلقائياً في المتصفح</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>البيانات تبقى محفوظة حتى بعد إغلاق المتصفح</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>لا يتم إرسال أي بيانات إلى الإنترنت (خصوصية كاملة)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-1">⚠</span>
            <span>قد تُحذف البيانات عند مسح بيانات المتصفح أو الكوكيز</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">💡</span>
            <span>يُنصح بتحميل نسخة احتياطية كل فترة للحفاظ على البيانات</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
