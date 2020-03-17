package kr.co.idosoft.intranet.common.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.idosoft.intranet.common.service.ExcelServiceImpl;

/**
 * 
 * @author 유기환
 * @since 2020.03.16
 * @content Excel
 */

public class ExcelController {
	
	@Resource
	ExcelServiceImpl excelService;
	
	private static final Logger LOG = LoggerFactory.getLogger(ExcelController.class);
	
	@RequestMapping(value = "/downloadExcelFile", method = RequestMethod.POST)
	public ModelAndView downloadExcelFile(ModelAndView mv ,
			@RequestParam String jsonArrData, 	// jsonArray Data
			@RequestParam String title){		// 시트 제목
		
		ObjectMapper om = new ObjectMapper();
		
		TypeReference<List<HashMap<String,Object>>> typeRef = new TypeReference<List<HashMap<String,Object>>>() {};
		
		List<Map<String, Object>> list = null;
		
		try {
			list = om.readValue(jsonArrData, typeRef);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		SXSSFWorkbook workbook = excelService.commonExcelWorkbook(title, list);
		
		mv.addObject("locale", Locale.KOREA);
		mv.addObject("workbookName", title);
		mv.addObject("workbook", workbook);
		
		mv.setViewName("excelDownloadView");
		
		return mv;
	}
}