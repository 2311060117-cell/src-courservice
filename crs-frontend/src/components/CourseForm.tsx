import React, { useState, useEffect } from 'react';
import type { Course, CourseFormValues } from '../types/course';
import { emptyCourseForm } from '../types/course';

interface CourseFormProps {
    editingCourse: Course | null;
    onSubmit: (values: CourseFormValues) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
    serverError: string | null;
}

export default function CourseForm({
                                       editingCourse,
                                       onSubmit,
                                       onCancel,
                                       submitting,
                                       serverError,
                                   }: CourseFormProps) {
    const [values, setValues] = useState<CourseFormValues>(emptyCourseForm);
    const [clientErrors, setClientErrors] = useState<Partial<CourseFormValues>>({});

    useEffect(() => {
        if (editingCourse) {
            setValues({
                maMonHoc: editingCourse.maMonHoc || '',
                tenMonHoc: editingCourse.tenMonHoc || '',
                soTinChi: String(editingCourse.soTinChi || ''),
                soChoToiDa: String(editingCourse.soChoToiDa || ''),
            });
        } else {
            setValues(emptyCourseForm);
        }
        setClientErrors({});
    }, [editingCourse]);

    const validate = (): boolean => {
        const errors: Partial<CourseFormValues> = {};
        if (!values.maMonHoc.trim()) {
            errors.maMonHoc = 'Mã môn học không được để trống';
        }
        if (!values.tenMonHoc.trim()) {
            errors.tenMonHoc = 'Tên môn học không được để trống';
        }

        const soTinChi = Number(values.soTinChi);
        if (!values.soTinChi || isNaN(soTinChi) || soTinChi <= 0) {
            errors.soTinChi = 'Số tín chỉ phải là số lớn hơn 0';
        }

        const soChoToiDa = Number(values.soChoToiDa);
        if (!values.soChoToiDa || isNaN(soChoToiDa) || soChoToiDa <= 0) {
            errors.soChoToiDa = 'Số chỗ tối đa phải là số lớn hơn 0';
        }

        setClientErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <h3>{editingCourse ? 'Sửa môn học' : 'Thêm môn học mới'}</h3>

            <div style={{ marginBottom: 8 }}>
                <label>Mã môn học</label><br />
                <input
                    type="text"
                    value={values.maMonHoc}
                    onChange={(e) => setValues({ ...values, maMonHoc: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box' }}
                    disabled={!!editingCourse}
                />
                {clientErrors.maMonHoc ? <p style={{ color: '#b91c1c', margin: '4px 0 0 0', fontSize: 13 }}>{clientErrors.maMonHoc}</p> : null}
            </div>

            <div style={{ marginBottom: 8 }}>
                <label>Tên môn học</label><br />
                <input
                    type="text"
                    value={values.tenMonHoc}
                    onChange={(e) => setValues({ ...values, tenMonHoc: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box' }}
                />
                {clientErrors.tenMonHoc ? <p style={{ color: '#b91c1c', margin: '4px 0 0 0', fontSize: 13 }}>{clientErrors.tenMonHoc}</p> : null}
            </div>

            <div style={{ marginBottom: 8 }}>
                <label>Số tín chỉ</label><br />
                <input
                    type="number"
                    value={values.soTinChi}
                    onChange={(e) => setValues({ ...values, soTinChi: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box' }}
                />
                {clientErrors.soTinChi ? <p style={{ color: '#b91c1c', margin: '4px 0 0 0', fontSize: 13 }}>{clientErrors.soTinChi}</p> : null}
            </div>

            <div style={{ marginBottom: 8 }}>
                <label>Số chỗ tối đa</label><br />
                <input
                    type="number"
                    value={values.soChoToiDa}
                    onChange={(e) => setValues({ ...values, soChoToiDa: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box' }}
                />
                {clientErrors.soChoToiDa ? <p style={{ color: '#b91c1c', margin: '4px 0 0 0', fontSize: 13 }}>{clientErrors.soChoToiDa}</p> : null}
            </div>

            {serverError ? <p style={{ color: '#b91c1c', marginTop: 8 }}>{serverError}</p> : null}

            <button type="submit" disabled={submitting} style={{ padding: '6px 16px', cursor: 'pointer' }}>
                {submitting ? 'Đang lưu...' : (editingCourse ? 'Cập nhật' : 'Thêm mới')}
            </button>

            {editingCourse ? (
                <button type="button" onClick={onCancel} style={{ marginLeft: 8, padding: '6px 16px', cursor: 'pointer' }}>
                    Hủy
                </button>
            ) : null}
        </form>
    );
}