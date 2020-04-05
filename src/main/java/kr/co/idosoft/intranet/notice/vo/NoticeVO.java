package kr.co.idosoft.intranet.notice.vo;

import java.io.Serializable;

/**
 * 
 * @author 김준선
 * @since 2020.03.25
 * @content Notice VO
 */
public class NoticeVO implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 3098854134501538315L;
	
	private int board_no;						//게시글 번호
	private String board_type_code= "BT0000";		//게시판 종류
	private String title;						//제목
	private String content;						//내용
	private int major_yn;						//중요공지 여부
	private String major_period_date;			//중요공지일 설정
	private String reg_datetime;				//등록일
	private String upd_datetime;				//수정일
	private String reg_id;						//등록자
	private String upd_id;						//수정자
	private String note;						//메모
	private String temp_colum;					//여분
	
	private String writer;
	
	public NoticeVO() {
		super();
	}

	public NoticeVO(int board_no, String board_type_code, String title, String content, int major_yn,
			String major_period_date, String reg_datetime, String upd_datetime, String reg_id, String upd_id,
			String note, String temp_colum,     String writer) {
		super();
		this.board_no = board_no;
		this.board_type_code = board_type_code;
		this.title = title;
		this.content = content;
		this.major_yn = major_yn;
		this.major_period_date = major_period_date;
		this.reg_datetime = reg_datetime;
		this.upd_datetime = upd_datetime;
		this.reg_id = reg_id;
		this.upd_id = upd_id;
		this.note = note;
		this.temp_colum = temp_colum;
		
		this.writer = writer;
	}

	public String getWriter() {
		return writer;
	}
	//
	public void setWriter(String writer) {
		this.writer = writer;
	}

	public int getBoard_no() {
		return board_no;
	}

	public void setBoard_no(int board_no) {
		this.board_no = board_no;
	}

	public String getBoard_type_code() {
		return board_type_code;
	}
	//
	public void setBoard_type_code(String board_type_code) {
		this.board_type_code = board_type_code;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public int getMajor_yn() {
		return major_yn;
	}

	public void setMajor_yn(int major_yn) {
		this.major_yn = major_yn;
	}

	public String getMajor_period_date() {
		return major_period_date;
	}

	public void setMajor_period_date(String major_period_date) {
		this.major_period_date = major_period_date;
	}

	public String getReg_datetime() {
		return reg_datetime;
	}

	public void setReg_datetime(String reg_datetime) {
		this.reg_datetime = reg_datetime;
	}

	public String getUpd_datetime() {
		return upd_datetime;
	}

	public void setUpd_datetime(String upd_datetime) {
		this.upd_datetime = upd_datetime;
	}

	public String getReg_id() {
		return reg_id;
	}

	public void setReg_id(String reg_id) {
		this.reg_id = reg_id;
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

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
	
}
