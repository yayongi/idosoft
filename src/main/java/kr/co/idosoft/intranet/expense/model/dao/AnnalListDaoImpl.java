package kr.co.idosoft.intranet.expense.model.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


/**
 * 
 * @author 유기환
 * @since 2020.03.09
 * @content AnnualList DAO interface
 */
@Repository
public class AnnalListDaoImpl implements AnnalListDao {
	@Autowired
	private SqlSessionTemplate sqlTemplate;

	private static final Logger LOG = LoggerFactory.getLogger(AnnalListDaoImpl.class);

	/**
	 * 경비관리목록 총개수
	 * @param data
	 * @return int
	 */

	@Override
	public int getListCount(Map<String, Object> data) {
		return (int) sqlTemplate.selectOne("expense.getAnnalListCount", data);
	}

	/**
	 * 경비관리목록 조회
	 * 
	 * @return String
	 */

	@Override
	public List<Map<String, Object>> getlist(Map<String, Object> data) {
		/* Pageing 처리 START */ 
		int offset =
		((int)data.get("currentPage") - 1) * (int)data.get("limit"); 
		RowBounds rowBounds = new RowBounds(offset, (int)data.get("limit"));

		return (ArrayList)sqlTemplate.selectList("getAnnalList", data, rowBounds); 
		/* Pageing 처리 END */ 
	}
	/**
	 * 직급인 대표인 사원 번호 추출
	 * 
	 * @return String
	 */


	@Override
	public String getRepresentativeNo() {
		return (String) sqlTemplate.selectOne("getRepresentativeNo");
	}

	/**
	 * 소속 프로젝트 PM 번호 추출
	 * 
	 * @return String
	 */

	@Override
	public String getProjectPMNo() {
		return (String) sqlTemplate.selectOne("getProjectPMNo");
	}

	/**
	 * 1차결재자 번호 추출
	 * 
	 * @return String
	 */
	@Override
	public String getFirSancternerMno() {
		return (String) sqlTemplate.selectOne("getFirSancternerMno");
	}

	public boolean insertExpense(Map<String, Object> data) {

		Integer result = sqlTemplate.update("insertExpense", data);

		if (result > 0) {
			return true;
		} else {
			return false;
		}
	}
	@Override
	public List<Map<String, Object>> getCode(Map<String, Object> data) {
		return sqlTemplate.selectList("expense.getCode", data);
	}

	
}
