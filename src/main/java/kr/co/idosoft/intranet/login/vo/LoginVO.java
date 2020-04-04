package kr.co.idosoft.intranet.login.vo;

import java.io.Serializable;

/**
 * 
 * @author 유기환
 * @since 2020.03.09
 * @content LOGIN
 */

public class LoginVO implements Serializable  {

	private static final long serialVersionUID = -2944358041715112116L;
	
	private String email;
	private String password;
	private String isKeepLogin;
	
	public LoginVO() {
		super();
	}

	public LoginVO(String email, String password, String isKeepLogin) {
		super();
		this.email = email;
		this.password = password;
		this.isKeepLogin = isKeepLogin;
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

	public String getIsKeepLogin() {
		return isKeepLogin;
	}

	public void setIsKeepLogin(String isKeepLogin) {
		this.isKeepLogin = isKeepLogin;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "LoginVO [email=" + email + ", password=" + password + ", isKeepLogin=" + isKeepLogin + "]";
	}
	
}
