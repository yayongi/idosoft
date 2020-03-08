package kr.co.idosoft.intranet.login.dao;

import java.util.List;
import java.util.Map;

import kr.co.idosoft.intranet.login.vo.LoginVO;

/**
 * LOGIN DAO 
 * @author 유기환
 *
 */
public interface LoginDao {
	/**
	 * 로그인 처리 
	 * @return LoginVO
	 */

	public LoginVO selectMemberInfo(LoginVO loginInfo);
}

