package kr.co.idosoft.intranet.common.service;

import java.util.List;
import java.util.Map;

import org.apache.poi.xssf.streaming.SXSSFWorkbook;

/**
 * 
 * @author 유기환
 * @since 2020.03.16
 * @content ExcelService interface
 */

public interface ExcelService {
	
	/**
	 *  엑셀 워크북 객체로 생성 
	 * @param list
	 * @return SXSSFWorkbook
	 */
	public SXSSFWorkbook commonExcelWorkbook(String title,List<Map<String,Object>> list);
	
}
