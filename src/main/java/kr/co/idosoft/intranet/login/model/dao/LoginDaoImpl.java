package kr.co.idosoft.intranet.login.model.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import kr.co.idosoft.demo.vo.TodoVO;
import kr.co.idosoft.intranet.login.controller.LoginController;
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
		
		return sqlTemplate.selectOne("selectMemberInfo", loginInfo);
	}
	/**
	 * 비밀번호 변경 
	 * @return Boolean
	 */
	@Override
	public Boolean updateResetPassword(Map<String, Object> data) {
		
		LOG.debug("# updateResetPassword START ###########################");
		Integer result = sqlTemplate.update("updateResetPassword", data);
		LOG.debug("# IsUpdate :: " + result);
		LOG.debug("# updateResetPassword END #############################");
		
		if(result > 0) {
			return true;
		} else {
			return false;
		}

	}
}
