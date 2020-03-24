package kr.co.idosoft.intranet.expense.model.service;

import java.util.Map;

/**
 * 
 * @author 유기환
 * @since 2020.03.24
 * @content AnnualList Service interface
 */

public interface AnnalListService {
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
}
