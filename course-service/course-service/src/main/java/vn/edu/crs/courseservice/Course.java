package vn.edu.crs.courseservice;

import jakarta.persistence.*;

@Entity
@Table(name = "course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String maMonHoc;
    private String tenMonHoc;
    private Integer soTinChi;
    private Integer soChoConLai;
    private Integer soChoToiDa;

    public Course() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMaMonHoc() { return maMonHoc; }
    public void setMaMonHoc(String maMonHoc) { this.maMonHoc = maMonHoc; }

    public String getTenMonHoc() { return tenMonHoc; }
    public void setTenMonHoc(String tenMonHoc) { this.tenMonHoc = tenMonHoc; }

    public Integer getSoTinChi() { return soTinChi; }
    public void setSoTinChi(Integer soTinChi) { this.soTinChi = soTinChi; }

    public Integer getSoChoConLai() { return soChoConLai; }
    public void setSoChoConLai(Integer soChoConLai) { this.soChoConLai = soChoConLai; }

    public Integer getSoChoToiDa() { return soChoToiDa; }
    public void setSoChoToiDa(Integer soChoToiDa) { this.soChoToiDa = soChoToiDa; }
}