package kr.co.idosoft.intranet.common.model.dao;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import kr.co.idosoft.intranet.expense.model.service.ExpenseStatementServiceImpl;

@Repository
public class ExcelDaoImpl implements ExcelDao{
	@Autowired
	SqlSessionTemplate sqlTemplate;
	
	private static final Logger LOG = LoggerFactory.getLogger(ExpenseStatementServiceImpl.class);
	
	@Override
	public List<LinkedHashMap<String, Object>> getCodetoList(Map<String, Object> data) {
		
		String FILE_CODE 					= (String) data.get("FILE_CODE");
		HashMap<String, Object> SEARCH_DATA = (HashMap<String, Object>) data.get("SEARCH_DATA");
		
		return sqlTemplate.selectList("excel."+FILE_CODE, SEARCH_DATA);
	}
	
	@Override
	public List<String> getCodetoListString(Map<String, Object> data) {
		
		String FILE_CODE 					= (String) data.get("FILE_CODE");
		HashMap<String, Object> SEARCH_DATA = (HashMap<String, Object>) data.get("SEARCH_DATA");
		
		return sqlTemplate.selectList("excel."+FILE_CODE, SEARCH_DATA);
	}
	
}
