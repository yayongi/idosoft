package kr.co.idosoft.intranet.expense.model.service;

import java.util.Map;

import javax.annotation.Resource;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.idosoft.common.util.commonUtil;
import kr.co.idosoft.intranet.expense.model.dao.ExpenseStatementDaoImpl;

/**
 * 
 * @author 유기환
 * @since 2020.03.30
 * @content ExpenseStatement Service
 */

@Service
public class ExpenseStatementServiceImpl implements ExpenseStatementService {
	
	private static final Logger LOG = LoggerFactory.getLogger(ExpenseStatementServiceImpl.class);
	
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
	
	@Override
	public List<Map<String, Object>> getCommExpenseList(Map<String, Object> data) {
		return dao.getCommExpenseList(data);
	}
	@Override
	public List<Map<String, Object>> getTransExpenseList(Map<String, Object> data){
		
		List<Map<String, Object>> 	dataList 	= dao.getTransExpenseList(data);
		//List<String>				memberList 	= dao.getMemberList(data);
		
		return dataList;
	}
	@Override
	public List<Map<String, Object>> getGasChargeList(Map<String, Object> data){
		List<Map<String, Object>> 	dataList 	= dao.getGasChargeList(data);
		//List<String>				memberList 	= dao.getMemberList(data);
		
		return dataList;
	}
	@Override
	public List<String> getMemberList(Map<String, Object> data) {
		return dao.getMemberList(data);
	}

}
