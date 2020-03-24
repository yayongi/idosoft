package kr.co.idosoft.intranet.login.model.service;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.login.model.dao.LoginDao;
import kr.co.idosoft.intranet.login.vo.LoginVO;
import kr.co.idosoft.intranet.login.vo.SessionVO;

@Service
public class LoginServiceImpl implements LoginService {
	@Resource LoginDao loginDao;
	/**
	 * 
	 * @author 유기환
	 * @since 2020.03.09
	 * @content LOGIN SERVICE interface
	 */
	@Override
	public SessionVO selectMemberInfo(LoginVO loginInfo) {
		return loginDao.selectMemberInfo(loginInfo);
	}
	@Override
	public Boolean updateResetPassword(Map<String, Object> data) {
		
		return loginDao.updateResetPassword(data);
	}


}
