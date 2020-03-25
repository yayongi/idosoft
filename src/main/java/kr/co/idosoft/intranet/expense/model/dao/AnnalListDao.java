package kr.co.idosoft.intranet.expense.model.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import kr.co.idosoft.common.util.PageInfo;

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
	//ArrayList<Object> getList(PageInfo pi);
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
	
}

