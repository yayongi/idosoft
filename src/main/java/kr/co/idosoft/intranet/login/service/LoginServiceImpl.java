package kr.co.idosoft.intranet.login.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.login.dao.LoginDao;
import kr.co.idosoft.intranet.login.vo.LoginVO;



@Service
public class LoginServiceImpl implements LoginService {
	@Resource LoginDao loginDao;
	/**
	 * 로그인
	 * @return List<LoginVO>
	 */
	@Override
	public LoginVO selectMemberInfo(LoginVO loginInfo) {
		// TODO Auto-generated method stub
		return loginDao.selectMemberInfo(loginInfo);
	}


}
