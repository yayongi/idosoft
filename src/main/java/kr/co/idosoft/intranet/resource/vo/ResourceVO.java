package kr.co.idosoft.intranet.resource.vo;

import java.io.Serializable;

/**
 * 
 * @author 김준선
 * @since 2020.03.25
 * @content Resource
 */
public class ResourceVO implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1869807961966758221L;
	private int res_no;						//자원 번호
	private String res_code;				//자원 종류 코드
	private String model_nm;				//모델명
	private String mark_code;				//제조사 코드
	private String product_mtn;				//제조년월
	private String purchase_mtn;			//구입년월
	private String display_size_code;		//화면사이즈 코드
	private String serial_no;				//시리얼번호
	private String mac_addr;				//MAC 주소
	private String reg_datetime;			//등록일
	private String upd_datetime;			//수정일
	private String reg_id;					//등록자
	private String upd_id;					//수정자
	private String holder;					//보유자
	private String note;					//비고
	private String temp_colum;				//남는 컬럼
	public ResourceVO(int res_no, String res_code, String model_nm, String mark_code, String product_mtn,
			String purchase_mtn, String display_size_code, String serial_no, String mac_addr, String reg_datetime,
			String upd_datetime, String reg_id, String upd_id, String holder, String note, String temp_colum) {
		super();
		this.res_no = res_no;
		this.res_code = res_code;
		this.model_nm = model_nm;
		this.mark_code = mark_code;
		this.product_mtn = product_mtn;
		this.purchase_mtn = purchase_mtn;
		this.display_size_code = display_size_code;
		this.serial_no = serial_no;
		this.mac_addr = mac_addr;
		this.reg_datetime = reg_datetime;
		this.upd_datetime = upd_datetime;
		this.reg_id = reg_id;
		this.upd_id = upd_id;
		this.holder = holder;
		this.note = note;
		this.temp_colum = temp_colum;
	}
	public ResourceVO() {
		super();
	}
	public int getRes_no() {
		return res_no;
	}
	public void setRes_no(int res_no) {
		this.res_no = res_no;
	}
	public String getRes_code() {
		return res_code;
	}
	public void setRes_code(String res_code) {
		this.res_code = res_code;
	}
	public String getModel_nm() {
		return model_nm;
	}
	public void setModel_nm(String model_nm) {
		this.model_nm = model_nm;
	}
	public String getMark_code() {
		return mark_code;
	}
	public void setMark_code(String mark_code) {
		this.mark_code = mark_code;
	}
	public String getProduct_mtn() {
		return product_mtn;
	}
	public void setProduct_mtn(String product_mtn) {
		this.product_mtn = product_mtn;
	}
	public String getPurchase_mtn() {
		return purchase_mtn;
	}
	public void setPurchase_mtn(String purchase_mtn) {
		this.purchase_mtn = purchase_mtn;
	}
	public String getDisplay_size_code() {
		return display_size_code;
	}
	public void setDisplay_size_code(String display_size_code) {
		this.display_size_code = display_size_code;
	}
	public String getSerial_no() {
		return serial_no;
	}
	public void setSerial_no(String serial_no) {
		this.serial_no = serial_no;
	}
	public String getMac_addr() {
		return mac_addr;
	}
	public void setMac_addr(String mac_addr) {
		this.mac_addr = mac_addr;
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
	public String getHolder() {
		return holder;
	}
	public void setHolder(String holder) {
		this.holder = holder;
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
