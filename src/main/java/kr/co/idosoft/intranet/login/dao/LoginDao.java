package kr.co.idosoft.intranet.login.dao;

import java.util.List;
import java.util.Map;

import kr.co.idosoft.intranet.login.vo.LoginVO;
import kr.co.idosoft.intranet.login.vo.SessionVO;

/**
 * 
 * @author 유기환
 * @since 2020.03.09
 * @content LOGIN DAO
 */
public interface LoginDao {
	/**
	 * 로그인 처리 
	 * @return LoginVO
	 */

	public SessionVO selectMemberInfo(LoginVO loginInfo);
}

