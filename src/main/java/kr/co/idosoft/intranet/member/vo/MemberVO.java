package kr.co.idosoft.intranet.member.vo;

import java.io.Serializable;

public class MemberVO implements Serializable {
	
	private static final long serialVersionUID = -2944358041715112116L;
	
	private String member_no;				//사원번호
	private String email;					//이메일
	private String pwd;						//비밀번호
	private String name;					//이름
	private String position;				//직급
	private String address_1;				//기본주소
	private String address_2;				//상세주소
	private String zip_code;				//우편번호
	private String phone_num;				//전화번호
	private String birth_date;				//생일
	private String marriage_date;			//결혼기념일
	private String career_date;				//경력시작일
	private String entry_date;				//입사일
	private String school_major;			//학교-전공
	private String school_career;			//최종학력
	private int mooncal_yn;				//음력여부
	private int cert_yn;					//자격증 유무
	private int manager_yn;				//관리자 여부
	private int approval_yn;				//1차 결제자 여부
	private String photo_path;				//프로필 사전 파일명
	private String certfile_job_path;		//정보처리기사 자격증 파일명
	private String certfile_school_path;	//졸업증명서 파일명 
	private String reg_datetime;			//등록일자
	private String upd_date;				//수정일자
	private String reg_id;					//등록아이디
	private String ret_date;				//등록일자
	private String upd_id;					//수정아이디
	private String note;					//비고1
	private String temp_colum;				//비고2
	private String code_name;
	
	public String getZip_code() {
		return zip_code;
	}
	public void setZip_code(String zip_code) {
		this.zip_code = zip_code;
	}
	
	public String getCode_name() {
		return code_name;
	}
	public void setCode_name(String code_name) {
		this.code_name = code_name;
	}
	public String getMember_no() {
		return member_no;
	}
	public void setMember_no(String member_no) {
		this.member_no = member_no;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPosition() {
		return position;
	}
	public void setPosition(String position) {
		this.position = position;
	}
	public String getAddress_1() {
		return address_1;
	}
	public void setAddress_1(String address_1) {
		this.address_1 = address_1;
	}
	public String getAddress_2() {
		return address_2;
	}
	public void setAddress_2(String address_2) {
		this.address_2 = address_2;
	}
	public String getPhone_num() {
		return phone_num;
	}
	public void setPhone_num(String phone_num) {
		this.phone_num = phone_num;
	}
	public String getBirth_date() {
		return birth_date;
	}
	public void setBirth_date(String birth_date) {
		this.birth_date = birth_date;
	}
	public String getMarriage_date() {
		return marriage_date;
	}
	public void setMarriage_date(String marriage_date) {
		this.marriage_date = marriage_date;
	}
	public String getCareer_date() {
		return career_date;
	}
	public void setCareer_date(String career_date) {
		this.career_date = career_date;
	}
	public String getEntry_date() {
		return entry_date;
	}
	public void setEntry_date(String entry_date) {
		this.entry_date = entry_date;
	}
	public String getSchool_major() {
		return school_major;
	}
	public void setSchool_major(String school_major) {
		this.school_major = school_major;
	}
	public String getSchool_career() {
		return school_career;
	}
	public void setSchool_career(String school_career) {
		this.school_career = school_career;
	}
	public int getMooncal_yn() {
		return mooncal_yn;
	}
	public void setMooncal_yn(int mooncal_yn) {
		this.mooncal_yn = mooncal_yn;
	}
	public int getCert_yn() {
		return cert_yn;
	}
	public void setCert_yn(int cert_yn) {
		this.cert_yn = cert_yn;
	}
	public int getManager_yn() {
		return manager_yn;
	}
	public void setManager_yn(int manager_yn) {
		this.manager_yn = manager_yn;
	}
	public int getApproval_yn() {
		return approval_yn;
	}
	public void setApproval_yn(int approval_yn) {
		this.approval_yn = approval_yn;
	}
	public String getPhoto_path() {
		return photo_path;
	}
	public void setPhoto_path(String photo_path) {
		this.photo_path = photo_path;
	}
	public String getCertfile_job_path() {
		return certfile_job_path;
	}
	public void setCertfile_job_path(String certfile_job_path) {
		this.certfile_job_path = certfile_job_path;
	}
	public String getCertfile_school_path() {
		return certfile_school_path;
	}
	public void setCertfile_school_path(String certfile_school_path) {
		this.certfile_school_path = certfile_school_path;
	}
	public String getReg_datetime() {
		return reg_datetime;
	}
	public void setReg_datetime(String reg_datetime) {
		this.reg_datetime = reg_datetime;
	}
	public String getUpd_date() {
		return upd_date;
	}
	public void setUpd_date(String upd_date) {
		this.upd_date = upd_date;
	}
	public String getReg_id() {
		return reg_id;
	}
	public void setReg_id(String reg_id) {
		this.reg_id = reg_id;
	}
	public String getRet_date() {
		return ret_date;
	}
	public void setRet_date(String ret_date) {
		this.ret_date = ret_date;
	}
	public String getUpd_id() {
		return upd_id;
	}
	public void setUpd_id(String upd_id) {
		this.upd_id = upd_id;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public String getTemp_colum() {
		return temp_colum;
	}
	public void setTemp_colum(String temp_colum) {
		this.temp_colum = temp_colum;
	}
	
	
}
