package kr.co.idosoft.intranet.common.model.service;

import java.text.ParseException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.xssf.streaming.SXSSFWorkbook;

/**
 * 
 * @author 유기환
 * @since 2020.03.16
 * @content ExcelService interface
 */

public interface ExcelService {
	
	List<LinkedHashMap<String, Object>> getCodetoList(Map<String, Object> data);

	List<LinkedHashMap<String, Object>> getTransList(Map<String, Object> data) throws Exception;

}
