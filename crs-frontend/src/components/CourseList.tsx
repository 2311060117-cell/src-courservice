import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
    courses: Course[];
    state: LoadState;
    errorMessage: string;
    onRetry: () => void;
}

export default function CourseList({ courses, state, errorMessage, onRetry }: CourseListProps) {
    if (state === 'loading') return <p>⏳ Đang tải danh sách môn học...</p>;

    if (state === 'error') {
        return (
            <div style={{ color: '#b91c1c', padding: 12, border: '1px solid #f87171', borderRadius: 6 }}>
                <p>⚠️ {errorMessage}</p>
                <button onClick={onRetry} style={{ cursor: 'pointer', padding: '6px 12px' }}>
                    Thử lại
                </button>
            </div>
        );
    }

    if (state === 'empty') return <p>🔍 Không tìm thấy môn học nào phù hợp.</p>;

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
            <tr style={{ borderBottom: '2px solid #ccc', paddingBottom: 8 }}>
                <th style={{ padding: 8 }}>Mã MH</th>
                <th style={{ padding: 8 }}>Tên môn học</th>
                <th style={{ padding: 8 }}>Số tín chỉ</th>
                <th style={{ padding: 8 }}>Số chỗ còn lại</th>
            </tr>
            </thead>
            <tbody>
            {courses.map((course) => (
                <tr key={course.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 8 }}>{course.maMonHoc}</td>
                    <td style={{ padding: 8 }}>{course.tenMonHoc}</td>
                    <td style={{ padding: 8 }}>{course.soTinChi}</td>
                    <td style={{ padding: 8, color: course.soChoConLai === 0 ? '#b91c1c' : 'green', fontWeight: 'bold' }}>
                        {course.soChoConLai} / {course.soChoToiDa}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}