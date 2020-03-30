package kr.co.idosoft.intranet.expense.model.dao;

import java.util.List;
import java.util.Map;

/**
 * 
 * @author 유기환
 * @since 2020.03.30
 * @content ExpenseStatement DAO
 */
public interface ExpenseStatementListDao {
	
	/**
	 * 경비 월별 통계 사원 리스트
	 * @return List<Map<String, Object>>
	 */
	List<Map<String, Object>> getlist(Map<String, Object> data);
	/**
	 * 사원 월별 통계 상세
	 * @return List<Map<String, Object>>
	 */
	List<Map<String, Object>> getView(Map<String, Object> data);
	/**
	 * 총 금액 합계
	 * @return String
	 */
	String getTotalAmount(Map<String, Object> data);
	/**
	 * 개인 총 금액 합계
	 * @return String
	 */
	String getIndiTotalAmount(Map<String, Object> data);
	/**
	 * 통신비 월별 통계
	 * @return List<Map<String, Object>>
	 */
	List<Map<String, Object>> getCommExpenseList(Map<String, Object> data);
	/**
	 * 교통비 월별 통계
	 * @return List<Map<String, Object>>
	 */
	List<Map<String, Object>> getTransExpenseList(Map<String, Object> data);
	
	
}

