package kr.co.idosoft.intranet.login.model.service;

import java.util.Map;

import kr.co.idosoft.intranet.login.vo.LoginVO;
import kr.co.idosoft.intranet.login.vo.SessionVO;

public interface LoginService {
	/**
	 * 
	 * @author 유기환
	 * @since 2020.03.09
	 * @content 로그인 회원정보 조회
	 */
	 public SessionVO selectMemberInfo(LoginVO loginInfo);
	 
	/**
	 * 
	 * @author 유기환
	 * @since 2020.03.24
	 * @content 비밀번호 재설정 
	 */
	 public Boolean updateResetPassword(Map<String, Object> data);
	
	 /**
	 * 
	 * @author 유기환
	 * @since 2020.04.04
	 * @content 로그인 유지 처리 
	 */
	 public void keepLogin(Map<String, Object> data);
	
	 /**
	 * 
	 * @author 유기환
	 * @since 2020.04.04
	 * @content 세션키 검증 
	 */
	 public SessionVO checkUserWithSessionKey(Map<String, Object> data);

}
