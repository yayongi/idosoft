package kr.co.idosoft.demo.vo;

public class TodoVO {
	private int id;
	private String text;
	private boolean completeYn;
	private String createDate;
	private String modifyDate;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public boolean getCompleteYn() {
		return completeYn;
	}
	public void setCompleteYn(boolean completeYn) {
		this.completeYn = completeYn;
	}
	public String getCreateDate() {
		return createDate;
	}
	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}
	public String getModifyDate() {
		return modifyDate;
	}
	public void setModifyDate(String modifyDate) {
		this.modifyDate = modifyDate;
	}
	
}
