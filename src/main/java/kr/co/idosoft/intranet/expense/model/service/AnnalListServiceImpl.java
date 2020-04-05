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
	/**
	 * 결재관리 목록 총 개수
	 * @return String
	 */
	@Override
	public int getlistCount(Map<String, Object> data) {
		return dao.getListCount(data);
	}
	/**
	 * 결재관리 목록
	 * @return int
	 */
	@Override
	public List<Map<String, Object>> getlist(Map<String, Object> data) {
		return dao.getlist(data);
	}
	/**
	 * 코드 목록
	 * @return String
	 */
	@Override
	public List<Map<String, Object>> getCode(Map<String, Object> data) {
		
		
		return dao.getCode(data);
	}
	/**
	 * 경비 번호로 데이터 요청
	 * @return String
	 */
	@Override
	public Map<String, Object> getView(Map<String, Object> data) {
		return dao.getView(data);
	}
	/**
	 * 경비 수정
	 * @return boolean
	 */
	@Override
	public boolean updateExpense(Map<String, Object> data) {
		return dao.updateExpense(data);
	}
	/**
	 * 경비 삭제
	 * @return boolean
	 */
	@Override
	public boolean deleteExpense(Map<String, Object> data) {
		return dao.deleteExpense(data);
	}
	/**
	 * 경비 총합계
	 * @return String
	 */
	@Override
	public String getTotalAmount(Map<String, Object> data) {
		return dao.getTotalAmount(data);
	}
	/**
	 * 경비 진행 처리
	 * @return boolean
	 */
	@Override
	public boolean Proceed(Map<String, Object> data) {
		return dao.Proceed(data);
	}
	@Override
	public String getTotalProgAmount(Map<String, Object> data) {
		return dao.getTotalProgAmount(data);
	}
	@Override
	public String getTotalFirAppAmount(Map<String, Object> data) {
		return dao.getTotalFirAppAmount(data);
	}
	@Override
	public String getTotalCompAmount(Map<String, Object> data) {
		// TODO Auto-generated method stub
		return dao.getTotalCompAmount(data);
	}
	@Override
	public String getTotalReturnAmount(Map<String, Object> data) {
		// TODO Auto-generated method stub
		return dao.getTotalReturnAmount(data);
	}
	
}
