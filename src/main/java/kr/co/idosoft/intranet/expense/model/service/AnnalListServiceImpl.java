package kr.co.idosoft.intranet.expense.model.service;

import java.util.Map;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.expense.model.dao.AnnalListDaoImpl;

/**
 * 
 * @author 유기환
 * @since 2020.03.24
 * @content AnnualList Service
 */

@Service
public class AnnalListServiceImpl implements AnnalListService {

	@Resource
	AnnalListDaoImpl dao;
	
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
	 * 경비 등록
	 * @return boolean
	 */
	@Override
	public boolean insertExpense(Map<String, Object> data) {
		return dao.insertExpense(data);
	}
	@Override
	public int getlistCount(Map<String, Object> data) {
		return dao.getListCount(data);
	}
	@Override
	public List<Map<String, Object>> getlist(Map<String, Object> data) {
		return dao.getlist(data);
	}
	@Override
	public List<Map<String, Object>> getCode(Map<String, Object> data) {
		
		
		return dao.getCode(data);
	}
	
	@Override
	public Map<String, Object> getView(Map<String, Object> data) {
		return dao.getView(data);
	}
	@Override
	public boolean updateExpense(Map<String, Object> data) {
		return dao.updateExpense(data);
	}
	@Override
	public boolean deleteExpense(Map<String, Object> data) {
		return dao.deleteExpense(data);
	}
	
}
