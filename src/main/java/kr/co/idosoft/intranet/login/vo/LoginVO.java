package kr.co.idosoft.intranet.login.vo;

import java.io.Serializable;

public class LoginVO implements Serializable  {

	private static final long serialVersionUID = 1L;
	
	private int no;
	private String email;
	private String password;
	
	public LoginVO() {
		super();
	}

	public LoginVO(int no, String email, String password) {
		super();
		this.no = no;
		this.email = email;
		this.password = password;
	}

	public int getNo() {
		return no;
	}

	public void setNo(int no) {
		this.no = no;
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

	@Override
	public String toString() {
		return "LoginVO [no=" + no + ", email=" + email + ", password=" + password + "]";
	}
	
}
