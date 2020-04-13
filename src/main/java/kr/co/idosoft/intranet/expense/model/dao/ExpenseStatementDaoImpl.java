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
 * @since 2020.03.30
 * @content ExpenseStatement DAO interface
 */
@Repository
public class ExpenseStatementDaoImpl implements ExpenseStatementListDao {
	@Autowired
	private SqlSessionTemplate sqlTemplate;

	private static final Logger LOG = LoggerFactory.getLogger(ExpenseStatementDaoImpl.class);
	/**
	 * 경비 월별 통계 사원 리스트
	 * @return List<Map<String, Object>>
	 */
	@Override
	public List<Map<String, Object>> getlist(Map<String, Object> data) {
		return sqlTemplate.selectList("expense.getMonthlyExpenseStatistics", data);
	}
	/**
	 * 사원 월별 통계 상세
	 * @return Map<String, Object>
	 */
	@Override
	public List<Map<String, Object>> getView(Map<String, Object> data) {
		return sqlTemplate.selectList("expense.getMonthlyExpenseRecode", data);
	}
	/**
	 * 총 금액 합계
	 * @return String
	 */
	@Override
	public String getTotalAmount(Map<String, Object> data) {
		Integer result = (Integer)sqlTemplate.selectOne("expense.getMonthTotalAmount", data);
		
		return String.valueOf(result != null ? result : 0);
	}
	/**
	 * 개인 총 금액 합계
	 * @return String
	 */
	@Override
	public String getIndiTotalAmount(Map<String, Object> data) {
		Integer result = (Integer)sqlTemplate.selectOne("expense.getIndiMonthTotalAmount", data);
		
		return String.valueOf(result != null ? result : 0);
	}
	/**
	 * 통신비 월별 통계
	 * @return List<Map<String, Object>>
	 */
	@Override
	public List<Map<String, Object>> getCommExpenseList(Map<String, Object> data) {
		return sqlTemplate.selectList("expense.getCommunicationExpenseList", data);
	}
	/**
	 * 교통비 시작일, 종료일 통계
	 * @return List<Map<String, Object>>
	 */
	@Override
	public List<Map<String, Object>> getTransExpenseList(Map<String, Object> data) {
		return sqlTemplate.selectList("expense.getTransExpenseList", data);
	}
	/**
	 * 주유비 시작일, 종료일 통계
	 * @return List<Map<String, Object>>
	 */
	@Override
	public List<Map<String, Object>> getGasChargeList(Map<String, Object> data) {
		return sqlTemplate.selectList("expense.getGasChargeList", data);
	}
	/**
	 * 직원 목록
	 * @return List<String>
	 */
	@Override
	public List<String> getMemberList(Map<String, Object> data){
		return sqlTemplate.selectList("expense.getMemberList", data);
	}

}
