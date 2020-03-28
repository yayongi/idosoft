package kr.co.idosoft.intranet.expense.model.service;

import java.util.List;
import java.util.Map;

/**
 * 
 * @author 유기환
 * @since 2020.03.24
 * @content AnnualList Service interface
 */

public interface ApprovalListService {
	/**
	 * 결재관리 목록 총 개수
	 * @return int
	 */
	int getlistCount(Map<String, Object> data);
	/**
	 * 결재관리 목록
	 * @return List<Map<String, Object>
	 */
	List<Map<String, Object>> getlist(Map<String, Object> data);
	/**
	 * 코드 목록
	 * @return List<Map<String, Object>>
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
	 * 총금액 합계
	 * @return String
	 */
	String getTotalAmount(Map<String, Object> data);
	/**
	 * 결재 처리
	 * @return boolean
	 */
	boolean updateApproval(Map<String, Object> data);
	/**
	 * 다중 결재 처리
	 * @return boolean
	 */
	boolean multiplexApproval(Map<String, Object> data);

	
}
