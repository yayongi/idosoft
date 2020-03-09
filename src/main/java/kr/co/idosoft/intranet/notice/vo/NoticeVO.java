package kr.co.idosoft.intranet.notice.vo;

public class NoticeVO {
	private int notice_no;
	private int writer; 
	private boolean major;
	private String title;
	private String content;
	private String res_date;
	private String major_period;
	
	public NoticeVO(int notice_no, int writer, boolean major, String title, String content, String res_date,
			String major_period) {
		super();
		this.notice_no = notice_no;
		this.writer = writer;
		this.major = major;
		this.title = title;
		this.content = content;
		this.res_date = res_date;
		this.major_period = major_period;
	}

	public NoticeVO() {
		super();
	}

	public int getNotice_no() {
		return notice_no;
	}

	public void setNotice_no(int notice_no) {
		this.notice_no = notice_no;
	}

	public int getWriter() {
		return writer;
	}

	public void setWriter(int writer) {
		this.writer = writer;
	}

	public boolean isMajor() {
		return major;
	}

	public void setMajor(boolean major) {
		this.major = major;
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

	public String getRes_date() {
		return res_date;
	}

	public void setRes_date(String res_date) {
		this.res_date = res_date;
	}

	public String getMajor_period() {
		return major_period;
	}

	public void setMajor_period(String major_period) {
		this.major_period = major_period;
	}

	@Override
	public String toString() {
		return "NoticeVO [notice_no=" + notice_no + ", writer=" + writer + ", major=" + major + ", title=" + title
				+ ", content=" + content + ", res_date=" + res_date + ", major_period=" + major_period + "]";
	}
	
}
