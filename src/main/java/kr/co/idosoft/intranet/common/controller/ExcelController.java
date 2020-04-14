package kr.co.idosoft.intranet.common.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
				String mno = (String)searchData.get("member_no");									// 로그인 회원번호
				
				// 세션 VO에 세션 값 저장
				String isAdmin = (String) session.getAttribute("IS_ADMIN");				//관리자 여부
				//이력관리 엑셀 다운로드
				searchStr = "사원명 : " + (String)searchData.get("name");
				searchData.put("MEMBER_NO", mno);
			}
			
			data.put("SEARCH_DATA", searchData);
		} else {
			data.put("SEARCH_DATA", new HashMap<String, Object>());
		}
		
		// 통신비 목록 조회
		List<LinkedHashMap<String,Object>> commList = null;
		// 교통비 조회
		List<LinkedHashMap<String, Object>> transList = null;
		// 주유비 조회
		List<LinkedHashMap<String,Object>> gasList = null;
		// 사원 목록
		List<String> memberList					= null;
		// batchProcessing 메소드 return Map
		HashMap<String, Object> resMap			= null;
				
		// 통신비, 교통비 통계
		if("EXCEL0005".equals(fileCode)) {
			//통신비
			data.put("FILE_CODE","EXCEL0005_1");
			commList =  excelService.getCodetoList(data);
			// 교통비
			data.put("FILE_CODE","EXCEL0005_2");
			transList = excelService.getCodetoList(data);
			// 주유비
			data.put("FILE_CODE","EXCEL0005_4");
			gasList = excelService.getCodetoList(data);
			// 사원 번호 목록
			data.put("FILE_CODE","EXCEL0005_3");
			memberList =  excelService.getCodetoListString(data);
			
			resMap = batchProcessing(transList, gasList, memberList, (String)searchData.get("YEAR"), (String)searchData.get("isAdmin"));
			
			data.remove("isAdmin");			// 관리자 여부 제거
			data.remove("MEMBER_NO");		// 사원번호
			
			transList.clear();
			gasList.clear();
			
			gasList.addAll((List<LinkedHashMap<String, Object>>)resMap.get("GAS"));
			transList.addAll((List<LinkedHashMap<String, Object>>)resMap.get("TRANS"));
			
			data.put("FILE_CODE","EXCEL0005");
		} else {
			commList =  excelService.getCodetoList(data);
		}
		
		if("EXCEL0005".equals(fileCode)) {
			// Month KEY Array
			String[] monthArray = {"1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"};
			
			// 통신비 & 교통비 합계 
			
			for(int i = 0; i < commList.size(); i++) {
				int commTotalAmount = 0;
				int transTotalAmount = 0;
				int gasTotalAmount = 0;
				
				for(int j = 0; j < monthArray.length; j++) {
					commTotalAmount += Integer.parseInt((String) commList.get(i).get(monthArray[j]));
					// 직원의 통신비 총합계
					commList.get(i).put("합계", commTotalAmount);
				}
				for(int j = 0; j < monthArray.length; j++) {
					transTotalAmount += ((Long)transList.get(i).get(monthArray[j])).intValue();
					// 직원의 교통비 총합계
					transList.get(i).put("합계", transTotalAmount);
				}
				for(int j = 0; j < monthArray.length; j++) {
					gasTotalAmount += ((Long)gasList.get(i).get(monthArray[j])).intValue();
					// 직원의 주유비 총합계
					gasList.get(i).put("합계", gasTotalAmount);
				}
				
				// 직원의 총합계
				commList.get(i).put("총합계", transTotalAmount+commTotalAmount+gasTotalAmount);
			}
		}
		
		response.setHeader("fileName", fileName);
		try {
			//엑셀 파일 생성 및 다운로드
			if("EXCEL0005".equals(fileCode)) {
				fileController.exportExceptionExcel(commList, transList, gasList, fileName, searchStr,response);
			} else {
				fileController.exportExcel(commList, fileName,"",searchStr, response);
			}
			
		}catch(Exception e) {
			LOG.debug("Exception : " + e.getMessage());
		}
		
	}
	
	// 교통비, 주유비 일괄 처리 프로세스
	static HashMap<String, Object> batchProcessing(List<LinkedHashMap<String, Object>> transList, List<LinkedHashMap<String, Object>> gasList
														, List<String> memberList, String year, String isAdmin){ // 월별 일괄 계산 처리
		
		LOG.debug("## 교통비, 주유비 일괄 처리 프로세스 START #######################################################");
		
		String[] 	monthKeyArray 	= {"1월", "2월", "3월", "4월", "5월", "6월", "7월","8월", "9월", "10월", "11월", "12월"};
		int[] 		monthArr 		= {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};
		
		List<LinkedHashMap<String, Object>> yearTransList 	= new ArrayList<LinkedHashMap<String,Object>>();
		List<LinkedHashMap<String, Object>> yearGasList 	= new ArrayList<LinkedHashMap<String,Object>>();
		
		SimpleDateFormat stringToDate 		= new SimpleDateFormat("yyyy-MM-dd");	// 문자열 -> date
		SimpleDateFormat dateToMonth 		= new SimpleDateFormat("MM");			// date -> 달
		SimpleDateFormat dateToDay 			= new SimpleDateFormat("dd");			// date -> 일
		
		// 회원 목록
		for(int i = 0; i < memberList.size(); i++) {
			LinkedHashMap<String, Object> monthTransMap = new LinkedHashMap<String, Object>();
			LinkedHashMap<String, Object> monthGasMap = new LinkedHashMap<String, Object>();
			
			// 달에 대한 LOOP
			for(int j = 0; j < monthArr.length; j++) {
				
				// 기준달 - 그달의 마지막일자를 구할 때 사용
				String baseMonth = year + "-" + ( monthArr[j] > 9 ? monthArr[j] : "0"+monthArr[j]) + "-01";
				
				//LOG.debug("# month : " + monthKeyArray[j]);
				
				// 그달 경비 리스트 (중복된 직원번호 존재시 누적 처리) 
				List <Double[]> monthTransList = new ArrayList<Double[]>();	
				List <Double[]> monthGasList = new ArrayList<Double[]>();	
				
				double monthTransTotal 	= 0.0;
				double monthGasTotal	= 0.0;
				// transList
				for(int k = 0; k < transList.size(); k++) {
					
					if(memberList.get(i).equals(transList.get(k).get("mno"))) {
						
						Date startDate = null;
						Date endDate = null;
						
						try {
							startDate 	= stringToDate.parse((String) transList.get(k).get("startDate"));	// 시작날짜
							endDate		= stringToDate.parse((String) transList.get(k).get("endDate"));		// 종료날짜
						} catch (Exception e) {
							LOG.debug("Exception : " + e.getMessage());
						} 	

						int startMonth 	= Integer.parseInt(dateToMonth.format(startDate)); 					// 시작달
						int endMonth 	= Integer.parseInt(dateToMonth.format(endDate)); 					// 종료달
						
						double amount 	= (double)((int) transList.get(k).get("ct")); 						// 월 총 경비
						
						LOG.debug("# trans amount : " + amount);
						
						/*1. 종료날짜가  해당 월보다 크거나 같은지 시작날짜가 해당월보다 작거나 같은지 체크 */
						if(startMonth <= monthArr[j] && monthArr[j] <= endMonth) {
							
							// 그달의 마지막 일자
							int lastDate = commonUtil.LastDateInMonth(baseMonth);
							
							// 일경비 (월경비/그달의 일수)
							Double transExpense =  (amount/lastDate);	
							//LOG.debug("# transExpense : " + transExpense);
							
							// 그달의 경비를 저장하는 배열(일)[그달의 마지막 일]
							Double[] monthExpenseArr = new Double[lastDate];
							
							// 그달의 일에 대한 LOOP
							/* 1. true : 2. 해당 월에 시작하는 날짜인지 체크  */
							if(monthArr[j] == startMonth) {
								/* 2. true : 3. 시작날짜와 종료날짜가 같은 달 인지 여부 - 시작일과 종료일이 같은 달인 경우 */ 
								if(startMonth == endMonth) {
									LOG.debug("# startMonth : " + startMonth);
									//LOG.debug("# endMonth : " + endMonth);
									LOG.debug("startMonth와 endMonth 현재 달에 포함되어있는지 추출");
									
									// SimpleDateFormat 이용하여 해당 날짜의 일수 추출
									int startDay = 0;
									
									// 시작일이 첫째주이면서 월요일인 경우, 첫날부터 시작 (2020-04-10 요건 수용)
									try {
										if(commonUtil.getWeekOfYear(stringToDate.format(startDate)) == 1 && "월".equals(commonUtil.getDateDay(stringToDate.format(startDate)))) {
											startDay = 0;
										} else {
											// 시작일이 0부터  시작하기 때문에 -1
											startDay 	= Integer.parseInt(dateToDay.format(startDate)) -1;
										}
									} catch (Exception e) {
										LOG.debug("Exception : " + e.getMessage());
									}
									// 종료 일에 -1 할 경우, 동일한 날짜가 들어올 경우 한번도 돌지않는 현상 발생
									int endDay 		= Integer.parseInt(dateToDay.format(endDate)) -1;
									
									// 시작날짜와 종료날짜가 같은 달이기 때문에, 1일 부터 시작날짜 까지 0.0 대입
									for(int l = 0; l < startDay; l++) {
										monthExpenseArr[l] = 0.0;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
									
									// 시작일과 종료일이 같은 경우, 한번이라도 값이 대입되야 하므로 do while문 사용
									int whileL = startDay;
									
									do {
										monthExpenseArr[whileL] = transExpense;
										//LOG.debug("#WHILE monthExpenseArr["+whileL+"] : " + monthExpenseArr[whileL]);
										whileL++;
									}while(whileL < endDay);

									// 종료일 부터 월의 마지막 날까지 0.0 대입
									for(int l = whileL; l < lastDate; l++) {
										monthExpenseArr[l] = 0.0;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
								} else {
									/* 3. false : 시작날짜부터 달의 마지막 날짜까지 일 수 계산*/
									//LOG.debug("시작날짜부터 달의 마지막 날짜까지 일 수 계산");
									
									// SimpleDateFormat 이용하여 해당 날짜의 일수 추출
									int startDay = 0;
									
									// 시작일이 첫째주이면서 월요일인 경우, 첫날부터 시작 (2020-04-10 요건 수용)
									try {
										if(commonUtil.getWeekOfYear(stringToDate.format(startDate)) == 1 && "월".equals(commonUtil.getDateDay(stringToDate.format(startDate)))) {
											startDay = 0;
										} else {
											// 시작일이 0부터  시작하기 때문에 -1
											startDay 	= Integer.parseInt(dateToDay.format(startDate)) -1;
										}
									} catch (Exception e) {
										LOG.debug("Exception : " + e.getMessage());
									}
									
									// (시작날짜는 그달에 해당)시작날짜와 종료날짜가 같지 않기 때문에, 1일부터 시작날짜까지 0.0 대입
									for(int l = 0; l < startDay; l++) {
										monthExpenseArr[l] = 0.0;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
									// 시작날짜부터 그달의 마지막 일까지 일경비 대입  
									for(int l = startDay; l < lastDate; l++) {
										// startMonth와 endMonth 현재 달에 포함되어있는지 추출
										monthExpenseArr[l] = transExpense;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
								}
							} else { // 그달이 시작날짜가 아닌 경우,
								/* 2. false :  4. 해당 월에 종료되는 날짜인지 체크 */
								if(monthArr[j] == endMonth) {
									/* 4. true : 그달의 첫 날부터 종료 일 수 까지 계산  */
									LOG.debug("그달의 첫 날부터 종료 일 수 까지 계산");
									
									int endDay 	= Integer.parseInt(dateToDay.format(endDate)) - 1;
									
									// 그달의 시작날짜가 아니고 그달에 종료날짜가 있기 때문에 1일부터 마지막 날짜까지 일경비 대입
									for(int l = 0; l < endDay; l++) {
										monthExpenseArr[l] = transExpense;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
									
									// 마지막날짜 기준으로 그달의 마지막 일까지 0.0 대입
									for(int l = endDay; l < lastDate; l++) {
										monthExpenseArr[l] = 0.0;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
								} else { // 시작날짜와 종료날짜가 그달에 없는 경우, (그달을 포함하고 있는 경우)
									/* 4. false : 그달의 첫 날부터 마지막 일 수 까지 계산  */
									LOG.debug("그달의 첫 날부터 마지막 일 수 까지 계산");
									
									for(int l = 0; l < lastDate; l++) {
										// startMonth와 endMonth 현재 달에 포함되어있는지 추출
										monthExpenseArr[l] = transExpense;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
								}
							}
							/*1. 종료날짜가  해당 월보다 작거나 같은지 체크 */
							/* 1. true : 2. 해당 월에 시작하는 날짜인지 체크  */
							/* 2. true : 3. 시작날짜와 종료날짜가 같은 달 인지 여부 	 */ 
							/* 2. false :  4. 해당 월에 종료되는 날짜인지 체크 */
							/* 3. true : 시작날짜부터 종료일 까지 일 수를 계산*/
							/* 3. false : 시작날짜부터 달의 마지막 날짜까지 일 수 계산*/
							/* 4. true : 그달의 첫 날부터 종료 일 수 까지 계산  */
							/* 4. false : 그달의 첫 날부터 마지막 일 수 까지 계산  */
							monthTransList.add(monthExpenseArr);
						}
						
					}
				}
				
				// gasList
				for(int k = 0; k < gasList.size(); k++) {
					
					if(memberList.get(i).equals(gasList.get(k).get("mno"))) {
						
						Date startDate = null;
						Date endDate = null;
						
						try {
							startDate 	= stringToDate.parse((String) gasList.get(k).get("startDate"));	// 시작날짜
							endDate		= stringToDate.parse((String) gasList.get(k).get("endDate"));		// 종료날짜
						} catch (Exception e) {
							LOG.debug("Exception : " + e.getMessage());
						} 	
						
						int startMonth 	= Integer.parseInt(dateToMonth.format(startDate)); 					// 시작달
						int endMonth 	= Integer.parseInt(dateToMonth.format(endDate)); 					// 종료달
						
						double amount 	= (double)Integer.parseInt((String) gasList.get(k).get("ct")); 						// 월 총 경비
						
						LOG.debug("# amount : " + amount);
						
						/*1. 종료날짜가  해당 월보다 크거나 같은지 시작날짜가 해당월보다 작거나 같은지 체크 */
						if(startMonth <= monthArr[j] && monthArr[j] <= endMonth) {
							// 그달의 마지막 일자
							int lastDate = commonUtil.LastDateInMonth(baseMonth);
							
							// 일경비 (월경비/그달의 일수)
							Double transExpense =  (amount/lastDate);	
							//LOG.debug("# transExpense : " + transExpense);
							
							// 그달의 경비를 저장하는 배열(일)[그달의 마지막 일]
							Double[] monthExpenseArr = new Double[lastDate];
							
							// 그달의 일에 대한 LOOP
							/* 1. true : 2. 해당 월에 시작하는 날짜인지 체크  */
							if(monthArr[j] == startMonth) {
								/* 2. true : 3. 시작날짜와 종료날짜가 같은 달 인지 여부 - 시작일과 종료일이 같은 달인 경우 */ 
								if(startMonth == endMonth) {
									//LOG.debug("# startMonth : " + startMonth);
									//LOG.debug("# endMonth : " + endMonth);
									LOG.debug("startMonth와 endMonth 현재 달에 포함되어있는지 추출");
									
									// SimpleDateFormat 이용하여 해당 날짜의 일수 추출
									int startDay = 0;
									
									// 시작일이 첫째주이면서 월요일인 경우, 첫날부터 시작 (2020-04-10 요건 수용)
									try {
										if(commonUtil.getWeekOfYear(stringToDate.format(startDate)) == 1 && "월".equals(commonUtil.getDateDay(stringToDate.format(startDate)))) {
											startDay = 0;
										} else {
											// 시작일이 0부터  시작하기 때문에 -1
											startDay 	= Integer.parseInt(dateToDay.format(startDate)) -1;
										}
									} catch (Exception e) {
										LOG.debug("Exception : " + e.getMessage());
									}
									// 종료 일에 -1 할 경우, 동일한 날짜가 들어올 경우 한번도 돌지않는 현상 발생
									int endDay 		= Integer.parseInt(dateToDay.format(endDate)) -1;
									
									// 시작날짜와 종료날짜가 같은 달이기 때문에, 1일 부터 시작날짜 까지 0.0 대입
									for(int l = 0; l < startDay; l++) {
										monthExpenseArr[l] = 0.0;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
									
									// 시작일과 종료일이 같은 경우, 한번이라도 값이 대입되야 하므로 do while문 사용
									int whileL = startDay;
									
									do {
										monthExpenseArr[whileL] = transExpense;
										//LOG.debug("#WHILE monthExpenseArr["+whileL+"] : " + monthExpenseArr[whileL]);
										whileL++;
									}while(whileL < endDay);

									// 종료일 부터 월의 마지막 날까지 0.0 대입
									for(int l = whileL; l < lastDate; l++) {
										monthExpenseArr[l] = 0.0;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
								} else {
									/* 3. false : 시작날짜부터 달의 마지막 날짜까지 일 수 계산*/
									//LOG.debug("시작날짜부터 달의 마지막 날짜까지 일 수 계산");
									
									// SimpleDateFormat 이용하여 해당 날짜의 일수 추출
									int startDay = 0;
									
									// 시작일이 첫째주이면서 월요일인 경우, 첫날부터 시작 (2020-04-10 요건 수용)
									try {
										if(commonUtil.getWeekOfYear(stringToDate.format(startDate)) == 1 && "월".equals(commonUtil.getDateDay(stringToDate.format(startDate)))) {
											startDay = 0;
										} else {
											// 시작일이 0부터  시작하기 때문에 -1
											startDay 	= Integer.parseInt(dateToDay.format(startDate)) -1;
										}
									} catch (Exception e) {
										LOG.debug("Exception : " + e.getMessage());
									}
									
									// (시작날짜는 그달에 해당)시작날짜와 종료날짜가 같지 않기 때문에, 1일부터 시작날짜까지 0.0 대입
									for(int l = 0; l < startDay; l++) {
										monthExpenseArr[l] = 0.0;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
									// 시작날짜부터 그달의 마지막 일까지 일경비 대입  
									for(int l = startDay; l < lastDate; l++) {
										// startMonth와 endMonth 현재 달에 포함되어있는지 추출
										monthExpenseArr[l] = transExpense;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
								}
							} else { // 그달이 시작날짜가 아닌 경우,
								/* 2. false :  4. 해당 월에 종료되는 날짜인지 체크 */
								if(monthArr[j] == endMonth) {
									/* 4. true : 그달의 첫 날부터 종료 일 수 까지 계산  */
									LOG.debug("그달의 첫 날부터 종료 일 수 까지 계산");
									
									int endDay 	= Integer.parseInt(dateToDay.format(endDate)) - 1;
									
									// 그달의 시작날짜가 아니고 그달에 종료날짜가 있기 때문에 1일부터 마지막 날짜까지 일경비 대입
									for(int l = 0; l < endDay; l++) {
										//LOG.debug("## endDay ##");
										monthExpenseArr[l] = transExpense;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
									
									// 마지막날짜 기준으로 그달의 마지막 일까지 0.0 대입
									for(int l = endDay; l < lastDate; l++) {
										//LOG.debug("## lastDate ##");
										monthExpenseArr[l] = 0.0;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
								} else { // 시작날짜와 종료날짜가 그달에 없는 경우, (그달을 포함하고 있는 경우)
									/* 4. false : 그달의 첫 날부터 마지막 일 수 까지 계산  */
									LOG.debug("그달의 첫 날부터 마지막 일 수 까지 계산");
									
									for(int l = 0; l < lastDate; l++) {
										// startMonth와 endMonth 현재 달에 포함되어있는지 추출
										monthExpenseArr[l] = transExpense;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
								}
							}
							/*1. 종료날짜가  해당 월보다 작거나 같은지 체크 */
							/* 1. true : 2. 해당 월에 시작하는 날짜인지 체크  */
							/* 2. true : 3. 시작날짜와 종료날짜가 같은 달 인지 여부 	 */ 
							/* 2. false :  4. 해당 월에 종료되는 날짜인지 체크 */
							/* 3. true : 시작날짜부터 종료일 까지 일 수를 계산*/
							/* 3. false : 시작날짜부터 달의 마지막 날짜까지 일 수 계산*/
							/* 4. true : 그달의 첫 날부터 종료 일 수 까지 계산  */
							/* 4. false : 그달의 첫 날부터 마지막 일 수 까지 계산  */
							monthGasList.add(monthExpenseArr);
						}
						
					}
				}
				
				int lastDate = commonUtil.LastDateInMonth(baseMonth);

				Double[] tempGasArr = new Double[lastDate];
				Double[] tempTransArr = new Double[lastDate];
				
				
				// 모든 배열을 0.0으로 초기화(비교) 
				for(int k = 0; k < tempGasArr.length; k++) {
					tempGasArr[k] = 0.0;
					tempTransArr[k] = 0.0;
				}
				
				// 중복된 ROW를 가지고 있는 경우, 
				// 차량운행비
				if(monthGasList.size() > 1) {
					
					LOG.debug("# 중복된 ROW를 가지고 있는 경우, 중복 ROW 개수 : " + monthGasList.size());
					
					// 리스트에 가지고 있는 첫번째 배열 길이를 기준으로 tempTransArr 배열 생성
					
					for(int k = 0; k < monthGasList.size(); k++) {
						// 해당 
						for(int l = 0; l < tempGasArr.length; l++) {
							Double temp = monthGasList.get(k)[l];
							
							// 배열안에 있는 값보다 temp가 클 경우, 배열에 temp를 대입한다. 가장 높은 일 경비를 저장
							if(tempGasArr[l] < temp) {
								tempGasArr[l] = temp;
							}
							//LOG.debug("# tempGasArr[" + l + "] : " + tempGasArr[l]);
						}
					}
					
					// 월 경비 합계 계산
					
					for(int k = 0; k < tempGasArr.length; k++) { 
						monthGasTotal += tempGasArr[k]; 
					}
					
				} else if(monthGasList.size() == 1){ // 중복된 ROW를 가지고 있지 않은 경우,
					
					LOG.debug("# 중복된 ROW를 가지고 있지 않은 경우, ");
					
					// 월 경비 합계 계산
					
					for(int k = 0; k < tempGasArr.length; k++) { 
						//LOG.debug("# tempGasArr["+k+"] : " + monthGasList.get(0)[k]); 
						
						Double temp = monthGasList.get(0)[k];
						
						tempGasArr[k] = temp;
						
						monthGasTotal += tempGasArr[k]; 
					}
					
				} else { // ROW가 없는 경우, 0
					monthGasTotal = 0.0;
				}
				
				// 그달의 키를 기준으로 올림처리해서 Map으로 저장
				monthGasMap.put(monthKeyArray[j], Math.round(monthGasTotal));
				if(memberList.get(i).equals("2019070101")) {
					for(int z = 0; z < tempGasArr.length; z++) {
						LOG.debug("# "+z+" : " + tempGasArr[z]);
					}
				}
				
				//교통비
				if(monthTransList.size() > 1) {
					
					LOG.debug("# 중복된 ROW를 가지고 있는 경우, 중복 ROW 개수 : " + monthTransList.size());
					
					// 리스트에 가지고 있는 첫번째 배열 길이를 기준으로 tempTransArr 배열 생성
					
					for(int k = 0; k < monthTransList.size(); k++) {
						// 해당 
						for(int l = 0; l < tempTransArr.length; l++) {
							Double temp = monthTransList.get(k)[l];
							
							// 배열안에 있는 값보다 temp가 클 경우, 배열에 temp를 대입한다. 가장 높은 일 경비를 저장
							// 차량을 운행했을 경우, 해당 일의 교통비는 제외
							if(tempTransArr[l] < temp && tempGasArr[l] == 0.0) {
								tempTransArr[l] = temp;
							}
							//LOG.debug("# tempTransArr[" + l + "] : " + tempTransArr[l]);
						}
					}
					
					// 월 경비 합계 계산
					
					for(int k = 0; k < tempTransArr.length; k++) { 
						monthTransTotal += tempTransArr[k]; 
					}
					
				} else if(monthTransList.size() == 1){ // 중복된 ROW를 가지고 있지 않은 경우,
					
					LOG.debug("# 중복된 ROW를 가지고 있지 않은 경우, ");
					// 월 경비 합계 계산
					
					for(int l = 0; l < tempTransArr.length; l++) {
						//LOG.debug("## tempGasArr["+l+"] : " + tempGasArr[l]);
						Double temp = monthTransList.get(0)[l];
						
						// 차량을 운행했을 경우, 해당 일의 교통비는 제외
						if(tempGasArr[l] == 0.0) {
							tempTransArr[l] = temp;
						}
						//LOG.debug("# tempTransArr[" + l + "] : " + tempTransArr[l]);
					}
					
					for(int k = 0; k < tempTransArr.length; k++) { 
						//LOG.debug("# tempTransArr["+k+"] : " + monthTransList.get(0)[k]); 
						
						monthTransTotal += tempTransArr[k]; 
					}
					
				} else { // ROW가 없는 경우, 0
					monthTransTotal = 0.0;
				}
				//LOG.debug("# monthKeyArray["+j+"] : " + monthTransTotal);
				
				// 그달의 키를 기준으로 올림처리해서 Map으로 저장
				monthTransMap.put(monthKeyArray[j], Math.round(monthTransTotal));
			}
			//LOG.debug("MEMBER_NO : " + memberList.get(i));
			// Map에 사번을 추가한다.
			monthGasMap.put("MEMBER_NO", memberList.get(i));
			monthTransMap.put("MEMBER_NO", memberList.get(i));
			// Map을 List에 저장한다.
			yearGasList.add(monthGasMap);
			yearTransList.add(monthTransMap);
			
		}
		
		if("1".equals(isAdmin)) {
			LinkedHashMap<String, Object> totalMonthTransMap = new LinkedHashMap<String, Object>();
			LinkedHashMap<String, Object> totalMonthGasMap = new LinkedHashMap<String, Object>();
			
			totalMonthTransMap.put("MEMBER_NO", "ALL");
			totalMonthGasMap.put("MEMBER_NO", "ALL");
			
			// 월별 합계 및 전체 합계 계산 기능 2020-04-08
			
			for(int i = 0; i < monthKeyArray.length; i++) {
				Integer totalTransValue = 0;
				Integer totalGasValue = 0;
				for(int j = 0; j < yearTransList.size(); j++) {
					
					totalGasValue 	+= ((Long)yearGasList.get(j).get(monthKeyArray[i])).intValue();
					totalTransValue += ((Long)yearTransList.get(j).get(monthKeyArray[i])).intValue();
				}
				
				totalMonthGasMap.put(monthKeyArray[i], totalGasValue.longValue());
				totalMonthTransMap.put(monthKeyArray[i], totalTransValue.longValue());
			}
			
			yearGasList.add(totalMonthGasMap);
			yearTransList.add(totalMonthTransMap);
		}
		
		LOG.debug("주유비 일괄 처리 프로세스 - yearGasList : " + yearGasList);
		LOG.debug("교통비 일괄 처리 프로세스 - yearTransList : " + yearTransList);
		
		LOG.debug("## 교통비 일괄 처리 프로세스 END #########################################################");
		
		Map<String, Object> resMap = new LinkedHashMap<String, Object>();
		
		resMap.put("GAS", yearGasList);
		resMap.put("TRANS", yearTransList);
		
		return (HashMap<String, Object>) resMap;
			
	}
}