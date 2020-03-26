package kr.co.idosoft.intranet.expense.model.service;

import java.util.List;
import java.util.Map;

/**
 * 
 * @author 유기환
 * @since 2020.03.24
 * @content AnnualList Service interface
 */

public interface AnnalListService {
	/**
	 * 결재관리 목록 총 개수
	 * @return String
	 */
	int getlistCount(Map<String, Object> data);
	/**
	 * 결재관리 목록
	 * @return int
	 */
	List<Map<String, Object>> getlist(Map<String, Object> data);
	/**
	 * 코드 목록
	 * @return String
	 */
	List<Map<String, Object>> getCode(Map<String, Object> data);
	/**
	 * 경비 번호로 데이터 요청
	 * @return String
	 */
	Map<String, Object> getView(Map<String, Object> data);
	/**
	 * 1차결재자 조건에 맞는 사원번호 추출
	 * @return String
	 */
	public String getFirSanCternerMno();
	/**
	 * 직급인 대표인 사원 번호 추출
	 * @return String
	 */
	public String getRepresentativeNo();
	/**
	 * 경비 등록
	 * @return boolean
	 */
	boolean insertExpense(Map<String, Object> data);
	/**
	 * 경비 수정
	 * @return boolean
	 */
	boolean updateExpense(Map<String, Object> data);
	/**
	 * 경비 삭제
	 * @return boolean
	 */
	boolean deleteExpense(Map<String, Object> data);
	

	
}
