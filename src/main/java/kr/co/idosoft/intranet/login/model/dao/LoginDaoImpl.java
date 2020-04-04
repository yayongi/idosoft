package kr.co.idosoft.intranet.login.model.dao;

import java.util.Date;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import kr.co.idosoft.intranet.login.vo.LoginVO;
import kr.co.idosoft.intranet.login.vo.SessionVO;

/**
 * 
 * @author 유기환
 * @since 2020.03.09
 * @content LOGIN DAO interface
 */
@Repository
public class LoginDaoImpl implements LoginDao {
	@Autowired
	private SqlSessionTemplate sqlTemplate;
	
	private static final Logger LOG = LoggerFactory.getLogger(LoginDaoImpl.class);
	
	/**
	 * 로그인 
	 * @return List<LoginVO>
	 */
	@Override
	public SessionVO selectMemberInfo(LoginVO loginInfo) {
		
		return sqlTemplate.selectOne("login.selectMemberInfo", loginInfo);
	}
	/**
	 * 비밀번호 변경 
	 * @return Boolean
	 */
	@Override
	public Boolean updateResetPassword(Map<String, Object> data) {
		
		LOG.debug("# updateResetPassword START ###########################");
		Integer result = sqlTemplate.update("login.updateResetPassword", data);
		LOG.debug("# IsUpdate :: " + result);
		LOG.debug("# updateResetPassword END #############################");
		
		if(result > 0) {
			return true;
		} else {
			return false;
		}

	}
	
	/**
	 * 로그인 유지 처리
	 * @return Boolean
	 */
	@Override
	public void keepLogin(Map<String, Object> data) {
		
		sqlTemplate.update("login.keepLogin", data);
		
	}
	
	/**
	 * 세션키 검증
	 * @return Boolean
	 */
	@Override
	public SessionVO checkUserWithSessionKey(Map<String, Object> data) {
		
		return sqlTemplate.selectOne("login.checkUserWithSessionKey", data);
	}
}
