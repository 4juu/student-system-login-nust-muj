import { useState, useEffect } from 'react';
import { Student, AttendanceRecord, AttendanceSession } from './types/student';
import { StudentManager } from './components/StudentManager';
import { AttendanceLogin } from './components/AttendanceLogin';
import { AttendanceRecords } from './components/AttendanceRecords';
import { Settings } from './components/Settings';
import { SessionManager } from './components/SessionManager';
import {
  loadStudents,
  loadAttendanceRecords,
  saveStudents,
  saveAttendanceRecords,
  loadSessions,
  saveSessions,
  loadActiveSession,
  saveActiveSession,
  isStorageAvailable,
} from './utils/storage';

function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    return loadStudents();
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    return loadAttendanceRecords();
  });

  const [sessions, setSessions] = useState<AttendanceSession[]>(() => {
    return loadSessions();
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return loadActiveSession();
  });

  const [activeTab, setActiveTab] = useState<'login' | 'manage' | 'records' | 'settings' | 'sessions'>('sessions');

  // Check if localStorage is available on mount
  useEffect(() => {
    if (!isStorageAvailable()) {
      alert('⚠️ تحذير: تخزين البيانات غير متاح في المتصفح. قد تفقد البيانات عند الإغلاق.');
    }
  }, []);

  // Save students to localStorage whenever they change
  useEffect(() => {
    saveStudents(students);
  }, [students]);

  // Save attendance records to localStorage whenever they change
  useEffect(() => {
    saveAttendanceRecords(attendanceRecords);
  }, [attendanceRecords]);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  // Save active session whenever it changes
  useEffect(() => {
    saveActiveSession(activeSessionId);
  }, [activeSessionId]);

  const handleAddStudent = (student: Student) => {
    setStudents([...students, student]);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleAttendanceRecord = (record: AttendanceRecord) => {
    setAttendanceRecords([...attendanceRecords, record]);
  };

  const handleClearRecords = () => {
    setAttendanceRecords([]);
  };

  const handleDataRestored = () => {
    // This will be called after backup restoration
    // The page will reload automatically
  };

  const handleCreateSession = (session: AttendanceSession) => {
    // Deactivate all other sessions
    const updatedSessions = sessions.map(s => ({ ...s, isActive: false }));
    setSessions([...updatedSessions, session]);
    setActiveSessionId(session.id);
  };

  const handleSelectSession = (sessionId: string) => {
    const updatedSessions = sessions.map(s => ({
      ...s,
      isActive: s.id === sessionId,
    }));
    setSessions(updatedSessions);
    setActiveSessionId(sessionId);
  };

  const handleDeleteSession = (sessionId: string) => {
    // Remove session
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    
    // Remove associated attendance records
    const updatedRecords = attendanceRecords.filter(r => r.sessionId !== sessionId);
    setAttendanceRecords(updatedRecords);
    
    // If deleted session was active, clear active session
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            نظام تسجيل حضور الطلاب
          </h1>
          <p className="text-gray-600 text-lg">
            نظام متكامل لإدارة حضور الطلاب بسهولة وفعالية
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>جميع البيانات محفوظة تلقائياً ✓</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
              activeTab === 'sessions'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📋 السجلات ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📝 تسجيل الحضور
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
              activeTab === 'manage'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            👥 إدارة الطلاب ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
              activeTab === 'records'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📊 سجل الحضور ({attendanceRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ⚙️ الإعدادات
          </button>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'sessions' && (
            <SessionManager
              sessions={sessions}
              activeSessionId={activeSessionId}
              onCreateSession={handleCreateSession}
              onSelectSession={handleSelectSession}
              onDeleteSession={handleDeleteSession}
            />
          )}

          {activeTab === 'login' && (
            <div className="max-w-lg mx-auto">
              {!activeSessionId ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-yellow-800 font-medium mb-4">
                    لا يوجد سجل نشط!
                  </p>
                  <p className="text-yellow-700 mb-4">
                    يجب تفعيل سجل حضور أولاً قبل البدء بتسجيل حضور الطلاب
                  </p>
                  <button
                    onClick={() => setActiveTab('sessions')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
                  >
                    انتقل لإدارة السجلات
                  </button>
                </div>
              ) : students.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <p className="text-yellow-800 font-medium mb-4">
                    لا يوجد طلاب مسجلين في النظام
                  </p>
                  <button
                    onClick={() => setActiveTab('manage')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
                  >
                    انتقل لإضافة الطلاب
                  </button>
                </div>
              ) : (
                <AttendanceLogin
                  students={students}
                  activeSessionId={activeSessionId}
                  onAttendanceRecord={handleAttendanceRecord}
                />
              )}
            </div>
          )}

          {activeTab === 'manage' && (
            <StudentManager
              students={students}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {activeTab === 'records' && (
            <AttendanceRecords
              records={attendanceRecords}
              sessions={sessions}
              activeSessionId={activeSessionId}
              onClearRecords={handleClearRecords}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              students={students}
              attendanceRecords={attendanceRecords}
              onDataRestored={handleDataRestored}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            نظام تسجيل الحضور الإلكتروني - {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
