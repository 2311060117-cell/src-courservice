export interface Course {
  id: number;
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: number;
  soChoToiDa: number;
  soChoConLai: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface CourseFormValues {
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: string;
  soChoToiDa: string;
}

export const emptyCourseForm: CourseFormValues = {
  maMonHoc: '',
  tenMonHoc: '',
  soTinChi: '',
  soChoToiDa: '',
};