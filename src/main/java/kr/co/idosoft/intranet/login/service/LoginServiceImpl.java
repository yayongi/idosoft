package kr.co.idosoft.intranet.login.service;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.login.dao.LoginDao;
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
		// TODO Auto-generated method stub
		return loginDao.selectMemberInfo(loginInfo);
	}


}
