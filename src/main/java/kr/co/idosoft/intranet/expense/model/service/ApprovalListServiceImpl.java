package kr.co.idosoft.intranet.expense.model.service;

import java.util.Map;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.expense.model.dao.AnnalListDaoImpl;
import kr.co.idosoft.intranet.expense.model.dao.ApprovalListDaoImpl;

/**
 * 
 * @author 유기환
 * @since 2020.03.24
 * @content AnnualList Service
 */

@Service
public class ApprovalListServiceImpl implements ApprovalListService {

	@Resource
	ApprovalListDaoImpl dao;
	
	/**
	 * 1차결재자 조건에 맞는 사원번호 추출
	 * @return String
	 */
	@Override
	public String getFirSanCternerMno() {
		
		/*
		 * 1순위 : 소속 프로젝트의 PM 
		 * 2순위 : 직원정보테이블에 등록된 1차 결재자
		 */ 
		
		String projectPMNo = dao.getProjectPMNo();
		
		if(projectPMNo == null) {
			
			String firSancternerMno = dao.getFirSancternerMno();
			
			return firSancternerMno;
		} else {
			return projectPMNo;
		}
		
	}
	
	/**
	 * 직급인 대표인 사원 번호 추출
	 * @return String
	 */
	@Override
	public String getRepresentativeNo() {
		return dao.getRepresentativeNo();
	}
	/**
	 * 직급인 대표인 사원 번호 추출
	 * @return String
	 */
	@Override
	public int getlistCount(Map<String, Object> data) {
		return dao.getListCount(data);
	}
	/**
	 * 직급인 대표인 사원 번호 추출
	 * @return String
	 */
	@Override
	public List<Map<String, Object>> getlist(Map<String, Object> data) {
		return dao.getlist(data);
	}
	/**
	 * 코드 목록
	 * @return List<Map<String, Object>>
	 */
	@Override
	public List<Map<String, Object>> getCode(Map<String, Object> data) {
		
		
		return dao.getCode(data);
	}
	/**
	 * 경비 결재 목록
	 * @return Map<String, Object>
	 */
	@Override
	public Map<String, Object> getView(Map<String, Object> data) {
		return dao.getView(data);
	}
	/**
	 * 금액 총합계
	 * @return String
	 */
	@Override
	public String getTotalAmount(Map<String, Object> data) {
		return dao.getTotalAmount(data);
	}
	/**
	 * 결재 처리
	 * @return boolean
	 */
	@Override
	public boolean updateApproval(Map<String, Object> data) {
		return dao.updateApproval(data);
	}
	
}
