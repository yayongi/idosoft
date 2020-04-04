package kr.co.idosoft.intranet.login.vo;

import java.io.Serializable;
import java.sql.Date;

/**
 * 
 * @author 유기환
 * @since 2020.03.09
 * @content SESSION_DATA 
 */
public class SessionVO implements Serializable{
	private static final long serialVersionUID = 6498887745377422418L;

	private String MEMBER_NO;					// 사번
	private String EMAIL;						// 이메일주소
	private String PWD;							// 비밀번호
	private String NAME;						// 이름
	private String POSITION;					// 직급
	private String ADDRESS_1;					// 기본주소
	private String ADDRESS_2;					// 상세주소
	private String PHONE_NUM;					// 전화번호
	private String BIRTH_DATE;					// 생일
	private String MOONCAL_YN;					// 생일음력여부
	private String MARRIAGE_DATE;				// 결혼기념일
	private String CAREER_DATE;					// 경력시작일
	private String ENTRY_DATE;					// 입사일
	private String SCHOOL_MAJOR; 				// 학교/학과
	private String SCHOOL_CAREER;				// 학위
	private String CERT_YN;						// 자격증유무
	private String MANAGER_YN;					// 관리자권한 유무
	private String APPROVAL_YN;					// 1차 결재자 여부
	private String PHOTO_PATH;					// 사진 경로
	private String CERTFILE_JOB_PATH;			// 자격증 파일 경로
	private String CERTFILE_SCHOOL_PATH;		// 증명서 파일 경로
	private Date REG_DATETIME;					// 등록일
	private Date UPD_DATE;						// 수정일
	private String REG_ID;						// 등록계정
	private String UPD_ID;						// 수정일
	private String RET_DATE;					// 퇴사일
	private String NOTE;						// SESSION_KEY(자동로그인 - session id 기록)
	private Date TEMP_COLUM;					// SESSION_LIMIT(자동로그인 유효시간 기록)
	
	public SessionVO() {
		super();
	}
	public SessionVO(String mEMBER_NO, String eMAIL, String pWD, String nAME, String pOSITION, String aDDRESS_1,
			String aDDRESS_2, String pHONE_NUM, String bIRTH_DATE, String mOONCAL_YN, String mARRIAGE_DATE,
			String cAREER_DATE, String eNTRY_DATE, String sCHOOL_MAJOR, String sCHOOL_CAREER, String cERT_YN,
			String mANAGER_YN, String aPPROVAL_YN, String pHOTO_PATH, String cERTFILE_JOB_PATH,
			String cERTFILE_SCHOOL_PATH, Date rEG_DATETIME, Date uPD_DATE, String rEG_ID, String uPD_ID,
			String rET_DATE, String nOTE, Date tEMP_COLUM) {
		super();
		MEMBER_NO = mEMBER_NO;
		EMAIL = eMAIL;
		PWD = pWD;
		NAME = nAME;
		POSITION = pOSITION;
		ADDRESS_1 = aDDRESS_1;
		ADDRESS_2 = aDDRESS_2;
		PHONE_NUM = pHONE_NUM;
		BIRTH_DATE = bIRTH_DATE;
		MOONCAL_YN = mOONCAL_YN;
		MARRIAGE_DATE = mARRIAGE_DATE;
		CAREER_DATE = cAREER_DATE;
		ENTRY_DATE = eNTRY_DATE;
		SCHOOL_MAJOR = sCHOOL_MAJOR;
		SCHOOL_CAREER = sCHOOL_CAREER;
		CERT_YN = cERT_YN;
		MANAGER_YN = mANAGER_YN;
		APPROVAL_YN = aPPROVAL_YN;
		PHOTO_PATH = pHOTO_PATH;
		CERTFILE_JOB_PATH = cERTFILE_JOB_PATH;
		CERTFILE_SCHOOL_PATH = cERTFILE_SCHOOL_PATH;
		REG_DATETIME = rEG_DATETIME;
		UPD_DATE = uPD_DATE;
		REG_ID = rEG_ID;
		UPD_ID = uPD_ID;
		RET_DATE = rET_DATE;
		NOTE = nOTE;
		TEMP_COLUM = tEMP_COLUM;
	}
	public String getMEMBER_NO() {
		return MEMBER_NO;
	}
	public void setMEMBER_NO(String mEMBER_NO) {
		MEMBER_NO = mEMBER_NO;
	}
	public String getEMAIL() {
		return EMAIL;
	}
	public void setEMAIL(String eMAIL) {
		EMAIL = eMAIL;
	}
	public String getPWD() {
		return PWD;
	}
	public void setPWD(String pWD) {
		PWD = pWD;
	}
	public String getNAME() {
		return NAME;
	}
	public void setNAME(String nAME) {
		NAME = nAME;
	}
	public String getPOSITION() {
		return POSITION;
	}
	public void setPOSITION(String pOSITION) {
		POSITION = pOSITION;
	}
	public String getADDRESS_1() {
		return ADDRESS_1;
	}
	public void setADDRESS_1(String aDDRESS_1) {
		ADDRESS_1 = aDDRESS_1;
	}
	public String getADDRESS_2() {
		return ADDRESS_2;
	}
	public void setADDRESS_2(String aDDRESS_2) {
		ADDRESS_2 = aDDRESS_2;
	}
	public String getPHONE_NUM() {
		return PHONE_NUM;
	}
	public void setPHONE_NUM(String pHONE_NUM) {
		PHONE_NUM = pHONE_NUM;
	}
	public String getBIRTH_DATE() {
		return BIRTH_DATE;
	}
	public void setBIRTH_DATE(String bIRTH_DATE) {
		BIRTH_DATE = bIRTH_DATE;
	}
	public String getMOONCAL_YN() {
		return MOONCAL_YN;
	}
	public void setMOONCAL_YN(String mOONCAL_YN) {
		MOONCAL_YN = mOONCAL_YN;
	}
	public String getMARRIAGE_DATE() {
		return MARRIAGE_DATE;
	}
	public void setMARRIAGE_DATE(String mARRIAGE_DATE) {
		MARRIAGE_DATE = mARRIAGE_DATE;
	}
	public String getCAREER_DATE() {
		return CAREER_DATE;
	}
	public void setCAREER_DATE(String cAREER_DATE) {
		CAREER_DATE = cAREER_DATE;
	}
	public String getENTRY_DATE() {
		return ENTRY_DATE;
	}
	public void setENTRY_DATE(String eNTRY_DATE) {
		ENTRY_DATE = eNTRY_DATE;
	}
	public String getSCHOOL_MAJOR() {
		return SCHOOL_MAJOR;
	}
	public void setSCHOOL_MAJOR(String sCHOOL_MAJOR) {
		SCHOOL_MAJOR = sCHOOL_MAJOR;
	}
	public String getSCHOOL_CAREER() {
		return SCHOOL_CAREER;
	}
	public void setSCHOOL_CAREER(String sCHOOL_CAREER) {
		SCHOOL_CAREER = sCHOOL_CAREER;
	}
	public String getCERT_YN() {
		return CERT_YN;
	}
	public void setCERT_YN(String cERT_YN) {
		CERT_YN = cERT_YN;
	}
	public String getMANAGER_YN() {
		return MANAGER_YN;
	}
	public void setMANAGER_YN(String mANAGER_YN) {
		MANAGER_YN = mANAGER_YN;
	}
	public String getAPPROVAL_YN() {
		return APPROVAL_YN;
	}
	public void setAPPROVAL_YN(String aPPROVAL_YN) {
		APPROVAL_YN = aPPROVAL_YN;
	}
	public String getPHOTO_PATH() {
		return PHOTO_PATH;
	}
	public void setPHOTO_PATH(String pHOTO_PATH) {
		PHOTO_PATH = pHOTO_PATH;
	}
	public String getCERTFILE_JOB_PATH() {
		return CERTFILE_JOB_PATH;
	}
	public void setCERTFILE_JOB_PATH(String cERTFILE_JOB_PATH) {
		CERTFILE_JOB_PATH = cERTFILE_JOB_PATH;
	}
	public String getCERTFILE_SCHOOL_PATH() {
		return CERTFILE_SCHOOL_PATH;
	}
	public void setCERTFILE_SCHOOL_PATH(String cERTFILE_SCHOOL_PATH) {
		CERTFILE_SCHOOL_PATH = cERTFILE_SCHOOL_PATH;
	}
	public Date getREG_DATETIME() {
		return REG_DATETIME;
	}
	public void setREG_DATETIME(Date rEG_DATETIME) {
		REG_DATETIME = rEG_DATETIME;
	}
	public Date getUPD_DATE() {
		return UPD_DATE;
	}
	public void setUPD_DATE(Date uPD_DATE) {
		UPD_DATE = uPD_DATE;
	}
	public String getREG_ID() {
		return REG_ID;
	}
	public void setREG_ID(String rEG_ID) {
		REG_ID = rEG_ID;
	}
	public String getUPD_ID() {
		return UPD_ID;
	}
	public void setUPD_ID(String uPD_ID) {
		UPD_ID = uPD_ID;
	}
	public String getRET_DATE() {
		return RET_DATE;
	}
	public void setRET_DATE(String rET_DATE) {
		RET_DATE = rET_DATE;
	}
	public String getNOTE() {
		return NOTE;
	}
	public void setNOTE(String nOTE) {
		NOTE = nOTE;
	}
	public Date getTEMP_COLUM() {
		return TEMP_COLUM;
	}
	public void setTEMP_COLUM(Date tEMP_COLUM) {
		TEMP_COLUM = tEMP_COLUM;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	@Override
	public String toString() {
		return "SessionVO [MEMBER_NO=" + MEMBER_NO + ", EMAIL=" + EMAIL + ", PWD=" + PWD + ", NAME=" + NAME
				+ ", POSITION=" + POSITION + ", ADDRESS_1=" + ADDRESS_1 + ", ADDRESS_2=" + ADDRESS_2 + ", PHONE_NUM="
				+ PHONE_NUM + ", BIRTH_DATE=" + BIRTH_DATE + ", MOONCAL_YN=" + MOONCAL_YN + ", MARRIAGE_DATE="
				+ MARRIAGE_DATE + ", CAREER_DATE=" + CAREER_DATE + ", ENTRY_DATE=" + ENTRY_DATE + ", SCHOOL_MAJOR="
				+ SCHOOL_MAJOR + ", SCHOOL_CAREER=" + SCHOOL_CAREER + ", CERT_YN=" + CERT_YN + ", MANAGER_YN="
				+ MANAGER_YN + ", APPROVAL_YN=" + APPROVAL_YN + ", PHOTO_PATH=" + PHOTO_PATH + ", CERTFILE_JOB_PATH="
				+ CERTFILE_JOB_PATH + ", CERTFILE_SCHOOL_PATH=" + CERTFILE_SCHOOL_PATH + ", REG_DATETIME="
				+ REG_DATETIME + ", UPD_DATE=" + UPD_DATE + ", REG_ID=" + REG_ID + ", UPD_ID=" + UPD_ID + ", RET_DATE="
				+ RET_DATE + ", NOTE=" + NOTE + ", TEMP_COLUM=" + TEMP_COLUM + "]";
	}

}
