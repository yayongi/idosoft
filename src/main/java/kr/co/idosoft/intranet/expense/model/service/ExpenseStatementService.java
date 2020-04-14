package kr.co.idosoft.intranet.expense.model.service;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

/**
 * 
 * @author 유기환
 * @since 2020.03.30
 * @content ExpenseStatement Service interface
 */

public interface ExpenseStatementService {
	/**
	 * 경비 월별 통계 사원 리스트
	 * @return List<Map<String, Object>>
	 */
	List<Map<String, Object>> getlist(Map<String, Object> data);
	/**
	 * 사원 월별 통계 상세
	 * @return Map<String, Object>
	 */
	List<Map<String, Object>> getView(Map<String, Object> data);
	/**
	 * 총금액 합계
	 * @return String
	 */
	String getTotalAmount(Map<String, Object> data);
	/**
	 * 개인 총금액 합계
	 * @return String
	 */
	String getIndiTotalAmount(Map<String, Object> data);
	/**
	 * 통신비 년별 통계
	 * @return String
	 */
	List<Map<String, Object>> getCommExpenseList(Map<String, Object> data);
	/**
	 * 교통비 년별 통계
	 * @return String
	 * @throws ParseException 
	 * @throws Exception 
	 */
	List<Map<String, Object>> getTransExpenseList(Map<String, Object> data);
	List<Map<String, Object>> getGasChargeList(Map<String, Object> data);
	List<String> getMemberList(Map<String, Object> data);
}
