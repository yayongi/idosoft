package kr.co.idosoft.intranet.common.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
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
@Controller
public class ExcelController {
	
	@Resource
	ExcelServiceImpl excelService;
	
	private static final Logger LOG = LoggerFactory.getLogger(ExcelController.class);
	
	@RequestMapping(value = "/downloadExcelFile", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView downloadExcelFile(@RequestBody Map<String, Object> params,
									HttpServletResponse response,
									HttpServletRequest request){ //JSON Object	
		
		String title 		= (String)params.get("title");			// 시트 제목
		String jsonArrData 	= (String)params.get("jsonArrData");	// jsonArray Data 문자열
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/downloadExcelFile");
		}
		
		LOG.debug("#######################################################################");
		LOG.debug("#title : " + title);
		LOG.debug("#jsonArrData : " + jsonArrData);
		LOG.debug("#######################################################################");
		
		ObjectMapper om = new ObjectMapper();
		
		TypeReference<List<HashMap<String,Object>>> typeRef = new TypeReference<List<HashMap<String,Object>>>() {};
		
		List<Map<String, Object>> list = null;
		
		try {
			list = om.readValue(jsonArrData, typeRef);
		} catch (IOException e) {
			LOG.debug("### IOException : " + e.getMessage());
		}
		
		SXSSFWorkbook workbook = excelService.commonExcelWorkbook(title, list);
		
		ModelAndView mv = new ModelAndView(); 
		mv.setViewName("excelDownloadView"); // 
		mv.addObject("locale", Locale.KOREA); // 뷰로 보낼 데이터 값
		mv.addObject("workbook", workbook); // 뷰로 보낼 데이터 값
		mv.addObject("workbookName", title); // 뷰로 보낼 데이터 값
		
		return mv;
	}
}