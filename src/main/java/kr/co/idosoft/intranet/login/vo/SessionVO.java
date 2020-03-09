package kr.co.idosoft.intranet.login.vo;

import java.io.Serializable;

/**
 * 
 * @author 유기환
 * @since 2020.03.09
 * @content SESSION_DATA 
 */
public class SessionVO implements Serializable{
	private static final long serialVersionUID = 6498887745377422418L;
	
	private int idx;
	private String email;
	private String password;
	private String name;
	private String phone;
	
	public SessionVO() {
		super();
	}

	public SessionVO(int idx, String email, String password, String name, String phone) {
		super();
		this.idx = idx;
		this.email = email;
		this.password = password;
		this.name = name;
		this.phone = phone;
	}

	public int getIdx() {
		return idx;
	}

	public void setIdx(int idx) {
		this.idx = idx;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "SessionVO [idx=" + idx + ", email=" + email + ", password=" + password + ", name=" + name + ", phone="
				+ phone + "]";
	}
	
}
