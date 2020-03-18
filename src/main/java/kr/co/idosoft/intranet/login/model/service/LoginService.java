package kr.co.idosoft.intranet.login.model.service;

import kr.co.idosoft.intranet.login.vo.LoginVO;
import kr.co.idosoft.intranet.login.vo.SessionVO;

public interface LoginService {
	/**
	 * 
	 * @author 유기환
	 * @since 2020.03.09
	 * @content LOGIN SERVICE 
	 */
	 public SessionVO selectMemberInfo(LoginVO loginInfo);

	
}
