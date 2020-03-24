package kr.co.idosoft.intranet.expense.model.dao;

/**
 * 
 * @author 유기환
 * @since 2020.03.09
 * @content AnnualList DAO
 */
public interface AnnalListDao {
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

