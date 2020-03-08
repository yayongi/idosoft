package kr.co.idosoft.intranet.login.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import kr.co.idosoft.demo.vo.TodoVO;
import kr.co.idosoft.intranet.login.vo.LoginVO;

/**
 * Login DAO
 * @author 유기환
 *
 */
@Repository
public class LoginDaoImpl implements LoginDao {
	@Autowired
	private SqlSessionTemplate sqlTemplate;
	
	/**
	 * 로그인 
	 * @return List<LoginVO>
	 */
	@Override
	public LoginVO selectMemberInfo(LoginVO loginInfo) {
		
		return sqlTemplate.selectOne("selectMemberInfo", loginInfo);
	}
}
