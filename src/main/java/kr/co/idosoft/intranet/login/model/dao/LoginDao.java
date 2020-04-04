package kr.co.idosoft.intranet.login.model.dao;

import java.util.Date;
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

	public Boolean updateResetPassword(Map<String, Object> data);

	public void keepLogin(Map<String, Object> data);

	public SessionVO checkUserWithSessionKey(Map<String, Object> data);
}

