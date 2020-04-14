package kr.co.idosoft.intranet.common.model.dao;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * @author 유기환
 * @since 2020.03.16
 * @content ExcelService interface
 */

public interface ExcelDao {

	List<LinkedHashMap<String, Object>> getCodetoList(Map<String, Object> data);

	List<String> getCodetoListString(Map<String, Object> data);
	
}
