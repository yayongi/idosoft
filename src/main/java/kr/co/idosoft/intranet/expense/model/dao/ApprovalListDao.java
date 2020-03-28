package kr.co.idosoft.intranet.expense.model.dao;

import java.util.List;
import java.util.Map;

/**
 * 
 * @author 유기환
 * @since 2020.03.09
 * @content AnnualList DAO
 */
public interface ApprovalListDao {
	/**
	 * 경비관리 목록 총 개수
	 * @return String
	 */
	int getListCount(Map<String, Object> data);
	/**
	 * 코드 목록
	 * @return List<Map<String, Object>>
	 */
	List<Map<String, Object>> getCode(Map<String, Object> data);
	/**
	 * 경비관리 목록 가져오기
	 * @return String
	 */
	List<Map<String, Object>> getlist(Map<String, Object> data);
	/**
	 * 경비 번호로 데이터 출력
	 * @return String
	 */
	Map<String, Object> getView(Map<String, Object> data);
	/**
	 * 소속 프로젝트 PM 번호 추출
	 * @return String
	 */
	public String getProjectPMNo();
	/**
	 * 1차결재자 번호 추출
	 * @return String
	 */
	public String getFirSancternerMno();
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
	 * 다중 2차 결재 처리
	 * @return boolean
	 */
	boolean multiplexApproval(Map<String, Object> data);
	/**
	 * 다중 1차 결재 처리
	 * @return boolean
	 */
	boolean multiplexFirApproval(Map<String, Object> data);
	
}

