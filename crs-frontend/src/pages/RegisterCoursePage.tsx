import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Course {
    id: number;
    tenMonHoc: string;
    soTinChi: number;
    soChoConLai: number;
    tongSoCho?: number;
}

interface ToastState {
    show: boolean;
    message: string;
    type: 'success' | 'error';
}

export default function RegisterCoursePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [registeringId, setRegisteringId] = useState<number | null>(null);

    // State quản lý Toast thông báo
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: '',
        type: 'success',
    });

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 4000);
    };

    // Hàm tải danh sách môn học từ API Gateway
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/courses', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            const data = response.data.content ? response.data.content : response.data;
            setCourses(data);
            setFetchError(null);
        } catch (err: any) {
            setFetchError('Lỗi: Không thể lấy danh sách môn học');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Hàm xử lý khi nhấn nút Đăng ký
    const handleRegister = async (courseId: number) => {
        setRegisteringId(courseId);
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId') || '1';

            await axios.post(
                'http://localhost:8080/api/registrations',
                {
                    studentId: Number(userId),
                    courseId: courseId,
                },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                }
            );

            showToast('Đăng ký học phần thành công!', 'success');
            // Chỉ tải lại danh sách môn học khi ĐĂNG KÝ THÀNH CÔNG
            fetchCourses();
        } catch (error: any) {
            // Bắt message lỗi từ registration-service truyền qua
            const errorMsg =
                error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : null) ||
                'Khong the ket noi toi course-service, vui long thu lai sau';

            // Hiển thị Toast lỗi và KHÔNG gọi fetchCourses() để giữ nguyên giao diện
            showToast(errorMsg, 'error');
        } finally {
            setRegisteringId(null);
        }
    };

    const filteredCourses = courses.filter((c) =>
        c.tenMonHoc?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', color: '#fff', position: 'relative' }}>
            {/* Toast popup hiển thị góc dưới màn hình */}
            {toast.show && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        backgroundColor: toast.type === 'success' ? '#28a745' : '#dc3545',
                        color: '#fff',
                        padding: '14px 24px',
                        borderRadius: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        zIndex: 9999,
                        fontWeight: 'bold',
                        fontSize: '15px',
                    }}
                >
                    {toast.message}
                </div>
            )}

            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Đăng ký học phần</h1>

            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên môn học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #444',
                        backgroundColor: '#222',
                        color: '#fff',
                    }}
                />
            </div>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Đang tải danh sách môn học...</p>
            ) : fetchError ? (
                <div style={{ textAlign: 'center', color: '#ff6b6b' }}>
                    <p>{fetchError}</p>
                    <button
                        onClick={fetchCourses}
                        style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}
                    >
                        Thử lại
                    </button>
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                    <tr style={{ borderBottom: '2px solid #555', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Tên môn học</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Số tín chỉ</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Số chỗ còn lại</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredCourses.map((course) => (
                        <tr key={course.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '12px' }}>{course.tenMonHoc}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>{course.soTinChi}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                {course.soChoConLai} / {course.tongSoCho || 30}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                <button
                                    onClick={() => handleRegister(course.id)}
                                    disabled={course.soChoConLai <= 0 || registeringId === course.id}
                                    style={{
                                        backgroundColor:
                                            course.soChoConLai <= 0 ? '#6c757d' : '#28a745',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        cursor: course.soChoConLai <= 0 ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {registeringId === course.id
                                        ? 'Đang xử lý...'
                                        : course.soChoConLai <= 0
                                            ? 'Hết chỗ'
                                            : 'Đăng ký'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}