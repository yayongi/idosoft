package kr.co.idosoft.intranet.expense.model.dao;

import java.util.List;
import java.util.Map;

/**
 * 
 * @author 유기환
 * @since 2020.03.09
 * @content AnnualList DAO
 */
public interface AnnalListDao {
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
	 * 경비 등록 처리
	 * @return boolean
	 */
	boolean insertExpense(Map<String, Object> data);
	/**
	 * 경비 수정 처리
	 * @return boolean
	 */
	boolean updateExpense(Map<String, Object> data);
	/**
	 * 경비 삭제 처리
	 * @return boolean
	 */
	boolean deleteExpense(Map<String, Object> data);
	
}

