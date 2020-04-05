package kr.co.idosoft.intranet.common.model.dao;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ExcelDaoImpl implements ExcelDao{
	@Autowired
	SqlSessionTemplate sqlTemplate;
	
	@Override
	public List<LinkedHashMap<String, Object>> getCodetoList(Map<String, Object> data) {
		
		String FILE_CODE 					= (String) data.get("FILE_CODE");
		HashMap<String, Object> SEARCH_DATA = (HashMap<String, Object>) data.get("SEARCH_DATA");
		
		return sqlTemplate.selectList("excel."+FILE_CODE, SEARCH_DATA);
	}
	
}
