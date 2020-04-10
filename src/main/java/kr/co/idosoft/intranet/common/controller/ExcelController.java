package kr.co.idosoft.intranet.common.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;


import kr.co.idosoft.common.util.commonUtil;
import kr.co.idosoft.intranet.common.model.service.ExcelServiceImpl;
import kr.co.idosoft.intranet.login.vo.SessionVO;
import kr.co.idosoft.intranet.util.fileController;

/**
 * 
 * @author 유기환
 * @since 2020.03.16
 * @content Excel
 */
@Controller
public class ExcelController {
	
	@Autowired
	fileController fileController;
	
	@Resource
	ExcelServiceImpl excelService;
	
	private static final Logger LOG = LoggerFactory.getLogger(ExcelController.class);
	
	@RequestMapping(value = "/downloadExcelFile", method = RequestMethod.POST)
	@ResponseBody
	public void downloadExcelFile(@RequestBody Map<String, Object> params,
									HttpServletResponse response,
									HttpServletRequest request){ //JSON Object	
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/downloadExcelFile");
		}
		
		ModelAndView mv = new ModelAndView(); 
		mv.setViewName("jsonView"); 

		String fileName 				= (String)params.get("fileName"); // 엑셀 이름
		String fileCode 				= (String)params.get("fileCode"); // 엑셀 코드
		
		Map<String, Object> searchData 	= (Map<String, Object>)params.getOrDefault("searchData", null);
		
		String searchStr				= "";
		
		// 겹치는 파일 이름 중복을 피하기 위해 시간을 이용해서 파일 이름에 추가
		Date date = new Date();
		
		SimpleDateFormat dayformat = new SimpleDateFormat("yyyyMMdd", Locale.KOREA);
		SimpleDateFormat hourformat = new SimpleDateFormat("hhmmss", Locale.KOREA);
		String day = dayformat.format(date);
		String hour = hourformat.format(date);
		
		fileName = fileName + "_" + day + "_" + hour + ".xls";  
		
		LOG.debug("#############################################################################");
		LOG.debug("# fileName : " + fileName);
		LOG.debug("# fileCode : " + fileCode);
		LOG.debug("# searchData : " + searchData);
		LOG.debug("#############################################################################");
		
		Map<String, Object> data = new HashMap<String, Object>();
		
		data.put("FILE_CODE", fileCode);
		
		if(searchData != null) {
			// EXCEL0001 월별 경비 통계 - 개인
			// EXCEL0002 월병 경비 통계 - 전체
			// EXCEL0003 결재 관리
			
			if("EXCEL0001".equals(fileCode) || "EXCEL0002".equals(fileCode)) {  
				String regDate = (String) searchData.get("regDate");
				
				searchStr = "검색 기간 : " + regDate;
				
				String REG_START_DATE 	= ""; // 그달의 시작일  
				String REG_END_DATE		= ""; // 그달의 종료일
				
				REG_START_DATE = regDate + "01";
				// 그달의 마지막 일 구하기
				int lastDate = commonUtil.LastDateInMonth(regDate);
				// 그해의 첫 날
				REG_END_DATE = regDate + String.valueOf(lastDate);
				
				searchData.put("REG_START_DATE", REG_START_DATE);		// 시작날짜
				searchData.put("REG_END_DATE", REG_END_DATE);			// 종료날짜
				
			} else if("EXCEL0003".equals(fileCode) || "EXCEL0004".equals(fileCode)) {
				
				String expenseType 		= (String)searchData.get("expenseType");			// 경비유형
				String payStDt 			= (String)searchData.get("payStDt");				// 시작날짜
				String payEdDt 			= (String)searchData.get("payEdDt");				// 종료날짜
				String status 			= (String)searchData.get("status");					// 결재상태
				// currentPage 1 초과하고 rows가 비어있는 경우,
				
				LOG.debug("#####################################################################################");
				LOG.debug("# SEARCH DATA ");
				LOG.debug("# expenseType 	: " + expenseType);
				LOG.debug("# payStDt 		: " + payStDt);
				LOG.debug("# payEdDt 		: " + payEdDt);
				LOG.debug("# status 		: " + status);
				LOG.debug("#####################################################################################");
			
				// -1 전체로 들어왔을  경우, null로 변환
				expenseType = !"-1".equals(expenseType) ? expenseType : null;
				status 		= !"-1".equals(status) ? status : null;
				
				searchStr = "검색 기간 : " + payStDt + " - " + payEdDt + 
						(expenseType != null ? ", 경비 유형 : " + expenseType : "") 
						+ (status != null ? ", 결재 상태 : "  + status : "");
				
				// 그해의 첫 날
				payStDt = payStDt + "01";
				
				// 그달의 마지막 일 구하기
				int lastDate = commonUtil.LastDateInMonth(payEdDt);
				payEdDt = payEdDt + String.valueOf(lastDate);
				
				LOG.debug("# LastDateInMonth : " + lastDate);
				
				searchData.put("expenseType", expenseType);
				searchData.put("payStDt", payStDt);
				searchData.put("payEdDt", payEdDt);
				searchData.put("status", status);
				
				HttpSession session = request.getSession();
				
				SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
				String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
				
				// 세션 VO에 세션 값 저장
				String isAdmin = (String) session.getAttribute("IS_ADMIN");				//관리자 여부

				searchData.put("MEMBER_NO", mno);		// 사원번호
				searchData.put("isAdmin", isAdmin);		// 관리자 여부
				
			} else if("EXCEL0005".equals(fileCode) ) {
				
				HttpSession session = request.getSession();
				
				SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
				String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
				String year = (String)searchData.get("YEAR");
				
				
				String isAdmin = (String) session.getAttribute("IS_ADMIN");				//관리자 여부
				
				searchStr = "년도 : " + year;
				
				searchData.put("MEMBER_NO", mno);		// 사원번호
				searchData.put("isAdmin", isAdmin);		// 관리자 여부
			} else if("EXCEL0006".equals(fileCode) ) {
				HttpSession session = request.getSession();
				
				SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
				String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
				
				// 세션 VO에 세션 값 저장
				String isAdmin = (String) session.getAttribute("IS_ADMIN");				//관리자 여부
				//이력관리 엑셀 다운로드
				
				
				String member_no = "";
				if("1".equals(isAdmin)) {
					member_no = (String)searchData.get("select_member_no");
				}else {
					member_no = mno;
				}
				
				if("".equals(member_no)) {
					searchData.put("MEMBER_NO", null);
				}else {
					searchData.put("MEMBER_NO", member_no);
				}
				
			}
			
			data.put("SEARCH_DATA", searchData);
		} else {
			data.put("SEARCH_DATA", new HashMap<String, Object>());
		}
		
		List<LinkedHashMap<String,Object>> list1 = null;
		List<LinkedHashMap<String,Object>> list2 = null;
		
		// 통신비, 교통비 통계
		if("EXCEL0005".equals(fileCode)) {
			//통신비
			data.put("FILE_CODE","EXCEL0005_1");
			list1 =  excelService.getCodetoList(data);
			//교통비
			data.put("FILE_CODE","EXCEL0005_2");
			
			try {
				list2 =  excelService.getTransList(data);
			} catch (Exception e) {
				LOG.debug("# Exception : " + e.getMessage());
			}
			
			
			data.put("FILE_CODE","EXCEL0005");
		} else {
			list1 =  excelService.getCodetoList(data);
		}
		
		if("EXCEL0005".equals(fileCode)) {
			// Month KEY Array
			String[] monthArray = {"1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"};
			
			// 통신비 & 교통비 합계 
			
			for(int i = 0; i < list1.size(); i++) {
				int commTotalAmount = 0;
				int transTotalAmount = 0;
				
				for(int j = 0; j < monthArray.length; j++) {
					commTotalAmount += Integer.parseInt((String) list1.get(i).get(monthArray[j]));
					// 직원의 통신비 총합계
					list1.get(i).put("합계", commTotalAmount);
				}
				for(int j = 0; j < monthArray.length; j++) {
					transTotalAmount += ((Long)list2.get(i).get(monthArray[j])).intValue();
					// 직원의 교통비 총합계
					list2.get(i).put("합계", transTotalAmount);
				}
				
				// 직원의 총합계
				list1.get(i).put("총합계", transTotalAmount+commTotalAmount);
			}
		}
		
		response.setHeader("fileName", fileName);
		try {
			//엑셀 파일 생성 및 다운로드
			if("EXCEL0005".equals(fileCode)) {
				fileController.exportExceptionExcel(list1, list2, fileName, searchStr,response);
			} else {
				fileController.exportExcel(list1, fileName,"",searchStr, response);
			}
			
		}catch(Exception e) {
			LOG.debug("Exception : " + e.getMessage());
		}
		
	}
}