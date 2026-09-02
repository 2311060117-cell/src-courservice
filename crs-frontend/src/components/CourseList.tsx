import React from 'react';

interface Course {
    id: number;
    tenMonHoc?: string;
    name?: string;
    soTinChi?: number;
    credits?: number;
    soChoConLai?: number;
    soChoToiDa?: number;
    tongSoCho?: number;
}

interface CourseListProps {
    courses: Course[];
    state?: string;
    errorMessage?: string;
    onRetry?: () => void;
    onRegister: (courseId: number) => void;
    registeringId?: number | null;
}

export default function CourseList({
                                       courses,
                                       state,
                                       errorMessage,
                                       onRetry,
                                       onRegister,
                                       registeringId,
                                   }: CourseListProps) {
    if (state === 'loading') return <p style={{ color: '#fff' }}>Đang tải danh sách môn học...</p>;

    if (state === 'error') {
        return (
            <div style={{ color: '#ff6b6b', textAlign: 'center', margin: '20px 0' }}>
                <p>Lỗi: {errorMessage || 'Không thể tải dữ liệu'}</p>
                {onRetry && (
                    <button onClick={onRetry} style={{ padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}>
                        Thử lại
                    </button>
                )}
            </div>
        );
    }

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left' }}>
            <thead>
            <tr style={{ borderBottom: '2px solid #555' }}>
                <th style={{ padding: '12px' }}>Tên môn học</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Số tín chỉ</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Số chỗ còn lại</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Hành động</th>
            </tr>
            </thead>
            <tbody>
            {courses && courses.length > 0 ? (
                courses.map((course) => (
                    <tr key={course.id} style={{ borderBottom: '1px solid #333' }}>
                        <td style={{ padding: '12px' }}>{course.tenMonHoc || course.name}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>{course.soTinChi || course.credits}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                            {(course.soChoConLai ?? 30)} / {(course.soChoToiDa ?? course.tongSoCho ?? 30)}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button
                                onClick={() => onRegister(course.id)}
                                disabled={registeringId === course.id}
                                style={{
                                    backgroundColor: registeringId === course.id ? '#6c757d' : '#28a745',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: registeringId === course.id ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                {registeringId === course.id ? 'Đang xử lý...' : 'Đăng ký'}
                            </button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                        Không có môn học nào.
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
}