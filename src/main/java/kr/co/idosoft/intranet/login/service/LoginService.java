package kr.co.idosoft.intranet.login.service;

import java.util.List;
import java.util.Map;

import kr.co.idosoft.demo.vo.TodoVO;
import kr.co.idosoft.intranet.login.vo.LoginVO;

public interface LoginService {
	/**
	 * 로그인 
	 * 
	 * @return List<LoginVO>
	 */
	
	 public LoginVO selectMemberInfo(LoginVO loginInfo);

	
}
