package kr.co.idosoft.intranet.expense.model.service;

import java.util.Map;

import javax.annotation.Resource;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.expense.model.dao.ExpenseStatementDaoImpl;

/**
 * 
 * @author 유기환
 * @since 2020.03.30
 * @content ExpenseStatement Service
 */

@Service
public class ExpenseStatementServiceImpl implements ExpenseStatementService {
	
	@Resource
	ExpenseStatementDaoImpl dao;
	
	@Override
	public List<Map<String, Object>> getlist(Map<String, Object> data) {
		return dao.getlist(data);
	}

	@Override
	public List<Map<String, Object>> getView(Map<String, Object> data) {
		return dao.getView(data);
	}

	@Override
	public String getTotalAmount(Map<String, Object> data) {
		return dao.getTotalAmount(data);
	}
	
	@Override
	public String getIndiTotalAmount(Map<String, Object> data) {
		return dao.getIndiTotalAmount(data);
	}

	
}
